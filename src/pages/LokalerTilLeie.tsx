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
  Byline,
  PullQuote,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";

const UPDATED = "23. juli 2026";

const HOWTO_STEPS = [
  {
    name: "Bestem arrangementstype og antall gjester",
    text: "Kapasiteten avgjør mye. Et intimt selskap på 20 personer og et bryllup på 120 krever helt ulike lokaler. Tell gjester før du leter, så slipper du å vurdere lokaler som er for små eller unødvendig dyre.",
  },
  {
    name: "Sett dato – og vær tidlig ute i høysesong",
    text: "Lørdager i mai, juni, august og september er de mest ettertraktede. Har du fleksible datoer, får du flere valg og ofte lavere pris på hverdager og utenfor høysesong.",
  },
  {
    name: "Søk på lokaltype, geografi og fasiliteter",
    text: "Filtrer på det som faktisk betyr noe for deg: kapasitet, kjøkken, parkering, universell utforming, uteområde eller AV-utstyr. Da står du igjen med lokaler som passer, ikke bare lokaler som er ledige.",
  },
  {
    name: "Sammenlign pris, kapasitet og tilleggstjenester",
    text: "Se på totalprisen, ikke bare grunnleien: rengjøring, utstyr, bemanning og catering kan komme i tillegg. På Digilist vises tilleggstjenester som egne linjer, så du ser hva sluttsummen faktisk blir.",
  },
  {
    name: "Sjekk sanntidskalenderen for ledige datoer",
    text: "En sanntidskalender viser med én gang om datoen din er ledig, opptatt eller blokkert – i stedet for at du sender e-post og venter på svar som kanskje kommer for sent.",
  },
  {
    name: "Book og betal direkte",
    text: "Bekreft bookingen, betal med Vipps eller kort, og få bekreftelse og kvittering automatisk. Da er datoen sikret, og du unngår at lokalet blir booket av noen andre mens du venter.",
  },
];

const GUIDANCE = [
  { type: "Selskapslokale / festlokale", cap: "30–150 gjester", price: "5 000–30 000 kr / dag" },
  { type: "Grendehus / foreningslokale", cap: "40–120 gjester", price: "1 000–5 000 kr / dag" },
  { type: "Møterom", cap: "4–20 personer", price: "300–2 500 kr / dag" },
  { type: "Konferanselokale", cap: "20–200 personer", price: "2 000–15 000 kr / dag" },
  { type: "Kulturhus / storsal", cap: "50–400 personer", price: "3 000–20 000 kr / arr." },
  { type: "Idrettshall", cap: "Lag / grupper", price: "200–1 500 kr / time" },
];

const FAQ = [
  {
    question: "Hvor finner jeg lokaler til leie?",
    answer:
      "Du finner lokaler til leie på bookingplattformer som viser ledige tider i sanntid. På Digilist søker du på lokaltype, geografi og fasiliteter, ser hva som er ledig på datoen din, og booker direkte – uten å sende e-poster og vente på svar. Plattformen samler både private utleielokaler og offentlige/kommunale lokaler ett sted.",
  },
  {
    question: "Hva slags lokaler kan jeg leie?",
    answer:
      "Du kan leie selskapslokaler og festlokaler, møterom og konferanselokaler, kontorlokaler og coworking, kulturhus og grendehus, idrettshaller, svømmehaller og gårder. På Digilist er både private og kommunale lokaler samlet, slik at du kan sammenligne på ett sted i stedet for å lete på mange nettsider.",
  },
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med lokaltype, kapasitet, ukedag og sesong. Som en grov pekepinn ligger grendehus og foreningslokaler ofte på 1 000–5 000 kr per dag, mens selskapslokaler til større fester kan koste 5 000–30 000 kr eller mer, og møterom fra noen hundre kroner. Lørdager i høysesong koster mer enn hverdager. Se alltid prisen på det enkelte lokalet før du bekrefter bookingen.",
  },
  {
    question: "Hvor tidlig bør jeg booke et lokale?",
    answer:
      "Det kommer an på arrangementet. Populære selskaps- og festlokaler til bryllup og store fester bookes ofte 6–12 måneder i forveien, særlig for lørdager i mai–september. Møterom og mindre lokaler kan gjerne bookes med noen dagers eller ukers varsel. Med sanntidskalender ser du umiddelbart om datoen din er ledig.",
  },
  {
    question: "Hvordan booker jeg et lokale på nett?",
    answer:
      "Du finner lokalet, velger en ledig dato i sanntidskalenderen, legger til eventuelle tilleggstjenester, og bekrefter. Betaling skjer med Vipps eller kort, og du får bekreftelse og kvittering automatisk. Fordi kalenderen er i sanntid, vet du med én gang om lokalet faktisk er ledig.",
  },
  {
    question: "Kan jeg leie både private og kommunale lokaler?",
    answer:
      "Ja. Digilist samler private utleielokaler og offentlige/kommunale lokaler i samme kalender. Mange grendehus, kulturhus og kommunale lokaler leies ut til private arrangementer, og du kan sammenligne dem side om side med private festlokaler på ett sted.",
  },
];

