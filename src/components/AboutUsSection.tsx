import {
  MapPin,
  Calendar,
  Shield,
  Code2,
  Building,
  Languages,
  Flag,
  Lock,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import {
  SectionRule,
  EditorialHeading,
  DropCap,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const fakta = [
  { Icon: Building, label: "UTGIVER", value: "Xala Technologies AS" },
  { Icon: MapPin, label: "KONTOR", value: "Nesbruveien 75, Nesbru" },
  { Icon: Calendar, label: "ETABLERT", value: "2024" },
  { Icon: Languages, label: "SPRÅK", value: "Bokmål · Nynorsk · English" },
  { Icon: Shield, label: "SERTIFISERT", value: "ISO 27001 · ISO 27701" },
  { Icon: Code2, label: "STACK", value: "Convex · React 19 · PostgreSQL" },
];

const timeline = [
  {
    year: "2024",
    title: "Etablert",
    body: "Xala Technologies starter arbeidet med Digilist, én plattform for det norske utleiemarkedet.",
  },
  {
    year: "2025",
    title: "Første kunder",
    body: "Rønningen Selskapslokale og andre private utleiere går i drift. Sanntid, Vipps, BankID og EHF i produksjon.",
  },
  {
    year: "2025",
    title: "Kommune live",
    body: "Nordre Follo kommune tar i bruk plattformen for 12 anlegg, sesongleie og ID-porten-innlogging.",
  },
  {
    year: "2026",
    title: "SSA-L 2026 klar",
    body: "Plattformen oppfyller SSA-L 2026-kravene. Norske kommuner kan ta i bruk Digilist gjennom offentlig anskaffelse.",
  },
];

const creed = [
  {
    n: "I",
    Icon: Flag,
    title: "Norsk fra grunnen",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir-designsystemet er innebygd, ikke bolt-on på en amerikansk SaaS.",
  },
  {
    n: "II",
    Icon: Lock,
    title: "Datasuverenitet",
    body: "All data lagres i Norge og EU. Ingen CLOUD Act-eksponering, ingen kryssjurisdiksjon, full GDPR-suverenitet.",
  },
  {
    n: "III",
    Icon: ClipboardCheck,
    title: "Etterprøvbar",
    body: "Hver mutasjon revisjonsspores. Hver beslutning kan forsvares i kontrakt, i drift og i revisjon.",
  },
  {
    n: "IV",
    Icon: Layers,
    title: "Sammenhengende",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og rapportering i én plattform, ikke fem integrerte verktøy.",
  },
];

const AboutUsSection = () => {
  return (
    <section id="om-oss" className="py-16 lg:py-24 bg-paper-tinted border-y border-rule">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="KOLOFON" />

        {/* Headline + lede */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
          <div className="lg:col-span-7 lg:col-start-2">
            <Byline
              author="Xala Technologies AS"
              role="Utgiver"
              date="Oslo, 2026"
              className="mb-10"
            />

            <EditorialHeading as="h2" size="section" className="mb-10">
              Om{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings:
                    '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                Digilist.
              </em>
            </EditorialHeading>

            <div className="prose-editorial text-ink-soft text-lg lg:text-xl leading-relaxed space-y-6">
              <DropCap>
                Digilist er en SaaS-plattform for det norske utleiemarkedet,
                utviklet av Xala Technologies AS. Plattformen samler booking,
                betaling, kalender, rapportering og integrasjoner mot offentlige
                tjenester i én løsning, bygd for både private utleiere,
                kulturhus, foreninger og kommuner.
              </DropCap>

              <p>
                Vi tror norske utleiere fortjener verktøy som passer det norske
                landskapet: Vipps og BankID til betaling og autentisering, EHF
                og Peppol til fakturering, ID-porten til innbyggerautentisering,
                ISO 27001 og GDPR til samsvar.{" "}
                <em
                  className="italic"
                  style={{ fontVariationSettings: '"opsz" 16, "wght" 420, "SOFT" 60' }}
                >
                  Ikke amerikansk SaaS oversatt til bokmål,
                </em>{" "}
                men en plattform bygd fra grunnen for norske krav.
              </p>

              <p>
                Plattformen kjører på Convex og PostgreSQL, hostet i Norge og
                EU. Hver mutasjon revisjonsspores. Hver komponent isoleres.
                Tilgang kontrolleres med RBAC og step-up-autentisering for
                sensitive operasjoner.
              </p>
            </div>
          </div>

          {/* Fakta sidebar */}
          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="bg-paper border border-hairline-strong rounded-sm p-7 lg:p-8 lg:sticky lg:top-28">
              <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-rule">
                <h3
                  className="font-serif text-xl lg:text-2xl text-ink"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Fakta
                </h3>
                <span className="editorial-mono-caption text-ink-faint">
                  FIG. VIII
                </span>
              </div>
              <dl className="space-y-5">
                {fakta.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="editorial-mono-caption text-ink-faint mb-1">
                        {label}
                      </dt>
                      <dd
                        className="font-serif text-base text-ink leading-snug"
                        style={{
                          fontVariationSettings: '"opsz" 24, "wght" 420',
                        }}
                      >
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>

        {/* Editorial creed — Hva vi tror */}
        <div className="mb-16 lg:mb-24">
          <div className="flex items-baseline justify-between mb-8 lg:mb-10 border-b border-rule pb-3">
            <span className="editorial-mono-caption text-accent-text">
              HVA VI TROR · DIGILIST-PROGRAM
            </span>
            <span className="editorial-mono-caption text-ink-faint">
              IV PRINSIPPER
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {creed.map(({ n, Icon, title, body }) => (
              <article
                key={n}
                className="group bg-paper p-8 lg:p-10 flex flex-col transition-colors duration-quick ease-editorial hover:bg-paper-deep/40"
              >
                <div className="flex items-baseline gap-3 mb-6">
                  <span
                    className="font-serif text-2xl text-accent-text tabular-nums leading-none"
                    style={{
                      fontVariationSettings: '"opsz" 48, "wght" 480',
                    }}
                    aria-hidden="true"
                  >
                    {n}.
                  </span>
                  <span className="flex-1 h-px bg-rule" />
                </div>
                <span className="inline-flex items-center justify-center w-14 h-14 border border-hairline-strong rounded-sm text-accent-text mb-5">
                  <Icon
                    className="h-7 w-7"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <h4
                  className="font-serif text-[1.65rem] lg:text-[1.85rem] text-ink mb-5 break-words hyphens-auto"
                  style={{
                    fontVariationSettings: getFraunces("sub"),
                    letterSpacing: "-0.015em",
                    lineHeight: 1.05,
                  }}
                >
                  {title}
                </h4>
                <p className="text-base lg:text-lg text-ink-soft leading-relaxed">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Editorial pull-quote — manifesto */}
        <figure
          aria-labelledby="manifest"
          className="relative isolate mb-16 lg:mb-24"
        >
          <span
            aria-hidden="true"
            className="absolute -top-6 lg:-top-12 left-4 lg:left-10 font-serif text-[10rem] lg:text-[16rem] leading-none text-accent-text/10 select-none pointer-events-none"
            style={{
              fontVariationSettings: '"opsz" 144, "wght" 380, "SOFT" 60',
            }}
          >
            &ldquo;
          </span>
          <div className="rule-h bg-rule" />
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-16">
            <div className="lg:col-span-2 hidden lg:flex items-start">
              <span className="editorial-mono-caption text-accent-text">
                MANIFEST
              </span>
            </div>
            <div className="lg:col-span-9">
              <blockquote
                id="manifest"
                className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink leading-[1.18]"
                style={{
                  fontVariationSettings:
                    '"opsz" 96, "wght" 380, "SOFT" 40, "WONK" 0',
                  letterSpacing: "-0.018em",
                }}
              >
                Vi bygger ikke en booking-app for verden,{" "}
                <em className="italic">vi bygger plattformen Norge fortjener</em>
                . Én løsning som kommunen kan stole på i drift, og som
                utleieren ser frem til å bruke en mandag morgen.
              </blockquote>
              <figcaption className="mt-8 lg:mt-10 flex items-center gap-3 editorial-mono-caption">
                <span className="inline-block w-8 h-px bg-accent-text" />
                <span className="text-ink">Ibrahim Rahmani</span>
                <span className="text-ink-faint">·</span>
                <span className="text-ink-faint">
                  CTO, Xala Technologies AS
                </span>
              </figcaption>
            </div>
          </div>
          <div className="rule-h bg-rule" />
        </figure>

        {/* Timeline — milepæler */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between mb-8 lg:mb-12 border-b border-rule pb-3">
            <span className="editorial-mono-caption text-accent-text">
              MILEPÆLER · 2024–2026
            </span>
            <span className="editorial-mono-caption text-ink-faint">
              KRONOLOGI
            </span>
          </div>

          <ol className="relative border-l border-rule pl-8 lg:pl-12">
            {timeline.map((step, idx) => (
              <li
                key={`${step.year}-${step.title}`}
                className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${
                  idx > 0 ? "border-t border-rule" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.25rem] lg:-left-[3.25rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-paper border border-hairline-strong rounded-sm text-accent-text"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-text" />
                </span>
                <div className="col-span-12 lg:col-span-3">
                  <span
                    className="font-mono text-2xl lg:text-3xl text-accent-text tabular-nums"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {step.year}
                  </span>
                </div>
                <div className="col-span-12 lg:col-span-9">
                  <h4
                    className="font-serif text-2xl lg:text-3xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      lineHeight: 1.15,
                    }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-base lg:text-lg text-ink-soft leading-relaxed measure">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
