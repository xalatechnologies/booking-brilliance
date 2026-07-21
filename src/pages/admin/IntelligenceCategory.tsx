/**
 * Category-filtered dashboard pages. One generic component per route:
 *   /admin/intelligence/uptime
 *   /admin/intelligence/seo
 *   /admin/intelligence/wcag
 *   /admin/intelligence/sikkerhet
 *   /admin/intelligence/ytelse
 *   /admin/intelligence/lenker
 *
 * Each shows the latest runs of one audit type across all surfaces + the
 * findings filtered to that audit type.
 */
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAction } from "convex/react";
import {
  AlertTriangle,
  Construction,
  Gauge,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  AUDIT_LABEL,
  SURFACE_LABEL,
  adminToken,
  type AuditType,
  type IntelligenceCtx,
  type LatestRun,
  scoreClass,
} from "./intelligence-shared";

interface Props {
  auditType: AuditType;
  title: string;
  description: string;
  /** True for audit types that aren't implemented yet (performance, vulns). */
  placeholder?: boolean;
}

export function IntelligenceCategoryPage({
  auditType,
  title,
  description,
  placeholder,
}: Props) {
  const { snap } = useOutletContext<IntelligenceCtx>();

  const runs = useMemo<LatestRun[]>(
    () => (snap?.latest ?? []).filter((r) => r.audit_type === auditType),
    [snap, auditType],
  );
  const issues = useMemo(
    () => (snap?.issues ?? []).filter((i) => i.auditType === auditType),
    [snap, auditType],
  );

  // Performance gets a "Run PSI" trigger since it bypasses the normal
  // site-intelligence orchestrator (no Lighthouse on VPS). Hooks must run before
  // the early return below (rules-of-hooks); none depend on `snap`.
  const psiScan = useAction(api.audits.performance.scan);
  const [psiBusy, setPsiBusy] = useState(false);
  const [psiError, setPsiError] = useState<string | null>(null);

  if (!snap) {
    return (
      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Henter status…
      </div>
    );
  }

  // A performance run is "unscorable" when PSI returned no Lighthouse score
  // (auth-gated surfaces like dashboard.digilist.no redirect to a login PSI
  // can't measure). That lands as avg_score=0 with zero findings — a real page
  // always scores >0, and any sub-90 score emits a lighthouse.performance
  // finding, so score=0 && findings=0 uniquely means "not measured". Counting
  // it as a literal 0 dragged the category average down (e.g. 67 → 53), so
  // exclude it from the headline and label it "ikke målbar" per-surface.
  const isUnscored = (r: LatestRun) =>
    r.avg_score === 0 && r.findings_total === 0;
  const scoredRuns = runs.filter((r) => !isUnscored(r));
  const avg =
    scoredRuns.length === 0
      ? null
      : Math.round(
          scoredRuns.reduce((s, r) => s + r.avg_score, 0) / scoredRuns.length,
        );
  const errors = issues.filter((i) => i.severity === "error").length;
  const warns = issues.filter((i) => i.severity === "warn").length;
  const infos = issues.filter((i) => i.severity === "info").length;
  const surfacesScanned = runs.length;
  const surfaceMap = new Map(snap.targets.map((t) => [t.name, t]));

  const runPsi = async () => {
    setPsiBusy(true);
    setPsiError(null);
    try {
      await psiScan({ adminToken: adminToken() });
    } catch (e) {
      setPsiError(e instanceof Error ? e.message : String(e));
    } finally {
      setPsiBusy(false);
    }
  };

  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="editorial-mono-caption text-accent-text mb-2">
            {AUDIT_LABEL[auditType].toUpperCase()}
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
            style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
          >
            {title}
          </h2>
          <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
            {description}
          </p>
        </div>
        {auditType === "performance" && (
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => void runPsi()}
              disabled={psiBusy}
              className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-2 hover:bg-paper-strong disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {psiBusy ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  KJØRER PSI…
                </>
              ) : (
                <>
                  <Gauge className="h-3 w-3" />
                  KJØR PSI-SKANNING
                </>
              )}
            </button>
            {psiError && (
              <p className="text-xs text-red-700 max-w-xs">{psiError}</p>
            )}
          </div>
        )}
        {!placeholder && avg !== null && (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "inline-flex items-center gap-3 rounded-sm px-4 py-3 border",
                avg >= 85
                  ? "bg-green-50 border-green-700/40 dark:bg-green-950/40"
                  : avg >= 60
                    ? "bg-amber-50 border-amber-700/40 dark:bg-amber-950/40"
                    : "bg-red-50 border-red-700/40 dark:bg-red-950/40",
              )}
            >
              <TrendingUp
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  avg >= 85
                    ? "text-green-700"
                    : avg >= 60
                      ? "text-amber-700"
                      : "text-red-700",
                )}
              />
              <div className="flex flex-col leading-tight">
                <span
                  className={cn(
                    "font-mono text-[0.55rem] uppercase tracking-widest",
                    avg >= 85
                      ? "text-green-700 dark:text-green-400"
                      : avg >= 60
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-red-700 dark:text-red-400",
                  )}
                >
                  KATEGORISNITT
                </span>
                <span
                  className={cn(
                    "font-serif text-2xl font-medium",
                    scoreClass(avg),
                  )}
                >
                  {avg}
                  <span className="font-mono text-xs ml-1 text-ink-faint">
                    /100
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {placeholder ? (
        <div className="border border-hairline rounded-sm p-10 bg-paper-deep/30 max-w-4xl">
          <div className="flex items-start gap-4">
            <Construction className="h-8 w-8 text-accent-text flex-shrink-0" />
            <div>
              <h3 className="font-serif text-2xl text-ink mb-2">
                Under arbeid
              </h3>
              <p className="text-base text-ink max-w-prose leading-relaxed">
                Denne auditoren krever ekstern infrastruktur (Lighthouse CI,
                Playwright + Chromium, eller Snyk/Dependabot API). Se{" "}
                <code className="font-mono text-xs bg-paper-deep px-1.5 py-0.5 rounded-sm">
                  tools/site-intelligence/PLAN.md
                </code>{" "}
                for phaset roadmap.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-rule border border-rule">
              <Tile
                label="Snittscore"
                value={avg ?? "—"}
                tone={scoreClass(avg)}
              />
              <Tile
                label="Overflater"
                value={surfacesScanned}
                sub={`/${snap.targets.filter((t) => t.is_active).length} aktive`}
              />
              <Tile
                label="Errors"
                value={errors}
                tone={errors > 0 ? "text-red-700" : undefined}
              />
              <Tile
                label="Warnings"
                value={warns}
                tone={warns > 0 ? "text-amber-700" : undefined}
              />
              <Tile label="Info" value={infos} />
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
              <p className="editorial-mono-caption text-accent-text">
                PER OVERFLATE
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                {runs.length} SKANNINGER
              </p>
            </div>
            <div className="border border-rule rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-deep/40">
                  <tr>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Overflate
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Type
                    </th>
                    <th className="text-right px-4 py-3 editorial-mono-caption text-ink">
                      Sider
                    </th>
                    <th className="text-right px-4 py-3 editorial-mono-caption text-ink">
                      Funn
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink min-w-[180px]">
                      Score
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Sist kjørt
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {runs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-ink-faint"
                      >
                        Ingen skanninger ennå for denne kategorien.
                      </td>
                    </tr>
                  ) : (
                    runs.map((r) => {
                      const target = surfaceMap.get(r.target_name);
                      const score = Math.round(r.avg_score);
                      return (
                        <tr
                          key={r.id}
                          className="border-t border-rule hover:bg-paper-deep/40"
                        >
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs text-ink font-medium">
                              {r.target_name}
                            </div>
                            <div className="text-xs text-ink-faint mt-0.5 truncate max-w-[28ch]">
                              {target?.origin.replace(/^https?:\/\//, "")}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                              {target?.type
                                ? SURFACE_LABEL[target.type]
                                : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-ink tabular-nums">
                            {r.pages_scanned}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 text-right font-mono text-xs tabular-nums",
                              r.findings_total === 0
                                ? "text-ink-faint"
                                : "text-ink",
                            )}
                          >
                            {r.findings_total}
                          </td>
                          <td className="px-4 py-3">
                            {isUnscored(r) ? (
                              <span
                                className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-faint"
                                title="PSI kunne ikke måle denne overflaten (auth-gated innlogging/redirect). Utelatt fra snittscoren."
                              >
                                ikke målbar
                              </span>
                            ) : (
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "font-serif text-2xl font-medium leading-none tabular-nums w-12",
                                  scoreClass(r.avg_score),
                                )}
                              >
                                {score}
                              </span>
                              <div className="flex-1 h-1 bg-paper-deep rounded-sm overflow-hidden max-w-[120px]">
                                <div
                                  className={cn(
                                    "h-full transition-all",
                                    score >= 85
                                      ? "bg-green-700"
                                      : score >= 60
                                        ? "bg-amber-600"
                                        : "bg-red-700",
                                  )}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-[0.65rem] text-ink-soft">
                            {new Date(r.started_at).toLocaleString("nb-NO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
              <p className="editorial-mono-caption text-accent-text">FUNN</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                {issues.length} REGISTRERT · {errors} ERR · {warns} WARN
              </p>
            </div>
            <div className="border border-rule rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-paper-deep/40">
                  <tr>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink w-24">
                      Alvorsgrad
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Overflate
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Regel
                    </th>
                    <th className="text-left px-4 py-3 editorial-mono-caption text-ink">
                      Detalj
                    </th>
                    <th className="text-right px-4 py-3 editorial-mono-caption text-ink w-24">
                      Berørte
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-ink-faint"
                      >
                        Ingen funn, pent ryddet
                      </td>
                    </tr>
                  ) : (
                    issues.map((i, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-rule hover:bg-paper-deep/40"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "font-mono text-[0.6rem] tracking-widest px-2 py-1 border rounded-sm uppercase font-medium",
                              i.severity === "error"
                                ? "text-red-700 border-red-700 bg-red-50 dark:bg-red-950/30"
                                : i.severity === "warn"
                                  ? "text-amber-700 border-amber-700 bg-amber-50 dark:bg-amber-950/30"
                                  : "text-navy border-navy bg-paper-deep/60",
                            )}
                          >
                            {i.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink">
                          {i.surface}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-ink">
                          {i.rule}
                        </td>
                        <td className="px-4 py-3 text-ink leading-snug">
                          <span className="line-clamp-2">{i.message}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-base tabular-nums text-ink">
                          {i.affected}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {issues.some((i) => i.severity === "error") && (
              <p className="mt-3 text-xs text-ink-soft flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-700" />
                Trenger forslag til fiks? Gå til{" "}
                <a
                  href="/admin/intelligence/issues"
                  className="underline decoration-hairline underline-offset-4 hover:text-ink"
                >
                  Hva gikk galt
                </a>{" "}
                for AI-anbefaling per rad.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Tile({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: number | string;
  tone?: string;
  sub?: string;
}) {
  return (
    <div className="bg-paper p-6 lg:p-7 flex flex-col gap-2">
      <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
        {label}
      </p>
      <p
        className={cn(
          "font-serif text-5xl lg:text-6xl font-medium leading-none mt-1",
          tone ?? "text-ink",
        )}
      >
        {value}
      </p>
      {sub && (
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}
