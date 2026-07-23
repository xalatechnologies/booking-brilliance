import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  Byline,
  PullQuote,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const UPDATED = "24. juli 2026";
const AUTHOR = "Ibrahim Rahmani";
const AUTHOR_ROLE = "Grunnlegger, Digilist";

// Søkeetterspørsel (DataForSEO Labs, Norge, søk/mnd). KD lav (0–12) for hode/geo.
const SEARCH_DEMAND = [
  { term: "lokaler til leie", vol: 1600, kd: 3 },
  { term: "lokale til leie", vol: 1600, kd: 10 },
  { term: "lokaler til leie oslo", vol: 880, kd: 0 },
  { term: "leie lokale oslo", vol: 480, kd: 0 },
  { term: "lokaler til leie bergen", vol: 260, kd: 0 },
  { term: "lokaler til leie trondheim", vol: 260, kd: 6 },
  { term: "leie selskapslokale", vol: 70, kd: 0 },
  { term: "leie festlokale", vol: 70, kd: 0 },
  { term: "bookingsystem utleie", vol: 20, kd: 0 },
  { term: "selskapslokale bryllup", vol: 20, kd: 12 },
];

// Prisintervaller pr dag (kategori-pekepinner, «varierer»). Idrettshall pr time.
const PRICES = [
  { type: "Kulturhus / storsal", lo: 3000, hi: 20000, unit: "kr / arr." },
  { type: "Selskapslokale / festlokale", lo: 5000, hi: 30000, unit: "kr / dag" },
  { type: "Konferanselokale", lo: 2000, hi: 15000, unit: "kr / dag" },
  { type: "Grendehus / foreningslokale", lo: 1000, hi: 5000, unit: "kr / dag" },
  { type: "Møterom", lo: 300, hi: 2500, unit: "kr / dag" },
  { type: "Idrettshall", lo: 200, hi: 1500, unit: "kr / time" },
];

// SSB – livshendelser som driver privat lokalleie.
const LIFE_EVENTS = [
  { label: "Fødte / år (dåp-marked)", value: "~50 000", src: "SSB" },
  { label: "Gravferder / år (minnestund)", value: "~44 000", src: "SSB" },
  { label: "Bryllup / år", value: "~20 000", src: "SSB" },
];

const FAQ = [
  {
    question: "Hvor stort er utleiemarkedet for lokaler i Norge?",
    answer:
      "Etterspørselen er betydelig og fragmentert. Alene på søkeordene for «lokaler til leie» og geografiske varianter finnes over 5 000 søk i måneden i Google Norge (DataForSEO), i tillegg til livshendelser som driver privat leie: SSB rapporterer ~20 000 bryllup, ~44 000 gravferder og ~50 000 fødte i året.",
  },
  {
    question: "Hva koster det å leie lokale i Norge?",
    answer:
      "Prisen varierer med lokaltype, kapasitet, ukedag og sesong. Veiledende intervaller pr dag: møterom 300–2 500 kr, grendehus 1 000–5 000 kr, konferanselokale 2 000–15 000 kr, kulturhus 3 000–20 000 kr og selskapslokale 5 000–30 000 kr. Idrettshall ligger typisk 200–1 500 kr pr time. Dette er pekepinner, ikke tilbud.",
  },
  {
    question: "Når bør man booke et festlokale?",
    answer:
      "Populære selskaps- og festlokaler til lørdager i høysesong (mai–september) bookes ofte 6–12 måneder i forveien. Med fleksible datoer – hverdager eller utenfor høysesong – er utvalget større og prisen lavere.",
  },
  {
    question: "Hvorfor er markedet så fragmentert?",
    answer:
      "Tilbudet er spredt over kommunale bookingsider, katalogsider og enkeltstående booking-SaaS, og en stor del av utleien skjer fortsatt via e-post og telefon uten sanntids tilgjengelighet. Det gjør det tidkrevende å finne og booke ledige lokaler på tvers.",
  },
];

const maxVol = Math.max(...SEARCH_DEMAND.map((d) => d.vol));
const maxPrice = Math.max(...PRICES.map((p) => p.hi));

