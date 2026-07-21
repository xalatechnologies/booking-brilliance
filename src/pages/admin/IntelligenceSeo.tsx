/**
 * SEO history — the trend view over the fleet seo-agent's runs. Reads the
 * seo_runs table (written by tools/seo-agent's Convex mirror) via
 * api.seo.runs.history and renders the latest run's KPIs, sparkline trends, and
 * a per-run table. Sibling of IntelligenceVekst (direct-useQuery pattern).
 */
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Loader2, LineChart, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";
import { adminToken, scoreClass } from "./intelligence-shared";

interface SeoRun {
  _id: string;
  _creationTime: number;
  origin: string;
  run_at: string;
  avg_score: number;
  pages_scanned: number;
  findings_total: number;
  serp_keywords_tracked: number;
  serp_our_top10: number;
  aeo_brand_mention_rate: number | null;
  aeo_citation_rate: number | null;
  aeo_share_of_voice: number | null;
  aeo_queries: number | null;
}

const pct = (r: number | null | undefined): string =>
  r == null ? "—" : `${Math.round(r * 100)}%`;

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleString("nb-NO", { dateStyle: "short", timeStyle: "short" });

/** Inline SVG sparkline (oldest→newest), matching the hand-rolled house style. */
function Spark({ values, className }: { values: Array<number | null>; className?: string }) {
  const pts = values.filter((v): v is number => v != null && Number.isFinite(v));
  if (pts.length < 2) {
    return <span className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint">for få kjøringer</span>;
  }
  const w = 200;
  const h = 40;
  const pad = 4;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const step = (w - pad * 2) / (pts.length - 1);
  const coords = pts.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (h - pad * 2) * (1 - (v - min) / range);
    return [x, y] as const;
  });
  const points = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full h-10", className)} preserveAspectRatio="none" role="img" aria-hidden>
      <polyline
        points={points}
        fill="none"
        className="stroke-navy"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lx} cy={ly} r={2.5} className="fill-accent-text" />
    </svg>
  );
}

function TrendCell({
  label,
  latest,
  values,
  tone,
}: {
  label: string;
  latest: string;
  values: Array<number | null>;
  tone?: string;
}) {
  return (
    <div className="bg-paper p-6 flex flex-col gap-3">
      <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">{label}</p>
      <p className={cn("font-serif text-4xl font-medium leading-none tabular-nums", tone ?? "text-ink")}>{latest}</p>
      <Spark values={values} />
    </div>
  );
}

