import { Link } from "react-router-dom";
import {
  GlassWater,
  Users2,
  Trophy,
  Theater,
  ArrowUpRight,
  Search,
  CalendarCheck,
  Wallet,
  Warehouse,
  Cake,
  Presentation,
  Building2,
  Laptop,
  Dumbbell,
  Waves,
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
import { CategoryVisual, imageForSlug } from "@/components/CategoryVisual";

const APP = "https://app.digilist.no";

// The hub links to a deep guide per category (/leie/<slug>). Each guide is an
// SEO landing page that funnels to the live platform via its own "finn ledig"
// CTA. Grouping mirrors the three ways people search: feiring, arbeid, aktivitet.
const CATEGORY_GROUPS = [
  {
    label: "FEST & FEIRING",
    meta: "SELSKAP · BRYLLUP · BURSDAG",
    items: [
      {
        title: "Selskapslokale",
        Icon: GlassWater,
        to: "/leie/selskapslokale",
        body: "Bryllup, jubileum, konfirmasjon og fest. Ekte pris for din dato, depositum og vilkår synlig før du booker.",
      },
      {
        title: "Gård og låve",
        Icon: Warehouse,
        to: "/leie/gaard",
        body: "Gårdsbryllup, sommerfest på tunet eller firmatur på landet. Låver og gårdstun med pris og ledig helg synlig.",
      },
      {
        title: "Bursdagslokale",
        Icon: Cake,
        to: "/leie/bursdagslokale",
        body: "Barnebursdag eller runde år. Festrom, grendehus og aktivitetslokaler med kjøkken, bookbart med Vipps.",
      },
      {
        title: "Kulturhus og grendehus",
        Icon: Theater,
        to: "/leie/kulturhus",
        body: "Konsert, forestilling eller storselskap. Kulturhus, samfunnshus og grendehus med scene og kapasitet oppgitt.",
      },
    ],
  },
  {
    label: "MØTE & ARBEID",
    meta: "MØTE · KONFERANSE · KONTOR",
    items: [
      {
        title: "Møterom",
        Icon: Users2,
        to: "/leie/moterom",
        body: "Møte, workshop eller kurs, per time. Kommunale rom, næringsbygg og private, med pris per time synlig.",
      },
      {
        title: "Konferanselokale",
        Icon: Presentation,
        to: "/leie/konferanselokale",
        body: "Seminar, kurs eller fagdag. Plenumssal og grupperom med kapasitet, AV og servering oppgitt.",
      },
      {
        title: "Kontorlokaler",
        Icon: Building2,
        to: "/leie/kontorlokaler",
        body: "Privat kontor på fleksibel leie. Cellekontor og teamkontor med pris, felleskostnader og ledig fra-dato.",
      },
      {
        title: "Coworking",
        Icon: Laptop,
        to: "/leie/coworking",
        body: "Dagplass eller hot desk uten medlemskap. Kontorfellesskap med dagspris og ledige plasser synlig.",
      },
    ],
  },
  {
    label: "IDRETT & AKTIVITET",
    meta: "HALL · PADEL · SVØMMING",
    items: [
      {
        title: "Idrettshall",
        Icon: Trophy,
        to: "/leie/idrettshall",
        body: "Trening, turnering eller bursdag i gymsalen. Ledige enkelttimer i hallene, bookbart uten søknad.",
      },
      {
        title: "Padelbane",
        Icon: Dumbbell,
        to: "/leie/padelbane",
        body: "Book padelbane per time. Ledige tider i sanntid på tvers av anlegg, med utstyrsleie og Vipps.",
      },
      {
        title: "Svømmehall",
        Icon: Waves,
        to: "/leie/svommehall",
        body: "Basseng til bursdag, svømmegruppe eller kurs. Ledige tider utenom klubbtidene, med pris og regler synlig.",
      },
    ],
  },
];

const STEPS = [
  {
    step: "01",
    Icon: Search,
    title: "Finn",
    body: "Søk på sted og dato. Du ser grendehus, kulturhus og private selskapslokaler i nærområdet, med ekte priser og hva som faktisk er ledig.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Book",
    body: "Velg ledig tid og book direkte, ingen uforpliktende forespørsel og ingen dager med e-post fram og tilbake. Vilkår, depositum og kapasitet er synlig før du bekrefter.",
  },
  {
    step: "03",
    Icon: Wallet,
    title: "Betal med Vipps",
    body: "Betal trygt med Vipps eller kort. Bekreftelse og kvittering kommer med en gang. Ingen bankoverføring til en fremmed, ingen usikkerhet.",
  },
];

const FAQ = [
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med type lokale, sted og varighet. Et grendehus kan koste noen hundre til noen tusen kroner for en helg, mens et kulturhus eller selskapslokale ligger høyere. På Digilist ser du den faktiske totalprisen for din dato, inkludert eventuelt depositum og rengjøring, før du booker, så du slipper å gjette.",
  },
  {
    question: "Kan jeg se ledige datoer og booke på nett?",
    answer:
      "Ja. Du søker på sted og dato, ser hva som faktisk er ledig i sanntid, og booker direkte. Ingen uforpliktende forespørsel og ingen venting på svar, du får bekreftelsen med en gang.",
  },
  {
    question: "Hvordan betaler jeg?",
    answer:
      "Du betaler trygt med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt med automatisk frigjøring etter arrangementet. Ingen bankoverføring til en fremmed.",
  },
  {
    question: "Hva slags lokaler finner jeg?",
    answer:
      "Selskapslokaler, møterom, idrettshaller og gymsaler, kulturhus, samfunnshus og grendehus, både kommunale og private. Digilist samler lokalene der du bor på ett sted, så du slipper å lete gjennom kommunens sider, Finn-annonser og Facebook-grupper hver for seg.",
  },
  {
    question: "Er det gratis å bruke Digilist?",
    answer:
      "Ja, det er gratis å søke, sammenligne og booke som privatperson. Du betaler kun leieprisen til utleier. Depositum og eventuelle tilleggstjenester vises tydelig før du bekrefter.",
  },
  {
    question: "Kan jeg avbestille?",
    answer:
      "Avbestillingsvilkårene settes av utleier og vises tydelig på hvert lokale før du booker. Der det er tillatt, kan du avbestille digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for lokalet.",
  },
];

