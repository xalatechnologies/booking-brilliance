/**
 * /admin/intelligence/* — full dashboard shell with sidebar + Outlet.
 *
 * Layout: full-bleed (no max-width cap). Sticky top bar shows the active
 * route's breadcrumb + page title + meta + actions.
 *
 * Sub-pages live in src/pages/admin/Intelligence*.tsx and consume the
 * snapshot via useOutletContext<IntelligenceCtx>().
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  ChevronDown,
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
  ShieldCheck,
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
  getEcosystemKpis,
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

// Primary nav — the three pillars this tool answers, every day:
// is it up (SLA), is it fast (Ytelse), and is it visible in search (SEO)?
const PRIMARY_NAV: NavItem[] = [
  { to: "/admin/intelligence", label: "Oversikt", icon: LayoutGrid, end: true, hint: "SLA · Ytelse · SEO" },
  { to: "/admin/intelligence/uptime", label: "SLA · Oppetid", icon: Wifi, hint: "Tilgjengelighet" },
  { to: "/admin/intelligence/ytelse", label: "Ytelse", icon: CircleGauge, hint: "Fart" },
  { to: "/admin/intelligence/seo", label: "SEO", icon: Search, hint: "Synlighet" },
];

// Operational tooling that supports the three pillars — diagnostics, scan
// history, per-surface config and settings. Always visible, but visually
// secondary to the pillars above.
const SUPPORTING_NAV: NavItem[] = [
  { to: "/admin/intelligence/issues", label: "Hva gikk galt", icon: AlertTriangle, hint: "AI-fix" },
  { to: "/admin/intelligence/scans", label: "Skanninger", icon: Activity, hint: "Historikk" },
  { to: "/admin/intelligence/overflater", label: "Overflater", icon: Globe2 },
  { to: "/admin/intelligence/innstillinger", label: "Innstillinger", icon: Settings },
];

// Everything out of scope for an SLA/Performance/SEO tool — kept in full but
// tucked behind one collapsed "Avansert" section, organized into labeled
// groups so it reads as structure, not a dump.
interface NavGroup {
  label: string;
  items: NavItem[];
}
const ADVANCED_GROUPS: NavGroup[] = [
  {
    label: "Øvrig kvalitet",
    items: [
      { to: "/admin/intelligence/wcag", label: "WCAG / UU", icon: BarChart3 },
      { to: "/admin/intelligence/sikkerhet", label: "Sikkerhet", icon: ShieldAlert },
      { to: "/admin/intelligence/lenker", label: "Lenker", icon: Link2 },
    ],
  },
  {
    label: "Vekst",
    items: [
      { to: "/admin/intelligence/vekst", label: "Vekst-oversikt", icon: TrendingUp, end: true },
      { to: "/admin/intelligence/vekst/keywords", label: "Nøkkelord", icon: KeyRound },
      { to: "/admin/intelligence/vekst/drafts", label: "Utkast", icon: FileEdit },
      { to: "/admin/intelligence/vekst/connections", label: "Tilkoblinger", icon: Plug },
      { to: "/admin/intelligence/vekst/aktivitet", label: "Aktivitet", icon: ScrollText },
    ],
  },
  {
    label: "AI & etterlevelse",
    items: [
      { to: "/admin/intelligence/agenter", label: "AI-agenter", icon: Bot },
      { to: "/admin/intelligence/etterlevelse", label: "Kontroller & RoPA", icon: ShieldCheck, hint: "ISO · GDPR" },
    ],
  },
  {
    label: "Referanse",
    items: [
      { to: "/admin/intelligence/transparens", label: "Offentlig rapport", icon: Sparkles },
    ],
  },
];

const ADVANCED_ITEMS: NavItem[] = ADVANCED_GROUPS.flatMap((g) => g.items);
const FLAT_NAV: NavItem[] = [
  ...PRIMARY_NAV,
  ...SUPPORTING_NAV,
  ...ADVANCED_ITEMS,
];

export default function IntelligenceShell() {
  // `auth` is never initialised straight from localStorage on mount —
  // a stale cached token would make the synchronous useQuery below
  // throw "Unauthorized" *during render*, above any error boundary,
  // crashing the shell so the user can't even see the login card.
  // Instead we validate the cached token via `convex.query()` in an
  // effect first, and only setAuth() once it passes.
  const [auth, setAuth] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const convex = useConvex();

  useEffect(() => {
    const cached =
      typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) : null;
    if (!cached) {
      setAuthChecked(true);
      return;
    }
    let cancelled = false;
    convex
      .query(api.audits.state.snapshot, { adminToken: cached })
      .then(() => {
        if (!cancelled) setAuth(cached);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unauthorized")) {
          localStorage.removeItem(AUTH_KEY);
          setAuthError("Sesjonen utløpte — logg inn på nytt.");
        } else {
          setAuthError(`Kunne ikke kontakte tjenesten: ${msg.slice(0, 160)}`);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [convex]);

  const snap = useQuery(
    api.audits.state.snapshot,
    auth ? { adminToken: auth } : "skip",
  ) as Snapshot | undefined;
  const loading = auth !== null && snap === undefined;
  const error: string | null = authError;
  const [running, setRunning] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Collapsible "Avansert" group — auto-opens when the active route lives
  // inside it, so deep pages always show their own nav; otherwise the user
  // can fold it away to keep the sidebar to the SLA + SEO essentials.
  const advancedActive = ADVANCED_ITEMS.some(
    (i) =>
      location.pathname === i.to ||
      location.pathname.startsWith(`${i.to}/`),
  );
  const [advancedOpen, setAdvancedOpen] = useState(advancedActive);
  useEffect(() => {
    if (advancedActive) setAdvancedOpen(true);
  }, [advancedActive]);

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
      setScanError(null);
      const scanStartedAt = Date.now();
      // Count how many runs are already "fresh" before the trigger so
      // we know when each new run lands.
      const expectedSurfaces = targetName
        ? 1
        : (snap?.targets.filter((t) => t.is_active).length ?? 7);
      try {
        const res = await fetch("/api/audits/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify(targetName ? { target: targetName } : {}),
        });
        if (!res.ok) {
          // Surface the server's own reason (e.g. "Audit runner not
          // configured…") rather than a bare status code, and never let
          // the rejection escape as an uncaught promise error.
          let detail = "";
          try {
            const data = (await res.json()) as { error?: string };
            if (data?.error) detail = data.error;
          } catch {
            /* non-JSON body — fall back to the status code below */
          }
          setScanError(
            detail ||
              `Kunne ikke starte skanning (HTTP ${res.status}). Prøv igjen senere.`,
          );
          return;
        }
        // For full scans we wait until either:
        //   - we see fresh runs covering every active surface, OR
        //   - 4 minutes have passed (orchestrator timeout)
        // For per-target scans, first fresh non-running row drops the spinner.
        const deadline = scanStartedAt + 4 * 60 * 1000;
        const scanStartedIso = new Date(scanStartedAt - 500).toISOString();
        await new Promise<void>((resolve) => {
          const tick = () => {
            const freshRuns = (snap?.latest ?? []).filter(
              (r) =>
                (!targetName || r.target_name === targetName) &&
                r.started_at > scanStartedIso &&
                r.status !== "running",
            );
            const distinctSurfaces = new Set(
              freshRuns.map((r) => r.target_name),
            ).size;
            if (
              distinctSurfaces >= expectedSurfaces ||
              Date.now() > deadline
            ) {
              resolve();
            } else {
              setTimeout(tick, 2000);
            }
          };
          tick();
        });
      } catch (err) {
        // Network-level failure (server down, connection reset) — the
        // fetch itself rejected before we got a response.
        setScanError(
          err instanceof Error
            ? `Kunne ikke nå skann-tjenesten: ${err.message}`
            : "Kunne ikke nå skann-tjenesten.",
        );
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

  // SINGLE SOURCE OF TRUTH — every KPI in the shell (top sticky bar
  // badges, sidebar mini-KPI, login card preview) reads from this
  // helper. Underlying numbers are computed once in Convex
  // (convex/audits/state.ts:snapshot.ecosystemSummary) so the header,
  // sidebar, and Oversikt page can never drift apart.
  const kpis = getEcosystemKpis(snap);
  const summary = snap?.ecosystemSummary;
  const liveCount = kpis?.surfacesTotal ?? 0;

  // Hold render while we validate the cached token — prevents a flash
  // of the login card for users who are already authenticated.
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
          Kontrollerer sesjon…
        </p>
      </div>
    );
  }

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
              Ett kontrollrom for oppetid (SLA), ytelse og SEO på tvers av
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
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-paper-deep/40 border-r border-hairline-strong overflow-y-auto z-40 hidden lg:flex flex-col">
        <div className="px-5 py-5 border-b border-hairline-strong">
          <h1
            className="font-serif text-[1.75rem] text-ink leading-none"
            style={{ fontVariationSettings: '"opsz" 48, "wght" 540' }}
          >
            Intelligence
          </h1>
          <p className="text-xs text-ink mt-1.5">Digilist økosystem</p>
          {kpis && (
            <div className="mt-4 grid grid-cols-2 gap-px bg-rule border border-rule">
              <div className="bg-paper px-2.5 py-2">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                  Snitt
                </p>
                <p className="font-serif text-xl text-ink leading-none mt-1 tabular-nums">
                  {kpis.avgScore}
                </p>
              </div>
              <div className="bg-paper px-2.5 py-2">
                <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                  Feil
                </p>
                <p
                  className={cn(
                    "font-serif text-xl leading-none mt-1 tabular-nums",
                    kpis.errorCount > 0 ? "text-red-700" : "text-ink",
                  )}
                >
                  {kpis.errorCount}
                </p>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {PRIMARY_NAV.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}

          <div className="pt-5 space-y-1">
            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint px-3 pb-1">
              Verktøy
            </p>
            {SUPPORTING_NAV.map((item) => (
              <SidebarLink key={item.to} item={item} />
            ))}
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              aria-expanded={advancedOpen}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-ink-soft hover:bg-paper-deep/80 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform",
                  advancedOpen ? "" : "-rotate-90",
                )}
              />
              <span className="flex-1 text-left font-mono text-[0.65rem] uppercase tracking-widest">
                Avansert
              </span>
              <span className="font-mono text-[0.55rem] text-ink-faint tabular-nums">
                {ADVANCED_ITEMS.length}
              </span>
            </button>
            {advancedOpen && (
              <div className="mt-1 ml-4 pl-1 border-l border-hairline space-y-4">
                {ADVANCED_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <p className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint px-3 pt-1">
                      {group.label}
                    </p>
                    {group.items.map((item) => (
                      <SidebarLink key={item.to} item={item} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
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
      <main className="lg:ml-72 min-h-screen flex flex-col">
        {/* Sticky topbar — three slots: breadcrumb | search | actions.
           Each slot is independent so they never overlap; the middle
           shrinks first when the viewport is tight, the breadcrumb
           truncates, and the actions cluster stays pinned right. */}
        <div className="hidden lg:flex sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-hairline-strong px-8 xl:px-12 py-4 items-center gap-6">
          <div className="flex items-center gap-3 min-w-0 flex-shrink overflow-hidden">
            {snap && (
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint truncate">
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
          {/* Middle: flex-1 spacer pushes the actions cluster right. */}
          <div className="hidden xl:block flex-1" />
          <div className="flex items-center gap-2 flex-shrink-0">
            {kpis && (
              <div className="hidden xl:flex items-center gap-2 mr-2">
                <Chip
                  label="OVERFLATER"
                  value={`${kpis.surfacesHealthy}/${kpis.surfacesTotal}`}
                  tone={
                    kpis.surfacesWithErrors === 0
                      ? "good"
                      : kpis.surfacesWithErrors >= 2
                        ? "bad"
                        : "warn"
                  }
                />
                <Chip
                  label="SNITT"
                  value={kpis.avgScore}
                  tone={
                    kpis.avgScore >= 85
                      ? "good"
                      : kpis.avgScore >= 60
                        ? "warn"
                        : "bad"
                  }
                />
                <Chip
                  label="FEIL"
                  value={kpis.errorCount}
                  tone={kpis.errorCount === 0 ? "good" : "bad"}
                />
              </div>
            )}
            <EcosystemJump />
            <button
              type="button"
              onClick={fetchState}
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-ink hover:bg-paper-deep/60 border border-hairline rounded-sm px-4 py-2.5 disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Oppdater
            </button>
            <button
              type="button"
              onClick={() => runScan()}
              disabled={Boolean(running)}
              className={cn(
                "inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-[0.7rem] uppercase tracking-widest font-medium transition-colors",
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

          {scanError && (
            <div className="border-l-2 border-amber-700 bg-paper-deep/60 px-5 py-3 mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="editorial-mono-caption text-amber-700 mb-1">
                  SKANNING FEILET
                </p>
                <p className="text-base text-ink">{scanError}</p>
              </div>
              <button
                type="button"
                onClick={() => setScanError(null)}
                className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-soft hover:text-ink border border-hairline rounded-sm px-2.5 py-1.5 flex-shrink-0"
              >
                Lukk
              </button>
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

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors group",
          isActive ? "bg-navy text-on-navy" : "text-ink hover:bg-paper-deep/80",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-[1.1rem] w-[1.1rem] flex-shrink-0",
              isActive ? "text-on-navy" : "text-ink-soft group-hover:text-ink",
            )}
          />
          <span
            className={cn(
              "flex-1 leading-tight text-[0.9rem]",
              isActive ? "font-medium" : "",
            )}
          >
            {item.label}
          </span>
          {item.hint && (
            <span
              className={cn(
                "font-mono text-[0.55rem] uppercase tracking-widest truncate",
                isActive
                  ? "text-on-navy/60"
                  : "text-ink-faint group-hover:text-ink-soft",
              )}
              title={item.hint}
            >
              {item.hint}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
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
        "inline-flex items-center gap-3 rounded-sm border px-3.5 py-2.5",
        tone === "good" && "bg-green-50 border-green-700/40 dark:bg-green-950/40",
        tone === "warn" && "bg-amber-50 border-amber-700/40 dark:bg-amber-950/40",
        tone === "bad" && "bg-red-50 border-red-700/40 dark:bg-red-950/40",
      )}
    >
      <span
        className={cn(
          "font-mono text-[0.65rem] uppercase tracking-widest leading-none",
          tone === "good" && "text-green-700 dark:text-green-400",
          tone === "warn" && "text-amber-700 dark:text-amber-400",
          tone === "bad" && "text-red-700 dark:text-red-400",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-serif text-2xl font-medium leading-none",
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

/* ──────────────────────────────────────────────────────────────
 * Ecosystem jump — quick links to public surfaces (matches the
 * "Hjemmeside / Plattform" pattern on docs.digilist.no header).
 * ────────────────────────────────────────────────────────────── */

const ECOSYSTEM_LINKS: Array<{ label: string; href: string }> = [
  { label: "Hjem", href: "https://digilist.no" },
  { label: "Docs", href: "https://docs.digilist.no" },
  { label: "Status", href: "https://status.digilist.no" },
];

function EcosystemJump() {
  return (
    <div className="hidden 2xl:flex items-center gap-1 mr-1">
      {ECOSYSTEM_LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-ink-soft hover:text-ink hover:bg-paper-deep/60 rounded-sm px-3 py-2.5 transition-colors"
        >
          {l.label}
          <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
        </a>
      ))}
    </div>
  );
}
