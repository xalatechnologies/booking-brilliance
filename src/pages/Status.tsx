/**
 * status.digilist.no — public service status page.
 *
 * Visual language mirrors /transparens (the public quality report):
 * ProgressRail + Navbar at top, large serif headline with custom font
 * variation settings, ecosystem KPI strip, per-surface SLA grid,
 * methodology + external validators, three-card CTA, Footer.
 *
 * Data: convex/audits/public.ts:summary — no auth, scrubbed (never
 * finding messages, never URLs). Fetched via the same-origin
 * /api/audits/public-summary proxy (which reads the summary from the
 * self-hosted backend over loopback), so this public page has no
 * browser-side Convex dependency and can't be taken down by a Convex
 * outage — it degrades to an "unavailable" notice instead.
 *
 * SLA commitments are declared in SLA_TARGETS below; actuals are
 * computed from the 30/90-day audit history.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Mail,
  ShieldCheck,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  EditorialButton,
  ProgressRail,
  SectionRule,
} from "@/components/editorial";
import { cn } from "@/lib/utils";

type SurfaceStatus = "operational" | "degraded" | "down";
type EcosystemStatus = "operational" | "degraded" | "outage";

interface SurfaceRow {
  id: string;
  label: string;
  type: string | null;
  environment: string | null;
  origin: string;
  overall: number | null;
  status: SurfaceStatus;
  uptime30d: number | null;
  uptime90d: number | null;
  lastIncidentAt: string | null;
}

interface IncidentRow {
  surface: string;
  surfaceLabel: string;
  auditType: string;
  startedAt: string;
  durationMin: number;
}

interface Summary {
  generatedAt: string;
  surfaces: SurfaceRow[];
  ecosystem: {
    status: EcosystemStatus;
    surfacesTotal: number;
    surfacesHealthy: number;
    surfacesDegraded: number;
    surfacesDown: number;
  };
  incidents: IncidentRow[];
}

// Committed SLA targets per surface type. Edit these when the SLAs
// change in the master service agreement; the page recomputes "met"
// vs "breach" against measured uptime automatically.
const SLA_TARGETS: Record<string, { uptime: number; description: string }> = {
  marketing: {
    uptime: 99.9,
    description: "Offentlige sider: markedsføring, blogg, dokumentasjon",
  },
  docs: { uptime: 99.9, description: "Dokumentasjon" },
  status: { uptime: 99.95, description: "Status-side (denne)" },
  app: {
    uptime: 99.5,
    description: "Innloggede applikasjons-overflater",
  },
  dashboard: { uptime: 99.5, description: "Tenant-administrasjon" },
  api: { uptime: 99.5, description: "Offentlige API-endepunkter" },
};

const SURFACE_TYPE_LABEL: Record<string, string> = {
  marketing: "Markedsføring",
  app: "App",
  dashboard: "Dashbord",
  docs: "Dokumentasjon",
  api: "API",
  status: "Status",
};

const STATUS_DOT: Record<SurfaceStatus, string> = {
  operational: "bg-green-600",
  degraded: "bg-amber-500",
  down: "bg-red-600",
};

const STATUS_LABEL: Record<SurfaceStatus, string> = {
  operational: "Operativ",
  degraded: "Redusert",
  down: "Nede",
};

const STATUS_PILL: Record<SurfaceStatus, string> = {
  operational: "bg-green-700 text-on-navy",
  degraded: "bg-amber-700 text-on-navy",
  down: "bg-red-700 text-on-navy",
};

const ECO_HEADLINE: Record<EcosystemStatus, string> = {
  operational: "Alle systemer operative",
  degraded: "Redusert ytelse på enkelte overflater",
  outage: "Pågående hendelse på minst én overflate",
};

const ECO_TONE: Record<EcosystemStatus, string> = {
  operational: "text-green-700",
  degraded: "text-amber-700",
  outage: "text-red-700",
};

const ECO_BG: Record<EcosystemStatus, string> = {
  operational: "border-green-700/40 bg-green-700/5",
  degraded: "border-amber-700/40 bg-amber-700/5",
  outage: "border-red-700/40 bg-red-700/5",
};

export default function Status() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Same-origin proxy — reads the summary from the self-hosted backend
    // server-side. Cache-bust to avoid stale CDN/SW copies.
    fetch(`/api/audits/public-summary?t=${Date.now()}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as { status: Summary | null };
      })
      .then((d) => {
        if (cancelled) return;
        if (d.status) setData(d.status);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <SEO
        title="Driftsstatus · Digilist"
        description="Sanntidsstatus for Digilist-økosystemet: oppetid, SLA, sikkerhet og tilgjengelighet på tvers av digilist.no, app.digilist.no, dashboard.digilist.no og dokumentasjon."
        canonical="https://status.digilist.no/"
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <article className="pt-28 lg:pt-32 pb-16 lg:pb-24">
            <div className="container mx-auto md:px-8 lg:px-12">
              <div className="flex items-baseline justify-between gap-4 mb-10 pb-4 border-b border-rule">
                <nav
                  className="editorial-mono-caption"
                  aria-label="Brødsmuler"
                >
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-2 text-accent-text"
                  >
                    ← Tilbake til forsiden
                  </Link>
                </nav>
                <p className="editorial-mono-caption text-ink-faint">
                  LIVE DRIFTSSTATUS
                </p>
              </div>

              <header className="mb-12 lg:mb-16">
                <h1
                  className="font-serif text-5xl lg:text-7xl text-ink leading-[1.05] tracking-tight"
                  style={{
                    fontVariationSettings:
                      '"opsz" 144, "wght" 360, "SOFT" 30, "WONK" 1',
                  }}
                >
                  Status.
                </h1>
                <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                  Sanntid for Digilist-økosystemet. Hver overflate skannes
                  automatisk. Vi måler det <em>du</em> opplever, ikke bare
                  serverpuls. Når noe ryker, ser du det her først.
                </p>
                <p className="mt-3 text-base text-ink-soft measure">
                  SLA-tall under er forpliktende. Avvik fra mål utløser
                  hendelsesrapport publisert i loggen nederst.
                </p>
              </header>

              {loading ? (
                <LoadingState />
              ) : data ? (
                <>
                  <EcosystemBanner data={data} />
                  <SLASection surfaces={data.surfaces} />
                  <SurfaceList surfaces={data.surfaces} />
                  <IncidentLog incidents={data.incidents} />
                  <ExternalValidators />
                  <ComplianceStrip />
                  <CTASection />
                  <p className="text-xs text-ink-faint mt-12 font-mono uppercase tracking-widest">
                    Sist oppdatert{" "}
                    {new Date(data.generatedAt).toLocaleString("nb-NO")} ·
                    skanninger kjøres automatisk · siden viser siste
                    tilgjengelige skanning
                  </p>
                </>
              ) : (
                <UnavailableState />
              )}
            </div>
          </article>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="border border-rule rounded-sm p-12">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
        Henter live data…
      </p>
    </div>
  );
}

function UnavailableState() {
  return (
    <div className="border-l-2 border-amber-700 bg-paper-deep/60 px-5 py-4">
      <p className="editorial-mono-caption text-amber-700 mb-1">
        LIVE DATA MIDLERTIDIG UTILGJENGELIG
      </p>
      <p className="text-base text-ink">
        Statusmålingene lastes ikke akkurat nå. Skanningene kjører videre i
        bakgrunnen — prøv å laste siden på nytt om litt.
      </p>
    </div>
  );
}

function EcosystemBanner({ data }: { data: Summary }) {
  const e = data.ecosystem;
  return (
    <section
      className={cn(
        "border rounded-sm p-6 lg:p-8 mb-14 lg:mb-20 flex items-start gap-5",
        ECO_BG[e.status],
      )}
    >
      <CheckCircle2
        className={cn("h-8 w-8 flex-shrink-0 mt-1", ECO_TONE[e.status])}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <p className="editorial-mono-caption text-ink-faint mb-2">
          STATUS PÅ ØKOSYSTEMET
        </p>
        <p
          className={cn(
            "font-serif text-3xl lg:text-4xl leading-tight",
            ECO_TONE[e.status],
          )}
          style={{ fontVariationSettings: '"opsz" 48, "wght" 540' }}
        >
          {ECO_HEADLINE[e.status]}
        </p>
        <p className="text-sm text-ink-soft mt-3">
          {e.surfacesHealthy} av {e.surfacesTotal} overflater operative
          {e.surfacesDegraded > 0 && ` · ${e.surfacesDegraded} redusert`}
          {e.surfacesDown > 0 && ` · ${e.surfacesDown} nede`}
        </p>
      </div>
    </section>
  );
}

function SLASection({ surfaces }: { surfaces: SurfaceRow[] }) {
  // Group surfaces by type and roll up actual uptime against committed SLA.
  const typeGroups = new Map<
    string,
    { committed: number; actuals30: number[]; actuals90: number[]; description: string; surfaces: SurfaceRow[] }
  >();
  for (const s of surfaces) {
    const key = s.type ?? "other";
    const sla = SLA_TARGETS[key];
    if (!sla) continue;
    const g = typeGroups.get(key) ?? {
      committed: sla.uptime,
      description: sla.description,
      actuals30: [],
      actuals90: [],
      surfaces: [],
    };
    if (s.uptime30d !== null) g.actuals30.push(s.uptime30d);
    if (s.uptime90d !== null) g.actuals90.push(s.uptime90d);
    g.surfaces.push(s);
    typeGroups.set(key, g);
  }

  const rows = Array.from(typeGroups.entries()).map(([type, g]) => {
    const actual30 =
      g.actuals30.length === 0
        ? null
        : g.actuals30.reduce((s, x) => s + x, 0) / g.actuals30.length;
    const actual90 =
      g.actuals90.length === 0
        ? null
        : g.actuals90.reduce((s, x) => s + x, 0) / g.actuals90.length;
    const met = actual90 === null ? null : actual90 >= g.committed;
    return { type, committed: g.committed, description: g.description, actual30, actual90, met, count: g.surfaces.length };
  });

  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="SLA-FORPLIKTELSER" />
      <header className="mt-8 mb-8 max-w-prose">
        <h2
          className="font-serif text-3xl lg:text-4xl text-ink leading-tight mb-3"
          style={{ fontVariationSettings: '"opsz" 60, "wght" 540' }}
        >
          Forpliktet oppetid vs. faktisk.
        </h2>
        <p className="text-base text-ink-soft leading-relaxed">
          Vi forplikter oss til konkrete oppetidstall per overflate-type. Tallet
          til høyre er målt over de siste 90 dagene, direkte fra skanninger,
          ikke selvrapportert.
        </p>
      </header>
      <div className="border border-rule">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-6 px-6 py-3 border-b border-rule bg-paper-deep/40">
          <p className="editorial-mono-caption text-ink-faint">OVERFLATE-TYPE</p>
          <p className="editorial-mono-caption text-ink-faint text-right">FORPLIKTET</p>
          <p className="editorial-mono-caption text-ink-faint text-right">SISTE 30D</p>
          <p className="editorial-mono-caption text-ink-faint text-right">SISTE 90D</p>
          <p className="editorial-mono-caption text-ink-faint">RESULTAT</p>
        </div>
        <div className="divide-y divide-rule">
          {rows.map((r) => (
            <article
              key={r.type}
              className="px-6 py-5 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-2 md:gap-6 items-baseline"
            >
              <div>
                <p
                  className="font-serif text-xl text-ink"
                  style={{
                    fontVariationSettings: '"opsz" 30, "wght" 540',
                  }}
                >
                  {SURFACE_TYPE_LABEL[r.type] ?? r.type}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  {r.description} ·{" "}
                  <span className="text-ink-faint">
                    {r.count} overflate{r.count === 1 ? "" : "r"}
                  </span>
                </p>
              </div>
              <p className="font-serif text-2xl text-ink md:text-right">
                {r.committed.toFixed(2)}%
              </p>
              <p
                className={cn(
                  "font-serif text-2xl md:text-right",
                  r.actual30 === null
                    ? "text-ink-faint"
                    : r.actual30 >= r.committed
                      ? "text-green-700"
                      : "text-amber-700",
                )}
              >
                {r.actual30 === null ? "-" : `${r.actual30.toFixed(2)}%`}
              </p>
              <p
                className={cn(
                  "font-serif text-2xl md:text-right",
                  r.actual90 === null
                    ? "text-ink-faint"
                    : r.actual90 >= r.committed
                      ? "text-green-700"
                      : "text-amber-700",
                )}
              >
                {r.actual90 === null ? "-" : `${r.actual90.toFixed(2)}%`}
              </p>
              <span
                className={cn(
                  "font-mono text-[0.6rem] tracking-widest uppercase rounded-sm px-2 py-1 inline-block",
                  r.met === null
                    ? "border border-hairline-strong text-ink-faint"
                    : r.met
                      ? "bg-green-700 text-on-navy"
                      : "bg-amber-700 text-on-navy",
                )}
              >
                {r.met === null ? "Ingen data" : r.met ? "SLA møtt" : "Under SLA"}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SurfaceList({ surfaces }: { surfaces: SurfaceRow[] }) {
  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="OVERFLATER" />
      <p className="text-base text-ink-soft mt-6 mb-6 max-w-prose">
        Per-overflate status (operativ, redusert eller nede) basert på siste
        skanning. Klikk en overflate for å åpne den i ny fane.
      </p>
      <div className="divide-y divide-rule border-y border-rule">
        {surfaces.map((s) => (
          <article
            key={s.id}
            className="py-5 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center gap-4"
          >
            <div className="flex items-start gap-3 min-w-0">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full mt-2 flex-shrink-0",
                  STATUS_DOT[s.status],
                )}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p
                    className="font-serif text-xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: '"opsz" 30, "wght" 540',
                    }}
                  >
                    {s.label}
                  </p>
                  {s.environment && s.environment !== "production" && (
                    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink-faint">
                      {s.environment}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint mt-1">
                  {s.type && SURFACE_TYPE_LABEL[s.type]
                    ? SURFACE_TYPE_LABEL[s.type]
                    : s.type ?? "-"}
                  {" · "}
                  <a
                    href={s.origin}
                    target="_blank"
                    rel="noopener"
                    className="text-accent-text hover:underline inline-flex items-center gap-0.5"
                  >
                    {s.origin.replace(/^https?:\/\//, "")}
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </a>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint">
                OPPETID 90D
              </p>
              <p className="font-serif text-xl text-ink mt-0.5">
                {s.uptime90d === null ? "-" : `${s.uptime90d.toFixed(1)}%`}
              </p>
            </div>
            <span
              className={cn(
                "font-mono text-[0.65rem] tracking-widest uppercase rounded-sm px-2.5 py-1 inline-block justify-self-start md:justify-self-end",
                STATUS_PILL[s.status],
              )}
            >
              {STATUS_LABEL[s.status]}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function IncidentLog({ incidents }: { incidents: IncidentRow[] }) {
  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="HENDELSESLOGG" />
      {incidents.length === 0 ? (
        <div className="mt-6 border border-rule rounded-sm p-8 text-center">
          <p className="text-sm text-ink-soft">
            Ingen hendelser registrert de siste 90 dagene.
          </p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-rule border-y border-rule">
          {incidents.map((i, idx) => (
            <article
              key={`${i.startedAt}-${idx}`}
              className="py-4 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-baseline"
            >
              <time
                dateTime={i.startedAt}
                className="font-mono text-[0.7rem] tracking-widest uppercase text-ink-faint"
              >
                {new Date(i.startedAt).toLocaleString("nb-NO", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
              <p className="text-sm text-ink">
                <span className="font-medium">{i.surfaceLabel}</span>
                <span className="text-ink-faint"> · </span>
                <span className="font-mono text-[0.7rem] tracking-widest uppercase">
                  {i.auditType}
                </span>
              </p>
              <p className="text-xs text-ink-faint md:text-right">
                {i.durationMin === 0 ? "<1m" : `${i.durationMin}m`}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ExternalValidators() {
  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="UAVHENGIG VURDERING" />
      <div className="mt-8 mb-6 max-w-prose">
        <h2 className="font-serif text-2xl text-ink mb-2">
          Verifiser oss hos uavhengige tredjeparter
        </h2>
        <p className="text-base text-ink-soft">
          Tallene over kommer fra våre egne skanninger. Sjekk digilist.no
          parallelt hos uavhengige sikkerhets- og kvalitetsmålere. De gir
          sanntidsdom du selv kan kjøre.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
        {[
          {
            name: "SSL Labs",
            provider: "Qualys",
            desc: "Sertifikat, cipher suites, protokoll-styrke. Mål A eller A+.",
            href: "https://www.ssllabs.com/ssltest/analyze.html?d=digilist.no",
          },
          {
            name: "Security Headers",
            provider: "Scott Helme",
            desc: "HSTS, CSP, X-Frame-Options, Referrer-Policy. Bokstavkarakter.",
            href: "https://securityheaders.com/?q=https%3A%2F%2Fdigilist.no",
          },
          {
            name: "Mozilla Observatory",
            provider: "Mozilla",
            desc: "Helhetlig sikkerhetsposture mot moderne nettstandarder.",
            href: "https://developer.mozilla.org/en-US/observatory/analyze?host=digilist.no",
          },
          {
            name: "PageSpeed Insights",
            provider: "Google",
            desc: "Core Web Vitals: LCP, CLS, INP. Mobile + desktop.",
            href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fdigilist.no",
          },
        ].map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-paper p-6 flex flex-col hover:bg-paper-deep/40 transition-colors group"
          >
            <p className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint">
              {tool.provider}
            </p>
            <h3 className="font-serif text-xl text-ink mt-1 mb-2 leading-tight">
              {tool.name}
            </h3>
            <p className="text-sm text-ink-soft leading-snug flex-1 mb-4">
              {tool.desc}
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-text mt-auto">
              Se live rapport
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ComplianceStrip() {
  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="SAMSVAR" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule mt-8">
        {[
          ["ISO 27001", "Informasjonssikkerhetsstyring"],
          ["ISO 27701", "Personverninformasjonsstyring"],
          ["GDPR", "EU/EØS-datalokasjon"],
          ["WCAG 2.1 AA", "Universell utforming"],
        ].map(([k, v]) => (
          <div key={k} className="bg-paper p-6">
            <ShieldCheck className="h-5 w-5 text-accent-text mb-3" />
            <p className="font-serif text-xl text-ink">{k}</p>
            <p className="text-sm text-ink-soft mt-1">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section>
      <SectionRule label="VEIEN VIDERE" />
      <header className="mt-8 mb-10 max-w-prose">
        <h2
          className="font-serif text-4xl lg:text-5xl text-ink leading-tight mb-4"
          style={{
            fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 25',
          }}
        >
          Trenger du mer detalj?
        </h2>
        <p className="text-base lg:text-lg text-ink-soft leading-relaxed">
          Full transparensrapport, sikkerhetsmøte under NDA og ansvarlig
          sårbarhetsrapportering. Alt under.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-px bg-rule border border-rule mb-10">
        <ResourceCard
          icon={FileText}
          eyebrow="DETALJER"
          title="Full transparensrapport"
          body="Per-overflate scoringer for SEO, tilgjengelighet, sikkerhet og lenker, samme data vårt interne team ser."
          href="/transparens"
          cta="Se rapport"
        />
        <ResourceCard
          icon={Mail}
          eyebrow="DIREKTE"
          title="Be om sikkerhetsmøte"
          body="30–45 min, NDA, sammendrag av siste pen-test, vulnerability-status og beredskapsplan."
          href="/book-demo"
          cta="Book demo"
        />
        <ResourceCard
          icon={BookOpen}
          eyebrow="SIKKERHET"
          title="security.txt"
          body="Fant du en sårbarhet? Vi tar imot ansvarlig rapportering på sikkerhet@digilist.no. Kvittert innen 24 timer."
          href="/.well-known/security.txt"
          cta="Se security.txt"
        />
      </div>

      <div className="flex flex-wrap gap-3 max-w-prose">
        <EditorialButton variant="primary" size="lg" href="/book-demo">
          Book demo
        </EditorialButton>
        <EditorialButton variant="outline" size="lg" href="/transparens">
          Full transparensrapport
        </EditorialButton>
      </div>
    </section>
  );
}

function ResourceCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("/.well-known");
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a href={href} className="contents">
        {children}
      </a>
    ) : (
      <Link to={href} className="contents">
        {children}
      </Link>
    );
  return (
    <article className="bg-paper p-7 lg:p-8 flex flex-col">
      <Icon className="h-6 w-6 text-accent-text mb-5" />
      <p className="editorial-mono-caption text-ink-faint mb-2">{eyebrow}</p>
      <h3 className="font-serif text-2xl text-ink leading-tight mb-3">
        {title}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed mb-5 flex-1">
        {body}
      </p>
      <Wrapper>
        <span className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-text hover:text-navy mt-auto">
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Wrapper>
    </article>
  );
}