const Leie = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Finn og book lokale — selskapslokale, møterom, kulturhus | Digilist"
        description="Finn og book lokale til bryllup, selskap, møte eller arrangement. Grendehus, kulturhus og selskapslokaler samlet ett sted, med ekte priser, ledige datoer og betaling med Vipps."
        keywords="leie lokale, finn lokale, leie selskapslokale, leie møterom, leie festlokale, leie lokale til bursdag, hva koster selskapslokale, book lokale online, leie kulturhus, leie grendehus"
        canonical="https://digilist.no/leie"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Leie", url: "https://digilist.no/leie" },
        ]}
        faq={FAQ}
        service
        howTo={{
          name: "Slik finner og booker du lokale",
          description: "Finn, book og betal med Vipps på tre steg via Digilist.",
          steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="FINN LOKALE" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Finn og book lokale til festen,{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      der du bor
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Grendehus, kulturhus og selskapslokaler samlet på ett sted. Ekte priser,
                    ledige datoer og trygg betaling med Vipps, ingen forespørsler og ingen
                    venting. Slutt med å lete gjennom kommunens sider, Finn-annonser og
                    Facebook-grupper hver for seg.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Finn ledig lokale
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="#slik">
                      Slik funker det
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={GlassWater}
                    label="DIGILIST · LOKALER"
                    src="/images/cat/selskapslokale.jpg"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>

              {/* Explainer video */}
              <div className="mb-14 lg:mb-20">
                <VideoPlaceholder
                  label="Reklamefilm · Finn lokale"
                  caption="Kort film om hvordan du finner og booker lokale"
                />
              </div>

              {/* Categories */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-8 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    HVA VIL DU LEIE?
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    FEIRING · ARBEID · AKTIVITET
                  </span>
                </div>
                <div className="space-y-10 lg:space-y-14">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.label}>
                      <div className="flex items-baseline justify-between mb-4">
                        <h3 className="editorial-mono-caption text-ink">{group.label}</h3>
                        <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                          {group.meta}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                        {group.items.map((c) => {
                          const Icon = c.Icon;
                          const photo = imageForSlug(
                            c.to.split("/").filter(Boolean).pop() ?? "",
                          );
                          return (
                            <Link
                              key={c.title}
                              to={c.to}
                              className="group bg-paper border border-rule rounded-lg overflow-hidden flex flex-col shadow-sm transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-xl hover:border-accent-text/40"
                            >
                              <div
                                className="relative w-full overflow-hidden bg-paper-deep"
                                style={{ aspectRatio: "16 / 9" }}
                              >
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <CategoryVisual
                                    icon={Icon}
                                    aspect="16 / 9"
                                    variant="texture"
                                    className="!border-0 !rounded-none"
                                  />
                                )}
                                <div
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/0 to-ink/0"
                                />
                                <span className="absolute left-4 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-paper/90 backdrop-blur-sm border border-hairline-strong text-navy shadow-sm transition-transform duration-quick ease-editorial group-hover:-translate-y-0.5">
                                  <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="p-6 lg:p-7 flex flex-col flex-1">
                                <header className="flex items-center gap-3 mb-2">
                                  <h4
                                    className="font-serif text-2xl text-ink leading-tight flex-1"
                                    style={{
                                      fontVariationSettings: getFraunces("sub"),
                                      letterSpacing: "-0.015em",
                                    }}
                                  >
                                    {c.title}
                                  </h4>
                                  <ArrowUpRight
                                    className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                </header>
                                <p className="text-base text-ink leading-relaxed flex-1">
                                  {c.body}
                                </p>
                                <p className="mt-4 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                                  Les mer
                                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div id="slik" className="mb-14 lg:mb-20 scroll-mt-28">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    SLIK BOOKER DU
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    FINN · BOOK · BETAL MED VIPPS
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
                            <Icon className="h-6 w-6 text-accent-text" strokeWidth={1.5} aria-hidden="true" />
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
                      Klar til å finne lokalet?
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Søk blant lokaler i nærområdet, se ekte priser og ledige datoer, og
                      book på minutter med Vipps.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Finn ledig lokale
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

export default Leie;
