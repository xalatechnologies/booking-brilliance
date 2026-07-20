import UseCasePage from "@/components/UseCasePage";

export default function OvernattingHytte() {
  return (
    <UseCasePage
      basePath="/overnatting"
      parentCrumb={{ name: "Overnatting", path: "/overnatting" }}
      sectionLabel="OVERNATTING"
      slug="hytte"
      breadcrumb="Hytte"
      title="Leie hytte"
      dek="Helgetur, ferie eller familiesamling. Finn ledig hytte nær deg eller i hele Norge, se totalpris og book med Vipps."
      lead="Skal du på hyttetur, starter jakten ofte i fem faner: Finn-annonser, Airbnb, DNT-oversikter og hyttegrupper på Facebook. Prisen ser grei ut helt til vask, gebyrer og strøm dukker opp i siste steg, ingen kalender viser hvilke netter som faktisk er ledige, og betalingen ender fort som bankoverføring til en fremmed. Digilist samler hytter til leie ett sted, med totalpris synlig fra start, ledige netter i sanntid og trygg betaling med Vipps, slik at du kan booke helgeturen eller ferien uten å gamble."
      seoTitle="Leie hytte: ledige netter, totalpris og booking | Digilist"
      seoDescription="Leie hytte til helgetur, ferie eller påske: se ledige netter og totalpris uten skjulte gebyrer, og book trygt med Vipps. Hytter i hele Norge, samlet ett sted."
      keywords="leie hytte, hytte til leie, leie hytte helg, leie hytte ferie, hytte utleie, leie hytte i fjellet, leie hytte ved sjøen, book hytte, hytte med badstue"
      audience={[
        {
          persona: "Familier på ferie",
          context: "Vinterferie, sommerferie eller påske med barn. Dere trenger nok sengeplasser, en totalpris dere kan stole på, og en hytte som faktisk er ledig i skoleferien.",
        },
        {
          persona: "Venner på helgetur",
          context: "En gjeng som vil bort en helg, gjerne med badstue, peis og plass til alle. Enkelt å finne, enkelt å booke, enkelt å dele regningen.",
        },
        {
          persona: "Hyttekos i høytidene",
          context: "Påske, jul eller en langhelg med storfamilien samlet. Finn en hytte med plass rundt bordet, uten å vente dagevis på svar i en Facebook-gruppe.",
        },
        {
          persona: "Naturglade på tur",
          context: "Fisketur, skitur eller topptur. Du vil ha en base nær løypene eller vannet, med det viktigste på plass: seng, varme og tørkeplass til utstyret.",
        },
      ]}
      problems={[
        "Hyttene ligger spredt på Finn, Airbnb, DNT, Novasol og lukkede hyttegrupper på Facebook, uten ett sted å søke.",
        "Totalprisen er uklar: vask, gebyrer og strøm dukker opp sent i bestillingen, eller ikke før du spør.",
        "Ingen samlet kalender: du vet ikke hvilke netter som er ledige før noen rekker å svare på melding.",
        "Betalingen skjer ofte som bankoverføring til en fremmed, uten kvittering eller trygghet hvis noe går galt.",
        "Depositum og nøkkeloverlevering avtales løst på melding, og hva som faktisk er inkludert er ofte gjetning.",
      ]}
      features={[
        {
          title: "Alle hytter samlet ett sted",
          body: "Hytter som i dag ligger spredt på Finn, Airbnb, DNT og Facebook-grupper, samlet i ett søk. Velg område, datoer og antall gjester, og se hva som finnes.",
        },
        {
          title: "Totalpris uten overraskelser",
          body: "Se totalprisen for dine netter, inkludert vask og gebyrer, før du booker. Ingen tillegg som dukker opp i siste steg av bestillingen.",
        },
        {
          title: "Ledige netter i sanntid",
          body: "Kalenderen viser hvilke netter som faktisk er ledige. Velg innsjekk og utsjekk, book direkte og få bekreftelsen med en gang.",
        },
        {
          title: "Vipps og digitalt depositum",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Krever hytta depositum, håndteres det digitalt og frigjøres automatisk etter oppholdet. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Se hva som er inkludert",
          body: "Sengeplasser, badstue, båt, wifi, strøm og om kjæledyr er tillatt, alt står tydelig på hver hytte før du bekrefter.",
        },
        {
          title: "Digital innsjekk og nøkkel",
          body: "Innsjekkstid, nøkkelboks eller digital nøkkel og praktisk info kommer i bekreftelsen. Du slipper å avtale overlevering på melding.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: familie i vinterferien",
          role: "Illustrasjon",
          headline: "Fra fem faner til én booking",
          body: "Slik kan det se ut: I stedet for å lete gjennom Finn, Airbnb og to hyttegrupper søker familien på fjellområdet og uka i vinterferien, filtrerer på seks sengeplasser og kjæledyr, sammenligner tre ledige hytter med totalpris synlig, og booker med Vipps samme kveld.",
          outcome: [
            { label: "Faner å lete i", value: "1" },
            { label: "Totalpris synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: vennegjeng på helgetur",
          role: "Illustrasjon",
          headline: "Helgetur med badstue, booket i lunsjen",
          body: "Slik kan det se ut: Fire venner vil bort en helg og finner en hytte ved vannet med badstue og åtte sengeplasser. Ledige netter vises i kalenderen, totalprisen inkluderer vask, depositumet håndteres digitalt, og nøkkelinfo kommer rett i bekreftelsen.",
          outcome: [
            { label: "Venting på svar", value: "Ingen" },
            { label: "Depositum", value: "Digitalt" },
            { label: "Booking", value: "På minutter" },
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
          value: "Sanntidskalender per hytte. Velg innsjekk og utsjekk, se hvilke netter som er ledige, og book direkte.",
        },
        {
          label: "Pris",
          value: "Totalpris for dine netter, inkludert vask og gebyrer, vises før du bekrefter. Ingen skjulte tillegg.",
        },
        {
          label: "Kapasitet",
          value: "Antall sengeplasser og maks antall gjester står tydelig på hver hytte. Filtrer på størrelsen dere er.",
        },
        {
          label: "Fasiliteter",
          value: "Badstue, båt, wifi, strøm, peis og om kjæledyr er tillatt, alt vises på hytta før du booker.",
        },
        {
          label: "Innsjekk",
          value: "Innsjekkstid og nøkkelløsning, nøkkelboks eller digital nøkkel, kommer i bekreftelsen sammen med praktisk info.",
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
        text: "Hyttene der du vil være, samlet ett sted, med ledige netter og totalpris synlig før du booker. Ikke fem faner, tre meldinger og en bankoverføring til en fremmed.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie hytte?",
          answer:
            "Prisen varierer med sted, standard, sesong og antall netter. En enkel hytte kan koste fra rundt tusenlappen per natt, mens større hytter med badstue og høy standard ligger høyere, spesielt i vinterferie og påske. På Digilist ser du totalprisen for dine netter, inkludert vask og gebyrer, før du booker.",
        },
        {
          question: "Hvordan booker jeg en hytte?",
          answer:
            "Søk på område og datoer, filtrer på antall gjester og fasiliteter, og velg en hytte med ledige netter i kalenderen. Du booker direkte og betaler med Vipps eller kort i samme flyt. Bekreftelsen med praktisk info kommer med en gang.",
        },
        {
          question: "Hva er inkludert i leien?",
          answer:
            "Det står på hver hytte. Sengeplasser, ved, strøm, wifi, badstue, båt og vask vises tydelig før du booker, og totalprisen viser hva som er med og hva som eventuelt koster ekstra, som sengetøy eller sluttvask.",
        },
        {
          question: "Kan jeg ta med hund eller katt?",
          answer:
            "Noen hytter tillater kjæledyr, andre ikke. Det står tydelig på hver hytte, og du kan filtrere på kjæledyr når du søker, slik at du slipper å spørre og vente på svar.",
        },
        {
          question: "Hvordan fungerer innsjekk og nøkkel?",
          answer:
            "Innsjekkstid og nøkkelløsning står i bekreftelsen. Mange hytter bruker nøkkelboks eller digital nøkkel, slik at du sjekker inn når det passer deg, uten å avtale overlevering på melding.",
        },
        {
          question: "Kan jeg avbestille hvis planene endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hver hytte før du booker. Der det er tillatt, avbestiller du digitalt, og betaling og eventuelt depositum refunderes etter reglene som gjelder for hytta.",
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
