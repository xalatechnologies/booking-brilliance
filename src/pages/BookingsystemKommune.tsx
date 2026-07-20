import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
  IntegrationLogo,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";

const FAQ = [
  {
    question: "Hva er et kommunalt bookingsystem?",
    answer:
      "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler (idrettshaller, svømmehaller, møterom, kantiner og kulturhus) i sanntid. Plattformen håndterer kalender, godkjenning, betaling, sesongleie og fakturering.",
  },
  {
    question: "Oppfyller Digilist SSA-L 2026-kravene?",
    answer:
      "Ja. Digilist er bygget med SSA-L 2026-krav som referansepunkt og oppfyller kjernekrav om sanntidstilgjengelighet, sesongleie med regelstyrt fordeling, ID-porten-autentisering, BRREG-verifisering, digital nøkkel, EHF-fakturagrunnlag, universell utforming (WCAG 2.0 AA) og ISO 27001/27701-sertifisering.",
  },
  {
    question: "Hvordan håndteres sesongleie for lag og foreninger?",
    answer:
      "Digilist har egen sesongleie-modul med søknadsportal for lag og foreninger. Saksbehandler får regelstyrt fordelingsforslag som kan justeres og godkjennes. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk.",
  },
  {
    question: "Kan kommunen importere bookinger fra eksisterende system?",
    answer:
      "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer. Vi kan ta over historiske bookinger, sesongleieavtaler og foreningsregistre i etableringsfasen.",
  },
  {
    question: "Hvor lagres dataene?",
    answer:
      "All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er ISO 27001 og ISO 27701-sertifisert, og oppfyller GDPR-kravene.",
  },
  {
    question: "Hva koster Digilist for en kommune?",
    answer:
      "Prisen avhenger av antall anlegg, brukermengde og integrasjoner. Vi tilbyr en gratis demo og pristilbud basert på kommunens spesifikke behov. Kontakt salg på kontakt@digilist.no.",
  },
];

const FEATURES = [
  {
    title: "Sanntidskalender",
    body: "Innbyggere og saksbehandlere ser ledig, opptatt og blokkert tid umiddelbart. Endringer fra bookinger, avlysninger eller administrasjon oppdateres uten refresh.",
  },
  {
    title: "Sesongleie med regelstyrt fordeling",
    body: "Lag og foreninger søker via egen portal. Saksbehandler får regelstyrt forslag basert på kommunens prioriteringsregler og kan justere før godkjenning.",
  },
  {
    title: "Driftsroller varsles automatisk",
    body: "Vaktmestere, renholdspersonell, vektere og andre driftsroller får automatisk varsel ved bookingbekreftelse, endring eller avlysning.",
  },
  {
    title: "ID-porten + BankID-innlogging",
    body: "Innbyggere logger inn med ID-porten eller BankID. Lag og foreninger verifiseres via Brønnøysundregisteret (BRREG).",
  },
  {
    title: "EHF / Peppol-fakturering",
    body: "Faktura sendes automatisk via EHF til kommunens regnskapssystem. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap.",
  },
  {
    title: "Digital nøkkel (Salto KS)",
    body: "Adgangskontroll med Salto KS digital nøkkel. Tilgang aktiveres automatisk ved bookingstart og deaktiveres ved slutt.",
  },
];

const SSA_L_CHECKLIST = [
  "Sanntidstilgjengelighet",
  "Sesongleiesøknad og regelstyrt fordeling",
  "ID-porten + BankID-autentisering",
  "BRREG-verifisering av organisasjoner",
  "Digital nøkkel for adgangskontroll",
  "EHF-fakturagrunnlag",
  "Min side for innbyggere",
  "Universell utforming (WCAG 2.0 AA)",
  "ISO 27001 og 27701-sertifisering",
  "Data lagret i Norge og EU (GDPR)",
  "Rapportering på kapasitet og økonomi",
  "Audit-logg på alle endringer",
];

