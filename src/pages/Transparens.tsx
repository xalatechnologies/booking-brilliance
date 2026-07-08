/**
 * /transparens — public-facing quality, SEO, security & uptime report.
 *
 * Pulls scrubbed snapshot from /api/audits/public-summary (no auth).
 * Shows ONLY rolled-up scores — never finding messages, URLs, or
 * sensitive paths. Editorial style, designed to be sent to kommune buyers
 * as a trust signal alongside the demo.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Loader2,
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

interface PublicSurface {
  id: string;
  label: string;
  type: string;
  environment: string;
  indexable: boolean;
  origin: string;
  overall: number | null;
  scores: Record<string, number>;
}

interface PostureFramework {
  framework: string;
  implementation_pct: number;
  total: number;
}

interface PublicSummary {
  generatedAt: string;
  surfaces: PublicSurface[];
  ecosystem: {
    surfacesTotal: number;
    surfacesHealthy: number;
    surfacesWithErrors: number;
    errorCount: number;
    warnCount: number;
    avgScore: number;
  } | null;
  posture?: PostureFramework[] | null;
}

const POSTURE_LABEL: Record<string, string> = {
  iso27001: "ISO 27001:2022",
  soc2: "SOC 2",
  gdpr: "GDPR",
};

const AUDIT_LABEL: Record<string, string> = {
  uptime: "Oppetid & SSL",
  seo: "SEO",
  a11y: "Tilgjengelighet",
  security: "Sikkerhet",
  links: "Lenker",
};

function scoreClass(s: number | null): string {
  if (s === null) return "text-ink-faint";
  if (s >= 85) return "text-green-700";
  if (s >= 60) return "text-amber-700";
  return "text-red-700";
}

function scoreLabel(s: number | null): string {
  if (s === null) return "Ingen data";
  if (s >= 95) return "Utmerket";
  if (s >= 85) return "Bra";
  if (s >= 70) return "Akseptabelt";
  if (s >= 50) return "Trenger forbedring";
  return "Kritisk";
}

export default function Transparens() {
  const [data, setData] = useState<PublicSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cache-bust to avoid stale CDN/SW copies of the JSON.
    fetch(`/api/audits/public-summary?t=${Date.now()}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const type = r.headers.get("content-type") || "";
        if (!type.includes("application/json")) {
          throw new Error(
            "API svarte med " + (type || "ukjent type") + " — prøv å laste siden på nytt",
          );
        }
        return (await r.json()) as PublicSummary;
      })
      .then((d) => setData(d))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const productionSurfaces =
    data?.surfaces.filter((s) => s.environment === "production") ?? [];

  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <SEO
        title="Transparens — kvalitetsrapport for Digilist"
        description="Live kvalitetsrapport: SEO, tilgjengelighet, sikkerhet, oppetid og lenker — automatisk skannet på tvers av Digilist-økosystemet."
        canonical="https://digilist.no/transparens"
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <article className="pt-28 lg:pt-32 pb-16 lg:pb-24">
            <div className="container mx-auto px-4">
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
                  LIVE KVALITETSRAPPORT
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
                  Transparens.
                </h1>
                <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                  En kommunal CIO bør vite hva slags plattform de velger. Denne
                  siden viser{" "}
                  <em>Digilist sin egen</em> kvalitet — SEO, tilgjengelighet,
                  sikkerhet, oppetid og lenker — automatisk skannet og oppdatert.
                </p>
                <p className="mt-3 text-base text-ink-soft measure">
                  Skanninger kjøres minst hver 15. minutt for oppetid og daglig
                  for hele økosystemet. Det vi viser her er det samme som vårt
                  interne team ser.
                </p>
                <p className="mt-3 text-base text-ink-soft measure">
                  Rapporten dekker fem områder. <strong>SEO</strong> måler hvor
                  synlig plattformen er i søk — titler, metadata, canonical og
                  strukturert data. <strong>Tilgjengelighet</strong> sjekker
                  WCAG-samsvar: overskriftshierarki, alt-tekster, landemerker og
                  tastaturnavigasjon for skjermlesere. <strong>Sikkerhet</strong>{" "}
                  vurderer HTTP-sikkerhetsheadere, TLS-sertifikater og at ingen
                  sensitive filer er eksponert. <strong>Oppetid</strong> følger
                  tilgjengelighet og responstid per tjeneste, med varsling ved
                  avvik. <strong>Lenker</strong> verifiserer at ingen utgående
                  lenker er brutt. Hver overflate i økosystemet — markedssiden,
                  booking-appen, dashbordet, dokumentasjonen og API-et — skannes
                  uavhengig, og tallene nedenfor er hentet direkte fra siste
                  kjøring, uten manuell redigering eller utvalg.
                </p>
              </header>

              {loading ? (
                <div className="flex items-center gap-2 text-ink-soft">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Henter live data…
                </div>
              ) : error ? (
                <div className="border-l-2 border-red-700 bg-paper-deep/60 px-5 py-4">
                  <p className="editorial-mono-caption text-red-700 mb-1">
                    KUNNE IKKE HENTE LIVE DATA
                  </p>
                  <p className="text-base text-ink">
                    Beklager — kommer tilbake snart. {error}
                  </p>
                </div>
              ) : data ? (
                <>
                  {/* Ecosystem rollup */}
                  {data.ecosystem && (
                    <section className="mb-14 lg:mb-20">
                      <p className="editorial-mono-caption text-accent-text mb-4">
                        ØKOSYSTEM
                      </p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
                        <Cell
                          label="Snittscore"
                          value={Math.round(data.ecosystem.avgScore)}
                          tone={scoreClass(data.ecosystem.avgScore)}
                          sub={scoreLabel(data.ecosystem.avgScore)}
                        />
                        <Cell
                          label="Overflater aktive"
                          value={data.ecosystem.surfacesTotal}
                          sub={`${data.ecosystem.surfacesHealthy} sunne`}
                        />
                        <Cell
                          label="Kritiske funn"
                          value={data.ecosystem.errorCount}
                          tone={
                            data.ecosystem.errorCount > 0
                              ? "text-red-700"
                              : "text-green-700"
                          }
                          sub={
                            data.ecosystem.errorCount === 0
                              ? "Ingen blokkerende"
                              : "Under aktiv utbedring"
                          }
                        />
                        <Cell
                          label="Advarsler"
                          value={data.ecosystem.warnCount}
                          tone={
                            data.ecosystem.warnCount > 0
                              ? "text-amber-700"
                              : undefined
                          }
                          sub="Anbefalt forbedring"
                        />
                      </div>
                    </section>
                  )}

                  {/* Trust posture — ISO 27001 / SOC 2 / GDPR */}
                  {data.posture && data.posture.length > 0 && (
                    <section className="mb-14 lg:mb-20">
                      <p className="editorial-mono-caption text-accent-text mb-4">
                        ETTERLEVELSE
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
                        {data.posture.map((p) => (
                          <div
                            key={p.framework}
                            className="bg-paper px-6 py-5"
                          >
                            <p className="editorial-mono-caption text-ink-faint">
                              {POSTURE_LABEL[p.framework] ?? p.framework}
                            </p>
                            <div className="flex items-baseline gap-3 mt-3">
                              <span
                                className={cn(
                                  "font-serif text-4xl leading-none tabular-nums",
                                  p.implementation_pct >= 80
                                    ? "text-green-700"
                                    : p.implementation_pct >= 40
                                      ? "text-amber-700"
                                      : "text-ink-soft",
                                )}
                                style={{
                                  fontVariationSettings:
                                    '"opsz" 144, "wght" 360',
                                }}
                              >
                                {p.implementation_pct}%
                              </span>
                              <span className="text-sm text-ink-soft">
                                av {p.total} kontroller
                              </span>
                            </div>
                            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                              {p.framework === "iso27001" &&
                                "Annex A — Organisatoriske, personell-, fysiske og teknologiske kontroller."}
                              {p.framework === "soc2" &&
                                "Common Criteria — kontrollmiljø, risiko, tilgang og systemoperasjoner."}
                              {p.framework === "gdpr" &&
                                "Kjerneartikler — personvern, lovlig grunnlag, sletting og brudd-håndtering."}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-ink-faint italic max-w-3xl">
                        Tallene viser implementeringsgrad — andelen
                        anvendelige kontroller med dokumentert tilstand
                        «Implementert» (full kreditt) eller «Delvis» (halv).
                        Detaljer over hver kontroll er tilgjengelig på
                        forespørsel for kommunale kunder under NDA.
                      </p>
                    </section>
                  )}

                  {/* Per-surface scores */}
                  <section className="mb-14 lg:mb-20">
                    <p className="editorial-mono-caption text-accent-text mb-4">
                      OVERFLATER · PRODUKSJON
                    </p>
                    <div className="space-y-px bg-rule border border-rule">
                      {productionSurfaces.length === 0 ? (
                        <div className="bg-paper p-6 text-ink-soft">
                          Ingen aktive produksjons-overflater i siste skanning.
                        </div>
                      ) : (
                        productionSurfaces.map((s) => (
                          <SurfaceRow key={s.id} s={s} />
                        ))
                      )}
                    </div>
                  </section>

                  {/* Methodology */}
                  <section className="mb-14 lg:mb-20">
                    <SectionRule label="METODE" />
                    <div className="mt-8 grid lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-serif text-2xl text-ink mb-3">
                          Hva vi måler
                        </h3>
                        <ul className="space-y-3 text-base text-ink-soft">
                          <li>
                            <strong className="text-ink">Oppetid & SSL.</strong>{" "}
                            HTTP-status, responstid og sertifikat-utløp via{" "}
                            <code className="font-mono text-xs">tls.connect</code>.
                          </li>
                          <li>
                            <strong className="text-ink">SEO.</strong> Titler,
                            descriptions, canonical, OG/Twitter, JSON-LD, alt-text,
                            duplikat-metadata, ødelagte interne lenker.
                          </li>
                          <li>
                            <strong className="text-ink">Tilgjengelighet.</strong>{" "}
                            Lang-attributt, alt-tekst, label-for, heading-hierarki,
                            ARIA-landmark, knapp- og lenkenavn (cheerio-baseline;
                            axe-core kommer).
                          </li>
                          <li>
                            <strong className="text-ink">Sikkerhet.</strong> HSTS,
                            CSP, X-Frame-Options, X-Content-Type-Options,
                            Referrer-Policy, Permissions-Policy, sensitive-fil-prober,
                            mixed content, source maps.
                          </li>
                          <li>
                            <strong className="text-ink">Lenker.</strong> Eksterne
                            lenker HEAD-sjekket, 405→GET fallback, dedup-ert per URL.
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-ink mb-3">
                          Score-tolkning
                        </h3>
                        <ul className="space-y-2 text-base">
                          <li>
                            <span className="font-serif text-lg font-medium text-green-700">
                              95–100
                            </span>{" "}
                            <span className="text-ink-soft">— utmerket</span>
                          </li>
                          <li>
                            <span className="font-serif text-lg font-medium text-green-700">
                              85–94
                            </span>{" "}
                            <span className="text-ink-soft">— bra</span>
                          </li>
                          <li>
                            <span className="font-serif text-lg font-medium text-amber-700">
                              70–84
                            </span>{" "}
                            <span className="text-ink-soft">— akseptabelt</span>
                          </li>
                          <li>
                            <span className="font-serif text-lg font-medium text-amber-700">
                              50–69
                            </span>{" "}
                            <span className="text-ink-soft">
                              — trenger forbedring
                            </span>
                          </li>
                          <li>
                            <span className="font-serif text-lg font-medium text-red-700">
                              0–49
                            </span>{" "}
                            <span className="text-ink-soft">— kritisk</span>
                          </li>
                        </ul>
                        <p className="text-xs text-ink-soft mt-4 font-mono uppercase tracking-widest">
                          Score = 100 minus vektsum av funn (error=18, warn=6,
                          info=1), klemt til [0, 100].
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* External validators — independent third-party scanners */}
                  <section className="mb-14 lg:mb-20">
                    <SectionRule label="UAVHENGIG VURDERING" />
                    <div className="mt-8 mb-6 max-w-prose">
                      <h2 className="font-serif text-2xl text-ink mb-2">
                        Verifiser oss hos uavhengige tredjeparter
                      </h2>
                      <p className="text-base text-ink-soft">
                        Vi kjører våre egne automatiske skanninger (oversikten
                        over), men du bør ikke ta vårt ord for det. Sjekk
                        digilist.no selv hos disse uavhengige
                        sikkerhets- og kvalitetsmålerne — de gir sanntidsdom.
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
                          href: "https://securityheaders.com/?q=https%3A%2F%2Fdigilist.no&hide=on&followRedirects=on",
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
                          desc: "Core Web Vitals — LCP, CLS, INP. Mobile + desktop.",
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
                    <p className="text-xs text-ink-faint mt-4 font-mono uppercase tracking-widest">
                      Live oppslag — Klikk en boks for å kjøre skanning hos
                      tredjepart i sanntid.
                    </p>
                  </section>

                  {/* Compliance trust strip */}
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

                  {/* CTA — three-card resource grid */}
                  <section>
                    <SectionRule label="VEIEN VIDERE" />
                    <header className="mt-8 mb-10 max-w-prose">
                      <h2
                        className="font-serif text-4xl lg:text-5xl text-ink leading-tight mb-4"
                        style={{
                          fontVariationSettings:
                            '"opsz" 96, "wght" 400, "SOFT" 25',
                        }}
                      >
                        Vil du se mer?
                      </h2>
                      <p className="text-base lg:text-lg text-ink-soft leading-relaxed">
                        Vi deler gjerne sammendrag av siste penetrasjonstest og
                        sårbarhetsstatus under NDA. Be om et møte — vi viser
                        rapportene side-om-side med plattformen.
                      </p>
                    </header>

                    <div className="grid md:grid-cols-3 gap-px bg-rule border border-rule mb-10">
                      <ResourceCard
                        icon={Mail}
                        eyebrow="DIREKTE"
                        title="Be om sikkerhetsmøte"
                        body="30–45 minutter, NDA, sammendrag av siste pen-test, vulnerability-status, RPO/RTO og beredskapsplan."
                        href="/book-demo"
                        cta="Book demo"
                      />
                      <ResourceCard
                        icon={BookOpen}
                        eyebrow="KUNNSKAP"
                        title="Sikkerhetsartikler"
                        body="Cyberangrep mot kommuner, beredskap mot ransomware, phishing-resistente innlogginger, sikkerhetsrevisjon."
                        href="/blogg"
                        cta="Les artikler"
                        secondary={[
                          {
                            label: "Cyberangrep mot kommuner",
                            href: "/blogg/cyberangrep-norske-kommuner-bookingsystem",
                          },
                          {
                            label: "DDoS & ransomware-beredskap",
                            href: "/blogg/ddos-ransomware-beredskap-bookingplattform",
                          },
                          {
                            label: "Penetrasjonstesting",
                            href: "/blogg/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor",
                          },
                        ]}
                      />
                      <ResourceCard
                        icon={FileText}
                        eyebrow="ANSVARLIG SÅRBARHETSRAPPORTERING"
                        title="security.txt"
                        body="Fant du en sårbarhet? Vi tar imot ansvarlig sårbarhetsrapportering på sikkerhet@digilist.no. Rapportering kvittert innen 24 timer."
                        href="/.well-known/security.txt"
                        cta="Se security.txt"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 max-w-prose">
                      <EditorialButton
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          const el = document.getElementById("kontakt");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                          else window.location.href = "/#kontakt";
                        }}
                      >
                        Book demo
                      </EditorialButton>
                      <EditorialButton
                        variant="outline"
                        size="lg"
                        href="/blogg/penetrasjonstesting-sikkerhetsrevisjon-saas-leverandor"
                      >
                        Les om sikkerhetsrevisjon
                      </EditorialButton>
                    </div>
                  </section>

                  <p className="text-xs text-ink-faint mt-12 font-mono uppercase tracking-widest">
                    Sist oppdatert{" "}
                    {new Date(data.generatedAt).toLocaleString("nb-NO")} ·
                    skanninger kjøres hver 15. min (oppetid) og daglig (full).
                  </p>
                </>
              ) : null}
            </div>
          </article>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

