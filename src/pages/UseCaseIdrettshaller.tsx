import UseCasePage from "@/components/UseCasePage";

const SIBLINGS = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Møterom", slug: "moterom" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" },
];

export default function UseCaseIdrettshaller() {
  return (
    <UseCasePage
      slug="idrettshaller-gymsaler"
      breadcrumb="Idrettshaller og gymsaler"
      title="Idrettshaller og gymsaler"
      dek="Halvhalls-, hel-halls- og blandingsbookinger med sesongleie til lag og foreninger. Privat trening, treningsturneringer og åpen hall, i samme kalender."
      lead="Idrettshaller er det mest komplekse å booke i en kommune. Du har lag som trenger fast tid hele sesongen, foreninger som vil leie inn fra utsiden, innbyggere som vil booke gymsal en lørdag, og halvhalls-bookinger som må kunne kombineres uten å låse motsatte halvdel. Digilist løser dette med sesongleie-modul, sambruk og automatisk fordeling."
      seoTitle="Idrettshall booking: bookingsystem for kommuner og foreninger · Digilist"
      seoDescription="Bookingsystem for idrettshaller og gymsaler. Sesongleie til lag og foreninger, halvhalls-bookinger, sambruk, kommunal innbyggerinnlogging via ID-porten."
      keywords="idrettshall booking, gymsal booking, sesongleie idrettslag, halvhalls booking, foreningstilskudd, kommunal idrett, idrettsanlegg, fritidsdrift"
      audience={[
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Eiere av idrettshaller, gymsaler, fotballbaner, svømmehaller, som leies ut til lag, foreninger, skoler og innbyggere.",
        },
        {
          persona: "Idrettsklubber og lag",
          context: "Brukere av kommunale anlegg: trenger fast trening flere ganger per uke gjennom hele sesongen, og enkeltbookinger for kamper og turneringer.",
        },
        {
          persona: "Skoler og videregående",
          context: "Bruker gymsalen i undervisningstid, leier den ut til lag og foreninger ettermiddag/kveld. Trenger sambruk uten konflikt.",
        },
        {
          persona: "Idrettsstiftelser",
          context: "Stiftelser som drifter spesifikke anlegg (svømmehall, ishall) på vegne av kommunen, med flere brukergrupper og prising.",
        },
        {
          persona: "Velforeninger og bydeler",
          context: "Mindre anlegg drevet av velforening eller bydelsadministrasjon, gjerne med begrenset administrasjon men mange brukere.",
        },
        {
          persona: "Private treningsanlegg",
          context: "Private bedrifter som leier ut tennishaller, paddelbaner, klatrevegger, på timesbasis til private og bedrifter.",
        },
      ]}
      problems={[
        "Sesongtildeling gjøres manuelt i Excel. Det tar uker hver høst, og konflikter løses i lukkede møter uten åpenhet for foreningene.",
        "Halvhalls-bookinger blir feilbooket fordi systemet ikke skjønner at to halve haller = én hel hall. Doble bookinger på den motsatte halvdelen oppdages midt i treningen.",
        "Foreningstilskudd holdes regnskap for i Excel. Hver forening har et tildelt antall timer, men ingen kan svare på hvor mye som er brukt midtveis i sesongen.",
        "Vaktmester får ikke alltid beskjed om kveld-bookinger, og må fysisk komme for å låse opp, eller innbyggere står ute i kulden.",
        "Lag som ikke møter opp blokkerer halltimer som andre kunne brukt, uten automatisk frigjøring eller vurdering av faste tildelinger.",
      ]}
      features={[
        {
          title: "Sesongleie-modul",
          body: "Lag og foreninger søker om fast tid for sesongen via plattformen. Saksbehandler tildeler basert på prioritet (alder, kjønn, geografi), og systemet låser tidene automatisk for hele perioden.",
        },
        {
          title: "Halvhalls + hel-halls i samme kalender",
          body: "Plattformen skjønner topologien av anlegget. Booker du halvhalls A og halvhalls B samtidig, registreres det som hel hall. Booker du hel hall, blokkeres begge halvdeler.",
        },
        {
          title: "Foreningstilskudd-regnskap",
          body: "Hver forening har et årlig tildelt timeantall. Plattformen teller automatisk og varsler når foreningen nærmer seg grensen. Tildeling kan justeres midt i sesongen ved behov.",
        },
        {
          title: "Driftsrolle-varsling",
          body: "Vaktmester får SMS om kveld-bookinger. Renhold får varsel om kamper og turneringer som krever ekstra rengjøring etter. Vekter får liste over hvem som har adgang når.",
        },
        {
          title: "Adgangskontroll via Salto KS",
          body: "Mobilnøkkel sendes til lagledere 30 min før hver trening, deaktiveres automatisk etter sluttid. Ingen fysisk nøkkeloverlevering, ingen vaktmester behøver å være tilstede.",
        },
        {
          title: "Privat booking + åpen hall",
          body: "Samme anlegg kan også leies av privatpersoner (lørdag gymsalbooking, helger med Vipps-betaling) og kjøres som åpen hall (gratis innbyggertid). Alt i samme kalender.",
        },
      ]}
      stories={[
        {
          customer: "Norsk kommune",
          role: "Idrettskoordinator (anonymisert)",
          headline: "Sesongtildeling som tok 3 uker, nå tar 4 dager",
          body: "Tidligere brukte vi hele september på sesongtildeling: møter, e-poster, Excel-tabeller, konflikter. Med Digilist søker lagene digitalt, vi ser alle søknader i et dashboard, tildeler basert på regler vi har definert opp, og hele tildelingen er klar før månedsslutt. Lagene får automatisk varsel om sine tildelte tider, og kan bytte seg imellom hvis avtalt.",
          outcome: [
            { label: "Sesongtildelings-tid", value: "−85%" },
            { label: "Konfliktsaker", value: "−70%" },
            { label: "Lag i systemet", value: "47" },
          ],
        },
        {
          customer: "Idrettslag-eksempel",
          role: "Lagleder",
          headline: "Vi vet om vi har fått hallen, lenge før sesongen starter",
          body: "Som lagleder har jeg ansvar for at vi har trening for fire aldersgrupper i halvhalls-format. Tidligere fikk vi vite tildelinger sent i august, og måtte ofte bytte med andre lag. Nå søker vi i juni, får svar i juli, og kan planlegge treneropplegget i god tid. Hvis vi trenger ekstra tid for kamp, kan vi se ledige timer i sanntid.",
          outcome: [
            { label: "Tildeling-frist", value: "−6 uker" },
            { label: "Trening flyttet", value: "−50%" },
            { label: "Lagledere fornøyd", value: "9/10" },
          ],
        },
      ]}
      technical={[
        {
          label: "Halltopologi",
          value: "Hver hall defineres med opptil 4 halvdeler. Halvhalls-bookinger sjekkes mot motsatte halvdel før bekreftelse. Hel hall blokkerer alle halvdeler automatisk.",
        },
        {
          label: "Sesongleie-flyt",
          value: "Søknad → saksbehandler-tildeling med drag-and-drop → bekreftelse til lagleder → automatisk låsing av alle sesongens tider. Endringer underveis varsler alle berørte.",
        },
        {
          label: "Foreningstilskudd",
          value: "Per forening: tildelt antall timer per sesong, faktisk forbruk, justeringer. Varsel ved 75% forbruk og blokkering ved 100% (med override-mulighet for saksbehandler).",
        },
        {
          label: "Prising",
          value: "Per time, halvdag, heldag. Tariffer per brukergruppe (kommunale, idrettslag, foreninger, privat). Gratis for tildelte sesongtimer, betalt for ekstra.",
        },
        {
          label: "Adgang",
          value: "Salto KS mobilnøkkel/PIN-kode aktiv 30 min før til 30 min etter. Lagleder mottar adgang for hele sesongen i én strøm.",
        },
        {
          label: "Drift",
          value: "Vaktmester får varsel om bookinger utenfor åpningstid. Renhold får dag-rapport over morgenens første og kveldens siste booking per anlegg.",
        },
        {
          label: "Kamper og turneringer",
          value: "Engangsbookinger på toppen av sesongleie. Kan kreve fysisk vakthold (vekter) og dobbel renhold. Alt varsles automatisk.",
        },
        {
          label: "Pålogging",
          value: "Innbyggere: BankID. Lagledere: ID-porten eller magic-link til e-post. Saksbehandlere: ID-porten med ansattlegitimasjon.",
        },
        {
          label: "Avbestilling og fravær",
          value: "Sent avbestilte timer kan utløse 'no-show'-rapport. Etter 3 uvarsl fravær får saksbehandler varsel om å revurdere foreningens tildeling.",
        },
      ]}
      pullQuote={{
        text: "Sesongtildeling tok hele september. Nå er den ferdig før månedsslutt, og lagene har færre konflikter fordi prosessen er åpen og spillereglene er kjent.",
        byline: "Idrettskoordinator, norsk kommune",
      }}
      faq={[
        {
          question: "Kan vi håndtere både kommunale anlegg og private treningsanlegg samme sted?",
          answer:
            "Ja. Plattformen kjenner forskjellen: kommunale anlegg har foreningstilskudd og innbyggertilgang via ID-porten, private anlegg har egne priser og kortbetaling. Du kan ha begge i samme installasjon.",
        },
        {
          question: "Hvordan håndteres prioritering mellom lag i sesongtildeling?",
          answer:
            "Prioritetsregler defineres av kommunen. Typisk: aldersbestemt prioritet, kjønnsfordeling, geografisk tilhørighet, antall lag i samme klubb. Systemet kjører tildelingen automatisk basert på dine regler, og saksbehandler godkjenner eller justerer.",
        },
        {
          question: "Hva med svømmehaller, har de samme bookingflyt?",
          answer:
            "Svømmehaller har samme grunnlogikk men ofte mer komplekse driftsbehov (klorlys, vannprøver, vaktbemanning). Vi har egne integrasjoner for svømmehall-spesifikk drift. Spør om en demo av svømmehall-konfigurasjon.",
        },
        {
          question: "Kan lagledere bytte tildelte tider seg imellom?",
          answer:
            "Ja, hvis kommunen aktiverer 'bytte-funksjonalitet'. Lagleder A foreslår bytte med lagleder B, B godtar eller avslår, og saksbehandler kan godkjenne hvis ønskelig. Alle endringer er logget.",
        },
        {
          question: "Hvordan integrerer vi med ID-porten for innbyggerinnlogging?",
          answer:
            "Vi er en registrert tjenesteleverandør hos Digdir. Konfigurasjon tar typisk 1-2 uker fra signert avtale til produksjonsbruk. Vi støtter ID-porten Sikkerhetsnivå 3 og 4.",
        },
        {
          question: "Hva skjer hvis kommunen vil endre fra ett bookingsystem til Digilist midt i sesongen?",
          answer:
            "Vi har gjort dette flere ganger. Vi importerer sesongtildeling fra Excel eller eksisterende system, kjører parallell-test i 2-4 uker, og bytter når begge systemer viser samme data. Ingen sesong må starte på nytt.",
        },
      ]}
      relatedPosts={[
        {
          title: "Sesongleie og fordeling for lag og foreninger",
          slug: "sesongleie-fordeling-lag-foreninger",
        },
        {
          title: "Sanntidskalender for kommunal booking",
          slug: "sanntidskalender-kommunal-booking",
        },
        {
          title: "Saksbehandler: godkjenne, avvise, kommunisere",
          slug: "saksbehandler-godkjenne-avvise-kommunisere",
        },
      ]}
      siblings={SIBLINGS}
    />
  );
}
