/**
 * /admin/intelligence — Ecosystem Overview page.
 * Top: page hero + KPI tile row.
 * Below: surface tiles per active target.
 */
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AUDIT_LABEL,
  SURFACE_LABEL,
  type AuditType,
  type IntelligenceCtx,
  type LatestRun,
  type RecentRun,
  scoreClass,
} from "./intelligence-shared";

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

  const summary = snap.ecosystemSummary;
  const activeCount = snap.targets.filter((t) => t.is_active).length;

  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="editorial-mono-caption text-accent-text mb-2">
            ØKOSYSTEM-OVERSIKT
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
            style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
          >
            Oversikt
          </h2>
          <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
            Live status på tvers av {activeCount} aktive overflater i
            Digilist-økosystemet. Skanninger kjøres automatisk hver natt
            og kan startes manuelt per overflate eller for hele systemet.
          </p>
        </div>
        {summary && (
          <div className="flex items-center gap-3">
            <Badge
              icon={CheckCircle2}
              label="SUNNE"
              value={`${summary.surfacesHealthy}/${summary.surfacesTotal}`}
              tone={
                summary.surfacesWithErrors === 0
                  ? "good"
                  : summary.surfacesWithErrors >= 2
                    ? "bad"
                    : "warn"
              }
            />
            <Badge
              icon={TrendingUp}
              label="SNITT"
              value={Math.round(summary.avgScore)}
              tone={
                summary.avgScore >= 85
                  ? "good"
                  : summary.avgScore >= 60
                    ? "warn"
                    : "bad"
              }
            />
          </div>
        )}
      </header>

      {summary && (
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {[
              {
                label: "Overflater aktive",
                value: summary.surfacesTotal,
                sub: `${summary.surfacesHealthy} sunne · ${summary.surfacesWithErrors} med feil`,
                tone: undefined as string | undefined,
              },
              {
                label: "Snittscore",
                value: Math.round(summary.avgScore),
                sub: "på tvers av siste skanninger",
                tone: undefined,
              },
              {
                label: "Errors",
                value: summary.errorCount,
                sub: "krever umiddelbar handling",
                tone:
                  summary.errorCount > 0
                    ? "text-red-700 dark:text-red-400"
                    : undefined,
              },
              {
                label: "Warnings",
                value: summary.warnCount,
                sub: "anbefalt utbedring",
                tone:
                  summary.warnCount > 0
                    ? "text-amber-700 dark:text-amber-400"
                    : undefined,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-paper p-6 lg:p-7 flex flex-col gap-2"
              >
                <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  {c.label}
                </p>
                <p
                  className={cn(
                    "font-serif text-5xl lg:text-6xl font-medium leading-none mt-1",
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

      {snap.recent.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> SISTE AKTIVITET
            </p>
            <a
              href="/admin/intelligence/scans"
              className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-text hover:underline decoration-hairline underline-offset-4"
            >
              SE ALLE SKANNINGER ›
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-px bg-rule border border-rule">
            {snap.recent.slice(0, 6).map((r) => (
              <ActivityTile key={r.id} run={r} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
          <p className="editorial-mono-caption text-accent-text">
            OVERFLATER
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
            {snap.targets.length} TOTALT · {activeCount} AKTIVE
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
          {snap.targets.map((t) => {
            const runs = byTarget.get(t.name) ?? [];
            const cardChecks: AuditType[] =
              t.checks && t.checks.length > 0
                ? t.checks
                : (["uptime", "seo", "a11y", "security", "links"] as AuditType[]);
            const scores = cardChecks.map((type) => ({
              type,
              run: runs.find((r) => r.audit_type === type),
            }));
            const have = scores.filter((s) => s.run);
            const overall =
              have.length === 0
                ? null
                : Math.round(
                    have.reduce((sum, s) => sum + (s.run?.avg_score ?? 0), 0) /
                      have.length,
                  );
            const isRunning = running === t.name;
            return (
              <div
                key={t.name}
                className="bg-paper p-6 lg:p-7 flex flex-col gap-3"
              >
                <header className="flex items-center justify-between">
                  <span className="editorial-mono-caption text-accent-text">
                    {t.name.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.55rem] tracking-widest inline-flex items-center gap-1",
                      t.is_active ? "text-green-700" : "text-ink-faint",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        t.is_active ? "bg-green-700" : "bg-ink-faint",
                      )}
                    />
                    {t.is_active ? "LIVE" : "INAKTIV"}
                  </span>
                </header>

                <div className="flex flex-wrap items-center gap-1.5">
                  {t.type && (
                    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                      {SURFACE_LABEL[t.type]}
                    </span>
                  )}
                  {t.environment && (
                    <span
                      className={cn(
                        "font-mono text-[0.55rem] tracking-widest uppercase border rounded-sm px-1.5 py-0.5",
                        t.environment === "production"
                          ? "border-green-700 text-green-700"
                          : t.environment === "staging"
                            ? "border-amber-700 text-amber-700"
                            : "border-hairline text-ink-faint",
                      )}
                    >
                      {t.environment}
                    </span>
                  )}
                  {t.requiresAuth && (
                    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                      auth-only
                    </span>
                  )}
                </div>

                <a
                  href={t.origin}
                  target="_blank"
                  rel="noopener"
                  className="font-serif text-xl text-ink leading-tight inline-flex items-center gap-1 hover:underline decoration-hairline underline-offset-4 group"
                  style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
                >
                  {t.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint group-hover:text-accent-text transition-colors" />
                </a>
                <p className="text-sm text-ink leading-snug min-h-[2.5em]">
                  {t.description}
                </p>

                <div className="flex items-baseline justify-between gap-2 mt-2 pt-3 border-t border-rule">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-serif text-5xl lg:text-6xl font-medium leading-none",
                        scoreClass(overall),
                      )}
                    >
                      {overall === null ? "—" : overall}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                      / 100
                    </span>
                  </div>
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                    OVERALL
                  </span>
                </div>

                <div
                  className="grid gap-px bg-rule border border-rule mt-1"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(scores.length, 5)}, minmax(0, 1fr))`,
                  }}
                >
                  {scores.map((s) => (
                    <div key={s.type} className="bg-paper px-2 py-2">
                      <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        {AUDIT_LABEL[s.type]}
                      </p>
                      <p
                        className={cn(
                          "font-serif text-lg font-medium",
                          scoreClass(s.run?.avg_score ?? null),
                        )}
                      >
                        {s.run ? Math.round(s.run.avg_score) : "—"}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => runScan(t.name)}
                  disabled={!t.is_active || isRunning}
                  className={cn(
                    "mt-2 inline-flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-xs uppercase tracking-widest font-medium transition-colors",
                    t.is_active
                      ? "bg-navy text-on-navy hover:bg-navy/90"
                      : "bg-paper-deep text-ink-faint cursor-not-allowed",
                    isRunning && "opacity-60",
                  )}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Skanner …
                    </>
                  ) : (
                    <>
                      <Activity className="h-3.5 w-3.5" />
                      Kjør skanning
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ActivityTile({ run }: { run: RecentRun }) {
  const score = Math.round(run.avg_score);
  const minutesAgo = Math.max(
    0,
    Math.round((Date.now() - new Date(run.started_at).getTime()) / 60000),
  );
  const when =
    minutesAgo < 60
      ? `${minutesAgo} min siden`
      : minutesAgo < 60 * 24
        ? `${Math.round(minutesAgo / 60)}t siden`
        : `${Math.round(minutesAgo / (60 * 24))}d siden`;
  return (
    <div className="bg-paper p-4 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="editorial-mono-caption text-accent-text truncate">
          {run.target_name.toUpperCase()}
        </span>
        <span
          className={cn(
            "font-mono text-[0.55rem] uppercase tracking-widest",
            run.status === "ok"
              ? "text-green-700"
              : run.status === "error"
                ? "text-red-700"
                : "text-ink-faint",
          )}
        >
          {run.status}
        </span>
      </div>
      <p className="text-xs text-ink">{AUDIT_LABEL[run.audit_type]}</p>
      <div className="flex items-baseline justify-between mt-1 pt-2 border-t border-rule">
        <span
          className={cn(
            "font-serif text-2xl font-medium tabular-nums leading-none",
            scoreClass(run.avg_score),
          )}
        >
          {score}
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
          {when}
        </span>
      </div>
    </div>
  );
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
