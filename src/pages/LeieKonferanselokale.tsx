import UseCasePage from "@/components/UseCasePage";

export default function LeieKonferanselokale() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="konferanselokale"
      breadcrumb="Konferanselokale"
      title="Leie konferanselokale"
      dek="Konferanse, seminar eller kurs. Finn ledig konferanselokale med plass til alle, se pris og kapasitet, og book og betal på nett."
      lead="Skal du arrangere konferanse, seminar eller fagdag, starter jobben ofte med å lete gjennom hoteller, kulturhus og kurssentre hver for seg. Prisen er uklar, kapasiteten står ikke oppgitt, og du må sende forespørsel og vente dagevis på tilbud, uten å vite om prosjektor, lyd og servering er inkludert. På Digilist er konferanselokalene samlet ett sted, med pris, kapasitet og fasiliteter synlig på hvert lokale. Du ser hva som faktisk er ledig for din dato, sammenligner alternativene, og booker direkte med bekreftelse med en gang."
      seoTitle="Leie konferanselokale: pris, kapasitet og booking | Digilist"
      seoDescription="Leie konferanselokale eller konferansesal til seminar, kurs og konferanse: se pris, kapasitet og ledige datoer, og book på nett. Lokaler samlet ett sted."
      keywords="leie konferanselokale, konferansesal, leie konferansesal, konferanselokale pris, book konferanselokale, leie lokale til seminar, kurslokale, leie lokale til konferanse, møtelokale stort"
      audience={[
        {
          persona: "Bedrifter og HR",
          context: "Kickoff, fagdag eller samling for hele avdelingen. Dere trenger plenumssal med plass til alle, grupperom til workshops, og en pris dere kan forsvare i budsjettet.",
        },
        {
          persona: "Kursholdere og kompetansemiljøer",
          context: "Du arrangerer kurs og opplæring jevnlig og trenger et kurslokale med prosjektor, godt lys og riktig oppsett, uten å forhandle tilbud for hver eneste dato.",
        },
        {
          persona: "Organisasjoner og foreninger",
          context: "Årsmøte, landsmøte eller medlemsseminar. Et lokale med plass til mange, mulighet for servering, og en bookingprosess som ikke krever ukevis med e-poster.",
        },
        {
          persona: "Offentlige virksomheter",
          context: "Fagsamling eller etatskonferanse med deltakere fra flere steder. Dere trenger tydelig pris og kapasitet på forhånd, og betaling med faktura.",
        },
      ]}
      problems={[
        "Konferanselokalene ligger spredt: hotellenes egne sider, kurssentre, kulturhus og telefonnumre, uten ett sted å søke og sammenligne.",
        "Prisen er sjelden oppgitt. Du må sende forespørsel, vente på tilbud, og ofte purre før du får svar.",
        "Kapasitet og oppsett er uklart: står det plass til 80 i klasseromsoppsett, eller bare i kinooppsett?",
        "Du vet ikke om prosjektor, lyd, wifi og grupperom er inkludert før langt ut i dialogen.",
        "Servering må avtales i egne runder, med egne priser som kommer på toppen av tilbudet.",
      ]}
      features={[
        {
          title: "Alle konferanselokaler, ett søk",
          body: "Hoteller, kulturhus, kurssentre og samfunnshus med store saler samlet på ett sted. Du søker på sted, dato og antall deltakere, og ser alternativene ved siden av hverandre.",
        },
        {
          title: "Pris og kapasitet synlig",
          body: "Hvert lokale viser pris for hel og halv dag og hvor mange det er plass til, før du tar kontakt. Ingen tilbudsrunder for å finne ut om det passer budsjettet.",
        },
        {
          title: "Plenumssal og grupperom",
          body: "Se hvilke oppsett lokalet støtter, kino, klasserom, øyer eller u-bord, og om det finnes grupperom til parallellsesjoner og workshops.",
        },
        {
          title: "AV, prosjektor og lyd oppgitt",
          body: "Prosjektor, lerret, lydanlegg, mikrofoner og wifi står listet på hvert lokale. Du slipper å oppdage på morgenen at skjøteledningen er det eneste tekniske utstyret.",
        },
        {
          title: "Servering som tilvalg",
          body: "Der lokalet tilbyr kaffe, lunsj eller møtemat, ser du det som tilvalg med pris i samme booking. Ett sted å bestille, én oversikt over totalkostnaden.",
        },
        {
          title: "Book direkte, betal med Vipps eller faktura",
          body: "Ledige datoer vises i sanntid, og du booker direkte med bekreftelse med en gang. Betal med Vipps eller kort, eller få faktura til virksomheten.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: HR-ansvarlig i Rogaland",
          role: "Illustrasjon",
          headline: "Fagdag for 90 booket på en formiddag",
          body: "Slik kan det se ut: I stedet for å sende forespørsler til fem hoteller og vente på tilbud, søker HR-ansvarlig på dato og 90 deltakere, sammenligner tre lokaler med plenumssal og grupperom, ser at prosjektor og lyd er inkludert, legger til lunsj som tilvalg, og booker med faktura til virksomheten.",
          outcome: [
            { label: "Tilbudsrunder", value: "0" },
            { label: "Pris og kapasitet", value: "Synlig før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: kursholder i Trøndelag",
          role: "Illustrasjon",
          headline: "Kursserie uten forhandling per dato",
          body: "En kursholder trenger samme kurslokale seks onsdager utover høsten. På Digilist ser hun halvdagsprisen og hva som følger med av prosjektor og wifi, sjekker at alle datoene er ledige i kalenderen, og booker hele serien i én flyt, uten en eneste tilbudsrunde på e-post.",
          outcome: [
            { label: "Datoer booket", value: "6" },
            { label: "E-postrunder", value: "Ingen" },
            { label: "Fasiliteter", value: "Oppgitt på forhånd" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen, eller faktura til virksomheten der utleier tilbyr det.",
        },
        {
          label: "Ledige datoer",
          value: "Sanntidskalender for hel dag og halv dag. Du ser hva som er ledig og booker direkte, uten forespørsel og venting på tilbud.",
        },
        {
          label: "Pris",
          value: "Pris for hel og halv dag vises på lokalet, med tilvalg som servering spesifisert, før du bekrefter.",
        },
        {
          label: "Kapasitet og oppsett",
          value: "Antall plasser per oppsett, kino, klasserom, øyer eller u-bord, og om lokalet har grupperom til parallellsesjoner.",
        },
        {
          label: "Fasiliteter",
          value: "Prosjektor, lerret, lydanlegg, mikrofon, wifi og annet teknisk utstyr står listet på hvert lokale.",
        },
        {
          label: "Servering",
          value: "Kaffe, lunsj og møtemat der lokalet tilbyr det, bestilles som tilvalg i samme booking med pris oppgitt.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "Konferanselokalene samlet ett sted, med pris, kapasitet og fasiliteter synlig før du booker. Ikke fem forespørsler og en uke med venting på tilbud.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et konferanselokale?",
          answer:
            "Prisen varierer med sted, størrelse og varighet. Et mindre kurslokale kan koste fra et par tusen kroner for en halv dag, mens en konferansesal med plass til hundrevis ligger betydelig høyere. På Digilist står prisen for hel og halv dag på hvert lokale, med tilvalg som servering spesifisert, før du booker.",
        },
        {
          question: "Hvor mange deltakere er det plass til?",
          answer:
            "Kapasiteten står oppgitt per oppsett på hvert lokale. Kinooppsett gir plass til flest, klasserom og øyer krever mer plass per deltaker. Du filtrerer på antall deltakere når du søker, og ser om lokalet også har grupperom til parallellsesjoner.",
        },
        {
          question: "Er prosjektor, lyd og servering inkludert?",
          answer:
            "Det varierer per lokale, og derfor står det tydelig oppgitt. Fasiliteter som prosjektor, lerret, lydanlegg, mikrofon og wifi listes på lokalet, og servering vises som tilvalg med egen pris der det tilbys. Du ser totalkostnaden før du bekrefter.",
        },
        {
          question: "Kan bedriften få faktura i stedet for å betale med kort?",
          answer:
            "Ja, der utleier tilbyr det. Mange konferanselokaler tilbyr faktura til virksomheter, og du velger det i samme bookingflyt. Alternativt betaler du med Vipps eller kort og får kvittering med en gang.",
        },
        {
          question: "Kan jeg leie for en halv dag i stedet for en hel?",
          answer:
            "Ja, de fleste konferanselokaler tilbyr både halv og hel dag, og noen tilbyr også kveldsleie. Prisene for de ulike variantene står på lokalet, og kalenderen viser hva som er ledig for den varigheten du trenger.",
        },
        {
          question: "Hva skjer hvis jeg må avbestille eller flytte datoen?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert lokale før du booker. Der det er tillatt, avbestiller du digitalt, og en eventuell refusjon følger reglene som gjelder for lokalet. Sjekk fristene før du bekrefter, spesielt for store arrangementer.",
        },
      ]}
      relatedPosts={[
        {
          title: "Sømløs betaling med Vipps og EHF",
          slug: "somlos-betaling-vipps-ehf",
        },
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
      ]}
    />
  );
}
