/**
 * /admin/intelligence/vekst/* — Growth Intelligence Agent Harness.
 *
 * Five sub-pages, all driven by the same `/api/content/state` snapshot.
 * The dashboard never mutates SQLite directly — every action POSTs
 * to /api/content/drafts/:id/... which spawns the cli helper server-side.
 *
 * Pages exported from this file (wired in src/App.tsx):
 *   VekstOverview      — agents org chart + run history + KPIs
 *   VekstKeywords      — cluster table + gap scores + recent terms
 *   VekstDrafts        — approval queue (pending → approved → published)
 *   VekstConnections   — LinkedIn / X OAuth status (drafts-only by default)
 *   VekstAktivitet     — agent_actions audit log (cost + tokens per call)
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardCopy,
  Coins,
  ExternalLink,
  Eye,
  FileEdit,
  Hash,
  KeyRound,
  Loader2,
  Plug,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_KEY, adminToken } from "./intelligence-shared";

// ─────────────────────────────────────────────────────────────
// Types (lightweight mirror of tools/content-agent/src/types.ts)

type Channel = "blog" | "linkedin" | "x";
type DraftStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published"
  | "failed";

interface AgentDef {
  slug: string;
  name: string;
  role: string;
  description: string;
  status: string;
  tier: "v1" | "v1plus" | "deferred";
  owner: string;
  allowed_tools: string[];
  reports_to: string;
  budget_usd_month: number;
  risk_default: "low" | "med" | "high";
  source: string;
  monthly_spend_usd: number;
}

interface ClusterRow {
  id: number;
  label: string;
  centroid_term: string;
  composite_score: number;
  topic_summary: string;
  coverage: {
    gap_score: number;
    best_match_url: string | null;
    best_match_score: number;
  } | null;
}

interface DraftRow {
  id: number;
  // Real Convex document id, used as the argument to approve/reject/publish
  // mutations. Optional during the migration window when rows still come
  // from the legacy SQLite snapshot (no _id).
  _id?: Id<"drafts">;
  brief_id: number;
  channel: Channel;
  title: string;
  body: string;
  hashtags_json: string;
  status: DraftStatus;
  reviewer_notes: string;
  created_at: string;
  approved_at: string | null;
  published_at: string | null;
  published_url: string | null;
  model: string;
}

interface KeywordRow {
  id: number;
  term: string;
  source: string;
  score: number;
  region: string;
  sampled_at: string;
}

interface RunRow {
  id: number;
  phase: string;
  started_at: string;
  finished_at: string | null;
  trigger: string;
  status: string;
  keywords_discovered: number;
  clusters_created: number;
  drafts_generated: number;
}

interface ActionRow {
  id: number;
  agent_slug: string;
  run_id: number | null;
  kind: string;
  tool: string;
  input_summary: string;
  output_summary: string;
  trace_ref: string;
  risk: "low" | "med" | "high";
  requires_review: boolean;
  reviewed_at: string | null;
  cost_usd: number;
  tokens_in: number;
  tokens_out: number;
  created_at: string;
}

interface ConnectionRow {
  provider: "linkedin" | "x";
  status: "disconnected" | "connected" | "expired";
  account_handle: string;
  scopes: string;
  token_expires_at: string | null;
  last_checked_at: string;
}

interface TaskRow {
  id: number;
  source_agent: string;
  category: string;
  title: string;
  priority: string;
  status: string;
}

export interface ContentSnapshot {
  generatedAt: string;
  agents: AgentDef[];
  clusters: ClusterRow[];
  drafts: {
    pending: DraftRow[];
    approved: DraftRow[];
    published: DraftRow[];
    rejected: DraftRow[];
  };
  keywords: { recent: KeywordRow[] };
  runs: RunRow[];
  actions: ActionRow[];
  connections: ConnectionRow[];
  tasks: TaskRow[];
  note?: string;
}

// ─────────────────────────────────────────────────────────────
// Shared snapshot hook

function useContentSnapshot() {
  // Reactive Convex query — every mutation that touches the underlying
  // tables auto-updates this snapshot, so the dashboard stays in sync
  // across tabs without polling. Loading is signalled by `snap === undefined`.
  const snap = useQuery(api.content.state.snapshot, { adminToken: adminToken() }) as
    | ContentSnapshot
    | undefined;
  const auth =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) : null;
  // refresh() is a no-op — kept for back-compat with the four pages that
  // still pass it to EmptyState. Convex queries refresh themselves.
  const refresh = useCallback(() => {
    /* reactive */
  }, []);
  return {
    snap: snap ?? null,
    loading: snap === undefined,
    error: null as string | null,
    refresh,
    auth,
  };
}

// ─────────────────────────────────────────────────────────────
// Shared UI primitives

