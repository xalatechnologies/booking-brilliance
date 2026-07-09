import UseCasePage from "@/components/UseCasePage";

const SIBLINGS = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" },
];

export default function UseCaseMoterom() {
  return (
    <UseCasePage
      slug="moterom"
      breadcrumb="Møterom"
      title="Møterom"
      dek="Kommunale møterom, næringsbygg, foreningslokaler. Sambruk mellom avdelinger, pris per brukergruppe, og hver booking i samme kalender."
      lead="Møterom er det mest brukte og oftest dobbeltbookede rommet i en organisasjon. Digilist gir deg én sanntidskalender for alle møterom, prising som vet om brukeren er ansatt, lag, forening eller innbygger, og automatiske varsler til vaktmester når et nytt møte skal arrangeres utenom åpningstid."
      seoTitle="Møterom: bookingsystem for kommuner og næringsbygg · Digilist"
      seoDescription="Bookingsystem for kommunale møterom, næringsbygg og foreningslokaler. Sanntidskalender, sambruk, prising per brukergruppe og Outlook-integrasjon."
      keywords="møterom booking, kommunal møterom, næringsbygg møterom, Outlook integrasjon, sambruk møterom, prising per brukergruppe, foreningslokaler"
      audience={[
        {
          persona: "Kommuner og fylkeskommuner",
          context: "Rådhus, sektorbygg og kulturhus med møterom som brukes av ansatte, politikere, lag og foreninger, og av og til innbyggere.",
        },
        {
          persona: "Næringsbygg og co-working",
          context: "Eiendomsbesittere som leier ut møterom som tilleggstjeneste til leietakere, eller til eksterne kunder på timesbasis.",
        },
        {
          persona: "Foreningslokaler og bedehus",
          context: "Lokaler som lag og foreninger deler på fastsatte tidspunkt, med behov for åpenhet om hvem som bruker hva og når.",
        },
        {
          persona: "Hoteller og konferansesentre",
          context: "Møterom som leies ut individuelt eller som del av konferansepakke, med koordinering mot hovedreservasjonssystem.",
        },
        {
          persona: "Skoler og høyskoler",
          context: "Klasserom og auditorier som brukes som møterom utenfor undervisningstid, med behov for sambruk uten konflikt.",
        },
        {
          persona: "Helseforetak og kontorbygg",
          context: "Sykehus, kommunehelse og store kontorbygg som har dusinvis av møterom som må koordineres på tvers av avdelinger.",
        },
      ]}
      problems={[
        "Møterom står tomme fordi de er reservert i Outlook av noen som ikke møtte opp. Ingen frigjøring, ingen sanksjon.",
        "Foreninger og innbyggere må sende e-post for å booke kommunale møterom. Saksbehandlere bruker timer per uke på dette.",
        "Prising er kompleks: ansatte gratis, foreninger redusert, kommersielle full pris, men det blir aldri konsekvent håndhevet.",
        "Vaktmester får ikke beskjed når en booking er utenfor åpningstid. Bruker må vente på inngangen til noen kommer.",
        "Møterom-data lever i 3-4 systemer (Outlook, Excel, kalenderapp, regneark for utleie til foreninger). Ingen kan svare på 'er det ledig på torsdag?'",
      ]}
      features={[
        {
          title: "Én sanntidskalender for alle møterom",
          body: "Ansatte ser ledige tider i Outlook-integrasjonen. Foreninger og innbyggere ser samme kalender via offentlig nettside. Ingen mulighet for dobbeltbooking.",
        },
        {
          title: "Prising per brukergruppe",
          body: "Ansatte gratis, politikere gratis, foreninger redusert, kommersielle full. Reglene defineres én gang og håndheves automatisk basert på brukerprofil.",
        },
        {
          title: "Outlook-toveis sync",
          body: "Bookinger gjort i Digilist vises i ansattes Outlook-kalender. Bookinger gjort i Outlook (kun for ansatte) skrives tilbake til Digilist for sanntidsstatus.",
        },
        {
          title: "Auto-varsling til driftsroller",
          body: "Vaktmester får SMS når møte er bekreftet utenom åpningstid. Renhold varsles om ekstra-rom som må klargjøres. Vekter varsles om kveld-arrangementer.",
        },
        {
          title: "Sambruksregler",
          body: "Møterom kan deles mellom avdelinger eller institusjoner med faste tidsblokk og prioriteringsregler, eller helt åpen sambruk hvor først-til-mølla gjelder.",
        },
        {
          title: "Bekreftelse og frigjøring",
          body: "Bookeren må bekrefte oppmøte 15 minutter før møtet starter (via SMS-lenke). Ubekreftet booking frigjør rommet automatisk til andre.",
        },
      ]}
      stories={[
        {
          customer: "Nordre Follo kommune",
          role: "Kulturkonsulent (Viken)",
          headline: "12 anlegg, én kalender: alle ser samme bilde",
          body: "Vi hadde tidligere én Outlook-kalender per anlegg og separat e-post-håndtering for forenings-bookinger. Nå booker både ansatte, politikere og lag og foreninger gjennom Digilist. Saksbehandlere godkjenner forenings-bookinger med ett klikk, vaktmester får automatisk varsel om kveld-arrangementer, og vi ser i sanntid hvor mye hvert rom faktisk brukes.",
          outcome: [
            { label: "Anlegg i drift", value: "12" },
            { label: "Aktive lag/foreninger", value: "~340" },
            { label: "Bookinger/mnd", value: "~1 200" },
          ],
        },
        {
          customer: "Næringsbygg-eksempel",
          role: "Eiendomsdrift",
          headline: "Møterom som tilleggstjeneste, uten manuell oppfølging",
          body: "Vi leier ut møterom til våre faste kontorleietakere og til eksterne på timesbasis. Tidligere ringte folk resepsjonen, vi sjekket Excel, sendte e-post med bekreftelse, fulgte opp betaling. Nå booker leietakerne selv via en lenke, betaler med Vipps eller faktura, og får adgangskode automatisk. Eksterne kunder oppdager møterommene via Google og booker uten å snakke med oss.",
          outcome: [
            { label: "Tomgang", value: "−45%" },
            { label: "Inntekter fra eksterne", value: "+3×" },
            { label: "Resepsjons-tid", value: "−4 t/uke" },
          ],
        },
      ]}
      technical={[
        {
          label: "Bookingmodus",
          value: "Direkte (ansatte og lag), saksbehandler-godkjenning (innbyggere, kommersielle), eller åpen (først til mølla).",
        },
        {
          label: "Outlook-integrasjon",
          value: "Toveis CalDAV/Microsoft Graph. Free/busy-status hentes fra og skrives til kalenderen. Møteinvitasjoner sendes til deltakere.",
        },
        {
          label: "Prising",
          value: "Per time, halvdag, heldag, eller fastpris. Tariffer per brukergruppe (ansatt, politiker, lag, kommersiell, innbygger). Sesongrabatter mulig.",
        },
        {
          label: "Sambruk",
          value: "Faste tidsblokk per avdeling/institusjon med prioritering, eller helt åpen sambruk. Konflikter løses automatisk i prioritetsrekkefølge.",
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS digital nøkkel (mobil/kode), eller integrasjon mot eksisterende fysisk adgangskontroll. Aktiv 15 min før til 15 min etter booking.",
        },
        {
          label: "Bekreftelse",
          value: "Bookeren får SMS 15 min før møtet med lenke 'jeg er på vei'. Manglende bekreftelse frigjør rommet etter 5 min for automatisk tildeling til ventelisten.",
        },
        {
          label: "Bilag og faktura",
          value: "Ansatt-bookinger: ingen bilag. Lag/forening: faktura månedlig samlet. Kommersielle: faktura per booking via EHF/Peppol til regnskapssystemet.",
        },
        {
          label: "Innbygger-tilgang",
          value: "Logge inn med ID-porten. Se kommunale møterom som er åpne for innbyggerbruk, book i sanntid.",
        },
      ]}
      pullQuote={{
        text: "Vi har redusert dobbeltbookinger til null og fått tilbake fire timer i uka som tidligere gikk til regnearkjusteringer.",
        byline: "Kulturkonsulent, norsk kommune (anonymisert)",
      }}
      faq={[
        {
          question: "Hva skjer hvis to ansatte prøver å booke samme rom samtidig?",
          answer:
            "Kalenderen oppdateres med optimistisk lås. Den første som klikker 'bekreft booking' vinner. Den andre ser umiddelbart at tiden er borte og må velge et annet rom eller tid. Ingen dobbeltbooking mulig.",
        },
        {
          question: "Kan vi importere våre eksisterende Outlook-bookinger?",
          answer:
            "Ja. Vi importerer historiske og fremtidige Outlook-bookinger ved oppstart. Etter importen er Digilist sannhetskilden, og Outlook synces toveis derfra.",
        },
        {
          question: "Hvordan håndteres bookinger som overlapper med rengjøring?",
          answer:
            "Rengjørings-vinduer er definert per rom (f.eks. 10 min etter hver booking). Plattformen blokkerer automatisk denne tiden, og renholdspersonell får varsel om når og hvor.",
        },
        {
          question: "Kan foreninger booke gratis hvis vi har avtale med dem?",
          answer:
            "Ja. Foreningstilskudd er en egen prisregel: foreninger som er registrert hos kommunen kan booke utvalgte rom gratis innenfor et årlig tildelt antall timer. Plattformen holder regnskap.",
        },
        {
          question: "Hva med universell utforming for innbyggere som ikke er digitale?",
          answer:
            "Plattformen oppfyller WCAG 2.1 AA. Saksbehandlere kan booke på vegne av innbyggere som ikke kan logge inn selv. Vi tilbyr også enkel SMS-flyt for de mest grunnleggende bookingene.",
        },
        {
          question: "Hva er forskjellen mellom et møterom og et selskapslokale i Digilist?",
          answer:
            "Møterom har typisk timesbasert booking, Outlook-integrasjon, ansatt-pålogging. Selskapslokaler har dag-/helg-basert booking, depositum, signert leieavtale. Du kan ha begge typer på samme plattform.",
        },
      ]}
      relatedPosts={[
        {
          title: "Bookingkalender for innbygger og saksbehandler",
          slug: "bookingkalender-for-innbygger-og-saksbehandler",
        },
        {
          title: "Realtime-varsler og driftsroller",
          slug: "realtime-varsler-driftsroller",
        },
        {
          title: "En plattform mot fem verktøy",
          slug: "en-plattform-mot-fem-verktoy",
        },
      ]}
      siblings={SIBLINGS}
    />
  );
}
