import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Users,
  Building2,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Users2,
  Theater,
  GlassWater,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const FAQ = [
  {
    question: "Hva er booking av lokaler og møterom?",
    answer:
      "Booking av lokaler og møterom er den digitale prosessen der innbyggere, bedrifter, lag eller foreninger reserverer fysiske rom (selskapslokaler, møterom, idrettshaller, kantiner, kulturhus) for et bestemt tidsrom. En moderne plattform håndterer sanntidstilgjengelighet, betaling, kontrakt, varsling av driftsroller og fakturering i én sammenhengende flyt.",
  },
  {
    question: "Hvordan booker man et lokale eller møterom på Digilist?",
    answer:
      "Søk etter sted og dato i sanntidskalenderen. Velg ledig tid, fyll inn formål og antall deltakere, signer leieavtalen digitalt og betal med Vipps, kort eller faktura. Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk. Hele flyten tar typisk under 90 sekunder.",
  },
  {
    question: "Hvilke typer lokaler og møterom kan jeg booke?",
    answer:
      "Digilist støtter selskapslokaler, møterom, kantiner, idrettshaller, gymsaler, kulturhus, samfunnshus, undervisningsrom og spesialressurser som AV-utstyr eller kjøretøy. Hvert anlegg kan ha egne regler for kapasitet, brukergrupper, prising og rabatter.",
  },
  {
    question: "Hvor mye koster det å booke et lokale via Digilist?",
    answer:
      "Prisen avhenger av lokalet, varigheten, brukergruppen og kommunens regler. Lag og foreninger får ofte 30–100 % rabatt avhengig av kommunens prioriteringsregler. Selve plattformen er gratis å bruke for innbyggere. Du betaler kun leieprisen til utleier.",
  },
  {
    question: "Kan kommuner og bedrifter bruke Digilist for å sette opp egne booking-tjenester?",
    answer:
      "Ja. Digilist er bygget for norske kommuner og private utleiere. Kommunen får eget administratorpanel der saksbehandlere håndterer søknader, sesongleie og kalenderbooking. Bedrifter får sin egen profil for selskapslokaler, kulturhus eller møterom. Plattformen er SSA-L 2026-klar.",
  },
  {
    question: "Er Digilist trygt og GDPR-kompatibelt?",
    answer:
      "Ja. All data lagres i Norge og EU på PostgreSQL hostet av Convex. Plattformen er sertifisert mot ISO 27001 og ISO 27701, oppfyller GDPR-krav, og bruker ID-porten/BankID for autentisering. Audit-spor registrerer hver mutasjon med tidsstempel.",
  },
  {
    question: "Hvilke betalingsmetoder støttes for booking av lokaler?",
    answer:
      "Vipps, kortbetaling via Stripe Connect, depositum med automatisk frigjøring, og EHF/Peppol-fakturering for organisasjoner. Refusjonsregler kan tilpasses per anlegg.",
  },
  {
    question: "Hvordan håndterer Digilist sesongleie for idrettslag og foreninger?",
    answer:
      "Digilist har en dedikert sesongleie-modul: lag og foreninger søker via egen portal, organisasjonen verifiseres mot Brønnøysundregistrene, og saksbehandler får regelstyrt fordelingsforslag basert på kommunens prioriteringer. Tilskudd, fordeling og kapasitetsutnyttelse rapporteres automatisk.",
  },
];

const BENEFITS = [
  {
    Icon: CalendarCheck,
    title: "Sanntids tilgjengelighet",
    body: "Innbyggere ser ledige og opptatte tider umiddelbart. Ingen polling, ingen daglig synkronisering. Endringer oppdateres samme sekund hos alle brukere.",
  },
  {
    Icon: CreditCard,
    title: "Betaling i én flyt",
    body: "Vipps, kort eller faktura, uten å forlate booking-skjemaet. EHF/Peppol til organisasjoner. Automatisk avstemming mot regnskapssystemet.",
  },
  {
    Icon: Users,
    title: "Sesongleie og brukergrupper",
    body: "Lag og foreninger med BRREG-verifisering, regelstyrt fordeling, og dokumentert prioritering. Saksbehandler får forslag, beholder skjønnet.",
  },
  {
    Icon: ShieldCheck,
    title: "Trygt og etterprøvbart",
    body: "ID-porten, ISO 27001 og 27701, GDPR, WCAG 2.1 AA, data i Norge og EU. Hver mutasjon revisjonsspores.",
  },
  {
    Icon: Building2,
    title: "Bygget for norske krav",
    body: "Vipps, BankID, ID-porten, EHF, BRREG og Digdir Designsystemet, innebygd. SSA-L 2026-klar for kommunale anskaffelser.",
  },
  {
    Icon: Sparkles,
    title: "Én plattform, ingen siloer",
    body: "Booking, betaling, sesongleie, fakturering, regnskap og driftsvarsling: én datakilde. Ingen dobbelinntastinger, ingen synkroniseringsfeil.",
  },
];

