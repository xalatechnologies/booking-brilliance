import {
  Ticket,
  Percent,
  Gift,
  BadgePercent,
  QrCode,
  Wallet,
  BarChart3,
  RefreshCcw,
  Share2,
  CalendarPlus,
  ScanLine,
  Banknote,
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
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { CategoryVisual } from "@/components/CategoryVisual";

const APP = "https://app.digilist.no";

const FEATURES = [
  {
    Icon: Ticket,
    title: "Billettsalg i sanntid",
    body: "Opprett flere billettyper med hver sin pris, kvote og salgsperiode: ordinær, honnør, barn, student eller VIP. Beholdningen oppdateres i sanntid, så du aldri selger mer enn kapasiteten.",
  },
  {
    Icon: BadgePercent,
    title: "Rabattkoder",
    body: "Lag rabattkoder med fast beløp eller prosent, med tak på antall bruk og gyldighetsperiode. Perfekt for tidligfugl, medlemspriser eller samarbeidspartnere.",
  },
  {
    Icon: Percent,
    title: "Kuponger og kampanjer",
    body: "Kjør kampanjer med kuponger som gjelder utvalgte billettyper eller hele arrangementet. Sett start og slutt, og se effekten på salget mens kampanjen løper.",
  },
  {
    Icon: Gift,
    title: "Gavekort",
    body: "Selg og løs inn gavekort som kan brukes på billetter og booking. Saldo og gyldighet håndteres digitalt, og gjenstående beløp følger med til neste kjøp.",
  },
  {
    Icon: Wallet,
    title: "Betaling med Vipps og kort",
    body: "Kjøperen betaler med Vipps eller kort i samme flyt, og får billetten med en gang. Ingen konto er nødvendig for å kjøpe, og kvittering sendes automatisk.",
  },
  {
    Icon: QrCode,
    title: "QR-billett og skanning",
    body: "Hver billett får en unik QR-kode. Ved inngangen skanner du den fra mobilen, og billetten merkes som brukt med en gang, slik at den ikke kan gå igjen.",
  },
  {
    Icon: BarChart3,
    title: "Salg og oversikt live",
    body: "Følg solgte billetter, omsetning, rabattbruk og innsjekk i sanntid. Eksporter deltakerlister og se hvilke kanaler som faktisk selger.",
  },
  {
    Icon: Banknote,
    title: "Oppgjør og regnskap",
    body: "Oppgjør utbetales til arrangøren, og bilag følger med til regnskapet, med EHF-fakturagrunnlag der det trengs. Full sporbarhet på hver transaksjon.",
  },
  {
    Icon: RefreshCcw,
    title: "Refusjon og ombooking",
    body: "Håndter avlysning, refusjon og navnebytte digitalt etter reglene du selv setter. Kjøperen får beskjed automatisk, og oppgjøret justeres.",
  },
];

const STEPS = [
  {
    step: "01",
    Icon: CalendarPlus,
    title: "Opprett arrangementet",
    body: "Legg inn dato, sted og kapasitet, og sett opp billettypene dine med pris, kvote og salgsperiode. Alt på ett sted, uten oppsett hos en ekstern billettleverandør.",
  },
  {
    step: "02",
    Icon: BadgePercent,
    title: "Sett opp rabatter og gavekort",
    body: "Lag rabattkoder, kuponger og kampanjer, og aktiver gavekort. Bestem hvem som gjelder for hva, hvor lenge, og hvor mange ganger koden kan brukes.",
  },
  {
    step: "03",
    Icon: Share2,
    title: "Del og selg",
    body: "Del salgslenken på nett, i sosiale medier eller på plakat. Kjøperen betaler med Vipps eller kort og får QR-billetten med en gang. Salget oppdateres i sanntid.",
  },
  {
    step: "04",
    Icon: ScanLine,
    title: "Skann ved inngangen",
    body: "Skann QR-koden fra mobilen ved døra. Billetten merkes som brukt umiddelbart, og du ser innsjekk og fyllingsgrad live gjennom hele arrangementet.",
  },
];

const FAQ = [
  {
    question: "Hva slags arrangementer passer billettsystemet for?",
    answer:
      "Konserter, forestillinger, konferanser, kurs, festivaler, idrettsarrangementer og lukkede selskaper. Du kan selge til åpne arrangementer med mange billettyper eller til et lukket arrangement med et fast antall plasser. Billettsystemet henger sammen med booking av lokalet, så arrangement og lokale kan håndteres i samme plattform.",
  },
  {
    question: "Hvordan fungerer rabattkoder og kuponger?",
    answer:
      "Du lager rabattkoder med enten et fast beløp eller en prosent, og setter gyldighetsperiode og maks antall bruk. Kuponger kan knyttes til bestemte billettyper eller hele arrangementet, og du kan kjøre tidsbegrensede kampanjer. Kjøperen legger inn koden i kassen, og rabatten trekkes fra med en gang.",
  },
  {
    question: "Kan jeg selge og løse inn gavekort?",
    answer:
      "Ja. Gavekort selges digitalt og kan brukes til å betale for billetter og booking. Saldoen håndteres i systemet, og hvis kjøpet er mindre enn gavekortets verdi, følger restbeløpet med til neste gang. Gyldighet og saldo er synlig for både kjøper og arrangør.",
  },
  {
    question: "Hvordan betaler kjøperen, og når får jeg oppgjør?",
    answer:
      "Kjøperen betaler med Vipps eller kort i samme flyt som billettkjøpet, og får billetten og kvitteringen med en gang. Oppgjøret utbetales til arrangøren etter avtalte vilkår, med bilag og EHF-fakturagrunnlag til regnskapet. Du har full oversikt over transaksjoner og omsetning underveis.",
  },
  {
    question: "Hvordan sjekker jeg inn gjester ved inngangen?",
    answer:
      "Hver billett har en unik QR-kode. Ved inngangen skanner du koden fra kjøperens mobil, og billetten merkes som brukt umiddelbart, slik at den samme billetten ikke kan brukes to ganger. Du ser innsjekk og fyllingsgrad live mens arrangementet pågår.",
  },
  {
    question: "Kan jeg refundere billetter hvis noe avlyses?",
    answer:
      "Ja. Du setter reglene for refusjon, ombooking og navnebytte selv, og håndterer det digitalt. Ved avlysning kan du refundere samlet, og kjøperne får beskjed automatisk. Oppgjøret justeres etter refusjonene som er gjort.",
  },
];

export default function Billettsystem() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Billettsystem: selg billetter med rabatt, kupong og gavekort | Digilist"
        description="Digilist billettsystem: selg billetter til arrangementet med rabattkoder, kuponger og gavekort. Vipps og kort, QR-billett, skanning ved inngang og oppgjør. Sanntid."
        keywords="billettsystem, selge billetter, billettsystem arrangement, rabattkoder billetter, kuponger, gavekort, billettsalg vipps, qr-billett, billettsystem norge"
        canonical="https://digilist.no/billettsystem"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Billettsystem", url: "https://digilist.no/billettsystem" },
        ]}
        service
        faq={FAQ}
        howTo={{
          name: "Slik selger du billetter med Digilist",
          description:
            "Opprett arrangement, sett opp billetter og rabatter, selg med Vipps, og skann ved inngangen.",
          steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="BILLETTSYSTEM" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Selg billetter til arrangementet,{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      med rabatt, kupong og gavekort
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist billettsystem lar deg selge billetter med rabattkoder,
                    kuponger og gavekort, ta betalt med Vipps og kort, og skanne QR-billetter
                    ved inngangen. Alt sammen med booking av lokalet i samme plattform.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Åpne plattformen
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Ticket}
                    label="DIGILIST · BILLETTSYSTEM"
                    src="/images/cat/konsert.jpg"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>

              {/* Explainer video */}
              <div className="mb-14 lg:mb-20">
                <VideoPlaceholder
                  label="Reklamefilm · Billettsystem"
                  caption="Kort film om billettsalg med Digilist"
                />
              </div>

              {/* Features */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-8 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    HVA DU KAN GJØRE
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                    BILLETTER · RABATT · KUPONG · GAVEKORT
                  </span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {FEATURES.map((f) => {
                    const Icon = f.Icon;
                    return (
                      <div key={f.title} className="bg-paper p-7">
                        <header className="flex items-center gap-3 mb-3">
                          <span className="flex-shrink-0 w-11 h-11 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3
                            className="font-serif text-2xl text-ink leading-tight flex-1"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {f.title}
                          </h3>
                        </header>
                        <p className="text-base text-ink leading-relaxed">
                          {f.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How it works */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    SLIK FUNKER DET
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    OPPRETT · SELG · SKANN
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {STEPS.map((s, i) => {
                    const Icon = s.Icon;
                    return (
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
                            className="font-serif text-2xl lg:text-3xl text-ink inline-flex items-center gap-3"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            <Icon
                              className="h-6 w-6 text-accent-text"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            {s.title}
                          </h3>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                          <p className="text-base lg:text-lg text-ink leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* FAQ */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    OFTE STILTE SPØRSMÅL
                  </h2>
                </div>
                <dl className="divide-y divide-rule border-b border-rule">
                  {FAQ.map((q, i) => (
                    <div key={i} className="py-6 grid lg:grid-cols-12 gap-4">
                      <dt className="lg:col-span-5 font-serif text-xl text-ink leading-tight">
                        {q.question}
                      </dt>
                      <dd className="lg:col-span-7 text-base text-ink leading-relaxed">
                        {q.answer}
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
                      Klar til å selge billetter?
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Book en demo, så viser vi hvordan billetter, rabattkoder, kuponger
                      og gavekort settes opp for ditt arrangement, med booking av lokalet
                      i samme plattform.
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
}