function Cell({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: number;
  tone?: string;
  sub?: string;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
        {label}
      </p>
      <p
        className={cn(
          "font-serif text-5xl font-medium leading-none mt-2",
          tone ?? "text-ink",
        )}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-ink-soft mt-2">{sub}</p>}
    </div>
  );
}

function ResourceCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  href,
  cta,
  secondary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  secondary?: Array<{ label: string; href: string }>;
}) {
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
      {secondary && secondary.length > 0 && (
        <ul className="space-y-1.5 mb-5 border-t border-rule pt-4">
          {secondary.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="group inline-flex items-baseline gap-1.5 text-sm text-ink hover:text-navy transition-colors"
              >
                <span className="text-ink-faint font-mono text-[0.65rem]">→</span>
                <span className="border-b border-rule group-hover:border-navy pb-0.5">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        to={href}
        className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent-text hover:text-navy mt-auto"
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}

// Fixed display order so columns line up across surfaces, even when an
// audit didn't run on a particular surface (those slots show "—").
const SCORE_COLUMNS: Array<{ key: string; label: string }> = [
  { key: "uptime", label: "Oppetid" },
  { key: "security", label: "Sikkerhet" },
  { key: "a11y", label: "Tilgjengelighet" },
  { key: "seo", label: "SEO" },
  { key: "links", label: "Lenker" },
];

function originPretty(origin: string): string {
  return origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function scoreBg(s: number | null): string {
  if (s === null) return "bg-paper-deep/30";
  if (s >= 85) return "bg-green-700/5";
  if (s >= 60) return "bg-amber-700/5";
  return "bg-red-700/5";
}

function ScoreChip({ value, label }: { value: number | null; label: string }) {
  const isNA = value === null;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-2 py-2.5 rounded-sm",
        scoreBg(value),
      )}
    >
      <span
        className={cn(
          "font-serif text-2xl leading-none font-medium",
          scoreClass(value),
        )}
      >
        {isNA ? "—" : value}
      </span>
      <span className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint mt-1.5 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function SurfaceRow({ s }: { s: PublicSurface }) {
  return (
    <article className="bg-paper px-6 py-5 lg:px-7 lg:py-6">
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-6 items-baseline mb-4">
        <div>
          <p className="editorial-mono-caption text-accent-text">
            {s.id.toUpperCase()}
          </p>
          <h3 className="font-serif text-xl lg:text-2xl text-ink mt-0.5 leading-tight">
            {originPretty(s.origin)}
          </h3>
          <p className="text-xs text-ink-soft mt-1 font-mono uppercase tracking-widest">
            {scoreLabel(s.overall)}
          </p>
        </div>
        <div className={cn("flex items-baseline gap-2", scoreClass(s.overall))}>
          <span className="font-serif text-5xl lg:text-6xl font-medium leading-none">
            {s.overall ?? "—"}
          </span>
          <span className="editorial-mono-caption text-ink-faint">overall</span>
        </div>
      </header>
      <div className="grid grid-cols-5 gap-px bg-rule border border-rule">
        {SCORE_COLUMNS.map((col) => (
          <ScoreChip
            key={col.key}
            value={s.scores[col.key] ?? null}
            label={col.label}
          />
        ))}
      </div>
    </article>
  );
}
