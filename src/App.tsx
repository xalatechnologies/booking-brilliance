import { ReactNode, lazy, Suspense, useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, MotionConfig } from "framer-motion";

// Lazy-loaded — every route's JS only loads once a visitor actually lands
// on it. The SSR prerender loop in entry-server.tsx resolves React.lazy
// Suspense boundaries into real HTML at build time, so crawlers still get
// full static content for every route (including "/") — only the browser
// defers the JS until that route loads. Index used to be bundled eagerly
// on the theory that most visits land on "/" first, but that dragged its
// HeroSection/MarketplaceSection weight (~90 KiB) into the shared entry
// chunk every OTHER page pays for too, which was the single biggest
// contributor to status.digilist.no's Lighthouse LCP regression.
const Index = lazy(() => import("./pages/Index"));

// Lazy-loaded — every page only needs its JS once the visitor actually
// navigates there. Keeps each route's initial bundle to just what it renders.
//   - Blog detail page + preview: react-markdown + remark-gfm
//   - Status page: Convex client + Recharts-adjacent code paths
//   - All /admin/intelligence/* routes: dashboard, Vekst, charts, etc.
// Scoped Convex provider — lazy so `convex/react` stays out of the marketing
// entry bundle; wraps only the routes below that call Convex.
const ConvexScope = lazy(() => import("./components/ConvexScope"));
const BookDemo = lazy(() => import("./pages/BookDemo"));
const BookingsystemKommune = lazy(() => import("./pages/BookingsystemKommune"));
const BookingLokalerMoterom = lazy(() => import("./pages/BookingLokalerMoterom"));
const Billettsystem = lazy(() => import("./pages/Billettsystem"));
const Teknologi = lazy(() => import("./pages/Teknologi"));
const OmOss = lazy(() => import("./pages/OmOss"));
const Leie = lazy(() => import("./pages/Leie"));
const LeieSelskapslokale = lazy(() => import("./pages/LeieSelskapslokale"));
const LeieMoterom = lazy(() => import("./pages/LeieMoterom"));
const LeieKonferanselokale = lazy(() => import("./pages/LeieKonferanselokale"));
const LeieKontorlokaler = lazy(() => import("./pages/LeieKontorlokaler"));
const LeieCoworking = lazy(() => import("./pages/LeieCoworking"));
const LeieIdrettshall = lazy(() => import("./pages/LeieIdrettshall"));
const LeiePadelbane = lazy(() => import("./pages/LeiePadelbane"));
const LeieSvommehall = lazy(() => import("./pages/LeieSvommehall"));
const LeieKulturhus = lazy(() => import("./pages/LeieKulturhus"));
const LeieGaard = lazy(() => import("./pages/LeieGaard"));
const LeieBursdagslokale = lazy(() => import("./pages/LeieBursdagslokale"));
const Overnatting = lazy(() => import("./pages/Overnatting"));
const OvernattingHytte = lazy(() => import("./pages/OvernattingHytte"));
const OvernattingLeilighet = lazy(() => import("./pages/OvernattingLeilighet"));
const OvernattingRom = lazy(() => import("./pages/OvernattingRom"));
const OvernattingFeriehus = lazy(() => import("./pages/OvernattingFeriehus"));
const Utstyr = lazy(() => import("./pages/Utstyr"));
const UtstyrFestutstyr = lazy(() => import("./pages/UtstyrFestutstyr"));
const UtstyrVerktoyMaskiner = lazy(() => import("./pages/UtstyrVerktoyMaskiner"));
const UtstyrLydOgLys = lazy(() => import("./pages/UtstyrLydOgLys"));
const UtstyrSportOgFriluft = lazy(() => import("./pages/UtstyrSportOgFriluft"));
const Tjenester = lazy(() => import("./pages/Tjenester"));
const TjenesteCatering = lazy(() => import("./pages/TjenesteCatering"));
const TjenesteDj = lazy(() => import("./pages/TjenesteDj"));
const TjenesteMusiker = lazy(() => import("./pages/TjenesteMusiker"));
const TjenesteDekor = lazy(() => import("./pages/TjenesteDekor"));
const Arrangementer = lazy(() => import("./pages/Arrangementer"));
const ArrangementKonsert = lazy(() => import("./pages/ArrangementKonsert"));
const ArrangementTeaterOgScene = lazy(() => import("./pages/ArrangementTeaterOgScene"));
const ArrangementFestival = lazy(() => import("./pages/ArrangementFestival"));
const ArrangementSport = lazy(() => import("./pages/ArrangementSport"));
const Blog = lazy(() => import("./pages/Blog"));
const FAQ = lazy(() => import("./pages/FAQ"));
const AiAgenter = lazy(() => import("./pages/AiAgenter"));
const AgentSesongtildeling = lazy(() => import("./pages/agents/Sesongtildeling"));
const AgentComplianceGodkjenning = lazy(() => import("./pages/agents/ComplianceGodkjenning"));
const AgentImporterOppforing = lazy(() => import("./pages/agents/ImporterOppforing"));
const Salgsvilkar = lazy(() => import("./pages/Salgsvilkar"));
const Personvern = lazy(() => import("./pages/Personvern"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Transparens = lazy(() => import("./pages/Transparens"));
const UseCaseSelskapslokaler = lazy(() => import("./pages/UseCaseSelskapslokaler"));
const UseCaseMoterom = lazy(() => import("./pages/UseCaseMoterom"));
const UseCaseIdrettshaller = lazy(() => import("./pages/UseCaseIdrettshaller"));
const UseCaseKulturhus = lazy(() => import("./pages/UseCaseKulturhus"));
import { ChatbotProvider } from "./components/chatbot/ChatbotProvider";
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogPreview = lazy(() => import("./pages/BlogPreview"));
const Status = lazy(() => import("./pages/Status"));
const IntelligenceShell = lazy(() => import("./pages/admin/IntelligenceShell"));
const IntelligenceOverview = lazy(() => import("./pages/admin/IntelligenceOverview"));
const IntelligenceIssues = lazy(() => import("./pages/admin/IntelligenceIssues"));
const IntelligenceAgents = lazy(() => import("./pages/admin/IntelligenceAgents"));
const IntelligenceCompliance = lazy(() => import("./pages/admin/IntelligenceCompliance"));
const IntelligenceSeo = lazy(() => import("./pages/admin/IntelligenceSeo"));
const IntelligenceCategoryPage = lazy(() =>
  import("./pages/admin/IntelligenceCategory").then((m) => ({
    default: m.IntelligenceCategoryPage,
  })),
);
const IntelligenceScans = lazy(() =>
  import("./pages/admin/IntelligenceMisc").then((m) => ({
    default: m.IntelligenceScans,
  })),
);
const IntelligenceSurfaces = lazy(() =>
  import("./pages/admin/IntelligenceMisc").then((m) => ({
    default: m.IntelligenceSurfaces,
  })),
);
const IntelligenceSettings = lazy(() =>
  import("./pages/admin/IntelligenceMisc").then((m) => ({
    default: m.IntelligenceSettings,
  })),
);
const IntelligenceTransparensPreview = lazy(() =>
  import("./pages/admin/IntelligenceMisc").then((m) => ({
    default: m.IntelligenceTransparensPreview,
  })),
);
const VekstOverview = lazy(() =>
  import("./pages/admin/IntelligenceVekst").then((m) => ({
    default: m.VekstOverview,
  })),
);
const VekstKeywords = lazy(() =>
  import("./pages/admin/IntelligenceVekst").then((m) => ({
    default: m.VekstKeywords,
  })),
);
const VekstDrafts = lazy(() =>
  import("./pages/admin/IntelligenceVekst").then((m) => ({
    default: m.VekstDrafts,
  })),
);
const VekstConnections = lazy(() =>
  import("./pages/admin/IntelligenceVekst").then((m) => ({
    default: m.VekstConnections,
  })),
);
const VekstAktivitet = lazy(() =>
  import("./pages/admin/IntelligenceVekst").then((m) => ({
    default: m.VekstAktivitet,
  })),
);

import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import RumReporter from "./components/RumReporter";
// Chatbot is lazy-loaded so it never appears in the critical bundle.
// On homepage the user has to scroll or click before it mounts, which
// is fine — it's not above the fold.
const Chatbot = lazy(() =>
  import("./components/chatbot").then((m) => ({ default: m.Chatbot })),
);
const AssistantRail = lazy(() =>
  import("./components/chatbot/AssistantRail").then((m) => ({
    default: m.AssistantRail,
  })),
);

// Tiny shared Suspense fallback — invisible, just maintains layout.
const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
      Laster…
    </span>
  </div>
);

/**
 * Wrap <Routes> in framer-motion's AnimatePresence keyed by pathname.
 * Each route's PageTransition uses the `pageEnter` variant (hidden →
 * visible on enter, visible → exit on unmount). With `mode="wait"` the
 * old page completes its exit before the next page mounts, so we get a
 * clean fade-out → fade-in without two pages overlapping.
 *
 * `initial={false}` skips entry animation on the very first paint
 * (which is the SSR'd HTML — we don't want to re-fade it in).
 */
// Delays a value from false -> true until the main thread is idle (or a
// short timeout elapses, for browsers without requestIdleCallback). Used
// below so the chatbot/assistant-rail dynamic imports don't fire at page
// load and compete — as "High"-priority module fetches — with the JS/CSS/
// fonts actually on the critical rendering path. Neither widget is above
// the fold or needed for LCP, so there's nothing to regress by letting
// their chunks load a beat later.
function useIdleFlag(): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true));
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 200);
    return () => window.clearTimeout(id);
  }, []);
  return idle;
}

