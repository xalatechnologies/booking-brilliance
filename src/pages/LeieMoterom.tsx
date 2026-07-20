import UseCasePage from "@/components/UseCasePage";

export default function LeieMoterom() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="moterom"
      breadcrumb="Møterom"
      title="Leie møterom"
      dek="Kundemøte, workshop, kurs eller styremøte. Finn ledig møterom nær deg, se pris per time, og book på nett med Vipps."
      lead="Trenger du et møterom noen timer, ender du ofte med å google, ringe rundt og vente på tilbud, for et rom du kanskje bare skal bruke en formiddag. På Digilist finner du møterom i nærområdet samlet ett sted, kommunale rom, næringsbygg og private tilbydere, med pris per time og hva som faktisk er ledig, synlig før du booker. Du booker direkte, betaler med Vipps, og får bekreftelsen med en gang. Ingen ringerunde, ingen venting på svar."
      seoTitle="Leie møterom: pris per time og booking på nett | Digilist"
      seoDescription="Leie møterom til møte, workshop, kurs eller intervju: se pris per time, ledige tider i sanntid, og book på nett med Vipps. Møterom nær deg, samlet ett sted."
      keywords="leie møterom, møterom til leie, hva koster møterom, leie møterom pris, book møterom online, møterom per time, leie møtelokale, møterom workshop, møterom kurs"
      audience={[
        {
          persona: "Selvstendige og frilansere",
          context: "Du jobber hjemmefra eller på farten, og trenger et profesjonelt rom til et kundemøte eller intervju, noen timer, uten fast kontorleie.",
        },
        {
          persona: "Små team og oppstartsbedrifter",
          context: "Dere trenger et rom til workshop, planleggingsdag eller styremøte, med skjerm og tavle, bookbart på timen uten avtale med et kontorhotell.",
        },
        {
          persona: "Kursholdere og veiledere",
          context: "Du holder kurs eller undervisning for en mindre gruppe, og trenger et rom med riktig kapasitet og utstyr, til en pris du ser på forhånd.",
        },
        {
          persona: "Lag og foreninger",
          context: "Styremøte, årsmøte eller komitéarbeid på kveldstid. Ofte finnes det kommunale rom i nærheten, hvis du bare visste hvor og om de var ledige.",
        },
      ]}
      problems={[
        "Møterommene ligger spredt: kontorhoteller, kommunens sider, bibliotek og frivillighetshus, uten ett sted å søke.",
        "Prisen per time er sjelden synlig, du må sende forespørsel og vente på tilbud for noen timers bruk.",
        "Ingen ekte kalender: du vet ikke om rommet er ledig i morgen før noen svarer på e-post eller telefon.",
        "Hva som følger med, skjerm, tavle, nett, kaffe, er uklart til du står i rommet.",
        "For et kort møte er terskelen for høy: mange ender på en kafé fordi det er enklere enn å booke et rom.",
      ]}
      features={[
        {
          title: "Alle møterom nær deg, ett søk",
          body: "Kommunale møterom, rom i næringsbygg og private tilbydere samlet på ett sted. Du søker på sted, tid og antall personer, og ser alt som finnes i nærheten.",
        },
        {
          title: "Pris per time, synlig før du booker",
          body: "Du ser hva rommet koster for akkurat de timene du trenger, før du bekrefter. Ingen forespørsel, ingen tilbud på e-post, ingen overraskelser.",
        },
        {
          title: "Ledige tider i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig, time for time. Trenger du et rom i morgen klokken ni, ser du det med en gang og booker direkte.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Booking og betaling i samme flyt, med Vipps eller kort. Bekreftelse og kvittering kommer med en gang, og småbedrifter kan få faktura ved behov.",
        },
        {
          title: "Utstyret står oppgitt",
          body: "Skjerm, tavle, videomøteutstyr, nett og kaffe, det som følger med rommet står tydelig på siden før du booker. Du vet hva du kommer til.",
        },
        {
          title: "Adgang uten oppmøte i resepsjon",
          body: "Mange rom har digital adgang: du får tilgangsinformasjon i bekreftelsen og går rett inn til avtalt tid, også på kveldstid der rommet tillater det.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: frilanser i Oslo",
          role: "Illustrasjon",
          headline: "Kundemøte i morgen, rom booket i kveld",
          body: "Slik kan det se ut: En frilansdesigner skal møte en ny kunde klokken ti i morgen. I stedet for å foreslå en kafé, søker hun på område og tidspunkt, ser tre ledige rom med pris per time og skjerm oppgitt, og booker et rom for to timer med Vipps. Bekreftelsen med adgangsinformasjon kommer med en gang.",
          outcome: [
            { label: "Pris synlig", value: "Før booking" },
            { label: "Booket for", value: "2 timer" },
            { label: "Venting på svar", value: "Ingen" },
          ],
        },
        {
          customer: "Eksempel: forening i bygda",
          role: "Illustrasjon",
          headline: "Styremøtet i det kommunale rommet",
          body: "Et idrettslag trenger et rom til styremøte en tirsdagskveld. Kassereren finner det kommunale møterommet på frivillighetshuset, ser at det er ledig og gratis for registrerte lag, og booker det på noen minutter, i stedet for å sende e-post til kommunen og vente på svar.",
          outcome: [
            { label: "Rom funnet", value: "I nærmiljøet" },
            { label: "Booking", value: "På minutter" },
            { label: "E-poster til kommunen", value: "0" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvittering kommer med en gang, og bedrifter kan få faktura der utleier tilbyr det.",
        },
        {
          label: "Ledige tider",
          value: "Sanntidskalender med timesoppløsning. Du ser hva som er ledig og booker direkte, uten forespørsel eller venting på svar.",
        },
        {
          label: "Pris",
          value: "Pris per time eller per halv dag, oppgitt per rom. Totalen for dine timer vises før du bekrefter.",
        },
        {
          label: "Utstyr",
          value: "Skjerm, tavle, videomøteutstyr, nett og kaffe står oppgitt på hvert rom, slik at du vet hva som er inkludert.",
        },
        {
          label: "Adgang",
          value: "Tilgangsinformasjon kommer i bekreftelsen. Mange rom har digital adgang uten oppmøte i resepsjon, også utenfor kontortid der rommet tillater det.",
        },
        {
          label: "Avbestilling",
          value: "Avbestillingsreglene settes av utleier og vises på rommet. Der det er tillatt, avbestiller du digitalt og refusjon følger reglene.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og oversikt over tidligere bookinger.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "Et møterom noen timer skal ikke kreve ringerunde og pristilbud på e-post. Søk, se pris per time, book med Vipps, ferdig.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et møterom?",
          answer:
            "Prisen varierer med sted, størrelse og utstyr. Et enkelt rom for fire til seks personer kan koste fra et par hundre kroner per time, mens større rom med videomøteutstyr ligger høyere. Kommunale rom er ofte rimelige, og noen er gratis for lag og foreninger. På Digilist står prisen per rom, og du ser totalen for dine timer før du booker.",
        },
        {
          question: "Kan jeg leie møterom for bare noen timer?",
          answer:
            "Ja. De fleste rommene bookes per time, så du betaler for de timene du faktisk trenger, enten det er et møte på en time eller en workshop over en hel dag. Du velger tidene i kalenderen når du booker.",
        },
        {
          question: "Hvordan ser jeg om rommet er ledig?",
          answer:
            "Kalenderen på hvert rom viser ledige tider i sanntid. Du velger dato og klokkeslett, booker direkte og får bekreftelsen med en gang, uten å sende forespørsel og vente på svar.",
        },
        {
          question: "Hva følger med rommet?",
          answer:
            "Det varierer, og derfor står det oppgitt på hvert rom: skjerm eller prosjektor, tavle, videomøteutstyr, trådløst nett, og om kaffe og vann er inkludert. Sjekk rombeskrivelsen før du booker, så vet du hva du kommer til.",
        },
        {
          question: "Kan jeg booke som bedrift og få faktura?",
          answer:
            "Du kan booke som privatperson eller på vegne av en bedrift eller forening. Betaling skjer med Vipps eller kort i samme flyt, og der utleier tilbyr det, kan bedrifter få faktura i stedet.",
        },
        {
          question: "Kan jeg avbestille hvis møtet flyttes?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert rom før du booker. Der det er tillatt, avbestiller du digitalt med noen klikk, og eventuell refusjon følger reglene som gjelder for rommet.",
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
