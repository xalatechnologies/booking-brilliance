import UseCasePage from "@/components/UseCasePage";

const SIBLINGS = [
  { title: "Møterom", slug: "moterom" },
  { title: "Idrettshaller og gymsaler", slug: "idrettshaller-gymsaler" },
  { title: "Kulturhus og kantiner", slug: "kulturhus-kantiner" },
];

export default function UseCaseSelskapslokaler() {
  return (
    <UseCasePage
      slug="selskapslokaler"
      breadcrumb="Selskapslokaler"
      title="Selskapslokaler"
      dek="Bryllup, jubileer, firmafester. Bookinger som binder seg juridisk, betaler depositum og åpner døren med digital nøkkel."
      lead="Eier du et selskapslokale, vet du at hver helg blir bestilt av folk som planlegger en stor dag. Det krever en bookingplattform som tar gjestene seriøst: med ledige helger i sanntid, juridisk leieavtale signert med BankID, depositum reservert via Vipps og dørtilgang når dagen kommer."
      seoTitle="Selskapslokaler: bookingsystem for bryllup og selskap · Digilist"
      seoDescription="Bookingplattform for selskapslokaler: sanntidskalender, depositum via Vipps, BankID-signert leieavtale, digital nøkkel og automatisk faktura."
      keywords="selskapslokale, booking selskapslokale, leie selskapslokale, bryllupslokale booking, depositum Vipps, BankID leieavtale, digital nøkkel, jubileum"
      audience={[
        {
          persona: "Eiere av selskapslokaler",
          context: "Privatpersoner eller småbedrifter som leier ut én eller flere saler, gjerne i tilknytning til gård, museum, restaurant eller historisk eiendom.",
        },
        {
          persona: "Kulturhus og bedehus",
          context: "Frivillige organisasjoner eller stiftelser som leier ut storsal og mindre lokaler til private arrangementer for å finansiere drift.",
        },
        {
          persona: "Hoteller og restauranter",
          context: "Steder med separat selskapssal/festsal som ønsker direkte booking uten å gå gjennom hovedreservasjonssystemet.",
        },
        {
          persona: "Kommunale festhus",
          context: "Kommuner som leier ut storstuer, samfunnshus eller historiske selskapslokaler til innbyggere, som regel via egne avdelinger.",
        },
        {
          persona: "Idrettslag og foreninger",
          context: "Klubbhus med selskapsareal, som leies ut for å støtte foreningsdriften, uten at det skal kreve ansatte for å håndtere.",
        },
        {
          persona: "Borettslag og sameier",
          context: "Felleslokaler som beboere booker for selskap, fødselsdager og familieselskap, typisk med depositum og rengjøringsavtale.",
        },
      ]}
      problems={[
        "Telefon og e-post fylles opp av forespørsler om ledige helger. Ingen sentral oversikt for utleier.",
        "Excel-regneark for booking gir dobbeltbookinger som først oppdages når to brudefølger møtes i samme sal.",
        "Depositum-håndtering er manuell: bankoverføring, kvittering, papirkontrakt, tilbakebetaling. Krever oppfølging i ukevis.",
        "Leieavtale signeres på papir eller PDF. Vanskelig å arkivere, vanskelig å håndheve hvis ting skjer.",
        "Nøkkel må overleveres fysisk. Eier blir bundet til faste klokkeslett for utlevering og innlevering.",
      ]}
      features={[
        {
          title: "Ledige helger i sanntid",
          body: "Innbygger ser ledige datoer øyeblikkelig. Reserverte og bekreftede bookinger låses i kalenderen så ingen kan booke samme tid.",
        },
        {
          title: "Depositum via Vipps eller kort",
          body: "Beløpet reserveres ved booking, frigis automatisk etter bruk hvis ingenting er meldt, eller belastes ved skade etter eierens vurdering.",
        },
        {
          title: "Leieavtale signert med BankID",
          body: "Juridisk bindende eID-signatur. Avtalen lagres digitalt og kan vises frem ved konflikt. Mal kan tilpasses per type arrangement.",
        },
        {
          title: "Digital nøkkel via Salto KS",
          body: "Adgangskode eller mobilnøkkel sendes 24 t før arrangement, deaktiveres automatisk etter avtalt sluttid. Ingen fysisk overlevering nødvendig.",
        },
        {
          title: "Tilleggstjenester per booking",
          body: "Rengjøring, dekorering, AV-utstyr, ekstra møblement, som pakkepris eller per stykk. Gjesten ser totalpris før hun signerer.",
        },
        {
          title: "Automatisk faktura og bilag",
          body: "Etter arrangementet sendes kvittering via e-post og bilag direkte til regnskapssystemet ditt (Visma, Tripletex, Fiken eller EHF).",
        },
      ]}
      stories={[
        {
          customer: "Rønning Selskapslokale",
          role: "Eier (Asker)",
          headline: "Fra excelark til kalenderautomatikk",
          body: "Vi har drevet utleie til private selskap siden 2008. Tidligere booket folk via SMS eller telefon, vi førte det inn i Excel, og hver høst hadde vi minst én dobbeltbooking. Med Digilist ser gjestene ledige helger selv, betaler depositum via Vipps, signerer leieavtalen med BankID, og får portkoden 24 timer før. Vi gjorde over 80 bookinger forrige år uten en eneste dobbeltbooking, og bruker betydelig mindre tid på administrasjon.",
          outcome: [
            { label: "Reduserte adm.-tid", value: "−65%" },
            { label: "Dobbeltbookinger", value: "0" },
            { label: "Bookinger fra mobil", value: "+82%" },
          ],
        },
        {
          customer: "Kulturhus (eksempel-persona)",
          role: "Frivillig drift",
          headline: "Storsalen leid ut hver helg uten ansatt på vakt",
          body: "Bygdas kulturhus drives av frivillige. Storsalen leies ut til konfirmasjoner, jubileer og bygdefester. Vi har ingen ansatt som kan ta imot kontanter eller møte opp for nøkkelovertaking. Med Digilist går alt automatisk: leietaker booker, betaler depositum, signerer avtalen og får adgangskode. Vi får automatisk faktura ført direkte til regnskapet.",
          outcome: [
            { label: "Bookinger per måned", value: "~14" },
            { label: "Fakturarunde", value: "0 min/uke" },
            { label: "Adm.-tid", value: "−80%" },
          ],
        },
      ]}
      technical={[
        {
          label: "Bookingmodus",
          value: "Direkte (innbygger booker uten godkjenning) eller med saksbehandler-godkjenning per anlegg.",
        },
        {
          label: "Betaling",
          value: "Vipps, kort (via Stripe), faktura (EHF/Peppol for organisasjoner). Depositum holdes som pre-autorisasjon eller engangsbeløp.",
        },
        {
          label: "Leieavtale",
          value: "Digital signering med BankID eller ID-porten. Maler per arrangement-type. Lagring i 10 år iht. bokføringsloven.",
        },
        {
          label: "Adgangskontroll",
          value: "Salto KS (mobilnøkkel + kode), eller kobling mot eksisterende fysiske adgangskontroll-systemer via integrasjon.",
        },
        {
          label: "Avbestilling",
          value: "Konfigurerbare regler per lokale (full refusjon, delvis, ingen refusjon). Refusjon initieres automatisk ved kansellering.",
        },
        {
          label: "Skader / klage",
          value: "Eier kan registrere skader innen 48 timer etter arrangement og bruke depositum til dekning. Saksbehandler beslutter ved tvist.",
        },
        {
          label: "Personvern",
          value: "All persondata i Norge og EU. GDPR-kompatibel. Data slettes 10 år etter siste booking.",
        },
        {
          label: "Universell utforming",
          value: "WCAG 2.1 AA. BankID + ID-porten fungerer for alle innbyggere uavhengig av digital ferdighet.",
        },
      ]}
      pullQuote={{
        text: "Tidligere holdt vi styr på bookinger i regneark. Nå ser gjestene ledige helger selv, betaler depositum og signerer leieavtalen med BankID. Vi unngår dobbeltbookinger og får automatisk faktura.",
        byline: "Eier av Rønning Selskapslokale, Asker",
      }}
      faq={[
        {
          question: "Hvor mye koster det å bruke Digilist for ett selskapslokale?",
          answer:
            "Prisen avhenger av antall bookinger per måned og om du trenger digitalnøkkel-integrasjon. Basispakken for små eiere starter på et fast månedsbeløp. Vi tilbyr gratis pilot i 30 dager. Be om tilbud for konkret prising.",
        },
        {
          question: "Hva skjer hvis leietaker ikke betaler depositum?",
          answer:
            "Bookingen blir ikke bekreftet før depositumet er reservert via Vipps eller kort. Hvis depositumet feiler, blir tidsluken fri igjen etter 30 minutter, og kunden får e-post om å prøve igjen.",
        },
        {
          question: "Kan jeg ha forskjellige priser i helg vs ukedag?",
          answer:
            "Ja. Priser settes per dag, time-block eller hel-leie. Du kan også ha sesongpriser (sommer vs vinter), eller spesielle priser for spesifikke dagsoner som nyttårsaften.",
        },
        {
          question: "Hvordan håndteres skader på lokalet etter arrangement?",
          answer:
            "Du har 48 timer på å registrere skader via plattformen, med bilde og beskrivelse. Hele eller deler av depositumet kan brukes til dekning. Leietaker varsles automatisk og kan klage hvis uenig. Saksbehandler avgjør tvist.",
        },
        {
          question: "Kan flere personer i samme husholdning booke under samme konto?",
          answer:
            "Ja. Innbyggeren kan ha en personlig konto (logget inn med BankID) eller booke på vegne av en organisasjon (også med BankID). All historikk er knyttet til den juridiske parten som signerte leieavtalen.",
        },
        {
          question: "Vi er en kommune. Kan vi bruke Digilist for selskapslokaler som tilhører kommunen?",
          answer:
            "Absolutt. Kommunale selskapslokaler kan administreres på lik linje med private, med ID-porten-pålogging, EHF-fakturering og kommunal driftsrolle-varsling. Se også /bookingsystem-kommune for SSA-L 2026-overflate.",
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
        {
          title: "Magic-link, SMS og BankID: sikker innlogging",
          slug: "magic-link-sms-bankid-sikker-innlogging",
        },
      ]}
      siblings={SIBLINGS}
    />
  );
}