// The chatbot widget is a marketing-site feature — admins don't need a
// support bubble floating over their dashboards, and it also reduces
// noise + bundle work on /admin/* and /blogg/preview/* routes. The host
// rewrite (status.digilist.no → /status) lands as /status, which is
// public, so we treat it like marketing.
function ChatbotMount() {
  const location = useLocation();
  const idle = useIdleFlag();
  const skip =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/blogg/preview");
  if (skip || !idle) return null;
  return (
    <Suspense fallback={null}>
      <Chatbot />
    </Suspense>
  );
}

// The persistent desktop assistant rail (lg+). Same skip rules as the chatbot.
function AssistantRailMount() {
  const location = useLocation();
  const idle = useIdleFlag();
  const skip =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/blogg/preview");
  if (skip || !idle) return null;
  return (
    <Suspense fallback={null}>
      <AssistantRail />
    </Suspense>
  );
}

// Reserves right space for the desktop rail so page content never hides behind
// it. Uses the same --rail-w variable the rail publishes (0 when collapsed or on
// unmount), so the body and the navbar stay aligned to one content box. Rail is
// lg+ only (so is the padding); admin/preview routes never reserve space.
function ContentShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const skip =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/blogg/preview");
  return (
    <div className={`transition-[padding] duration-300 ease-out ${skip ? "" : "lg:pr-[var(--rail-w,22rem)]"}`}>
      {children}
    </div>
  );
}

