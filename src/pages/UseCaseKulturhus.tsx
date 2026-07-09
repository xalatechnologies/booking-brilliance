import UseCasePage from "@/components/UseCasePage";

const SIBLINGS = [
  { title: "Selskapslokaler", slug: "selskapslokaler" },
  { title: "Møterom", slug: "moterom" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" },
];

export default function UseCaseKulturhus() {
  return (
    <UseCasePage
      slug="kulturhus-kantiner"
      breadcrumb="Kulturhus og kantiner"
      title="Kulturhus og kantiner"
      dek="Forestillinger, konserter, åpne dager. Adgangskontroll via Salto KS, automatisk varsling av driftsroller og bilag direkte til regnskap."
      lead="Kulturhus og kantiner er offentlige arenaer. De skal være tilgjengelige, drives sikkert, og levere alt fra en intim teater-forestilling til en åpen lørdagskafé på samme uke. Digilist gir kulturhus-administrasjonen sanntidskalender, billettsalgs-integrasjon, vakts-varsling, og automatiske bilag til regnskapssystemet, uten å fjerne det menneskelige preget."
      seoTitle="Kulturhus og kantiner: bookingsystem for kommunale arenaer · Digilist"
      seoDescription="Bookingsystem for kulturhus, kantiner og kommunale arenaer. Forestillinger, konserter, åpne dager. Adgangskontroll, driftsrolle-varsling, EHF-fakturering."
      keywords="kulturhus booking, kantine booking, kommunal kantine, kulturhus arrangement, Salto KS, kulturhus utleie, kommunal kultur, åpne dager"
      audience={[
        {
          persona: "Kommunale kulturhus",
          context: "Hovedarena for kommunens kulturliv: bruk av kulturkonsulent for arrangement, ekstern utleie til konserter og bryllup, åpne dager for innbyggere.",
        },
        {
          persona: "Stiftelser og kulturhus-AS",
          context: "Selvstendige kulturhus drevet på vegne av eller med tilskudd fra kommunen. Har egen drift men deler infrastruktur med kommunal billettsalg eller turnévirksomhet.",
        },
        {
          persona: "Kantiner i kommunehus",
          context: "Lunsj-kantiner som også brukes som arrangement-areal kveld og helg, for jubileer, foreningsmøter eller eksterne arrangement.",
        },
        {
          persona: "Konsert- og scenekunstaktører",
          context: "Eksterne arrangører som leier kulturhus eller scenearealer for konsert, teater, foredrag, trenger forutsigbar pris og rask bekreftelse.",
        },
        {
          persona: "Bibliotek og museer",
          context: "Offentlige institusjoner som leier ut møtefasiliteter eller arrangementsareal, ofte gratis til frivillighet og betalt til kommersielle.",
        },
        {
          persona: "Bydelshus og frivillighetssentral",
          context: "Lokalsamfunns-arenaer drevet av kommunen eller frivillighet, ofte med liten administrasjon men mange brukere på dugnad.",
        },
      ]}
      problems={[
        "Forestillinger, konserter og åpne dager krever forskjellig drift, men alt går gjennom samme kalender uten differensiering.",
        "Vakter, renhold, AV-tekniker, kafé-personale må alle informeres separat, i dag via separate e-poster eller ringerunde dagen før.",
        "Eksterne kunder ringer kulturhus-administrasjon for booking-forespørsel; pris og tilgjengelighet svares manuelt etter 'la meg sjekke kalenderen'.",
        "Kantiner brukes til arrangement på kvelden, men kafé-driften vet ikke om noen booket lokalet før folk møter opp.",
        "Bilag for utleie og bookinger må manuelt registreres i regnskapet. Kulturhus-administrasjon bruker timer per måned på dette.",
      ]}
      features={[
        {
          title: "Differensiert arrangement-flyt",
          body: "Forestilling, konsert, jubileum, åpen dag og firmaarrangement har hver sin booking-mal med riktige felter, godkjenningstrinn og driftsrolle-varsler.",
        },
        {
          title: "Driftsrolle-varsling",
          body: "Vakter, renhold, lyd-teknikker, kafé-leder, vekter, får alle automatisk SMS med relevant info når en booking er bekreftet. Ingen mottakerlister å vedlikeholde manuelt.",
        },
        {
          title: "Sanntidskalender + ekstern booking",
          body: "Kulturhus-administrasjon ser alle bookinger samme sted. Eksterne kunder kan se ledige datoer på offentlig nettside og forhåndsbestille. Saksbehandler godkjenner med ett klikk.",
        },
        {
          title: "Salto KS adgangskontroll",
          body: "Mobilnøkkel/PIN-kode aktiveres automatisk for arrangører og leverandører. Kafé har permanent tilgang, eksterne arrangører får tidsbegrenset tilgang.",
        },
        {
          title: "Billettsalgs-integrasjon",
          body: "For arrangement med billett kobles vi mot ekstern billettleverandør (Ticketmaster, Hoopla, ven). Antall solgte plasser oppdateres mot kapasitetsgrensen.",
        },
        {
          title: "Bilag og EHF-faktura",
          body: "Etter hvert arrangement sendes bilag automatisk til kommunens regnskapssystem (Visma, Tripletex, EHF/Peppol). Inntekter delt på riktig kostnadssted og kontoplan.",
        },
      ]}
      stories={[
        {
          customer: "Kommunalt kulturhus",
          role: "Kulturkonsulent (eksempel-persona)",
          headline: "Tre arrangementer per kveld uten å miste oversikten",
          body: "Vi har storsal, kafé, blackbox og foajé, fire arenaer som ofte kjøres parallelt. Tidligere brukte vi Outlook og en delt Excel for å koordinere. Nå har vi én sanntidskalender, og når en konsert bekreftes får lyd-tekniker og renhold automatisk SMS med scenisk plan og oppmøtetid. Vi fikk satt opp 23 arrangementer den siste måneden uten en eneste koordineringsfeil.",
          outcome: [
            { label: "Koordineringsfeil", value: "0" },
            { label: "Adm.-tid", value: "−55%" },
            { label: "Arrangement/mnd", value: "23" },
          ],
        },
        {
          customer: "Bygdas frivillighetshus",
          role: "Frivillig daglig leder",
          headline: "Bygda har 60 arrangementer i året, alle gjennom plattformen",
          body: "Vi drives av frivillighet og har ingen kontortid. Bygdas folk bruker huset til møter, fester, korøvelser, dugnadsmøter, alt mulig. Tidligere måtte folk ringe meg på fritiden eller sende SMS. Nå booker de selv via Digilist, betaler hvis nødvendig, og får tilgang automatisk. Jeg ser hva som skjer hver kveld i et oversiktsbilde, men trenger ikke gjøre noe annet enn å åpne dørene mentalt.",
          outcome: [
            { label: "Bookinger/år", value: "~60" },
            { label: "Min/uke på admin", value: "<30 min" },
            { label: "Brukere", value: "alle aldre" },
          ],
        },
      ]}
      technical={[
        {
          label: "Arrangement-maler",
          value: "Forhåndsdefinert per type: forestilling (krever lyd-tekniker), konsert (krever vekter), jubileum (krever renhold), åpen dag (krever vakt). Maler kan tilpasses.",
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS digital nøkkel (mobil + PIN). Permanent for kafé-personale, tidsbegrenset for eksterne arrangører. Adgangslogg lagret 90 dager.",
        },
        {
          label: "Driftsrolle-flyt",
          value: "Hver rolle (vakt, renhold, lyd, scene, kafé) har konfigurerbar varslings-mal og påkrevd oppmøtetid før/etter arrangement. SMS + e-post.",
        },
        {
          label: "Billettsalg",
          value: "Integrasjon mot Hoopla, Ticketmaster, ven (norsk leverandør). Antall solgte oppdateres mot kapasitetsgrensen. Refusjon ved kansellering håndteres av billettleverandør.",
        },
        {
          label: "Prising",
          value: "Per arrangement-type med differensiering for ideell, kommersiell, kommunal egen bruk, og innbygger. Refusjonsregler konfigurerbare per type.",
        },
        {
          label: "Drift av kantine + arrangement",
          value: "Kantine-personale ser hvilke arrangementer som krever kveld-bemanning. Inntekter fra arrangement-utleie og kantinedrift skilles automatisk i regnskap.",
        },
        {
          label: "Pålogging",
          value: "Innbyggere: BankID. Eksterne arrangører: BankID eller magic-link. Driftspersonale: ID-porten. Saksbehandlere: ID-porten ansattlegitimasjon.",
        },
        {
          label: "Regnskap og kostnadssted",
          value: "Bilag konteres automatisk på riktig kostnadssted (kulturhus, kantine, ekstern utleie). EHF-faktura via Peppol til kommunens fakturasystem.",
        },
        {
          label: "Personvern",
          value: "GDPR-kompatibel. ISO 27001 + 27701-sertifisert. Adgangslogger anonymiseres etter 90 dager, transaksjonslogger oppbevares 10 år iht. bokføringsloven.",
        },
      ]}
      pullQuote={{
        text: "Tre arrangement parallelt på en lørdagskveld, uten en eneste e-post mellom oss og lyd-teknikker. Alle vet hvor de skal være og når.",
        byline: "Kulturkonsulent, norsk kommune",
      }}
      faq={[
        {
          question: "Vi har et eksternt billettsystem fra før. Kan vi beholde det?",
          answer:
            "Ja. Vi integrerer mot Hoopla, Ticketmaster, ven og flere. Du beholder ditt eksisterende billettsystem som primær for billett, mens Digilist håndterer lokal-/kalenderbooking og driftsrolle-varsling rundt arrangementet.",
        },
        {
          question: "Hvordan håndteres innbygger som booker selv vs ekstern arrangør?",
          answer:
            "Plattformen kjenner forskjellen via pålogging og rolletilordning. Innbyggere (BankID) booker innenfor egne timer/regler. Eksterne (BankID, men registrert som kommersiell aktør) får annen flyt med pris, faktura og kontrakt.",
        },
        {
          question: "Kan kafé- og lunsj-drift bookes via samme plattform?",
          answer:
            "Kafé-drift er typisk åpningstid + booking-tilfeller på toppen. Vi kan ha kafé-arealet som default 'åpent' i åpningstid og kun blokkere ved spesielle bookinger (firmaarrangement, jubileum) som krever full overtagelse.",
        },
        {
          question: "Hva med arrangementer som krever bevilling (alkohol, mat-servering)?",
          answer:
            "Bevillingssøknader håndteres separat hos kommunen. Plattformen har felter for å registrere om bevilling er innhentet, og kan ikke fullføre bekreftelse uten godkjent bevilling for relevante arrangement-typer.",
        },
        {
          question: "Kan saksbehandlere booke på vegne av innbyggere som ikke kan logge inn?",
          answer:
            "Ja. Saksbehandler kan registrere booking på telefon-/personlig oppmøte og bekrefte direkte. Innbyggeren får e-post-/SMS-kvittering. All bookinghistorikk er knyttet til personen, ikke saksbehandleren.",
        },
        {
          question: "Hvordan integrerer vi med kommunens eksisterende driftsstyringssystem?",
          answer:
            "Vi har åpne API-er for å sende bookingdata til IFS, IBM Maximo, Plania og andre driftsstyringssystemer. Vakter og renhold kan beholde sine eksisterende grensesnitt mens Digilist er sentralregister.",
        },
      ]}
      relatedPosts={[
        {
          title: "Realtime-varsler og driftsroller",
          slug: "realtime-varsler-driftsroller",
        },
        {
          title: "Faktura, refusjon og avstemming",
          slug: "faktura-refusjon-avstemming",
        },
        {
          title: "Min Side: alle bookinger på ett sted",
          slug: "min-side-alle-bookinger-paa-ett-sted",
        },
      ]}
      siblings={SIBLINGS}
    />
  );
}