function PageHeader({
  icon: Icon,
  title,
  caption,
  actions,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  caption: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex items-start justify-between mb-8 pb-6 border-b border-rule">
      <div className="flex items-start gap-4">
        <div className="p-2 border border-hairline-strong rounded-sm">
          <Icon className="h-5 w-5 text-accent-text" />
        </div>
        <div>
          <p className="editorial-mono-caption text-accent-text mb-1">
            VEKST · INNHOLDSAGENT
          </p>
          <h1
            className="font-serif text-3xl lg:text-4xl text-ink leading-tight"
            style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
          >
            {title}
          </h1>
          <p className="text-sm text-ink-soft mt-1.5 max-w-2xl">{caption}</p>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

function RiskBadge({ risk }: { risk: "low" | "med" | "high" }) {
  const tone =
    risk === "high"
      ? "border-red-700 text-red-700"
      : risk === "med"
        ? "border-amber-700 text-amber-700"
        : "border-green-700 text-green-700";
  return (
    <span
      className={cn(
        "font-mono text-[0.55rem] tracking-widest uppercase border rounded-sm px-1.5 py-0.5",
        tone,
      )}
    >
      { {low:"lav",med:"middels",high:"høy"}[risk] }
    </span>
  );
}

function ChannelBadge({ channel }: { channel: Channel }) {
  const label =
    channel === "blog" ? "BLOG" : channel === "linkedin" ? "LINKEDIN" : "X";
  return (
    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
      {label}
    </span>
  );
}

const STATUS_LABEL_NO: Record<DraftStatus, string> = {
  pending: "Avventer",
  approved: "Godkjent",
  rejected: "Avvist",
  published: "Publisert",
  failed: "Feilet",
};

function StatusPill({ status }: { status: DraftStatus }) {
  const tone =
    status === "published"
      ? "bg-green-700 text-on-navy"
      : status === "approved"
        ? "bg-blue-700 text-on-navy"
        : status === "rejected"
          ? "bg-red-700 text-on-navy"
          : status === "failed"
            ? "bg-amber-700 text-on-navy"
            : "bg-ink-faint text-on-navy";
  return (
    <span
      className={cn(
        "font-mono text-[0.55rem] tracking-widest uppercase rounded-sm px-1.5 py-0.5",
        tone,
      )}
    >
      {STATUS_LABEL_NO[status]}
    </span>
  );
}

function EmptyState({ note, refresh }: { note: string; refresh: () => void }) {
  return (
    <div className="border border-dashed border-hairline-strong rounded-sm p-12 text-center">
      <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint mb-3">
        INGEN DATA
      </p>
      <p className="text-sm text-ink-soft mb-4">{note}</p>
      <button
        type="button"
        onClick={refresh}
        className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong"
      >
        <RefreshCw className="h-3 w-3 inline mr-1.5" />
        REFRESH
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. Overview — agents grid + KPIs + run history

export function VekstOverview() {
  const { snap, loading, error, refresh, auth } = useContentSnapshot();
  const [running, setRunning] = useState(false);

  const runPipeline = async (phase: "all" | "discover" | "analyze" | "generate") => {
    if (!auth) return;
    setRunning(true);
    try {
      await fetch("/api/content/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ phase }),
      });
      // Pipeline runs async; show running state, then poll snapshot.
      setTimeout(() => {
        void refresh();
        setRunning(false);
      }, 8000);
    } catch {
      setRunning(false);
    }
  };

  if (loading && !snap) {
    return (
      <div className="p-12 text-center text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
        Laster vekst-snapshot…
      </div>
    );
  }
  if (error || !snap) {
    return (
      <EmptyState
        note={error ?? "No snapshot. Click 'Kjør discover' to begin."}
        refresh={refresh}
      />
    );
  }

  const v1 = snap.agents.filter((a) => a.tier === "v1");
  const v1plus = snap.agents.filter((a) => a.tier === "v1plus");
  const deferred = snap.agents.filter((a) => a.tier === "deferred");
  const totalSpend = snap.agents.reduce((s, a) => s + (a.monthly_spend_usd ?? 0), 0);
  const totalBudget = snap.agents.reduce((s, a) => s + a.budget_usd_month, 0);
  const pendingDrafts = snap.drafts.pending.length;
  const approvedDrafts = snap.drafts.approved.length;
  const publishedDrafts = snap.drafts.published.length;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        icon={TrendingUp}
        title="Vekst-oversikt"
        caption="Multi-agent system som overvåker hele Digilist-økosystemet og hjelper aktivt med SEO, synlighet, innholdskvalitet og sikkerhet. Hver agent er katalogisert, budsjettert og fullt sporet."
        actions={
          <>
            <button
              type="button"
              onClick={() => runPipeline("all")}
              disabled={running}
              className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong disabled:opacity-50"
            >
              {running ? (
                <>
                  <Loader2 className="h-3 w-3 inline mr-1.5 animate-spin" />
                  KJØRER…
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 inline mr-1.5" />
                  KJØR FULL PIPELINE
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => void refresh()}
              className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong"
            >
              <RefreshCw className="h-3 w-3 inline mr-1.5" />
              REFRESH
            </button>
          </>
        }
      />

      {/* KPI strip */}
      <section className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
          {[
            {
              label: "Agenter aktive",
              value: snap.agents.filter((a) => a.status === "active").length,
              sub: `${v1.length} V1 · ${v1plus.length} V1+ · ${deferred.length} utsatt`,
            },
            {
              label: "Drafts pending",
              value: pendingDrafts,
              sub: `${approvedDrafts} godkjent · ${publishedDrafts} publisert`,
              tone:
                pendingDrafts > 0
                  ? "text-amber-700 dark:text-amber-400"
                  : undefined,
            },
            {
              label: "Clusters",
              value: snap.clusters.length,
              sub: `${snap.keywords.recent.length} keywords siste 14d`,
            },
            {
              label: "Spend / mnd",
              value: `$${totalSpend.toFixed(2)}`,
              sub: `av $${totalBudget.toFixed(0)} budsjett`,
              tone:
                totalSpend > totalBudget
                  ? "text-red-700 dark:text-red-400"
                  : undefined,
            },
          ].map((c) => (
            <div key={c.label} className="bg-paper p-6 flex flex-col gap-2">
              <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                {c.label}
              </p>
              <p
                className={cn(
                  "font-serif text-4xl lg:text-5xl font-medium leading-none mt-1",
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

      {/* Agent grid — 2 cards per row per user spec */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
          <p className="editorial-mono-caption text-accent-text">
            AGENT-KATALOG
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
            {snap.agents.length} TOTALT
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
          {snap.agents.map((a) => {
            const overBudget =
              a.budget_usd_month > 0 &&
              a.monthly_spend_usd > a.budget_usd_month;
            const utilization =
              a.budget_usd_month > 0
                ? Math.round((a.monthly_spend_usd / a.budget_usd_month) * 100)
                : 0;
            return (
              <div key={a.slug} className="bg-paper p-6 flex flex-col gap-3">
                <header className="flex items-start justify-between gap-3">
                  <div>
                    <span className="editorial-mono-caption text-accent-text">
                      {a.slug.toUpperCase()}
                    </span>
                    <p
                      className="font-serif text-xl text-ink mt-1"
                      style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
                    >
                      {a.name}
                    </p>
                    <p className="text-xs text-ink-soft mt-0.5">{a.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={cn(
                        "font-mono text-[0.55rem] tracking-widest uppercase rounded-sm px-1.5 py-0.5 border",
                        a.tier === "v1"
                          ? "border-green-700 text-green-700"
                          : a.tier === "v1plus"
                            ? "border-amber-700 text-amber-700"
                            : "border-ink-faint text-ink-faint",
                      )}
                    >
                      {a.tier}
                    </span>
                    <RiskBadge risk={a.risk_default} />
                  </div>
                </header>

                <p className="text-sm text-ink leading-snug">
                  {a.description}
                </p>

                {a.reports_to && (
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                    REPORTS TO · {a.reports_to}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-px bg-rule border border-rule mt-1">
                  <div className="bg-paper px-2 py-2">
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      EIER
                    </p>
                    <p className="text-xs text-ink mt-0.5">{a.owner || "—"}</p>
                  </div>
                  <div className="bg-paper px-2 py-2">
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      KILDE
                    </p>
                    <p className="text-xs text-ink mt-0.5">{a.source}</p>
                  </div>
                </div>

                <div className="border-t border-rule pt-3 mt-1 flex items-baseline justify-between">
                  <div>
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      SPEND / BUDSJETT
                    </p>
                    <p
                      className={cn(
                        "font-serif text-lg mt-0.5",
                        overBudget
                          ? "text-red-700 dark:text-red-400"
                          : "text-ink",
                      )}
                    >
                      ${a.monthly_spend_usd.toFixed(2)}{" "}
                      <span className="text-ink-faint text-sm">
                        / ${a.budget_usd_month.toFixed(0)}
                      </span>
                    </p>
                  </div>
                  {a.budget_usd_month > 0 && (
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
                      {utilization}%
                    </span>
                  )}
                </div>

                {a.allowed_tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {a.allowed_tools.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[0.55rem] tracking-widest text-ink-faint border border-hairline rounded-sm px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                    {a.allowed_tools.length > 6 && (
                      <span className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        +{a.allowed_tools.length - 6} til
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent runs */}
      {snap.runs.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text">
              SISTE PIPELINE-KJØRINGER
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
              {snap.runs.length} TOTALT
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
            {snap.runs.slice(0, 8).map((r) => (
              <div key={r.id} className="bg-paper p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
                      RUN #{r.id} · {r.phase} · {r.trigger}
                    </p>
                    <p className="text-xs text-ink mt-1">
                      {new Date(r.started_at).toLocaleString("nb-NO")}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "font-mono text-[0.55rem] tracking-widest uppercase rounded-sm px-1.5 py-0.5",
                      r.status === "ok"
                        ? "bg-green-700 text-on-navy"
                        : r.status === "running"
                          ? "bg-blue-700 text-on-navy"
                          : "bg-red-700 text-on-navy",
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-rule">
                  <div>
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      KEYWORDS
                    </p>
                    <p className="font-serif text-lg text-ink">
                      {r.keywords_discovered}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      CLUSTERS
                    </p>
                    <p className="font-serif text-lg text-ink">
                      {r.clusters_created}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                      DRAFTS
                    </p>
                    <p className="font-serif text-lg text-ink">
                      {r.drafts_generated}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Keywords — clusters + recent terms

export function VekstKeywords() {
  const { snap, loading, error, refresh } = useContentSnapshot();
  if (loading && !snap) {
    return (
      <div className="p-12 text-center text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
        Laster keywords…
      </div>
    );
  }
  if (error || !snap) {
    return <EmptyState note={error ?? "No snapshot"} refresh={refresh} />;
  }
  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        icon={KeyRound}
        title="Keyword Intelligence"
        caption="Klynger av søkefraser samlet fra Google Trends, Reddit, HN, RSS, SerpAPI og Claude-utvidelse, rangert etter signalstyrke × gap mot eksisterende Digilist-innhold."
        actions={
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong"
          >
            <RefreshCw className="h-3 w-3 inline mr-1.5" />
            REFRESH
          </button>
        }
      />

      {/* Clusters */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
          <p className="editorial-mono-caption text-accent-text">
            KEYWORD CLUSTERS
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
            {snap.clusters.length} TOTALT
          </p>
        </div>
        {snap.clusters.length === 0 ? (
          <EmptyState
            note="No clusters yet. Run discover + analyze to build them."
            refresh={refresh}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
            {snap.clusters.map((c) => {
              const gap = c.coverage?.gap_score ?? 100;
              const opp = (c.composite_score / 100) * (gap / 100) * 100;
              return (
                <div key={c.id} className="bg-paper p-6">
                  <header className="flex items-start justify-between mb-2">
                    <div>
                      <span className="editorial-mono-caption text-accent-text">
                        CLUSTER #{c.id}
                      </span>
                      <p
                        className="font-serif text-xl text-ink mt-1"
                        style={{
                          fontVariationSettings: '"opsz" 36, "wght" 540',
                        }}
                      >
                        {c.label}
                      </p>
                      <p className="text-xs text-ink-soft mt-0.5 italic">
                        Centroid: "{c.centroid_term}"
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        OPPORTUNITY
                      </p>
                      <p
                        className={cn(
                          "font-serif text-3xl mt-0.5",
                          opp >= 70
                            ? "text-green-700"
                            : opp >= 40
                              ? "text-amber-700"
                              : "text-ink-faint",
                        )}
                      >
                        {Math.round(opp)}
                      </p>
                    </div>
                  </header>
                  <p className="text-sm text-ink leading-snug mt-2">
                    {c.topic_summary}
                  </p>
                  <div className="grid grid-cols-3 gap-px bg-rule border border-rule mt-3">
                    <div className="bg-paper px-3 py-2">
                      <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        SIGNAL
                      </p>
                      <p className="font-serif text-lg text-ink">
                        {Math.round(c.composite_score)}
                      </p>
                    </div>
                    <div className="bg-paper px-3 py-2">
                      <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        GAP
                      </p>
                      <p className="font-serif text-lg text-ink">
                        {Math.round(gap)}
                      </p>
                    </div>
                    <div className="bg-paper px-3 py-2">
                      <p className="font-mono text-[0.55rem] tracking-widest text-ink-faint">
                        DEKKER
                      </p>
                      <p className="font-serif text-lg text-ink">
                        {100 - Math.round(gap)}
                      </p>
                    </div>
                  </div>
                  {c.coverage?.best_match_url && (
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-2">
                      NÆRMESTE TREFF ·{" "}
                      <a
                        href={c.coverage.best_match_url}
                        target="_blank"
                        rel="noopener"
                        className="text-accent-text hover:underline"
                      >
                        {c.coverage.best_match_url.replace(
                          "https://digilist.no",
                          "",
                        )}
                      </a>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent keywords table */}
      {snap.keywords.recent.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text">
              SISTE NØKKELORD
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
              {snap.keywords.recent.length} SISTE 14D
            </p>
          </div>
          <div className="border border-rule overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-paper-strong border-b border-rule">
                  <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                    TERM
                  </th>
                  <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                    KILDE
                  </th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                    SCORE
                  </th>
                  <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                    SAMPLET
                  </th>
                </tr>
              </thead>
              <tbody>
                {snap.keywords.recent.slice(0, 80).map((k) => (
                  <tr key={k.id} className="border-b border-rule">
                    <td className="p-3 text-ink">{k.term}</td>
                    <td className="p-3">
                      <span className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-soft">
                        {k.source}
                      </span>
                    </td>
                    <td className="p-3 text-right font-serif text-ink">
                      {Math.round(k.score)}
                    </td>
                    <td className="p-3 text-right font-mono text-[0.65rem] text-ink-faint">
                      {new Date(k.sampled_at).toLocaleDateString("nb-NO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. Drafts — approval queue

function parseHashtags(raw: string): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) {
      return v
        .map((s) => String(s).trim())
        .filter(Boolean)
        .map((s) => (s.startsWith("#") ? s : `#${s}`));
    }
  } catch {
    /* fall through to whitespace split */
  }
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.startsWith("#") ? s : `#${s}`));
}

const CHANNEL_ACCENT: Record<Channel, string> = {
  blog: "bg-accent-text",
  linkedin: "bg-blue-700",
  x: "bg-ink",
};

type Toast = { kind: "ok" | "err"; text: string } | null;

export function VekstDrafts() {
  // Reactive snapshot via Convex — no more polling, no snapshot file race.
  // Mutations trigger an automatic re-render of every component reading
  // the same query, so approving a draft immediately moves the card.
  const snap = useQuery(api.content.state.snapshot, { adminToken: adminToken() });
  const approveDraft = useMutation(api.content.drafts.approve);
  const rejectDraft = useMutation(api.content.drafts.reject);
  const publishDraft = useAction(api.content.publish.publish);

  const [filter, setFilter] = useState<DraftStatus>("pending");
  const [busy, setBusy] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const loading = snap === undefined;
  const error: string | null = null;
  const refresh = useCallback(() => {
    // Convex queries are reactive — manual refresh is a no-op now.
    // Kept as a stable function so EmptyState's signature doesn't change.
  }, []);

  // Auto-dismiss toasts.
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const act = async (
    draft: DraftRow,
    action: "approve" | "reject" | "publish",
  ) => {
    if (!draft._id) {
      setToast({
        kind: "err",
        text: "Draften har ikke en Convex-id ennå. Kjør migreringsskriptet først.",
      });
      return;
    }
    setBusy(draft.id);
    try {
      const note = notes[draft.id]?.trim();
      let result: { ok?: boolean; error?: string } | unknown;
      const token = adminToken();
      if (action === "approve") {
        result = await approveDraft({
          adminToken: token,
          id: draft._id,
          note: note || undefined,
        });
      } else if (action === "reject") {
        result = await rejectDraft({
          adminToken: token,
          id: draft._id,
          note: note || undefined,
        });
      } else {
        result = await publishDraft({ adminToken: token, id: draft._id });
      }
      const r = result as { ok?: boolean; error?: string };
      if (r && r.ok === false) {
        setToast({
          kind: "err",
          text: r.error ?? `Draft ${draft.id} ${action} feilet.`,
        });
        return;
      }
      setToast({
        kind: "ok",
        text: `Draft #${draft.id} ${action === "approve" ? "godkjent" : action === "reject" ? "avvist" : "publisert"}.`,
      });
      setNotes((n) => {
        const next = { ...n };
        delete next[draft.id];
        return next;
      });
    } catch (e) {
      setToast({
        kind: "err",
        text: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setBusy(null);
    }
  };

  const copyBody = async (id: number, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
    } catch {
      setToast({ kind: "err", text: "Kunne ikke kopiere: clipboard blokkert." });
    }
  };

  if (loading && !snap) {
    return (
      <div className="p-12 text-center text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
        Laster drafts…
      </div>
    );
  }
  if (error || !snap) {
    return <EmptyState note={error ?? "No snapshot"} refresh={refresh} />;
  }

  const counts = {
    pending: snap.drafts.pending.length,
    approved: snap.drafts.approved.length,
    published: snap.drafts.published.length,
    rejected: snap.drafts.rejected.length,
  };
  const list =
    filter === "pending"
      ? snap.drafts.pending
      : filter === "approved"
        ? snap.drafts.approved
        : filter === "published"
          ? snap.drafts.published
          : snap.drafts.rejected;

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        icon={FileEdit}
        title="Godkjenningskø"
        caption="Hver generert draft venter her på menneskelig godkjenning. Ingenting publiseres automatisk. Selv etter godkjenning må Publiser-knappen trykkes eksplisitt."
        actions={
          <button
            type="button"
            onClick={() => void refresh()}
            className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong"
          >
            <RefreshCw className="h-3 w-3 inline mr-1.5" />
            REFRESH
          </button>
        }
      />

      {toast && (
        <div
          role="status"
          className={cn(
            "mb-6 flex items-start justify-between gap-3 border rounded-sm px-4 py-3",
            toast.kind === "ok"
              ? "border-green-700 bg-green-50/40 dark:bg-green-950/20 text-green-800 dark:text-green-300"
              : "border-red-700 bg-red-50/40 dark:bg-red-950/20 text-red-800 dark:text-red-300",
          )}
        >
          <div className="flex items-start gap-2 min-w-0">
            {toast.kind === "ok" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm break-words">{toast.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Lukk varsel"
            className="text-current opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {(["pending", "approved", "published", "rejected"] as const).map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "font-mono text-[0.65rem] tracking-widest uppercase rounded-sm px-3 py-1.5 border",
                filter === s
                  ? "bg-navy text-on-navy border-navy"
                  : "border-hairline-strong hover:bg-paper-strong",
              )}
            >
              {STATUS_LABEL_NO[s]} · {counts[s]}
            </button>
          ),
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          note={`Ingen utkast med status "${STATUS_LABEL_NO[filter]}".`}
          refresh={refresh}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((d) => {
            const channelRisk =
              d.channel === "x" ? "low" : ("med" as "low" | "med");
            const tags = parseHashtags(d.hashtags_json);
            const wordCount = d.body
              ? d.body.trim().split(/\s+/).filter(Boolean).length
              : 0;
            const note = notes[d.id] ?? "";
            return (
              <article
                key={d.id}
                className="bg-paper border border-rule rounded-sm flex"
              >
                <div
                  className={cn(
                    "w-1.5 flex-shrink-0 rounded-l-sm",
                    CHANNEL_ACCENT[d.channel],
                  )}
                  aria-hidden
                />
                <div className="flex-1 min-w-0 p-6 flex flex-col gap-3">
                  <header>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <ChannelBadge channel={d.channel} />
                      <RiskBadge risk={channelRisk} />
                      <StatusPill status={d.status} />
                    </div>
                    <h3
                      className="font-serif text-2xl text-ink leading-tight"
                      style={{
                        fontVariationSettings: '"opsz" 36, "wght" 540',
                      }}
                    >
                      {d.title}
                    </h3>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-2">
                      DRAFT #{d.id} · {d.model} · {wordCount} ord ·{" "}
                      {new Date(d.created_at).toLocaleString("nb-NO")}
                    </p>
                  </header>

                  <div className="border-t border-rule pt-3 text-sm text-ink whitespace-pre-wrap leading-relaxed">
                    {d.body}
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-0.5 font-mono text-[0.65rem] tracking-wide text-ink-soft border border-hairline rounded-sm px-1.5 py-0.5"
                        >
                          <Hash className="h-2.5 w-2.5" />
                          {t.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  )}

                  {d.published_url && (
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint border-t border-rule pt-3">
                      PUBLISERT ·{" "}
                      <a
                        href={d.published_url}
                        target="_blank"
                        rel="noopener"
                        className="text-accent-text hover:underline inline-flex items-center gap-1"
                      >
                        {d.published_url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  )}

                  {d.reviewer_notes && filter !== "pending" && (
                    <p className="text-xs text-ink-soft italic border-t border-rule pt-3">
                      "{d.reviewer_notes}"
                    </p>
                  )}

                  {filter === "pending" && (
                    <div className="border-t border-rule pt-3 mt-auto">
                      <label
                        htmlFor={`note-${d.id}`}
                        className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-1.5 block"
                      >
                        VURDERINGSNOTAT (VALGFRITT)
                      </label>
                      <textarea
                        id={`note-${d.id}`}
                        value={note}
                        onChange={(e) =>
                          setNotes((n) => ({ ...n, [d.id]: e.target.value }))
                        }
                        placeholder="Kontekst for godkjenning/avvisning…"
                        rows={2}
                        className="w-full text-sm bg-paper-strong border border-hairline rounded-sm px-2 py-1.5 mb-3 focus:outline-none focus:ring-1 focus:ring-accent-text resize-y"
                      />
                      <div className="flex flex-wrap gap-2">
                        {d._id && (
                          <a
                            href={`/blogg/preview/${d._id}`}
                            target="_blank"
                            rel="noopener"
                            className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-2 hover:bg-paper-strong inline-flex items-center justify-center"
                          >
                            <Eye className="h-3 w-3 inline mr-1.5" />
                            PREVIEW
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => void copyBody(d.id, d.body)}
                          className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-2 hover:bg-paper-strong inline-flex items-center justify-center"
                        >
                          {copied === d.id ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 inline mr-1.5" />
                              KOPIERT
                            </>
                          ) : (
                            <>
                              <ClipboardCopy className="h-3 w-3 inline mr-1.5" />
                              KOPIER
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={busy === d.id}
                          onClick={() => void act(d, "approve")}
                          className="flex-1 min-w-[120px] font-mono text-[0.65rem] tracking-widest uppercase bg-green-700 text-on-navy rounded-sm px-3 py-2 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                        >
                          {busy === d.id ? (
                            <Loader2 className="h-3 w-3 inline animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 inline mr-1.5" />
                              APPROVE
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={busy === d.id}
                          onClick={() => void act(d, "reject")}
                          className="flex-1 min-w-[120px] font-mono text-[0.65rem] tracking-widest uppercase bg-red-700 text-on-navy rounded-sm px-3 py-2 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3 inline mr-1.5" />
                          REJECT
                        </button>
                      </div>
                    </div>
                  )}

                  {filter === "approved" && (
                    <div className="border-t border-rule pt-3 mt-auto flex flex-wrap gap-2">
                      {d._id && (
                        <a
                          href={`/blogg/preview/${d._id}`}
                          target="_blank"
                          rel="noopener"
                          className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-2 hover:bg-paper-strong inline-flex items-center justify-center"
                        >
                          <Eye className="h-3 w-3 inline mr-1.5" />
                          PREVIEW
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => void copyBody(d.id, d.body)}
                        className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-2 hover:bg-paper-strong inline-flex items-center justify-center"
                      >
                        {copied === d.id ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 inline mr-1.5" />
                            KOPIERT
                          </>
                        ) : (
                          <>
                            <ClipboardCopy className="h-3 w-3 inline mr-1.5" />
                            KOPIER
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={busy === d.id}
                        onClick={() => void act(d, "publish")}
                        className="flex-1 min-w-[140px] font-mono text-[0.65rem] tracking-widest uppercase bg-navy text-on-navy rounded-sm px-3 py-2 hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center"
                      >
                        {busy === d.id ? (
                          <Loader2 className="h-3 w-3 inline animate-spin" />
                        ) : (
                          <>
                            <Send className="h-3 w-3 inline mr-1.5" />
                            PUBLISH
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Connections — LinkedIn / X OAuth status

export function VekstConnections() {
  const { snap, loading, error, refresh } = useContentSnapshot();
  if (loading && !snap) {
    return (
      <div className="p-12 text-center text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
        Laster connections…
      </div>
    );
  }
  if (error || !snap) {
    return <EmptyState note={error ?? "No snapshot"} refresh={refresh} />;
  }
  const byProvider = new Map(snap.connections.map((c) => [c.provider, c]));
  const providers: Array<{
    provider: "linkedin" | "x";
    name: string;
    docs: string;
    notes: string;
  }> = [
    {
      provider: "linkedin",
      name: "LinkedIn",
      docs: "https://developer.linkedin.com/",
      notes:
        "Krever Marketing Developer Platform-godkjenning for å poste til Company Page (2-6 ukers ventetid). Personlig profil: w_member_social-scope.",
    },
    {
      provider: "x",
      name: "X (Twitter)",
      docs: "https://developer.x.com/",
      notes:
        "Krever Basic tier ($200/mnd) for å POST /tweets. Access token har 2-timers TTL. Refresh-cron må settes opp separat.",
    },
  ];

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        icon={Plug}
        title="Publishing Connections"
        caption="OAuth-tilkoblinger til LinkedIn og X. Disse er valgfrie. Uten dem holdes alle drafts som drafts. Sett opp credentials i /etc/digilist-api.env og restart digilist-api."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
        {providers.map(({ provider, name, docs, notes }) => {
          const conn = byProvider.get(provider);
          const isConnected = conn?.status === "connected";
          return (
            <div key={provider} className="bg-paper p-6">
              <header className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className="font-serif text-2xl text-ink"
                    style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
                  >
                    {name}
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-1">
                    PROVIDER · {provider}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-[0.6rem] tracking-widest uppercase rounded-sm px-2 py-1",
                    isConnected
                      ? "bg-green-700 text-on-navy"
                      : "bg-ink-faint text-on-navy",
                  )}
                >
                  {conn?.status ?? "disconnected"}
                </span>
              </header>

              <p className="text-sm text-ink-soft leading-snug mb-4">
                {notes}
              </p>

              {conn && isConnected && (
                <dl className="space-y-1.5 text-xs border-t border-rule pt-3">
                  <div className="flex justify-between">
                    <dt className="font-mono uppercase tracking-widest text-ink-faint">
                      KONTO
                    </dt>
                    <dd className="text-ink">{conn.account_handle}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-mono uppercase tracking-widest text-ink-faint">
                      SCOPES
                    </dt>
                    <dd className="text-ink font-mono text-[0.65rem]">
                      {conn.scopes || "—"}
                    </dd>
                  </div>
                  {conn.token_expires_at && (
                    <div className="flex justify-between">
                      <dt className="font-mono uppercase tracking-widest text-ink-faint">
                        UTLØPER
                      </dt>
                      <dd className="text-ink">
                        {new Date(conn.token_expires_at).toLocaleString(
                          "nb-NO",
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              )}

              {!isConnected && (
                <div className="border-t border-rule pt-3 mt-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-2">
                    SETUP
                  </p>
                  <ol className="text-xs text-ink-soft space-y-1 list-decimal list-inside">
                    <li>
                      Registrer app hos{" "}
                      <a
                        href={docs}
                        target="_blank"
                        rel="noopener"
                        className="text-accent-text hover:underline"
                      >
                        {provider} developer
                      </a>
                    </li>
                    <li>Kjør OAuth-flow, fang access_token</li>
                    <li>
                      Lagre i <code className="bg-paper-strong px-1">{provider === "linkedin" ? "LINKEDIN_ACCESS_TOKEN" : "X_BEARER_TOKEN"}</code>{" "}
                      i /etc/digilist-api.env
                    </li>
                    <li>
                      <code className="bg-paper-strong px-1">
                        systemctl restart digilist-api
                      </code>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 border border-amber-700 border-dashed rounded-sm p-4 bg-amber-50/30 dark:bg-amber-950/20">
        <p className="font-mono text-[0.65rem] tracking-widest uppercase text-amber-700 mb-2 inline-flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          MERK: INGEN AUTO-PUBLISERING
        </p>
        <p className="text-sm text-ink-soft">
          Selv når tilkoblinger er aktive, publiseres ingenting automatisk.
          Hver draft må eksplisitt godkjennes i godkjenningskøen og deretter
          få Publiser-knappen trykket av en menneskelig admin. Dette er
          tilsiktet og endres tidligst etter 10+ vellykkede manuelle
          publiseringer.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. Activity log

export function VekstAktivitet() {
  const { snap, loading, error, refresh } = useContentSnapshot();
  if (loading && !snap) {
    return (
      <div className="p-12 text-center text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
        Laster aktivitet…
      </div>
    );
  }
  if (error || !snap) {
    return <EmptyState note={error ?? "No snapshot"} refresh={refresh} />;
  }
  const totalCost = snap.actions.reduce((s, a) => s + (a.cost_usd ?? 0), 0);
  const totalTokens = snap.actions.reduce(
    (s, a) => s + (a.tokens_in ?? 0) + (a.tokens_out ?? 0),
    0,
  );

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1600px] mx-auto">
      <PageHeader
        icon={Activity}
        title="Agent Activity Log"
        caption="Hver tool-call, draft, recommendation og publish-handling logges her med kostnad, tokens, risk og link til hva som ble produsert. Full sporbarhet for hver agent-handling."
        actions={
          <>
            <span className="font-mono text-[0.65rem] tracking-widest uppercase text-ink-soft inline-flex items-center gap-1.5">
              <Coins className="h-3 w-3" />
              ${totalCost.toFixed(2)} · {Math.round(totalTokens / 1000)}k
              tokens
            </span>
            <button
              type="button"
              onClick={() => void refresh()}
              className="font-mono text-[0.65rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-3 py-1.5 hover:bg-paper-strong"
            >
              <RefreshCw className="h-3 w-3 inline mr-1.5" />
              REFRESH
            </button>
          </>
        }
      />
      {snap.actions.length === 0 ? (
        <EmptyState note="No actions logged yet." refresh={refresh} />
      ) : (
        <div className="border border-rule overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper-strong border-b border-rule">
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  TID
                </th>
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  AGENT
                </th>
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  KIND
                </th>
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  TOOL
                </th>
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  OUTPUT
                </th>
                <th className="text-left p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  RISK
                </th>
                <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  TOKENS
                </th>
                <th className="text-right p-3 font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  COST
                </th>
              </tr>
            </thead>
            <tbody>
              {snap.actions.slice(0, 150).map((a) => (
                <tr
                  key={a.id}
                  className={cn(
                    "border-b border-rule",
                    a.requires_review && !a.reviewed_at && "bg-amber-50/30 dark:bg-amber-950/20",
                  )}
                >
                  <td className="p-3 font-mono text-[0.65rem] text-ink-faint">
                    {new Date(a.created_at).toLocaleString("nb-NO")}
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[0.65rem] tracking-widest uppercase text-ink">
                      {a.agent_slug}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-soft">
                      {a.kind}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[0.65rem] text-ink-soft">
                    {a.tool}
                  </td>
                  <td className="p-3 text-ink-soft text-xs">
                    {a.output_summary.slice(0, 80)}
                    {a.output_summary.length > 80 && "…"}
                  </td>
                  <td className="p-3">
                    <RiskBadge risk={a.risk} />
                  </td>
                  <td className="p-3 text-right font-mono text-[0.65rem] text-ink">
                    {(a.tokens_in + a.tokens_out).toLocaleString("nb-NO")}
                  </td>
                  <td className="p-3 text-right font-mono text-[0.65rem] text-ink">
                    ${a.cost_usd.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