function AnimatedRoutesWrap({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={location.pathname}>{children}</div>
    </AnimatePresence>
  );
}

// Convex is no longer provided at the app root — only the routes that call it
// (status, blog preview, admin dashboard) are wrapped in <ConvexScope>, which
// lazy-imports `convex/react`. This keeps the ~69KB Convex client out of the
// marketing entry bundle. RUM reporting loads its own HTTP client on demand.
//
// Auth: we don't use Convex's JWT-based `setAuth()` — instead, every
// admin query/mutation takes an explicit `adminToken` arg pulled from
// localStorage (key: digilist-admin-basic-auth-v1, value: base64 of
// user:pass). See convex/auth.ts:requireAdmin().

/**
 * Router-agnostic app body. SSR (entry-server) and client (main.tsx) each
 * wrap this with their own Router (StaticRouter / BrowserRouter).
 */
/**
 * Skip framer-motion `initial` states on the very first SSR/hydration
 * render so the SSR'd HTML paints with opacity:1 — Lighthouse was
 * measuring LCP at 12.9s because every editorial fade-in section was
 * rendered as opacity:0 in the static HTML, waiting for framer-motion
 * to hydrate and run the entry animation.
 *
 * After hydration we flip `reducedMotion` back to "user" so subsequent
 * client-side route changes (and on-scroll reveals lower on the page)
 * animate normally. There's no visible flash because everything was
 * already in the `animate` state, so the only change is that *future*
 * animations are allowed to run.
 */
