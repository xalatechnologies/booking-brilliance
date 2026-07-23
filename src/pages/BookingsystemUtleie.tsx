import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
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
    question: "Hva er et bookingsystem for utleie?",
    answer:
      "Et bookingsystem for utleie er en digital plattform der du som utleier legger ut ledige tider på lokalet ditt, og leietakere ser tilgjengelighet i sanntid og booker direkte. Systemet håndterer kalender, pris, tilleggstjenester, betaling og bekreftelser, så du slipper e-poster og telefoner frem og tilbake. Digilist er et slikt system, bygget for både private utleiere og offentlige/kommunale lokaler.",
  },
  {
    question: "Hvordan leier jeg ut lokaler med sanntidskalender?",
    answer:
      "Du legger utleieobjektet inn med ledige tider, pris og eventuelle tilleggstjenester. Leietakere ser umiddelbart hva som er ledig, opptatt og blokkert, og booker den datoen de trenger. Kalenderen oppdateres uten refresh, og dobbeltbooking hindres automatisk fordi alle ser samme sanntidsstatus.",
  },
  {
    question: "Kan jeg ta betalt på nett for utleien?",
    answer:
      "Ja. Leietaker kan betale direkte ved booking med Vipps eller kort. Du kan sette differensiert pris etter ukedag, sesong og kapasitet, og legge til tilleggstjenester som rengjøring, utstyr eller bemanning som egne linjer i prisen.",
  },
  {
    question: "Hva koster et bookingsystem for utleie?",
    answer:
      "Prisen avhenger av antall utleieobjekter, bookingvolum og integrasjoner. Digilist tilbyr en gratis demo og et pristilbud tilpasset behovet ditt. For leietakere er det gratis å søke, sammenligne og booke – de betaler kun leieprisen til utleier.",
  },
  {
    question: "Passer Digilist for både private utleiere og kommuner?",
    answer:
      "Ja. Digilist er bygget for begge markeder i samme system. Private utleiere av festlokaler, gårder, møterom og idrettsanlegg bruker samme sanntidskalender som kommuner bruker for offentlige lokaler. Det betyr at leietakere finner både private og offentlige lokaler samlet ett sted.",
  },
  {
    question: "Hvordan får utleieobjektet mitt mer synlighet?",
    answer:
      "Utleieobjektet ditt blir søkbart på lokaltype, geografi og fasiliteter, slik at leietakere som leter etter akkurat den typen lokale finner deg. Sanntidskalender og direkte booking senker terskelen for at en interessert leietaker faktisk fullfører bookingen.",
  },
];

const FEATURES = [
  {
    title: "Sanntidskalender",
    body: "Leietakere ser ledig, opptatt og blokkert tid umiddelbart. Dobbeltbooking hindres automatisk, og endringer oppdateres uten refresh for både utleier og leietaker.",
  },
  {
    title: "Online booking og betaling",
    body: "Leietaker booker og betaler direkte med Vipps eller kort. Bekreftelse og kvittering sendes automatisk – ingen manuell fakturering av småoppdrag.",
  },
  {
    title: "Differensiert pris og tilleggstjenester",
    body: "Sett pris etter ukedag, sesong og kapasitet. Legg til rengjøring, utstyr, bemanning eller andre tillegg som egne linjer, slik at leietaker ser totalprisen før booking.",
  },
  {
    title: "Kalendersynk (iCal / CalDAV / Outlook)",
    body: "Hold utleiekalenderen synkronisert med Outlook, Google og andre kalendere, så en booking ett sted aldri kolliderer med en avtale et annet.",
  },
  {
    title: "Automatiske bekreftelser og påminnelser",
    body: "Forespørsler, bekreftelser, påminnelser og endringer sendes automatisk til leietaker og relevante driftsroller – mindre e-post og telefon for deg.",
  },
  {
    title: "Søkbar og oppdagbar",
    body: "Utleieobjektet vises der leietakere leter, med filtrering på lokaltype, geografi og fasiliteter. Det gjør at interesserte finner deg og fullfører bookingen.",
  },
];

const WHY_UTLEIE = [
  "Sanntidstilgjengelighet uten dobbeltbooking",
  "Online booking og betaling (Vipps, kort)",
  "Differensiert pris etter sesong og ukedag",
  "Tilleggstjenester som egne prislinjer",
  "Kalendersynk (iCal / CalDAV / Outlook)",
  "Automatiske bekreftelser og påminnelser",
  "Mindre e-post og telefon per booking",
  "Søkbar på lokaltype, geografi og fasiliteter",
  "Privat og offentlig utleie i samme system",
  "Data lagret i Norge og EU (GDPR)",
  "Rapportering på belegg og inntekt",
  "Audit-logg på alle endringer",
];