/** Enkelt inline-SVG horisontalt søylediagram (rendres i statisk HTML). */
function DemandChart() {
  const rowH = 34;
  const h = SEARCH_DEMAND.length * rowH + 12;
  const labelW = 210;
  const barMax = 460;
  return (
    <svg
      viewBox={`0 0 ${labelW + barMax + 70} ${h}`}
      role="img"
      aria-label="Søkeetterspørsel per måned for utleie-relaterte søkeord i Norge"
      style={{ width: "100%", height: "auto" }}
    >
      {SEARCH_DEMAND.map((d, i) => {
        const y = i * rowH + 6;
        const w = Math.max(3, (d.vol / maxVol) * barMax);
        return (
          <g key={d.term}>
            <text x={labelW - 8} y={y + 15} textAnchor="end" fontSize="12.5" fill="currentColor" opacity="0.85">
              {d.term}
            </text>
            <rect x={labelW} y={y + 4} width={w} height={16} rx="3" fill="currentColor" opacity={0.72} />
            <text x={labelW + w + 6} y={y + 16} fontSize="12" fill="currentColor" opacity="0.9" fontVariantNumeric="tabular-nums">
              {d.vol.toLocaleString("nb-NO")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Inline-SVG prisintervaller (min–maks pr lokaltype), log-lignende lineær skala. */
function PriceChart() {
  const rowH = 40;
  const h = PRICES.length * rowH + 12;
  const labelW = 230;
  const barMax = 430;
  return (
    <svg
      viewBox={`0 0 ${labelW + barMax + 40} ${h}`}
      role="img"
      aria-label="Veiledende prisintervaller for å leie ulike lokaltyper i Norge"
      style={{ width: "100%", height: "auto" }}
    >
      {PRICES.map((p, i) => {
        const y = i * rowH + 6;
        const x0 = labelW + (p.lo / maxPrice) * barMax;
        const x1 = labelW + (p.hi / maxPrice) * barMax;
        return (
          <g key={p.type}>
            <text x={labelW - 8} y={y + 14} textAnchor="end" fontSize="12.5" fill="currentColor" opacity="0.85">
              {p.type}
            </text>
            <line x1={x0} y1={y + 10} x2={x1} y2={y + 10} stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity={0.72} />
            <text x={labelW} y={y + 30} fontSize="11.5" fill="currentColor" opacity="0.8" fontVariantNumeric="tabular-nums">
              {p.lo.toLocaleString("nb-NO")}–{p.hi.toLocaleString("nb-NO")} {p.unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function UtleiemarkedetNorge2026() {
  const totalDemand = SEARCH_DEMAND.reduce((s, d) => s + d.vol, 0);
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Utleiemarkedet i Norge 2026 – data, priser og etterspørsel | Digilist"
        description="Datastudie om det norske utleiemarkedet for lokaler i 2026: søkeetterspørsel (DataForSEO), veiledende priser, sesong og bookingatferd, og det digitale gapet mellom e-post og sanntidsbooking. Frie tall og grafer for journalister og bransjen."
        keywords="utleiemarkedet norge, lokaler til leie statistikk, leiepriser lokale, utleie marked 2026, bookingsystem marked, selskapslokale marked, datastudie utleie"
        canonical="https://digilist.no/rapport/utleiemarkedet-norge-2026"
        ogType="article"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Rapport", url: "https://digilist.no/rapport/utleiemarkedet-norge-2026" },
        ]}
        faq={FAQ}
        article={{
          headline: "Utleiemarkedet i Norge 2026",
          description:
            "Datastudie om det norske utleiemarkedet for lokaler: etterspørsel, priser, sesong og det digitale gapet.",
          datePublished: "2026-07-24",
          dateModified: "2026-07-24",
          author: AUTHOR,
          authorRole: AUTHOR_ROLE,
          articleSection: "Rapport",
          keywords: ["utleiemarkedet", "lokaler til leie", "leiepriser", "bookingsystem"],
        }}
      />
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-28 md:pt-32">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Rapport · Datastudie 2026
        </p>
        <EditorialHeading as="h1" size="hero" style={{ fontVariationSettings: getFraunces("hero") }}>
          Utleiemarkedet i Norge 2026
        </EditorialHeading>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          En datadrevet gjennomgang av det norske markedet for å leie lokaler: hvor
          stor etterspørselen er, hva det koster, når folk booker – og det digitale
          gapet mellom e-post og sanntidsbooking som fortsatt preger bransjen.
        </p>
        <Byline author={AUTHOR} role={AUTHOR_ROLE} date={`Oppdatert ${UPDATED}`} className="mt-6" />
        <p className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <strong className="text-foreground">For journalister og bransjen:</strong>{" "}
          Alle tall og grafer er frie å sitere med kildehenvisning til Digilist
          (digilist.no) og de oppgitte primærkildene (DataForSEO, SSB). Ta kontakt for
          høyoppløste grafer eller utdypende tall.
        </p>

        <SectionRule className="my-12" />

        {/* Sammendrag */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            Kort oppsummert
          </EditorialHeading>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <EditorialCard className="p-5">
              <div className="font-mono text-3xl font-bold text-primary tabular-nums">
                {totalDemand.toLocaleString("nb-NO")}+
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                søk i måneden på «lokaler til leie» og nære varianter (DataForSEO, Norge).
              </p>
            </EditorialCard>
            <EditorialCard className="p-5">
              <div className="font-mono text-3xl font-bold text-primary tabular-nums">0–12</div>
              <p className="mt-1 text-sm text-muted-foreground">
                søkeordvanskelighet (KD) på hode- og geo-ordene – lav konkurranse, ledig terreng.
              </p>
            </EditorialCard>
            <EditorialCard className="p-5">
              <div className="font-mono text-3xl font-bold text-primary tabular-nums">6–12</div>
              <p className="mt-1 text-sm text-muted-foreground">
                måneder i forveien bookes populære festlokaler til lørdager i høysesong.
              </p>
            </EditorialCard>
          </div>
        </section>

        <SectionRule className="my-12" />

        {/* Etterspørsel */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            1. Søkeetterspørselen er stor – og lite dekket
          </EditorialHeading>
          <p className="mt-4 text-muted-foreground">
            Nordmenn søker aktivt etter lokaler å leie. De brede hodeordene «lokaler til
            leie» og «lokale til leie» har hver rundt 1 600 søk i måneden, og geografiske
            varianter som «lokaler til leie oslo» ligger på flere hundre. Det som er
            påfallende er hvor <strong className="text-foreground">lav konkurransen</strong>{" "}
            er: søkeordvanskeligheten (KD) på disse ordene ligger på 0–12 av 100.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-5 text-card-foreground">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Søk per måned · Google Norge · Kilde: DataForSEO Labs
            </p>
            <DemandChart />
          </div>
        </section>

        <SectionRule className="my-12" />

        {/* Pris */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            2. Prisbildet: fra grendehus til storsal
          </EditorialHeading>
          <p className="mt-4 text-muted-foreground">
            Prisene spenner vidt. Et grendehus kan koste noen tusenlapper for en hel dag,
            mens et sentralt selskapslokale til bryllup fort passerer 20 000 kr. Under er
            veiledende intervaller pr dag – faktisk pris varierer med kapasitet, beliggenhet,
            ukedag og sesong.
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-5 text-card-foreground">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Veiledende prisintervall pr lokaltype · pekepinner, ikke tilbud
            </p>
            <PriceChart />
          </div>
        </section>

        <SectionRule className="my-12" />

        {/* Sesong + livshendelser */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            3. Sesong og livshendelser driver etterspørselen
          </EditorialHeading>
          <p className="mt-4 text-muted-foreground">
            Store deler av privatmarkedet følger livshendelser og kalender. Lørdager i
            mai–september er høysesong for bryllup og fester, og de mest ettertraktede
            lokalene bookes 6–12 måneder i forveien. SSB gir et bilde av volumet bak
            etterspørselen:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {LIFE_EVENTS.map((e) => (
              <EditorialCard key={e.label} className="p-5">
                <div className="font-mono text-2xl font-bold text-primary tabular-nums">{e.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{e.label}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground/70">Kilde: {e.src}</p>
              </EditorialCard>
            ))}
          </div>
        </section>

        <SectionRule className="my-12" />

        {/* Det digitale gapet */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            4. Det digitale gapet: e-post vs sanntid
          </EditorialHeading>
          <p className="mt-4 text-muted-foreground">
            Markedet er fragmentert. Etterspørselen dekkes i dag av tre atskilte kanaler –
            kommunale bookingsider, katalogsider som selskapslokaler.no, og enkeltstående
            booking-SaaS som Sharefox og Gibbs. Under alt dette skjer fortsatt en stor del
            av utleien via e-post og telefon, uten at kunden ser ledige datoer i sanntid.
          </p>
          <PullQuote className="my-8">
            Den som skal leie et lokale, må ofte kontakte flere utleiere og vente på svar –
            i stedet for å se hva som faktisk er ledig på datoen sin, med én gang.
          </PullQuote>
          <p className="text-muted-foreground">
            Det er dette gapet Digilist adresserer ved å samle private og offentlige lokaler
            i én sanntidskalender med direkte booking og betaling. For markedet som helhet
            betyr lav søkekonkurranse og et umodent digitalt tilbud at det er reell plass for
            en samlende, søkbar løsning.
          </p>
        </section>

        <SectionRule className="my-12" />

        {/* Metode + kilder */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            Metode og kilder
          </EditorialHeading>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Søkeetterspørsel og vanskelighet:</strong>{" "}
              DataForSEO Labs, Google Norge, månedlige søkevolum og keyword difficulty (KD),
              hentet juli 2026.
            </li>
            <li>
              <strong className="text-foreground">Livshendelser:</strong> Statistisk
              sentralbyrå (SSB) – årlige tall for fødte, ekteskap og dødsfall, avrundet.
            </li>
            <li>
              <strong className="text-foreground">Priser og kapasitet:</strong> veiledende
              kategori-intervaller basert på typiske tall i det norske utleiemarkedet.
              Oppgitt som pekepinner, ikke bindende priser eller tilbud.
            </li>
            <li>
              <strong className="text-foreground">Markedsstruktur:</strong> observert tilbud
              på tvers av kommunale bookingløsninger, katalogsider og booking-SaaS.
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Tallene er ment som et ærlig øyeblikksbilde. Estimater er merket som estimater,
            og vi har utelatt tall vi ikke kan kildebelegge fremfor å anslå dem.
          </p>
          <Byline author={AUTHOR} role={AUTHOR_ROLE} date={`Publisert ${UPDATED}`} className="mt-6" />
        </section>

        <SectionRule className="my-12" />

        {/* FAQ */}
        <section>
          <EditorialHeading as="h2" size="section" style={{ fontVariationSettings: getFraunces("section") }}>
            Ofte stilte spørsmål
          </EditorialHeading>
          <dl className="mt-5 space-y-5">
            {FAQ.map((f) => (
              <div key={f.question}>
                <dt className="font-semibold text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <SectionRule className="my-12" />

        {/* Videre lesning + CTA */}
        <section>
          <EditorialHeading as="h2" size="sub" style={{ fontVariationSettings: getFraunces("sub") }}>
            Utforsk markedet videre
          </EditorialHeading>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/bookingsystem-utleie" className="text-primary underline underline-offset-4">Bookingsystem for utleie</Link>
            <Link to="/lokaler-til-leie" className="text-primary underline underline-offset-4">Lokaler til leie</Link>
            <Link to="/verktoy/leiepriskalkulator" className="text-primary underline underline-offset-4">Leiepriskalkulator</Link>
            <Link to="/verktoy/kapasitetskalkulator" className="text-primary underline underline-offset-4">Kapasitetskalkulator</Link>
            <Link to="/lokaler-til-leie/oslo" className="text-primary underline underline-offset-4">Lokaler i Oslo</Link>
          </div>
          <div className="mt-8">
            <EditorialButton href="/book-demo">Se Digilist i praksis</EditorialButton>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