export default function IntelligenceSeo() {
  const auth = adminToken();
  const runs = useQuery(api.seo.runs.history, auth ? { adminToken: auth, limit: 60 } : "skip") as
    | SeoRun[]
    | undefined;

  const loading = runs === undefined;
  const rows = useMemo(() => runs ?? [], [runs]);
  const latest = rows[0];

  // Sparklines read oldest→newest, so reverse the newest-first feed.
  const chrono = useMemo(() => [...rows].reverse(), [rows]);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <header className="flex items-start justify-between mb-8 pb-6 border-b border-rule">
        <div className="flex items-start gap-4">
          <div className="p-2 border border-hairline-strong rounded-sm">
            <LineChart className="h-5 w-5 text-accent-text" />
          </div>
          <div>
            <p className="editorial-mono-caption text-accent-text mb-1">SEO-AGENT · HISTORIKK</p>
            <h1
              className="font-serif text-3xl lg:text-4xl text-ink leading-tight"
              style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
            >
              SEO-historikk
            </h1>
            <p className="text-sm text-ink-soft mt-1.5 max-w-2xl">
              Utvikling i søkesynlighet (SERP) og AI-synlighet (AEO) på tvers av seo-agentens kjøringer.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-12 text-center text-ink-soft">
          <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
          Laster SEO-historikk…
        </div>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-hairline-strong rounded-sm p-12 text-center">
          <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint mb-3">INGEN KJØRINGER ENNÅ</p>
          <p className="text-sm text-ink-soft">
            SEO-agenten speiler hver kjøring hit. Første rad kommer etter neste nattlige kjøring.
          </p>
        </div>
      ) : (
        <>
          {/* Latest-run KPI seam-grid */}
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text">SISTE KJØRING</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
              {fmtDate(latest.run_at)} · {new URL(latest.origin).hostname}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mb-10">
            <div className="bg-paper p-6 flex flex-col gap-2">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">SEO-score</p>
              <p className={cn("font-serif text-4xl lg:text-5xl font-medium leading-none mt-1 tabular-nums", scoreClass(latest.avg_score))}>
                {Math.round(latest.avg_score)}
              </p>
              <p className="text-xs text-ink mt-1">{latest.pages_scanned} sider · {latest.findings_total} funn</p>
            </div>
            <div className="bg-paper p-6 flex flex-col gap-2">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Google topp-10</p>
              <p className="font-serif text-4xl lg:text-5xl font-medium leading-none mt-1 tabular-nums text-ink">
                {latest.serp_our_top10}<span className="text-ink-faint text-2xl"> / {latest.serp_keywords_tracked}</span>
              </p>
              <p className="text-xs text-ink mt-1">søkeord vi rangerer på</p>
            </div>
            <div className="bg-paper p-6 flex flex-col gap-2">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">AEO merkeomtale</p>
              <p className="font-serif text-4xl lg:text-5xl font-medium leading-none mt-1 tabular-nums text-ink">
                {pct(latest.aeo_brand_mention_rate)}
              </p>
              <p className="text-xs text-ink mt-1">{latest.aeo_queries ?? 0} AI-spørringer</p>
            </div>
            <div className="bg-paper p-6 flex flex-col gap-2">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">AEO andel av stemme</p>
              <p className="font-serif text-4xl lg:text-5xl font-medium leading-none mt-1 tabular-nums text-ink">
                {pct(latest.aeo_share_of_voice)}
              </p>
              <p className="text-xs text-ink mt-1">vs. konkurrenter i AI-svar</p>
            </div>
          </div>

          {/* Trends over runs */}
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text">TREND</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">{rows.length} KJØRINGER</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule mb-10">
            <TrendCell
              label="SEO-score"
              latest={String(Math.round(latest.avg_score))}
              values={chrono.map((r) => r.avg_score)}
              tone={scoreClass(latest.avg_score)}
            />
            <TrendCell
              label="Google topp-10"
              latest={String(latest.serp_our_top10)}
              values={chrono.map((r) => r.serp_our_top10)}
            />
            <TrendCell
              label="AEO andel av stemme"
              latest={pct(latest.aeo_share_of_voice)}
              values={chrono.map((r) => r.aeo_share_of_voice)}
            />
          </div>

          {/* Per-run table */}
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text">ALLE KJØRINGER</p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">NYESTE FØRST</p>
          </div>
          <div className="border border-rule overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-paper-strong border-b border-rule">
                  <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Tidspunkt</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Score</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Sider</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Funn</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Topp-10</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">Søkeord</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">AEO omtale</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">AEO sitat</th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">AEO stemme</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-b border-rule hover:bg-paper-deep/40">
                    <td className="p-3 text-ink whitespace-nowrap">{fmtDate(r.run_at)}</td>
                    <td className={cn("p-3 text-right font-serif tabular-nums", scoreClass(r.avg_score))}>{Math.round(r.avg_score)}</td>
                    <td className="p-3 text-right text-ink-soft tabular-nums">{r.pages_scanned}</td>
                    <td className="p-3 text-right text-ink-soft tabular-nums">{r.findings_total}</td>
                    <td className="p-3 text-right text-ink tabular-nums">{r.serp_our_top10}</td>
                    <td className="p-3 text-right text-ink-soft tabular-nums">{r.serp_keywords_tracked}</td>
                    <td className="p-3 text-right text-ink tabular-nums">{pct(r.aeo_brand_mention_rate)}</td>
                    <td className="p-3 text-right text-ink-soft tabular-nums">{pct(r.aeo_citation_rate)}</td>
                    <td className="p-3 text-right text-ink tabular-nums">{pct(r.aeo_share_of_voice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="flex items-center gap-2 mt-4 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
            <RefreshCw className="h-3 w-3" />
            <Search className="h-3 w-3" />
            Speiles automatisk fra seo-agenten etter hver kjøring
          </p>
        </>
      )}
    </div>
  );
}
