/**
 * /admin/intelligence — simplified SLA + SEO dashboard.
 *
 * One scannable page: a KPI strip, open alerts, then two focused tables —
 * SLA/uptime per surface on top, SEO per surface below. Everything else
 * (WCAG, security, performance, links, growth, agents) still lives in the
 * "Avansert" nav group; this page just makes the day-to-day answer — "is
 * everything up, and is SEO healthy?" — readable at a glance.
 *
 * All data comes from the shared Convex snapshot via outlet context, so no
 * functionality is lost — the deep pages read the same source.
 */
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Search,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  adminToken,
  getEcosystemKpis,
  type IntelligenceCtx,
  type LatestRun,
  scoreClass,
} from "./intelligence-shared";

interface AlertRow {
  _id: Id<"alerts">;
  kind: string;
  surface: string;
  audit_type: string;
  severity: "error" | "warn";
  title: string;
  detail: string;
  first_seen_at: string;
  last_seen_at: string;
  occurrence_count: number;
}

/** Compact relative-time formatter shared by both tables. */
function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min siden`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)}t siden`;
  return `${Math.round(mins / (60 * 24))}d siden`;
}

export default function IntelligenceOverview() {
  const { snap, running, runScan } = useOutletContext<IntelligenceCtx>();

  const byTarget = useMemo(() => {
    const m = new Map<string, LatestRun[]>();
    if (!snap) return m;
    for (const r of snap.latest) {
      const arr = m.get(r.target_name) ?? [];
      arr.push(r);
      m.set(r.target_name, arr);
    }
    return m;
  }, [snap]);

  if (!snap) {
    return (
      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Henter status…
      </div>
    );
  }

  const kpis = getEcosystemKpis(snap);
  const activeCount = kpis?.surfacesTotal ?? 0;
  const activeTargets = snap.targets.filter((t) => t.is_active);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="editorial-mono-caption text-accent-text mb-2">
            SLA · SEO
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl text-ink leading-[1.04]"
            style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
          >
            Oversikt
          </h2>
          <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
            Er alt oppe, og er SEO friskt? Live status på {activeCount} aktive
            overflater. Detaljer for sikkerhet, WCAG, ytelse og lenker ligger
            under «Avansert».
          </p>
        </div>
        {kpis && (
          <div className="flex items-center gap-3">
            <Badge
              icon={CheckCircle2}
              label="OPPE"
              value={`${kpis.surfacesHealthy}/${kpis.surfacesTotal}`}
              tone={
                kpis.surfacesWithErrors === 0
                  ? "good"
                  : kpis.surfacesWithErrors >= 2
                    ? "bad"
                    : "warn"
              }
            />
            <Badge
              icon={TrendingUp}
              label="SNITT"
              value={kpis.avgScore}
              tone={
                kpis.avgScore >= 85 ? "good" : kpis.avgScore >= 60 ? "warn" : "bad"
              }
            />
          </div>
        )}
      </header>

      {kpis && (
        <section className="mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {[
              {
                label: "Overflater oppe",
                value: `${kpis.surfacesHealthy}/${kpis.surfacesTotal}`,
                sub: `${kpis.surfacesWithErrors} med feil`,
                tone: kpis.surfacesWithErrors > 0
                  ? "text-red-700 dark:text-red-400"
                  : "text-green-700 dark:text-green-400",
              },
              {
                label: "Snittscore",
                value: kpis.avgScore,
                sub: "på tvers av siste skanninger",
                tone: undefined as string | undefined,
              },
              {
                label: "Feil",
                value: kpis.errorCount,
                sub: "krever umiddelbar handling",
                tone: kpis.errorCount > 0
                  ? "text-red-700 dark:text-red-400"
                  : undefined,
              },
              {
                label: "Advarsler",
                value: kpis.warnCount,
                sub: "anbefalt utbedring",
                tone: kpis.warnCount > 0
                  ? "text-amber-700 dark:text-amber-400"
                  : undefined,
              },
            ].map((c) => (
              <div key={c.label} className="bg-paper p-5 lg:p-6 flex flex-col gap-1.5">
                <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  {c.label}
                </p>
                <p
                  className={cn(
                    "font-serif text-4xl lg:text-5xl font-medium leading-none mt-1 tabular-nums",
                    c.tone ?? "text-ink",
                  )}
                >
                  {c.value}
                </p>
                <p className="text-xs text-ink mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <AlertsPanel />

      {/* ── SLA · OPPETID ─────────────────────────────────────────── */}
      <SectionHeading
        icon={Wifi}
        title="SLA · Oppetid"
        detailTo="/admin/intelligence/uptime"
        detailLabel="Se oppetid-detaljer"
      />
      <div className="mb-12 overflow-x-auto border border-rule">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-paper-deep/40 text-left">
              <Th>Overflate</Th>
              <Th>Status</Th>
              <Th className="text-right">Oppetid</Th>
              <Th>Sist sjekket</Th>
              <Th className="text-right">Handling</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {activeTargets.map((t) => {
              const run = (byTarget.get(t.name) ?? []).find(
                (r) => r.audit_type === "uptime",
              );
              const runs = t.checks ?? [];
              const monitored = runs.length === 0 || runs.includes("uptime");
              const up = run ? run.status === "ok" : null;
              const isRunning = running === t.name;
              return (
                <tr key={t.name} className="bg-paper">
                  <Td>
                    <a
                      href={t.origin}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-baseline gap-1.5 font-serif text-lg text-ink hover:underline decoration-hairline underline-offset-4 group"
                      style={{ fontVariationSettings: '"opsz" 24, "wght" 520' }}
                    >
                      {t.label}
                      <ArrowUpRight className="h-3 w-3 text-ink-faint group-hover:text-accent-text flex-shrink-0" />
                    </a>
                  </Td>
                  <Td>
                    {!monitored ? (
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                        Ikke overvåket
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest",
                          up === null
                            ? "text-ink-faint"
                            : up
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400",
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            up === null
                              ? "bg-ink-faint"
                              : up
                                ? "bg-green-600"
                                : "bg-red-600",
                          )}
                        />
                        {up === null ? "Ukjent" : up ? "Oppe" : "Nede"}
                      </span>
                    )}
                  </Td>
                  <Td className="text-right">
                    <span
                      className={cn(
                        "font-serif text-lg font-medium tabular-nums",
                        run ? scoreClass(run.avg_score) : "text-ink-faint",
                      )}
                    >
                      {run ? Math.round(run.avg_score) : "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
                      {timeAgo(run?.started_at ?? null)}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => runScan(t.name)}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest border border-hairline-strong rounded-sm px-2.5 py-1.5 hover:bg-paper-deep disabled:opacity-50"
                    >
                      {isRunning ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Activity className="h-3 w-3" />
                      )}
                      Skann
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── SEO ───────────────────────────────────────────────────── */}
      <SectionHeading
        icon={Search}
        title="SEO"
        detailTo="/admin/intelligence/seo"
        detailLabel="Se SEO-detaljer"
      />
      <div className="overflow-x-auto border border-rule">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="bg-paper-deep/40 text-left">
              <Th>Overflate</Th>
              <Th className="text-right">Score</Th>
              <Th className="text-right">Funn</Th>
              <Th>Toppfunn</Th>
              <Th>Sist skannet</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {activeTargets.map((t) => {
              const run = (byTarget.get(t.name) ?? []).find(
                (r) => r.audit_type === "seo",
              );
              const checks = t.checks ?? [];
              const monitored = checks.length === 0 || checks.includes("seo");
              const topIssue = (snap.issues ?? [])
                .filter((i) => i.surface === t.name && i.auditType === "seo")
                .sort((a, b) => {
                  const rank = { error: 0, warn: 1, info: 2 } as const;
                  return rank[a.severity] - rank[b.severity] || b.affected - a.affected;
                })[0];
              return (
                <tr key={t.name} className="bg-paper">
                  <Td>
                    <span
                      className="font-serif text-lg text-ink"
                      style={{ fontVariationSettings: '"opsz" 24, "wght" 520' }}
                    >
                      {t.label}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span
                      className={cn(
                        "font-serif text-lg font-medium tabular-nums",
                        run ? scoreClass(run.avg_score) : "text-ink-faint",
                      )}
                    >
                      {monitored ? (run ? Math.round(run.avg_score) : "—") : "·"}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span
                      className={cn(
                        "font-mono text-xs tabular-nums",
                        run && run.findings_total > 0
                          ? "text-ink"
                          : "text-ink-faint",
                      )}
                    >
                      {run ? run.findings_total : monitored ? "—" : "·"}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-xs text-ink-soft line-clamp-1 max-w-[26ch]">
                      {topIssue
                        ? `${topIssue.message}${topIssue.affected > 1 ? ` (${topIssue.affected}×)` : ""}`
                        : monitored && run
                          ? "Ingen åpne funn"
                          : "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
                      {monitored ? timeAgo(run?.started_at ?? null) : "—"}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  detailTo,
  detailLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detailTo: string;
  detailLabel: string;
}) {
  return (
    <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
      <p className="editorial-mono-caption text-accent-text inline-flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" /> {title.toUpperCase()}
      </p>
      <Link
        to={detailTo}
        className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-text hover:underline decoration-hairline underline-offset-4"
      >
        {detailLabel} ›
      </Link>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint px-4 py-3 font-normal",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

function Badge({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tone: "good" | "warn" | "bad";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-sm px-4 py-3 border",
        tone === "good" && "bg-green-50 border-green-700/40 dark:bg-green-950/40",
        tone === "warn" && "bg-amber-50 border-amber-700/40 dark:bg-amber-950/40",
        tone === "bad" && "bg-red-50 border-red-700/40 dark:bg-red-950/40",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0",
          tone === "good" && "text-green-700",
          tone === "warn" && "text-amber-700",
          tone === "bad" && "text-red-700",
        )}
      />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-mono text-[0.55rem] uppercase tracking-widest",
            tone === "good" && "text-green-700 dark:text-green-400",
            tone === "warn" && "text-amber-700 dark:text-amber-400",
            tone === "bad" && "text-red-700 dark:text-red-400",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-serif text-lg font-medium",
            tone === "good" && "text-green-700 dark:text-green-400",
            tone === "warn" && "text-amber-700 dark:text-amber-400",
            tone === "bad" && "text-red-700 dark:text-red-400",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * Live regression alerts — open items from convex.audits.alerts.listOpen
 * (reactive). Kept on the simplified overview because "what's broken right
 * now" is the first thing a reviewer needs. Resolve inline.
 */
const ALERT_KIND_LABEL_NO: Record<string, string> = {
  "score-drop": "POENGFALL",
  "new-error": "NY FEIL",
  "uptime-down": "NEDETID",
  "ssl-expiring": "SSL UTLØPER",
};

function AlertsPanel() {
  const alerts = useQuery(api.audits.alerts.listOpen, {
    adminToken: adminToken(),
  }) as AlertRow[] | undefined;
  const resolve = useMutation(api.audits.alerts.resolve);
  if (!alerts || alerts.length === 0) return null;
  const errors = alerts.filter((a) => a.severity === "error");
  const warns = alerts.filter((a) => a.severity === "warn");
  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
        <p className="editorial-mono-caption text-red-700 dark:text-red-400 inline-flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" /> ÅPNE VARSLER
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
          {errors.length} FEIL · {warns.length} ADVARSEL
        </p>
      </div>
      <ul className="divide-y divide-rule border-y border-rule">
        {alerts.slice(0, 8).map((a) => (
          <li
            key={a._id}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 md:gap-5 items-start py-4"
          >
            <span
              className={cn(
                "font-mono text-[0.55rem] tracking-widest uppercase rounded-sm px-2 py-1 inline-block w-fit",
                a.severity === "error"
                  ? "bg-red-700 text-on-navy"
                  : "bg-amber-700 text-on-navy",
              )}
            >
              {ALERT_KIND_LABEL_NO[a.kind] ?? a.kind}
            </span>
            <div className="min-w-0">
              <p
                className="font-serif text-base lg:text-lg text-ink leading-snug"
                style={{ fontVariationSettings: '"opsz" 24, "wght" 540' }}
              >
                {a.title}
              </p>
              <p className="text-xs text-ink-soft mt-0.5 line-clamp-1">
                {a.detail}
              </p>
              <p className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint mt-1">
                {a.surface} · {a.audit_type} · {a.occurrence_count}×
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                resolve({ adminToken: adminToken(), id: a._id }).catch(() => {})
              }
              className="justify-self-start md:justify-self-end font-mono text-[0.6rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-2.5 py-1.5 hover:bg-paper-deep"
            >
              Resolve
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