const LOKALTYPER = [
  { label: "Selskapslokale", to: "/leie/selskapslokale" },
  { label: "Gård", to: "/leie/gaard" },
  { label: "Bursdagslokale", to: "/leie/bursdagslokale" },
  { label: "Kulturhus", to: "/leie/kulturhus" },
  { label: "Møterom", to: "/leie/moterom" },
  { label: "Konferanselokale", to: "/leie/konferanselokale" },
  { label: "Kontorlokaler", to: "/leie/kontorlokaler" },
  { label: "Coworking", to: "/leie/coworking" },
  { label: "Idrettshall", to: "/leie/idrettshall" },
  { label: "Padelbane", to: "/leie/padelbane" },
  { label: "Svømmehall", to: "/leie/svommehall" },
  { label: "Alle lokaler", to: "/leie" },
];

const BookingsystemUtleie = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Bookingsystem for utleie · Digilist | Leie ut lokaler på nett"
        description="Bookingsystem for utleie av lokaler: sanntidskalender, online booking og betaling med Vipps, differensiert pris og kalendersynk. For private utleiere og kommuner."
        keywords="bookingsystem utleie, bookingsystem for utleie av lokaler, utleie booking, leie ut lokaler system, utleiesystem lokaler"
        canonical="https://digilist.no/bookingsystem-utleie"
        ogImage="https://digilist.no/og-image.png"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Bookingsystem for utleie", url: "https://digilist.no/bookingsystem-utleie" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="UTLEIE-BOOKING · 2026" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Bookingsystem for{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    utleie av lokaler
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  Et bookingsystem for utleie lar deg vise ledige tider i sanntid og
                  la leietakere booke og betale direkte. Digilist er en norsk
                  bookingplattform for{" "}
                  <strong className="text-ink">både private utleiere og kommuner</strong>{" "}
                  – sanntidskalender, Vipps-betaling og differensiert pris, uten
                  runder med e-post og telefon.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href="/#kontakt">
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
                  {/* First sub-heading after the hero <h1> → must be h2, not h3,
                      or it skips a level (H1→H3) and trips a11y.heading.skip. */}
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    For utleiere
                  </h2>
                  <SpecRow label="Marked" value="Privat · offentlig" />
                  <SpecRow label="Lokaltyper" value="11+" />
                  <SpecRow label="Betaling" value="Vipps · kort" />
                  <SpecRow label="Datalokasjon" value="Norge · EU" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="I. HVORFOR DIGITAL UTLEIE" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Fra e-post til{" "}
                  <em className="italic">direkte booking</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Alt en utleier trenger for å fylle kalenderen, samlet ett sted.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {WHY_UTLEIE.map((item) => (
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
                  Hva utleieren får.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Seks funksjoner som gjør utleie til en digital, selvbetjent flyt.
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
            <SectionRule label="III. LOKALTYPER DU KAN LEIE UT" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Én plattform, mange{" "}
                  <em className="italic">lokaltyper</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Fra festlokaler og gårder til møterom og idrettsanlegg.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-rule border border-rule">
              {LOKALTYPER.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className="group bg-paper p-5 lg:p-6 flex items-center justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span className="text-base text-ink group-hover:text-accent-text">
                    {t.label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-ink-soft group-hover:text-accent-text group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="IV. NORSKE INTEGRASJONER" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Tilkoblet det du{" "}
                  <em className="italic">allerede bruker</em>.
                </EditorialHeading>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Vipps",
                "BankID",
                "Altinn",
                "EHF / Peppol",
                "Brønnøysund",
                "Visma",
                "Tripletex",
                "Fiken",
                "PowerOffice",
                "Microsoft 365",
                "Google Calendar",
                "Salto KS",
              ].map((brand) => (
                <div key={brand} className="border border-rule rounded-sm p-4 bg-paper">
                  <IntegrationLogo brand={brand} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-accent-tinted">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="V. KONTAKT" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="display" className="mb-6">
                  Be om{" "}
                  <em className="italic">pristilbud</em>.
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure mb-8">
                  Vi setter sammen et pristilbud basert på antall utleieobjekter,
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
                    Leverandørinformasjon
                  </h3>
                  <SpecRow label="Leverandør" value="Xala Technologies AS" />
                  <SpecRow label="Adresse" value="Nesbruveien 75, 1394 Nesbru" />
                  <SpecRow label="Telefon" value="+47 96 66 50 01" />
                  <SpecRow label="E-post" value="kontakt@digilist.no" />
                  <SpecRow label="Betaling" value="Vipps · kort" />
                  <SpecRow label="ISO 27001/27701" value="Sertifisert" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="VI. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål om utleie-booking.
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
              Se også{" "}
              <Link
                to="/bookingsystem-kommune"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                bookingsystem for kommuner
              </Link>{" "}
              eller tilbake til{" "}
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

export default BookingsystemUtleie;
