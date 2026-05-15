/**
 * /admin/intelligence/* — full dashboard shell with sidebar + Outlet.
 *
 * Layout: full-bleed (no max-width cap). Sticky top bar shows the active
 * route's breadcrumb + page title + meta + actions.
 *
 * Sub-pages live in src/pages/admin/Intelligence*.tsx and consume the
 * snapshot via useOutletContext<IntelligenceCtx>().
 */
import React, { useCallback, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  ChevronLeft,
  CircleGauge,
  Compass,
  FileEdit,
  Globe2,
  KeyRound,
  LayoutGrid,
  Link2,
  Loader2,
  Plug,
  RefreshCw,
  ScrollText,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { useQuery, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import SEO from "@/components/SEO";
import { EditorialButton } from "@/components/editorial";
import { cn } from "@/lib/utils";
import {
  AUTH_KEY,
  adminToken,
  type IntelligenceCtx,
  type Snapshot,
} from "./intelligence-shared";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  hint?: string;
}

const NAV: Array<{
  group: string;
  items: NavItem[];
}> = [
  {
    group: "STATUS",
    items: [
      { to: "/admin/intelligence", label: "Oversikt", icon: LayoutGrid, end: true, hint: "Økosystem-rollup" },
      { to: "/admin/intelligence/issues", label: "Hva gikk galt", icon: AlertTriangle, hint: "AI-fix-anbefalinger" },
      { to: "/admin/intelligence/scans", label: "Skanninger", icon: Activity, hint: "Historikk" },
    ],
  },
  {
    group: "MONITORS",
    items: [
      { to: "/admin/intelligence/uptime", label: "Oppetid & SSL", icon: Wifi },
      { to: "/admin/intelligence/seo", label: "SEO", icon: Search },
      { to: "/admin/intelligence/wcag", label: "WCAG / UU", icon: BarChart3 },
      { to: "/admin/intelligence/sikkerhet", label: "Sikkerhet", icon: ShieldAlert },
      { to: "/admin/intelligence/ytelse", label: "Ytelse", icon: CircleGauge },
      { to: "/admin/intelligence/lenker", label: "Lenker", icon: Link2 },
    ],
  },
  {
    group: "ECOSYSTEM",
    items: [
      { to: "/admin/intelligence/overflater", label: "Overflater", icon: Globe2, hint: "Per-surface" },
    ],
  },
  {
    group: "AI",
    items: [
      { to: "/admin/intelligence/agenter", label: "AI-agenter", icon: Bot, hint: "Multi-agent chat" },
    ],
  },
  {
    group: "VEKST",
    items: [
      { to: "/admin/intelligence/vekst", label: "Vekst-oversikt", icon: TrendingUp, end: true, hint: "Harness + org chart" },
      { to: "/admin/intelligence/vekst/keywords", label: "Keywords", icon: KeyRound, hint: "Trender + gap" },
      { to: "/admin/intelligence/vekst/drafts", label: "Drafts", icon: FileEdit, hint: "Approval queue" },
      { to: "/admin/intelligence/vekst/connections", label: "Connections", icon: Plug, hint: "LinkedIn / X" },
      { to: "/admin/intelligence/vekst/aktivitet", label: "Aktivitet", icon: ScrollText, hint: "Audit log" },
    ],
  },
  {
    group: "REFERANSE",
    items: [
      { to: "/admin/intelligence/transparens", label: "Offentlig rapport", icon: Sparkles, hint: "/transparens" },
      { to: "/admin/intelligence/innstillinger", label: "Innstillinger", icon: Settings },
    ],
  },
];

const FLAT_NAV: NavItem[] = NAV.flatMap((g) => g.items);

export default function IntelligenceShell() {
  const [auth, setAuth] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_KEY);
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const convex = useConvex();
  // useQuery throws on auth errors. To keep the login card renderable,
  // skip the query until we have a token, and use the imperative
  // `convex.query()` to validate new tokens at login time before
  // persisting them.
  const snap = useQuery(
    api.audits.state.snapshot,
    auth ? { adminToken: auth } : "skip",
  ) as Snapshot | undefined;
  const loading = auth !== null && snap === undefined;
  const error: string | null = authError;
  const [running, setRunning] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchState = useCallback(async () => {
    // No-op — useQuery is reactive. Kept as a stable function so callers
    // (runScan polling, IntelligenceCtx) that still expect a refresh()
    // can keep their shape.
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const u = String(fd.get("user") || "");
    const p = String(fd.get("pass") || "");
    if (!u || !p) return;
    const b64 = btoa(`${u}:${p}`);
    setAuthError(null);
    // Validate against Convex before persisting — a bad token would
    // otherwise crash every Vekst/audit page that calls useQuery.
    try {
      await convex.query(api.audits.state.snapshot, { adminToken: b64 });
      localStorage.setItem(AUTH_KEY, b64);
      setAuth(b64);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAuthError(
        msg.includes("Unauthorized")
          ? "Feil brukernavn eller passord."
          : `Innlogging feilet: ${msg.slice(0, 200)}`,
      );
    }
  };

  const runScan = useCallback(
    async (targetName?: string) => {
      if (!auth) return;
      setRunning(targetName || "__all__");
      const beforeId =
        snap?.latest.find(
          (r) => !targetName || r.target_name === targetName,
        )?.id ?? 0;
      try {
        const res = await fetch("/api/audits/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify(targetName ? { target: targetName } : {}),
        });
        if (!res.ok)
          throw new Error(`Kunne ikke starte skanning (${res.status})`);
        // The orchestrator now writes to Convex as it runs, so we just
        // wait for the reactive snapshot to show a newer run id for this
        // (target, audit_type). When that happens we drop the spinner.
        const deadline = Date.now() + 6 * 60 * 1000;
        const poll = () =>
          new Promise<void>((resolve) => {
            const tick = () => {
              const newer = snap?.latest.find(
                (r) =>
                  (!targetName || r.target_name === targetName) &&
                  r.id > beforeId &&
                  r.status !== "running",
              );
              if (newer || Date.now() > deadline) resolve();
              else setTimeout(tick, 1500);
            };
            tick();
          });
        await poll();
      } finally {
        setRunning(null);
      }
    },
    [auth, snap],
  );

  const ctx: IntelligenceCtx = useMemo(
    () => ({
      snap,
      loading,
      refresh: fetchState,
      running,
      runScan,
    }),
    [snap, loading, fetchState, running, runScan],
  );

  const activeItem = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "");
    const exact = FLAT_NAV.find((i) => i.end && i.to === path);
    if (exact) return exact;
    return (
      FLAT_NAV.filter((i) => !i.end)
        .sort((a, b) => b.to.length - a.to.length)
        .find((i) => path === i.to || path.startsWith(`${i.to}/`)) ?? FLAT_NAV[0]
    );
  }, [location.pathname]);

  const summary = snap?.ecosystemSummary;
  const liveCount = snap?.targets.filter((t) => t.is_active).length ?? 0;

  if (!auth) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
        <SEO
          title="Intelligence — innlogging"
          description="Digilist Ecosystem Intelligence Center."
          robots="noindex,nofollow"
        />
        <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_440px] gap-px bg-rule border border-hairline-strong">
          {/* Editorial left panel */}
          <aside className="bg-paper-deep/40 p-10 lg:p-12 hidden lg:flex flex-col">
            <p className="editorial-mono-caption text-accent-text mb-2">
              DIGILIST · VOL. 2026 · OSLO
            </p>
            <h1
              className="font-serif text-5xl xl:text-6xl text-ink leading-[1.02] mt-2"
              style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
            >
              Intelligence
              <br />
              Center
            </h1>
            <p
              className="font-serif italic text-xl text-ink leading-relaxed mt-6 max-w-prose"
              style={{ fontVariationSettings: '"opsz" 72, "wght" 460' }}
            >
              Ett kontrollrom for SEO, sikkerhet, WCAG og ytelse på tvers av
              hele Digilist-økosystemet.
            </p>
            <div className="mt-auto pt-10">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-3">
                OVERVÅKER
              </p>
              <ul className="space-y-1.5 font-mono text-xs text-ink">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-navy" /> digilist.no
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-navy" /> app.digilist.no
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-navy" /> dashboard.digilist.no
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-3 bg-navy" /> api.digilist.no
                </li>
              </ul>
            </div>
          </aside>

          {/* Login form */}
          <form
            onSubmit={handleLogin}
            className="bg-paper p-10 lg:p-12 flex flex-col"
          >
            <p className="editorial-mono-caption text-accent-text mb-2">
              INNLOGGING
            </p>
            <h2
              className="font-serif text-3xl text-ink mb-2"
              style={{ fontVariationSettings: '"opsz" 48, "wght" 540' }}
            >
              Tilgang kreves
            </h2>
            <p className="text-base text-ink mb-8 leading-relaxed">
              Bruk det interne brukernavnet og passordet (basic-auth). RBAC og
              SSO-integrasjon kommer i en senere fase.
            </p>
            <label className="block mb-5">
              <span className="editorial-mono-caption text-ink-soft mb-1.5 block">
                Brukernavn
              </span>
              <input
                name="user"
                type="text"
                autoComplete="username"
                className="w-full border-0 border-b border-hairline-strong rounded-none bg-transparent px-0 py-2 text-base text-ink focus:outline-none focus:border-navy"
                required
              />
            </label>
            <label className="block mb-8">
              <span className="editorial-mono-caption text-ink-soft mb-1.5 block">
                Passord
              </span>
              <input
                name="pass"
                type="password"
                autoComplete="current-password"
                className="w-full border-0 border-b border-hairline-strong rounded-none bg-transparent px-0 py-2 text-base text-ink focus:outline-none focus:border-navy"
                required
              />
            </label>
            {authError && (
              <p
                role="alert"
                className="text-sm text-red-700 dark:text-red-400 mb-4 -mt-2"
              >
                {authError}
              </p>
            )}
            <EditorialButton variant="primary" size="md" type="submit">
              Logg inn
            </EditorialButton>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-auto pt-8">
              v2026.05 · phase 1.5 · digilist intelligence center
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SEO
        title="Digilist Intelligence Center"
        description="Quality, SEO & Compliance Command Center."
        canonical="https://digilist.no/admin/intelligence"
        robots="noindex,nofollow"
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-paper-deep/40 border-r border-hairline-strong overflow-y-auto z-40 hidden lg:flex flex-col">
        <div className="px-5 py-5 border-b border-hairline-strong">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-ink-soft hover:text-ink transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest">
              Tilbake til forsiden
            </span>
          </button>
          <h1
            className="font-serif text-[1.75rem] text-ink mt-3 leading-none"
            style={{ fontVariationSettings: '"opsz" 48, "wght" 540' }}
          >
            Intelligence
          </h1>
          <p className="text-xs text-ink mt-1.5">Digilist økosystem</p>
          {summary && (
            <div className="mt-4 grid grid-cols-2 gap-px bg-rule border border-rule">
              <div className="bg-paper px-2.5 py-2">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                  Snitt
                </p>
                <p className="font-serif text-xl text-ink leading-none mt-1">
                  {Math.round(summary.avgScore)}
                </p>
              </div>
              <div className="bg-paper px-2.5 py-2">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                  Feil
                </p>
                <p
                  className={cn(
                    "font-serif text-xl leading-none mt-1",
                    summary.errorCount > 0 ? "text-red-700" : "text-ink",
                  )}
                >
                  {summary.errorCount}
                </p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5">
          {NAV.map((group) => (
            <div key={group.group}>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mb-2 px-2.5">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm transition-colors group",
                            isActive
                              ? "bg-navy text-on-navy font-medium"
                              : "text-ink hover:bg-paper-deep/80",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={cn(
                                "h-4 w-4 flex-shrink-0",
                                isActive ? "text-on-navy" : "text-ink-soft group-hover:text-ink",
                              )}
                            />
                            <span className="flex-1 leading-tight">
                              {item.label}
                            </span>
                            {item.hint && !isActive && (
                              <span className="font-mono text-[0.5rem] uppercase tracking-widest text-ink-faint">
                                ›
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <footer className="px-5 py-4 border-t border-hairline-strong">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
            v2026.05 · phase 1.5
          </p>
          <p className="text-xs text-ink mt-1">
            {snap?.generatedAt
              ? `Sist ${new Date(snap.generatedAt).toLocaleString("nb-NO", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}`
              : "Ingen data"}
          </p>
        </footer>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-paper border-b border-hairline-strong px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-mono text-xs uppercase tracking-widest text-ink"
        >
          ← Forsiden
        </button>
        <span
          className="font-serif text-xl text-ink"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
        >
          Intelligence
        </span>
        <button
          type="button"
          onClick={fetchState}
          className="text-ink-soft"
          aria-label="Oppdater"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* Mobile nav */}
      <div className="lg:hidden border-b border-hairline-strong bg-paper-deep/30 overflow-x-auto">
        <nav className="flex gap-1 px-4 py-2 whitespace-nowrap">
          {FLAT_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-mono",
                  isActive
                    ? "bg-navy text-on-navy"
                    : "text-ink border border-hairline",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main column — full width, sticky topbar */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Sticky topbar (per-route title + ecosystem chips + actions) */}
        <div className="hidden lg:flex sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-hairline-strong px-8 xl:px-12 py-4 items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint flex-shrink-0">
              INTELLIGENCE / {activeItem?.label.toUpperCase()}
            </p>
            {snap && (
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint flex-shrink-0">
                ·
              </span>
            )}
            {snap && (
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint truncate">
                Sist oppdatert{" "}
                <time className="text-ink" dateTime={snap.generatedAt}>
                  {new Date(snap.generatedAt).toLocaleString("nb-NO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </time>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {summary && (
              <div className="hidden xl:flex items-center gap-2 mr-2">
                <Chip
                  label="OVERFLATER"
                  value={`${summary.surfacesHealthy}/${summary.surfacesTotal}`}
                  tone={
                    summary.surfacesWithErrors === 0
                      ? "good"
                      : summary.surfacesWithErrors >= 2
                        ? "bad"
                        : "warn"
                  }
                />
                <Chip
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
                <Chip
                  label="FEIL"
                  value={summary.errorCount}
                  tone={summary.errorCount === 0 ? "good" : "bad"}
                />
              </div>
            )}
            <button
              type="button"
              onClick={fetchState}
              className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink hover:bg-paper-deep/60 border border-hairline rounded-sm px-2.5 py-1.5 disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Oppdater
            </button>
            <button
              type="button"
              onClick={() => runScan()}
              disabled={Boolean(running)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[0.65rem] uppercase tracking-widest font-medium transition-colors",
                running
                  ? "bg-paper-deep text-ink-faint cursor-not-allowed"
                  : "bg-navy text-on-navy hover:bg-navy/90",
              )}
            >
              {running ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Skanner …
                </>
              ) : (
                <>
                  <Compass className="h-3.5 w-3.5" />
                  Kjør full skanning
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content area — full width */}
        <div className="flex-1 px-6 lg:px-8 xl:px-12 py-8 lg:py-10">
          {error && (
            <div className="border-l-2 border-red-700 bg-paper-deep/60 px-5 py-3 mb-6">
              <p className="editorial-mono-caption text-red-700 mb-1">FEIL</p>
              <p className="text-base text-ink">{error}</p>
            </div>
          )}

          <AuthErrorBoundary
            onUnauthorized={() => {
              localStorage.removeItem(AUTH_KEY);
              setAuth(null);
              setAuthError("Sesjonen utløpte — logg inn på nytt.");
            }}
          >
            <Outlet context={ctx} />
          </AuthErrorBoundary>
        </div>

        <p className="hidden lg:block text-center font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint border-t border-hairline px-8 xl:px-12 py-4">
          Digilist Ecosystem Intelligence · {liveCount} aktive overflater · v2026.05
        </p>
      </main>
    </div>
  );
}

/**
 * Catches Convex Unauthorized errors thrown by useQuery in any child
 * (Vekst pages, audit pages). On hit, clears the cached admin token and
 * surfaces the login card via the shell's auth state. Other errors are
 * re-thrown so React's normal error reporting still works.
 */
class AuthErrorBoundary extends React.Component<
  { onUnauthorized: () => void; children: React.ReactNode },
  { fired: boolean }
> {
  state = { fired: false };
  static getDerivedStateFromError(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unauthorized")) return { fired: true };
    return null;
  }
  componentDidCatch(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unauthorized")) {
      this.props.onUnauthorized();
      return;
    }
    throw err;
  }
  componentDidUpdate(_: unknown, prev: { fired: boolean }) {
    if (prev.fired && !this.state.fired) {
      /* recovery — handled by parent re-render */
    }
  }
  render() {
    if (this.state.fired) return null;
    return this.props.children;
  }
}

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "good" | "warn" | "bad";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 border",
        tone === "good" && "bg-green-50 border-green-700/40 dark:bg-green-950/40",
        tone === "warn" && "bg-amber-50 border-amber-700/40 dark:bg-amber-950/40",
        tone === "bad" && "bg-red-50 border-red-700/40 dark:bg-red-950/40",
      )}
    >
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
          "font-serif text-base font-medium leading-none",
          tone === "good" && "text-green-700 dark:text-green-400",
          tone === "warn" && "text-amber-700 dark:text-amber-400",
          tone === "bad" && "text-red-700 dark:text-red-400",
        )}
      >
        {value}
      </span>
    </div>
  );
}