const USE_CASES = [
  {
    title: "Selskapslokaler",
    Icon: GlassWater,
    body: "Bryllup, jubileer, firmafester. Med depositum, leieavtale-signering og digital nøkkel.",
    href: "/bruksomrader/selskapslokaler",
    cta: "Les om selskapslokaler",
  },
  {
    title: "Møterom",
    Icon: Users2,
    body: "Kommunale møterom, næringsbygg, foreningslokaler, med sambruk og pris per brukergruppe.",
    href: "/bruksomrader/moterom",
    cta: "Les om møterom",
  },
  {
    title: "Idrettshaller og gymsaler",
    Icon: Trophy,
    body: "Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger.",
    href: "/bruksomrader/idrettshaller-gymsaler",
    cta: "Les om idrettshaller",
  },
  {
    title: "Kulturhus og kantiner",
    Icon: Theater,
    body: "Forestillinger, konserter, åpne dager. Adgangskontroll via Salto KS og automatisk varsling av driftsroller.",
    href: "/bruksomrader/kulturhus-kantiner",
    cta: "Les om kulturhus",
  },
];

const BookingLokalerMoterom = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Booking av lokaler og møterom · Digilist | Norsk bookingplattform for kommuner og utleiere"
        description="Booking av lokaler og møterom i Norge: sanntidskalender, Vipps, BankID, EHF og sesongleie. Bygget for kommuner, selskapslokaler, idrettshaller og kulturhus. SSA-L 2026-klar, ISO 27001-sertifisert."
        keywords="booking av lokaler og møterom, booking lokale, booking møterom, leie lokale, leie møterom, bookingplattform Norge, kommunal booking, selskapslokale booking, idrettshall booking, kulturhus booking, Vipps booking, BankID booking, EHF, sesongleie"
        canonical="https://digilist.no/booking-av-lokaler-og-moterom"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          {
            name: "Booking av lokaler og møterom",
            url: "https://digilist.no/booking-av-lokaler-og-moterom",
          },
        ]}
        faq={FAQ}
        service
        howTo={{
          name: "Slik booker du lokale eller møterom",
          description:
            "Fra søk til bekreftet booking på fire steg via Digilist.",
          steps: [
            {
              name: "Søk og velg ledig tid",
              text: "Søk etter lokale eller møterom i kalenderen. Filtrer på dato, kapasitet og fasiliteter. Ledige tider vises i sanntid.",
            },
            {
              name: "Fyll inn formål og deltakere",
              text: "Angi hvilken anledning, antall deltakere og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring).",
            },
            {
              name: "Logg inn og signer leieavtalen",
              text: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur.",
            },
            {
              name: "Betal og motta bekreftelse",
              text: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk.",
            },
          ],
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="BOOKING AV LOKALER OG MØTEROM" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
                <div className="lg:col-span-8">
                  <EditorialHeading as="h1" size="display">
                    Booking av{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings: getFraunces("display"),
                      }}
                    >
                      lokaler og møterom
                    </em>{" "}
                    · én norsk plattform.
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist er en norsk bookingplattform for kommuner,
                    selskapslokaler, idrettshaller, kulturhus og møterom. Søk,
                    book og betal i én flyt, med Vipps, BankID, EHF og
                    sesongleie innebygd.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href="https://app.digilist.no"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Åpne plattformen
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href="/book-demo"
                    >
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </div>

              {/* Benefits grid */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  {/* Real <h2> (styled as the caption) so the benefit-card
                      <h3>s below don't skip straight from the hero <h1>
                      (H1→H3) and trip a11y.heading.skip. */}
                  <h2 className="editorial-mono-caption text-accent-text">
                    HVORFOR DIGILIST
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    SEKS PRINSIPPER
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {BENEFITS.map(({ Icon, title, body }) => (
                    <article
                      key={title}
                      className="bg-paper p-7 lg:p-9 flex flex-col"
                    >
                      <header className="flex items-center gap-3 mb-3">
                        <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy">
                          <Icon
                            className="h-5 w-5"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </span>
                        <h3
                          className="font-serif text-2xl text-ink leading-tight flex-1"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                          }}
                        >
                          {title}
                        </h3>
                      </header>
                      <p className="text-base text-ink leading-relaxed">
                        {body}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* Use cases */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    BRUKSOMRÅDER
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    LOKALER · MØTEROM · IDRETT · KULTUR
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
                  {USE_CASES.map((u) => {
                    const Icon = u.Icon;
                    return (
                      <Link
                        key={u.title}
                        to={u.href}
                        className="group bg-paper p-7 lg:p-9 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40 flex flex-col"
                      >
                        <header className="flex items-center gap-4 mb-4">
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy group-hover:bg-navy group-hover:text-on-navy transition-colors duration-quick ease-editorial">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3
                            className="font-serif text-2xl lg:text-3xl text-ink leading-tight flex-1 inline-flex items-center gap-2"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {u.title}
                          </h3>
                          <ArrowUpRight
                            className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                        </header>
                        <p className="text-base text-ink leading-relaxed flex-1">
                          {u.body}
                        </p>
                        <p className="mt-5 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                          {u.cta}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* How it works */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    SLIK BOOKER DU
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    FIRE STEG · UNDER 90 SEKUNDER
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {[
                    {
                      step: "01",
                      title: "Søk og velg ledig tid",
                      body: "Søk på lokale eller møterom, filtrer på dato og kapasitet. Sanntidskalenderen viser ledige og opptatte tider umiddelbart.",
                    },
                    {
                      step: "02",
                      title: "Fyll inn formål og deltakere",
                      body: "Angi anledning, antall personer og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring).",
                    },
                    {
                      step: "03",
                      title: "Logg inn og signer",
                      body: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur.",
                    },
                    {
                      step: "04",
                      title: "Betal og motta bekreftelse",
                      body: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse og digital nøkkel sendes automatisk.",
                    },
                  ].map((s, i) => (
                    <li
                      key={s.step}
                      className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${i > 0 ? "border-t border-rule" : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[2.5rem] lg:-left-[3.5rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 bg-paper border border-hairline-strong rounded-sm font-mono text-xs text-accent-text tabular-nums"
                      >
                        {s.step}
                      </span>
                      <div className="col-span-12 lg:col-span-4">
                        <h3
                          className="font-serif text-2xl lg:text-3xl text-ink"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            letterSpacing: "-0.015em",
                            lineHeight: 1.1,
                          }}
                        >
                          {s.title}
                        </h3>
                      </div>
                      <div className="col-span-12 lg:col-span-8">
                        <p className="text-base lg:text-lg text-ink leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ inline */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <span className="editorial-mono-caption text-accent-text">
                    OFTE STILTE SPØRSMÅL
                  </span>
                  <span className="editorial-mono-caption text-ink-faint">
                    BOOKING AV LOKALER OG MØTEROM
                  </span>
                </div>
                <dl className="border-t border-rule">
                  {FAQ.map((f, idx) => (
                    <div
                      key={idx}
                      className="border-b border-rule py-7 lg:py-9 grid lg:grid-cols-12 gap-4 lg:gap-gutter"
                    >
                      <dt className="lg:col-span-5">
                        <h3
                          className="font-serif text-xl lg:text-2xl text-ink"
                          style={{
                            fontVariationSettings: getFraunces("sub"),
                            lineHeight: 1.15,
                          }}
                        >
                          {f.question}
                        </h3>
                      </dt>
                      <dd className="lg:col-span-7">
                        <p className="text-base lg:text-lg text-ink leading-relaxed">
                          {f.answer}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Closing CTA */}
              <EditorialCard className="bg-paper-deep/40">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
                  <div className="lg:col-span-8">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      Klar til å digitalisere booking av lokaler og møterom?
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Få en gratis 30-minutters demo for kommunen eller utleier.
                      Vi viser plattformen i ditt bruksområde. Ingen
                      forpliktelser.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BookingLokalerMoterom;