const BookingsystemKommune = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Bookingsystem for kommuner · Digilist | SSA-L 2026 klar"
        description="Digital bookingplattform for norske kommuner. Sanntidskalender, sesongleie, ID-porten, EHF, ISO 27001. Bygget for SSA-L 2026-krav."
        canonical="https://digilist.no/bookingsystem-kommune"
        ogImage="https://digilist.no/og-image.png"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Bookingsystem for kommuner", url: "https://digilist.no/bookingsystem-kommune" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="KOMMUNAL BOOKING · 2026" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Bookingsystem for{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    norske kommuner
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  Sanntidskalender, sesongleie, ID-porten-innlogging, EHF-fakturering
                  og automatisk driftsvarsling, i én plattform bygget for{" "}
                  <strong className="text-ink">SSA-L 2026-krav</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    href="/#kontakt"
                  >
                    Be om pristilbud
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne plattformen
                  </EditorialButton>
                </div>
              </div>

              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  {/* First sub-heading after the hero <h1> → must be h2, not
                      h3, or it skips a level (H1→H3) and trips a11y.heading.skip. */}
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    Aktive kommuner
                  </h2>
                  <SpecRow label="Nordre Follo" value="12 anlegg" />
                  <SpecRow label="Foreninger" value="~340" />
                  <SpecRow label="Bookinger / mnd" value="~1 200" />
                  <SpecRow label="Datalokasjon" value="Norge · EU" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="I. SSA-L 2026 KRAV" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Bygget for offentlig{" "}
                  <em className="italic">anskaffelse</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Hver SSA-L 2026-funksjon dekket fra dag én, ikke som tillegg.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {SSA_L_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-base text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="II. FUNKSJONALITET" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Hva kommunen får.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Seks funksjoner som adresserer kjernekrav fra norske kommuner.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-paper p-6 lg:p-8 flex flex-col gap-3">
                  <h3
                    className="font-serif text-xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="III. NORSKE INTEGRASJONER" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Tilkoblet kommunens{" "}
                  <em className="italic">eksisterende systemer</em>.
                </EditorialHeading>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Vipps",
                "BankID",
                "ID-porten",
                "Altinn",
                "EHF / Peppol",
                "Brønnøysund",
                "Visma",
                "Tripletex",
                "Fiken",
                "PowerOffice",
                "Microsoft 365",
                "Salto KS",
              ].map((brand) => (
                <div
                  key={brand}
                  className="border border-rule rounded-sm p-4 bg-paper"
                >
                  <IntegrationLogo brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-accent-tinted">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="IV. KONTAKT" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="display" className="mb-6">
                  Be om{" "}
                  <em className="italic">pristilbud</em>.
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure mb-8">
                  Vi setter sammen et pristilbud basert på antall anlegg,
                  bookingvolum og integrasjoner. Demo på 30–45 minutter, ingen
                  forpliktelser.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href="/#kontakt">
                    Be om demo
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="mailto:kontakt@digilist.no"
                  >
                    kontakt@digilist.no
                  </EditorialButton>
                </div>
              </div>
              <div className="lg:col-span-5">
                <EditorialCard className="bg-paper">
                  <h3
                    className="font-serif text-xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    Anskaffelsesinformasjon
                  </h3>
                  <SpecRow label="Leverandør" value="Xala Technologies AS" />
                  <SpecRow label="Org.nr." value="Tilgjengelig" />
                  <SpecRow label="Adresse" value="Nesbruveien 75, 1394 Nesbru" />
                  <SpecRow label="Telefon" value="+47 96 66 50 01" />
                  <SpecRow label="E-post" value="kontakt@digilist.no" />
                  <SpecRow label="SSA-L 2026" value="Tilpasset" />
                  <SpecRow label="ISO 27001/27701" value="Sertifisert" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="V. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål fra kommuner.
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {FAQ.map((q) => (
                <div key={q.question} className="border-b border-rule pb-8">
                  <dt
                    className="font-serif text-2xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {q.question}
                  </dt>
                  <dd className="text-base text-ink-soft leading-relaxed measure">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 editorial-mono-caption">
              Tilbake til{" "}
              <Link
                to="/"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                forsiden
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingsystemKommune;