const LOKALTYPER = [
  { label: "Selskapslokale", desc: "Bryllup, fest og feiring", to: "/leie/selskapslokale" },
  { label: "Møterom", desc: "Møter og workshops", to: "/leie/moterom" },
  { label: "Konferanselokale", desc: "Seminarer og konferanser", to: "/leie/konferanselokale" },
  { label: "Kontorlokaler", desc: "Fast eller fleksibelt kontor", to: "/leie/kontorlokaler" },
  { label: "Coworking", desc: "Delt arbeidsplass", to: "/leie/coworking" },
  { label: "Kulturhus", desc: "Kultur og arrangement", to: "/leie/kulturhus" },
  { label: "Idrettshall", desc: "Trening og aktivitet", to: "/leie/idrettshall" },
  { label: "Hall", desc: "Idretts- og aktivitetshall", to: "/leie/hall" },
  { label: "Gård", desc: "Landlig ramme for fest", to: "/leie/gaard" },
  { label: "Bursdagslokale", desc: "Barnebursdag og feiring", to: "/leie/bursdagslokale" },
  { label: "Svømmehall", desc: "Svømming og vannaktivitet", to: "/leie/svommehall" },
  { label: "Alle lokaltyper", desc: "Se hele oversikten", to: "/leie" },
];

const BYER = [
  { label: "Lokaler til leie i Oslo", to: "/lokaler-til-leie/oslo" },
  { label: "Lokaler til leie i Bergen", to: "/lokaler-til-leie/bergen" },
  { label: "Lokaler til leie i Trondheim", to: "/lokaler-til-leie/trondheim" },
];

