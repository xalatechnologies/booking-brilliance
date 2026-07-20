import UseCasePage from "@/components/UseCasePage";

export default function OvernattingFeriehus() {
  return (
    <UseCasePage
      basePath="/overnatting"
      parentCrumb={{ name: "Overnatting", path: "/overnatting" }}
      sectionLabel="OVERNATTING"
      slug="feriehus"
      breadcrumb="Feriehus"
      title="Leie feriehus"
      dek="Familieferie eller gjenforening. Finn ledig feriehus nær sjøen eller fjellet, se totalpris og book med Vipps."
      lead="Skal du samle familien eller vennegjengen i et feriehus, starter letingen ofte i mange faner: Finn-annonser, Airbnb, Novasol og utleiesider med hver sin kalender. Prisen ser grei ut helt til vask og gebyrer dukker opp i siste steg, ingen samlet kalender viser hvilke uker som faktisk er ledige, og hvordan innsjekk og nøkler fungerer er ofte uklart helt til dagen før. Digilist samler feriehus til leie ett sted, med totalpris synlig fra start, ledige netter i sanntid og trygg betaling med Vipps, slik at hele gjengen kan booke ferien uten å gamble."
      seoTitle="Leie feriehus: ledige netter, totalpris og booking | Digilist"
      seoDescription="Leie feriehus til familieferie, gjenforening eller storfamilie: se ledige netter og totalpris uten skjulte gebyrer, og book trygt med Vipps. Feriehus i hele Norge."
      keywords="leie feriehus, feriehus til leie, leie feriehus ved sjøen, feriehus utleie, leie feriehus norge, feriehus til familie, stort feriehus leie, book feriehus"
      audience={[
        {
          persona: "Storfamilier på ferie",
          context: "Tre generasjoner på samme sted, med nok soverom, flere bad og plass rundt bordet til alle. Dere trenger et hus som faktisk er ledig i fellesferien, med totalpris dere kan stole på.",
        },
        {
          persona: "Venner og kollegaer på gruppetur",
          context: "En gjeng som vil samles en uke eller langhelg, gjerne ved sjøen. Nok sengeplasser til alle, enkelt å booke, og enkelt å dele regningen når totalprisen er klar fra start.",
        },
        {
          persona: "Gjenforening og jubileum",
          context: "Familietreff, rund dag eller gjensyn med gamle venner. Dere trenger ett hus med plass til mange, hage til de minste, og en booking som er bekreftet lenge før alle bestiller reise.",
        },
        {
          persona: "Familier som vil ha plass og hage",
          context: "Barnefamilier som vil ha mer enn et hotellrom: egne soverom til barna, hage å leke i, og kjøkken til å lage mat selv. En base for hele ferien, ikke bare et sted å sove.",
        },
      ]}
      problems={[
        "Feriehusene ligger spredt på Finn, Airbnb, Novasol og ulike utleiesider, uten ett sted å søke og sammenligne.",
        "Totalprisen er uklar: vask, gebyrer og tillegg dukker opp sent i bestillingen, eller ikke før du spør utleier.",
        "Ingen samlet kalender: du vet ikke hvilke uker som faktisk er ledige før noen rekker å svare på melding.",
        "Kapasiteten er gjetning: antall soverom, bad og reelle sengeplasser stemmer ikke alltid med annonsen når mange skal bo sammen.",
        "Innsjekk og nøkkeloverlevering avtales løst på melding, og med et helt reisefølge på vei er det dumt å være usikker.",
      ]}
      features={[
        {
          title: "Alle feriehus samlet ett sted",
          body: "Feriehus som i dag ligger spredt på Finn, Airbnb, Novasol og utleiesider, samlet i ett søk. Velg område, datoer og antall gjester, og se hvilke hus som har plass til hele følget.",
        },
        {
          title: "Totalpris uten skjulte gebyrer",
          body: "Se totalprisen for dine netter, inkludert vask og gebyrer, før du booker. Med mange som skal dele regningen er det greit at summen er riktig fra start.",
        },
        {
          title: "Ledige netter i sanntid",
          body: "Kalenderen viser hvilke netter og uker som faktisk er ledige. Velg innsjekk og utsjekk, book direkte og få bekreftelsen med en gang, lenge før alle bestiller reise.",
        },
        {
          title: "Vipps og digitalt depositum",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Krever huset depositum, håndteres det digitalt og frigjøres automatisk etter oppholdet. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Kapasitet og fasiliteter, svart på hvitt",
          body: "Antall soverom, bad og sengeplasser, hage, sjøtilgang og wifi står tydelig på hvert hus. Filtrer på det dere trenger, og slipp overraskelser når tolv personer ruller inn.",
        },
        {
          title: "Digital innsjekk og nøkkel",
          body: "Innsjekkstid, nøkkelboks eller digital nøkkel og praktisk info kommer i bekreftelsen. Hele følget vet hvor de skal og når, uten å avtale overlevering på melding.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: storfamilie i fellesferien",
          role: "Illustrasjon",
          headline: "Ett hus til tre generasjoner, booket på en kveld",
          body: "Slik kan det se ut: Besteforeldre, to søskenflokker og seks barnebarn skal samles en uke ved sjøen. I stedet for å lete på Finn, Airbnb og Novasol søker familien på området og uka, filtrerer på fem soverom, to bad og hage, sammenligner tre ledige hus med totalpris synlig, og booker med Vipps samme kveld.",
          outcome: [
            { label: "Faner å lete i", value: "1" },
            { label: "Totalpris synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: gjenforening med venner",
          role: "Illustrasjon",
          headline: "Jubileumshelg med plass til alle tolv",
          body: "Slik kan det se ut: En vennegjeng planlegger gjenforening etter tjue år og trenger ett hus med tolv sengeplasser og stort kjøkken. Ledige netter vises i kalenderen, totalprisen inkluderer vask og deles enkelt på tolv, depositumet håndteres digitalt, og nøkkelinfo kommer rett i bekreftelsen.",
          outcome: [
            { label: "Venting på svar", value: "Ingen" },
            { label: "Depositum", value: "Digitalt" },
            { label: "Regning å dele", value: "En, kjent fra start" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk etter oppholdet.",
        },
        {
          label: "Ledige netter",
          value: "Sanntidskalender per feriehus. Velg innsjekk og utsjekk, se hvilke netter og uker som er ledige, og book direkte.",
        },
        {
          label: "Pris",
          value: "Totalpris for dine netter, inkludert vask og gebyrer, vises før du bekrefter. Ingen skjulte tillegg når regningen skal deles.",
        },
        {
          label: "Kapasitet",
          value: "Antall soverom, bad, sengeplasser og maks antall gjester står tydelig på hvert hus. Filtrer på størrelsen dere er.",
        },
        {
          label: "Fasiliteter",
          value: "Hage, sjøtilgang, wifi, kjøkken og om kjæledyr er tillatt, alt vises på huset før du booker.",
        },
        {
          label: "Innsjekk",
          value: "Innsjekkstid og nøkkelløsning, nøkkelboks eller digital nøkkel, kommer i bekreftelsen sammen med praktisk info til hele følget.",
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
        text: "Ett feriehus med plass til alle, med soverom, ledige netter og totalpris synlig før du booker. Ikke ti faner, en usikker kalender og en regning som vokser i siste steg.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie feriehus?",
          answer:
            "Prisen varierer med sted, størrelse, standard og sesong. Et mindre feriehus kan koste noen tusenlapper for en helg, mens store hus ved sjøen med mange soverom ligger høyere, spesielt i fellesferien. På Digilist ser du totalprisen for dine netter, inkludert vask og gebyrer, før du booker, og med mange som deler blir prisen per person ofte lavere enn hotell.",
        },
        {
          question: "Hvor mange er det plass til i et feriehus?",
          answer:
            "Det varierer fra hus til hus, men feriehus har typisk flere soverom og sengeplasser enn en hytte eller leilighet, ofte plass til åtte, tolv eller flere. Antall soverom, bad og sengeplasser står tydelig på hvert hus, og du kan filtrere på antall gjester når du søker.",
        },
        {
          question: "Hva er inkludert i leien?",
          answer:
            "Det står på hvert hus. Sengeplasser, kjøkken, wifi, strøm, hage og vask vises tydelig før du booker, og totalprisen viser hva som er med og hva som eventuelt koster ekstra, som sengetøy eller sluttvask. Du slipper å oppdage tillegg i siste steg.",
        },
        {
          question: "Kan vi ta med hund, og har huset hage?",
          answer:
            "Noen feriehus tillater kjæledyr, andre ikke, og det står tydelig på hvert hus. Hage, uteplass og sjøtilgang vises også på huset, og du kan filtrere på både kjæledyr og hage når du søker, slik at du slipper å spørre og vente på svar.",
        },
        {
          question: "Hvordan fungerer innsjekk med et helt reisefølge?",
          answer:
            "Innsjekkstid og nøkkelløsning står i bekreftelsen. Mange feriehus bruker nøkkelboks eller digital nøkkel, slik at dere sjekker inn når det passer, også når bilene kommer til ulik tid. Praktisk info kan deles med hele følget på forhånd.",
        },
        {
          question: "Kan vi avbestille hvis planene endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert hus før du booker. Der det er tillatt, avbestiller du digitalt, og betaling og eventuelt depositum refunderes etter reglene som gjelder for huset. Sjekk reglene før du booker, spesielt når mange skal reise sammen.",
        },
      ]}
      relatedPosts={[
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
        {
          title: "Sømløs betaling med Vipps og EHF",
          slug: "somlos-betaling-vipps-ehf",
        },
      ]}
    />
  );
}