function MotionFirstPaintShim({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Defer to next frame so the initial paint is fully committed before
    // we re-enable animations.
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <MotionConfig reducedMotion={hydrated ? "user" : "always"}>
      {children}
    </MotionConfig>
  );
}

export function AppShell() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <MotionFirstPaintShim>
        <TooltipProvider>
          <ScrollToTop />
          <RumReporter />
          <ChatbotProvider>
          <ContentShell>
          <Suspense fallback={<RouteFallback />}>
          <AnimatedRoutesWrap>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/bookingsystem-kommune" element={<BookingsystemKommune />} />
            <Route path="/booking-av-lokaler-og-moterom" element={<BookingLokalerMoterom />} />
            <Route path="/billettsystem" element={<Billettsystem />} />
            <Route path="/teknologi" element={<Teknologi />} />
            <Route path="/om-oss" element={<OmOss />} />
            <Route path="/leie" element={<Leie />} />
            <Route path="/leie/selskapslokale" element={<LeieSelskapslokale />} />
            <Route path="/leie/gaard" element={<LeieGaard />} />
            <Route path="/leie/bursdagslokale" element={<LeieBursdagslokale />} />
            <Route path="/leie/kulturhus" element={<LeieKulturhus />} />
            <Route path="/leie/moterom" element={<LeieMoterom />} />
            <Route path="/leie/konferanselokale" element={<LeieKonferanselokale />} />
            <Route path="/leie/kontorlokaler" element={<LeieKontorlokaler />} />
            <Route path="/leie/coworking" element={<LeieCoworking />} />
            <Route path="/leie/idrettshall" element={<LeieIdrettshall />} />
            <Route path="/leie/padelbane" element={<LeiePadelbane />} />
            <Route path="/leie/svommehall" element={<LeieSvommehall />} />
            <Route path="/overnatting" element={<Overnatting />} />
            <Route path="/overnatting/hytte" element={<OvernattingHytte />} />
            <Route path="/overnatting/leilighet" element={<OvernattingLeilighet />} />
            <Route path="/overnatting/rom" element={<OvernattingRom />} />
            <Route path="/overnatting/feriehus" element={<OvernattingFeriehus />} />
            <Route path="/utstyr" element={<Utstyr />} />
            <Route path="/utstyr/festutstyr" element={<UtstyrFestutstyr />} />
            <Route path="/utstyr/verktoy-maskiner" element={<UtstyrVerktoyMaskiner />} />
            <Route path="/utstyr/lyd-og-lys" element={<UtstyrLydOgLys />} />
            <Route path="/utstyr/sport-og-friluft" element={<UtstyrSportOgFriluft />} />
            <Route path="/tjenester" element={<Tjenester />} />
            <Route path="/tjenester/catering" element={<TjenesteCatering />} />
            <Route path="/tjenester/dj" element={<TjenesteDj />} />
            <Route path="/tjenester/musiker" element={<TjenesteMusiker />} />
            <Route path="/tjenester/dekor" element={<TjenesteDekor />} />
            <Route path="/arrangementer" element={<Arrangementer />} />
            <Route path="/arrangementer/konsert" element={<ArrangementKonsert />} />
            <Route path="/arrangementer/teater-og-scene" element={<ArrangementTeaterOgScene />} />
            <Route path="/arrangementer/festival" element={<ArrangementFestival />} />
            <Route path="/arrangementer/sport" element={<ArrangementSport />} />
            <Route path="/blogg" element={<Blog />} />
            <Route
              path="/blogg/preview/:draftId"
              element={
                <ConvexScope>
                  <BlogPreview />
                </ConvexScope>
              }
            />
            <Route path="/blogg/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/ai-agenter" element={<AiAgenter />} />
            <Route path="/ai-agenter/sesongtildeling" element={<AgentSesongtildeling />} />
            <Route path="/ai-agenter/compliance-godkjenning" element={<AgentComplianceGodkjenning />} />
            <Route path="/ai-agenter/importer-oppforing" element={<AgentImporterOppforing />} />
            <Route path="/salgsvilkar" element={<Salgsvilkar />} />
            <Route path="/personvern" element={<Personvern />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* Public pages read audit/status data through the same-origin
                /api/audits/public-summary proxy (server-side Convex), so they
                need no browser Convex client and stay up during a Convex
                outage. */}
            <Route path="/transparens" element={<Transparens />} />
            <Route path="/status" element={<Status />} />
            <Route path="/bruksomrader/selskapslokaler" element={<UseCaseSelskapslokaler />} />
            <Route path="/bruksomrader/moterom" element={<UseCaseMoterom />} />
            <Route path="/bruksomrader/idrettshaller-gymsaler" element={<UseCaseIdrettshaller />} />
            <Route path="/bruksomrader/kulturhus-kantiner" element={<UseCaseKulturhus />} />
            <Route
              path="/admin/intelligence"
              element={
                <ConvexScope>
                  <IntelligenceShell />
                </ConvexScope>
              }
            >
              <Route index element={<IntelligenceOverview />} />
              <Route path="issues" element={<IntelligenceIssues />} />
              <Route path="scans" element={<IntelligenceScans />} />
              <Route
                path="uptime"
                element={
                  <IntelligenceCategoryPage
                    auditType="uptime"
                    title="Oppetid & SSL"
                    description="HTTP-status, responstid og TLS-sertifikatutløp per overflate."
                  />
                }
              />
              <Route
                path="seo"
                element={
                  <IntelligenceCategoryPage
                    auditType="seo"
                    title="SEO"
                    description="Titler, descriptions, canonical, OG/Twitter, JSON-LD, duplikater og ødelagte interne lenker."
                  />
                }
              />
              <Route
                path="wcag"
                element={
                  <IntelligenceCategoryPage
                    auditType="a11y"
                    title="WCAG / Tilgjengelighet"
                    description="Lang, alt-tekst, label-for, heading-hierarki, ARIA-landmark, knapp- og lenkenavn. axe-core via Playwright kommer i pass 2."
                  />
                }
              />
              <Route
                path="sikkerhet"
                element={
                  <IntelligenceCategoryPage
                    auditType="security"
                    title="Sikkerhet"
                    description="HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy + sensitive-file-prober og mixed-content."
                  />
                }
              />
              <Route
                path="ytelse"
                element={
                  <IntelligenceCategoryPage
                    auditType="performance"
                    title="Ytelse"
                    description="Core Web Vitals (LCP, CLS, INP, FCP, TTFB) + Lighthouse-score. Hentet fra Google PageSpeed Insights. Målt mot Chrome User Experience Report-data der det finnes RUM-data."
                  />
                }
              />
              <Route
                path="lenker"
                element={
                  <IntelligenceCategoryPage
                    auditType="links"
                    title="Lenker"
                    description="Eksterne lenker HEAD-sjekket på tvers av alle skannede sider."
                  />
                }
              />
              <Route path="overflater" element={<IntelligenceSurfaces />} />
              <Route path="seo-historikk" element={<IntelligenceSeo />} />
              <Route path="agenter" element={<IntelligenceAgents />} />
              <Route path="vekst" element={<VekstOverview />} />
              <Route path="vekst/keywords" element={<VekstKeywords />} />
              <Route path="vekst/drafts" element={<VekstDrafts />} />
              <Route path="vekst/connections" element={<VekstConnections />} />
              <Route path="vekst/aktivitet" element={<VekstAktivitet />} />
              <Route
                path="transparens"
                element={<IntelligenceTransparensPreview />}
              />
              <Route
                path="innstillinger"
                element={<IntelligenceSettings />}
              />
              <Route
                path="etterlevelse"
                element={<IntelligenceCompliance />}
              />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AnimatedRoutesWrap>
          </Suspense>
          </ContentShell>
          <CookieConsent />
          <ChatbotMount />
          <AssistantRailMount />
          </ChatbotProvider>
        </TooltipProvider>
        </MotionFirstPaintShim>
    </ThemeProvider>
  );
}

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