const LokalerTilLeie = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Lokaler til leie — finn og book ledig lokale på nett | Digilist"
        description="Lokaler til leie: finn ledige selskapslokaler, møterom, kulturhus og haller i sanntid. Sammenlign private og kommunale lokaler, se pris, kapasitet og book direkte på Digilist."
        keywords="lokaler til leie, lokale til leie, leie lokaler, leie lokale, finn lokale til leie, lokale til leie på nett, leie lokale pris"
        canonical="https://digilist.no/lokaler-til-leie"
        ogImage="https://digilist.no/og-image.png"
        ogType="article"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Lokaler til leie", url: "https://digilist.no/lokaler-til-leie" },
        ]}
        howTo={{
          name: "Slik finner og velger du et lokale til leie",
          description:
            "Seks steg for å finne, sammenligne og booke riktig lokale til arrangementet ditt.",
          steps: HOWTO_STEPS.map((s) => ({ name: s.name, text: s.text })),
        }}
        article={{
          headline: "Lokaler til leie: slik finner, sammenligner og booker du",
          description:
            "En praktisk guide til å finne lokaler til leie i Norge: lokaltyper, kapasitet, prisintervaller, når du bør booke, og hvordan du booker på nett.",
          datePublished: "2026-07-23",
          dateModified: "2026-07-23",
          author: "Ibrahim Rahmani",
          authorRole: "Grunnlegger, Digilist",
          articleSection: "Lokaler til leie",
          keywords: ["lokaler til leie", "leie lokale", "booke lokale"],
        }}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="LOKALER TIL LEIE · 2026" />
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Lokaler{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    til leie
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-6">
                  Du finner lokaler til leie ved å søke i sanntid på Digilist – en
                  norsk bookingplattform der{" "}
                  <strong className="text-ink">både private og kommunale lokaler</strong>{" "}
                  ligger samlet. Se hva som er ledig på datoen din, sammenlign pris og
                  kapasitet, og book direkte, uten en runde med e-post og telefon.
                </p>
                <Byline author="Ibrahim Rahmani" role="Grunnlegger, Digilist" date={`Sist oppdatert ${UPDATED}`} className="mb-10" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Finn ledig lokale
                  </EditorialButton>
                  <EditorialButton variant="outline" size="lg" icon={false} href="/leie">
                    Se lokaltyper
                  </EditorialButton>
                </div>
              </div>
              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    For leietakere
                  </h2>
                  <SpecRow label="Marked" value="Privat · offentlig" />
                  <SpecRow label="Lokaltyper" value="11+" />
                  <SpecRow label="Tilgjengelighet" value="Sanntid" />
                  <SpecRow label="Betaling" value="Vipps · kort" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="I. SLIK FINNER OG VELGER DU LOKALE" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Seks steg til riktig{" "}
                  <em className="italic">lokale</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Fra antall gjester til bekreftet booking – uten e-postjakt.
                </p>
              </div>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
              {HOWTO_STEPS.map((s, i) => (
                <li key={s.name} className="bg-paper p-6 lg:p-8 flex flex-col gap-2">
                  <span className="editorial-mono-caption text-accent-text">
                    Steg {i + 1}
                  </span>
                  <h3
                    className="font-serif text-xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {s.name}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="II. KAPASITET OG PRIS" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Hva slags lokale –{" "}
                  <em className="italic">og hva koster det</em>?
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Grove intervaller som pekepinn – se alltid prisen på det enkelte lokalet.
                </p>
              </div>
            </div>
            <div className="overflow-x-auto border border-rule">
              <table className="w-full text-left border-collapse min-w-[520px]">
                <thead>
                  <tr className="bg-paper-tinted border-b border-rule">
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Lokaltype</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk kapasitet</th>
                    <th className="p-4 editorial-mono-caption font-normal text-ink-soft">Typisk prisintervall</th>
                  </tr>
                </thead>
                <tbody>
                  {GUIDANCE.map((g) => (
                    <tr key={g.type} className="border-b border-rule last:border-0">
                      <td className="p-4 text-base text-ink">{g.type}</td>
                      <td className="p-4 text-base text-ink-soft">{g.cap}</td>
                      <td className="p-4 text-base text-ink-soft">{g.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-ink-soft measure">
              Prisene varierer mye med kapasitet, ukedag, sesong og geografi, og er ment
              som en grov pekepinn – ikke et tilbud. Grendehus og foreningslokaler ligger
              typisk lavere enn hotell- og restaurantlokaler, og lørdager i høysesong
              koster mer enn hverdager. Prisen på det enkelte lokalet vises alltid før du
              bekrefter bookingen på Digilist.
            </p>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <PullQuote>
              Rundt 20 000 par gifter seg i Norge hvert år (SSB), og populære festlokaler
              bookes ofte 6–12 måneder i forveien. Er du ute i god tid, har du langt flere
              lokaler å velge mellom – og bedre priser på hverdager og utenfor høysesong.
            </PullQuote>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="III. LOKALTYPER DU KAN LEIE" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Hva vil du{" "}
                  <em className="italic">leie</em>?
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Fra selskapslokaler og møterom til kulturhus, haller og gårder.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {LOKALTYPER.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  className="group bg-paper p-6 flex items-start justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span>
                    <span className="block text-base text-ink group-hover:text-accent-text">
                      {t.label}
                    </span>
                    <span className="block text-sm text-ink-soft mt-1">{t.desc}</span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 mt-1 text-ink-soft group-hover:text-accent-text group-hover:translate-x-0.5 transition-all"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="IV. LOKALER TIL LEIE ETTER BY" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Finn lokaler i{" "}
                  <em className="italic">din by</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Lokale oversikter over hva du kan leie i de største byene.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule">
              {BYER.map((b) => (
                <Link
                  key={b.to}
                  to={b.to}
                  className="group bg-paper p-6 flex items-center justify-between gap-3 hover:bg-accent-tinted transition-colors"
                >
                  <span className="text-base text-ink group-hover:text-accent-text">
                    {b.label}
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

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="V. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål om lokaler til leie.
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
              Er du utleier? Se{" "}
              <Link
                to="/bookingsystem-utleie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                bookingsystem for utleie
              </Link>{" "}
              eller gå til{" "}
              <Link
                to="/leie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                oversikten over lokaltyper
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LokalerTilLeie;
