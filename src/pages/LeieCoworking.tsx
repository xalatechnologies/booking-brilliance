import UseCasePage from "@/components/UseCasePage";

export default function LeieCoworking() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="coworking"
      breadcrumb="Coworking"
      title="Leie coworking-plass"
      dek="Dagplass, hot desk eller kontorfellesskap. Finn ledig coworking-plass nær deg, se dagsprisen, og book på nett."
      lead="Hjemmekontoret funker ikke alltid. Noen dager trenger du et skrivebord utenfor huset, men det er vanskelig å vite hvilke kontorfellesskap som finnes i nærheten, hva en dagplass faktisk koster, og altfor ofte må du registrere et medlemskap bare for å sitte der én dag. På Digilist er coworking-plasser samlet ett sted, med dagspris og ledige plasser synlig før du velger. Du booker direkte og betaler for dagen, uten medlemskap, uten skjema og uten å vente på svar fra en resepsjon."
      seoTitle="Leie coworking-plass: dagplass og kontorfellesskap | Digilist"
      seoDescription="Leie kontorplass i coworking eller kontorfellesskap: finn ledig dagplass nær deg, se dagspris og hva som er inkludert, og book på nett med Vipps. Uten medlemskap."
      keywords="coworking, coworking oslo, kontorfellesskap, leie kontorplass, dagplass kontor, hot desk, drop-in kontor, coworking plass, leie skrivebord"
      audience={[
        {
          persona: "Frilansere",
          context: "Du jobber for deg selv og trenger et fast punkt noen dager i uka, med folk rundt deg og en pris som passer et enkeltpersonforetak.",
        },
        {
          persona: "Remote-ansatte som vil ut av huset",
          context: "Du jobber hjemmefra, men vil ut blant folk noen dager i uka. En dagplass i et kontorfellesskap gir struktur og miljø uten pendling til et hovedkontor.",
        },
        {
          persona: "Folk på reise eller i andre byer",
          context: "Du er i en annen by noen dager og trenger et skrivebord, godt wifi og kanskje et møterom, uten å binde deg til et lokalt medlemskap.",
        },
        {
          persona: "Små team som møtes av og til",
          context: "Dere er to til fem som vanligvis jobber hver for dere, men trenger noen plasser samme sted av og til, til workshops eller felles arbeidsdager.",
        },
      ]}
      problems={[
        "Coworking-tilbudene ligger spredt på egne nettsider, Instagram og Google Maps, uten ett sted å søke etter ledig plass.",
        "Dagsprisen er ofte gjemt bak et kontaktskjema, så du vet ikke hva én dag faktisk koster før noen svarer deg.",
        "Mange steder krever medlemskap eller registrering selv om du bare skal sitte der én dag.",
        "Du vet ikke om det faktisk er ledig plass før du har møtt opp eller sendt e-post og ventet på svar.",
        "Hva som er inkludert, wifi, kaffe, møterom, printer, varierer mye fra sted til sted og står sjelden tydelig noe sted.",
      ]}
      features={[
        {
          title: "Alle coworking-plasser, ett søk",
          body: "Kontorfellesskap, coworking-spaces og drop-in-plasser i nærheten samlet på ett sted. Du slipper å lete gjennom hver enkelt aktørs nettside for å finne et skrivebord.",
        },
        {
          title: "Dagspris og klippekort synlig",
          body: "Se hva en dagplass koster, og om stedet tilbyr klippekort eller månedspris, før du velger. Ingen skjema og venting bare for å få vite prisen.",
        },
        {
          title: "Ledige plasser i sanntid",
          body: "Du ser om det er ledig plass den dagen du trenger den, og booker direkte med bekreftelse med en gang. Ingen bomtur til et fullt lokale.",
        },
        {
          title: "Book uten medlemskap",
          body: "Skal du bare sitte der én dag, booker du én dag. Ingen registrering av medlemskap, ingen binding og ingen oppsigelsesfrist for en dagplass.",
        },
        {
          title: "Hva som er inkludert, tydelig",
          body: "Wifi, kaffe, tilgang til møterom, printer og garderobe. Alt som følger med plassen står oppgitt før du booker, så du vet hva du får for prisen.",
        },
        {
          title: "Miljø og fasiliteter oppgitt",
          body: "Stille soner, telefonbokser, felleslunsj eller sosialt miljø. Stedene beskriver hva slags fellesskap du kommer til, så du kan finne et som passer måten du jobber på.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: frilanser i Oslo",
          role: "Illustrasjon",
          headline: "Fra kjøkkenbordet til dagplass på minutter",
          body: "Slik kan det se ut: En frilansdesigner trenger å komme seg ut av leiligheten et par dager i uka. I stedet for å google seg gjennom ti coworking-nettsider, søker hun på området sitt, sammenligner tre steder med dagspris og fasiliteter synlig, og booker en dagplass med Vipps. Neste morgen møter hun opp med bekreftelsen på mobilen.",
          outcome: [
            { label: "Nettsider å lete gjennom", value: "0" },
            { label: "Dagspris synlig", value: "Før booking" },
            { label: "Medlemskap", value: "Ikke nødvendig" },
          ],
        },
        {
          customer: "Eksempel: på jobbreise i Bergen",
          role: "Illustrasjon",
          headline: "Et skrivebord i en fremmed by",
          body: "En konsulent skal være tre dager i Bergen mellom kundemøter og trenger et sted å jobbe med godt wifi og et møterom til en videosamtale. Han finner et kontorfellesskap nær hotellet, ser at møterom er inkludert i dagsprisen, og booker tre dagplasser på én gang, uten å registrere seg som medlem noe sted.",
          outcome: [
            { label: "Dager booket", value: "3" },
            { label: "Møterom", value: "Inkludert" },
            { label: "Registrering", value: "Ingen" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvittering med en gang, og klippekort eller månedskort betales på samme måte.",
        },
        {
          label: "Ledige plasser",
          value: "Sanntidsoversikt over ledige dagplasser. Du ser om det er plass den dagen du trenger den, og booker direkte uten å vente på svar.",
        },
        {
          label: "Pris",
          value: "Dagspris, klippekort og månedspris vises tydelig på hvert sted, så du kan velge det som passer hvor ofte du kommer.",
        },
        {
          label: "Inkludert",
          value: "Wifi, kaffe og te, tilgang til møterom og printer. Det som følger med plassen står oppgitt før du booker.",
        },
        {
          label: "Tilgang",
          value: "Drop-in i åpningstiden eller digital adgang med kode eller app, avhengig av stedet. Hvordan du kommer inn står på plassen.",
        },
        {
          label: "Fleksibilitet",
          value: "Book én dag, flere dager eller faste dager i uka. Ingen binding eller oppsigelsestid for dagplasser.",
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
        text: "Coworking-plassene der du er, samlet ett sted, med dagspris og ledige plasser synlig før du booker. Ikke medlemsskjema og e-poster frem og tilbake for én dag ved et skrivebord.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster en dagplass i coworking?",
          answer:
            "Prisen varierer med by og sted. En dagplass ligger typisk mellom 150 og 500 kroner, klippekort gir lavere pris per dag, og månedspris passer deg som kommer ofte. På Digilist ser du prisen på hvert sted før du booker.",
        },
        {
          question: "Trenger jeg medlemskap for å bruke et kontorfellesskap?",
          answer:
            "Nei, ikke på steder som tilbyr dagplass via Digilist. Du booker dagen du trenger og betaler for den, uten registrering, binding eller oppsigelsesfrist. Kommer du ofte, kan klippekort eller månedspris lønne seg.",
        },
        {
          question: "Hva er inkludert i en coworking-plass?",
          answer:
            "Det vanlige er wifi, kaffe og te, og tilgang til fellesarealer. Mange steder inkluderer også møterom, printer, telefonbokser og garderobe. Hva som følger med står på hvert sted før du booker, så du kan sammenligne.",
        },
        {
          question: "Hva er forskjellen på coworking og eget kontor?",
          answer:
            "Coworking er delte lokaler der du leier en plass, gjerne per dag, og deler fasiliteter og miljø med andre. Eget kontorlokale er en fast leieavtale med egne rom og lengre bindingstid. Trenger du bare et skrivebord av og til, er coworking den fleksible varianten.",
        },
        {
          question: "Kan jeg booke coworking for bare én dag?",
          answer:
            "Ja, det er hele poenget med dagplass. Du søker på sted og dato, ser at det er ledig, booker og betaler med Vipps, og møter opp. Skal du komme flere dager, booker du flere dager eller velger klippekort.",
        },
        {
          question: "Har coworking-steder møterom jeg kan bruke?",
          answer:
            "De fleste kontorfellesskap har møterom. Noen inkluderer et antall timer i dagsprisen, andre tar egen pris per time. Hvordan møterom fungerer står på hvert sted, så du vet det før du booker.",
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
