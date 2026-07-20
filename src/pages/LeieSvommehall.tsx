import UseCasePage from "@/components/UseCasePage";

export default function LeieSvommehall() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="svommehall"
      breadcrumb="Svømmehall"
      title="Leie svømmehall"
      dek="Barnebursdag, svømmegruppe eller kurs. Finn ledig svømmehall nær deg, se pris og regler, og book basseng på nett."
      lead="Skal du leie svømmehall til bursdag, svømmegruppe eller kurs, går det ofte via kommunens skjema eller en telefon i kontortiden. Det er uklart hva som er ledig utenom klubbtidene, hva det koster, og hvilke regler som gjelder for badevakt og antall badende. På Digilist ser du ledige tider i basseng og svømmehaller nær deg samlet ett sted, med pris og regler synlig før du booker direkte. Faste baner og klubbtider tildeles av kommunen i egen prosess, de ledige enkelttimene utenom booker du her."
      seoTitle="Leie svømmehall og basseng: se ledige tider og book | Digilist"
      seoDescription="Leie svømmehall eller basseng til bursdag, svømmegruppe eller kurs: se ledige tider utenom klubbtidene, pris og regler, og book direkte på nett. Samlet ett sted."
      keywords="leie svømmehall, leie basseng, svømmehall til leie, leie svømmebasseng, basseng til bursdag, leie basseng til arrangement, svømmehall enkelttime, booke svømmehall"
      audience={[
        {
          persona: "Familier med barnebursdag",
          context: "Dere vil samle bursdagsgjengen i bassenget en lørdag. Da trenger dere en time som faktisk er ledig, tydelige regler for barn i vannet, og en pris dere ser før dere booker.",
        },
        {
          persona: "Svømmegrupper og lag",
          context: "Klubbtidene dekker ikke alt. Når dere trenger en ekstra bane før stevnet eller i ferien, vil dere finne ledige enkelttimer uten en ny søknadsrunde.",
        },
        {
          persona: "Kursholdere",
          context: "Babysvømming, svømmekurs eller livredningskurs trenger basseng med riktig temperatur og faste ukentlige timer, og en enkel måte å booke dem på.",
        },
        {
          persona: "Private arrangement og lukket bading",
          context: "Vennegjenger, bedrifter og foreninger som vil ha bassenget for seg selv en kveld, med krav til badevakt og kapasitet avklart på forhånd.",
        },
      ]}
      problems={[
        "Booking går via kommunens sentralbord eller et skjema, ofte bare i kontortiden, og svaret kan ta dager.",
        "Det er uklart hva som faktisk er ledig utenom klubbtider, skolesvømming og publikumsbading.",
        "Prisen for en bane eller hele bassenget står sjelden oppgitt noe sted.",
        "Regler om badevakt, livredningskompetanse og antall badende dukker opp sent i prosessen, i stedet for å stå tydelig før du booker.",
        "Fasiliteter som vanntemperatur, antall baner og garderober må du ringe for å finne ut av.",
      ]}
      features={[
        {
          title: "Ledige tider i sanntid",
          body: "Kalenderen viser hvilke timer og baner som faktisk er ledige utenom klubbtider og publikumsbading. Du slipper å ringe og spørre, du ser det selv.",
        },
        {
          title: "Haller og basseng nær deg, samlet",
          body: "Kommunale svømmehaller, skolebasseng og opplæringsbasseng i nærområdet på ett sted. Ett søk i stedet for å lete på hver kommunes sider etter et svømmebasseng.",
        },
        {
          title: "Book enkelttimer uten søknad",
          body: "Enkelttimer booker du direkte, uten søknadsskjema og saksbehandling. Faste baner og klubbtider tildeles av kommunen i egen prosess, resten er åpent for deg.",
        },
        {
          title: "Pris synlig før du booker",
          body: "Timepris for en bane eller hele bassenget står på timen før du bekrefter. Ingen overraskelser på faktura i etterkant.",
        },
        {
          title: "Regler og badevakt oppgitt",
          body: "Krav om badevakt eller livredningskompetanse, maks antall badende og aldersgrenser står tydelig på hver hall, så du vet hva som kreves før du booker.",
        },
        {
          title: "Fasiliteter beskrevet",
          body: "Antall baner, garderober, vanntemperatur, dybde og eventuelt stupebrett står oppgitt på hver svømmehall. Du vet hva du får før du kommer.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: barnebursdag i bassenget",
          role: "Illustrasjon",
          headline: "Bassenget booket til bursdagen på en kveld",
          body: "Slik kan det se ut: I stedet for å ringe kommunen i kontortiden og vente på svar, søker familien opp svømmehaller i nærheten, ser hvilke lørdagstimer som er ledige utenom klubbtidene, leser reglene om badevakt og antall barn i vannet, og booker timen med Vipps samme kveld.",
          outcome: [
            { label: "Telefoner til kommunen", value: "0" },
            { label: "Regler synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: svømmegruppe før stevne",
          role: "Illustrasjon",
          headline: "Ekstra bane uten ny søknadsrunde",
          body: "Slik kan det se ut: En svømmegruppe har sine faste klubbtider tildelt av kommunen, men trenger en ekstra bane før stevnet. I stedet for en ny søknadsrunde ser treneren hvilke enkelttimer som er ledige i hallene i nærheten, sammenligner pris og antall baner, og booker to kveldstimer direkte.",
          outcome: [
            { label: "Søknad", value: "Ikke nødvendig" },
            { label: "Ledige timer", value: "I sanntid" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvittering kommer med en gang, ingen faktura i posten.",
        },
        {
          label: "Ledige tider",
          value: "Sanntidskalender som viser hvilke timer og baner som er ledige utenom klubbtider, skolesvømming og publikumsbading.",
        },
        {
          label: "Pris",
          value: "Timepris for bane eller hele basseng vises før du bekrefter, med eventuelle tillegg oppgitt.",
        },
        {
          label: "Fasiliteter",
          value: "Antall baner, garderober, vanntemperatur og dybde står oppgitt på hver svømmehall.",
        },
        {
          label: "Regler",
          value: "Krav om badevakt eller livredningskompetanse, maks antall badende og aldersgrenser står tydelig på hallen før du booker.",
        },
        {
          label: "Sesong og klubbtider",
          value: "Faste baner og klubbtider tildeles av kommunen i egen sesongprosess. Enkelttimene utenom vises og bookes direkte her.",
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
        text: "Svømmehallene der du bor, med ledige timer, pris og regler synlig før du booker. Ikke et skjema hos kommunen og dagevis med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Kan jeg leie svømmehall privat?",
          answer:
            "Ja. Mange kommunale svømmehaller leier ut enkelttimer til private utenom klubbtider og publikumsbading, både enkeltbaner og hele basseng. Reglene for badevakt og antall badende varierer per hall og står oppgitt før du booker.",
        },
        {
          question: "Hva koster det å leie svømmehall eller basseng?",
          answer:
            "Prisen varierer med hall, tidspunkt og om du leier en bane eller hele bassenget. En enkeltbane koster gjerne noen hundre kroner per time, hele basseng mer. På Digilist ser du prisen for akkurat din time før du bekrefter.",
        },
        {
          question: "Hva med badevakt og sikkerhetsregler?",
          answer:
            "De fleste haller krever at noen i gruppen har godkjent livredningskompetanse, eller at hallen stiller med badevakt mot et tillegg. Kravene, sammen med maks antall badende og aldersgrenser, står på hver hall før du booker.",
        },
        {
          question: "Hva er forskjellen på klubbtider og ledige tider?",
          answer:
            "Faste baner og klubbtider tildeles av kommunen i en egen sesongprosess, typisk etter søknad fra klubber og lag. De ledige tidene utenom, enkelttimer på kvelder og i helger, er det du finner og booker direkte på Digilist.",
        },
        {
          question: "Kan jeg leie basseng til barnebursdag?",
          answer:
            "Ja, mange svømmehaller tilbyr timer for lukkede grupper som passer til bursdag. Sjekk kapasiteten, aldersreglene og kravet til antall voksne i vannet på den aktuelle hallen, alt står oppgitt før du booker.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av hallen og vises på timen før du booker. Der det er tillatt, avbestiller du digitalt og får pengene tilbake etter reglene som gjelder for hallen.",
        },
      ]}
      relatedPosts={[
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
        {
          title: "Idrettshall: enkelttime, søknad og godkjenning",
          slug: "idrettshall-enkelttime-saksbehandler-soknad-godkjenning-venteliste",
        },
      ]}
    />
  );
}
