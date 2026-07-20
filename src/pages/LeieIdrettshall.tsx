import UseCasePage from "@/components/UseCasePage";

export default function LeieIdrettshall() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="idrettshall"
      breadcrumb="Idrettshall"
      title="Leie idrettshall"
      dek="Trening, turnering eller bursdag i gymsalen. Se ledige enkelttimer i hallene nær deg, og book og betal direkte."
      lead="Vil du inn i en idrettshall eller gymsal, går veien i dag ofte via servicetorget: du ringer eller sender e-post, venter på svar, og vet ikke hva som er ledig eller hva det koster før noen har sjekket for deg. På Digilist ser du ledige enkelttimer i kommunale haller i sanntid, med pris og regler synlig, og booker og betaler direkte med Vipps. Faste treningstider gjennom sesongen fordeles fortsatt av kommunen i egen tildelingsprosess, men de ledige timene utenom, kvelder, helger og hull i timeplanen, kan du booke selv, uten søknad og uten venting."
      seoTitle="Leie idrettshall: ledige enkelttimer og booking | Digilist"
      seoDescription="Leie idrettshall eller gymsal til trening, turnering eller bursdag: se ledige enkelttimer i sanntid, book direkte og betal med Vipps. Ingen søknad, ingen venting."
      keywords="leie idrettshall, leie gymsal, idrettshall enkelttime, leie hall, booke idrettshall, ledige timer idrettshall, leie idrettshall pris, leie gymsal til bursdag"
      audience={[
        {
          persona: "Venner som vil trene sammen",
          context: "En gjeng som vil spille fotball, badminton eller volleyball en kveld i uka, uten å være medlem i en klubb eller søke om treningstid.",
        },
        {
          persona: "Foreldre som planlegger bursdag",
          context: "En gymsal med plass til å løpe er ofte det beste bursdagslokalet. Book et par timer en lørdag, med pris og regler synlig på forhånd.",
        },
        {
          persona: "Lag og foreninger som trenger ekstratimer",
          context: "En ekstra økt før cup, eller en time når den faste tiden ikke strekker til. Enkelttimer utenom sesongtildelingen, booket direkte.",
        },
        {
          persona: "Grupper som arrangerer turnering eller samling",
          context: "Full hallflate en helgedag til minicup, klassesamling eller aktivitetsdag, med tydelig kapasitet, utstyr og totalpris før booking.",
        },
      ]}
      problems={[
        "Ledige timer er usynlige: etter sesongtildelingen ligger hallkalenderen internt hos kommunen, og du må ringe eller sende e-post for å høre hva som er ledig.",
        "Booking går via servicetorg eller skjema, med svartid på dager, ikke minutter.",
        "Prisen er uklar: timepris, hel eller halv flate og eventuelle tillegg får du først vite når noen svarer.",
        "Betaling skjer med faktura i etterkant eller bankoverføring, uten kvittering i det du booker.",
        "Regler om utstyr, garderober, innesko og rydding kommer som overraskelser i stedet for å stå tydelig på forhånd.",
      ]}
      features={[
        {
          title: "Ledige enkelttimer i sanntid",
          body: "Kalenderen viser hvilke timer som faktisk er ledige i hver hall, kvelder, helger og hull i timeplanen. Du booker direkte og får bekreftelsen med en gang.",
        },
        {
          title: "Hallene nær deg, ett søk",
          body: "Idrettshaller og gymsaler i kommunen samlet på ett sted. Du slipper å vite hvilken skole eller etat som eier hallen for å finne den.",
        },
        {
          title: "Book uten søknad",
          body: "Enkelttimer bookes direkte, uten søknadsskjema og uten å vente på saksbehandling. Faste treningstider gjennom sesongen fordeles fortsatt av kommunen i egen prosess.",
        },
        {
          title: "Pris per time, synlig først",
          body: "Timeprisen for hel eller halv flate står på hallen, og totalprisen vises før du bekrefter. Ingen faktura med overraskelser i etterkant.",
        },
        {
          title: "Betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen, og få kvittering med en gang. Ingen bankoverføring og ingen faktura å vente på.",
        },
        {
          title: "Regler og utstyr tydelig på forhånd",
          body: "Hva som er inkludert av mål, nett og matter, om garderober er tilgjengelige, og reglene for innesko og rydding, alt står på hallen før du booker.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: badmintongjeng i nabolaget",
          role: "Illustrasjon",
          headline: "Fra telefon til servicetorget til fast kveldstime",
          body: "Slik kan det se ut: I stedet for å ringe servicetorget og vente på at noen sjekker hallkalenderen, søker gjengen på gymsaler i nærheten, ser at tirsdag klokka 20 er ledig, og booker timen med Vipps. Neste uke gjør de det samme på tretti sekunder.",
          outcome: [
            { label: "Steder å ringe", value: "0" },
            { label: "Ledige timer", value: "Synlig i sanntid" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: barnebursdag i gymsalen",
          role: "Illustrasjon",
          headline: "Gymsalen booket til lørdagsbursdagen",
          body: "En familie finner gymsalen på nærskolen ledig lørdag formiddag, ser at matter og baller er inkludert og hva reglene for rydding er, og booker to timer med pris betalt på forhånd, uten skjema og uten å vente på svar fra kommunen.",
          outcome: [
            { label: "Pris", value: "Før booking" },
            { label: "Booking", value: "På minutter" },
            { label: "Venting på svar", value: "Ingen" },
          ],
        },
        {
          customer: "Eksempel: håndballag før cup",
          role: "Illustrasjon",
          headline: "Ekstratimen som ikke fantes i den faste tiden",
          body: "Laget har sin faste treningstid gjennom sesongtildelingen, men trenger en ekstra økt uka før cup. Treneren finner en ledig time i en annen hall torsdag kveld og booker den direkte, uten å gå veien om en ny søknad til kommunen.",
          outcome: [
            { label: "Søknad", value: "Ingen" },
            { label: "Ledig time funnet", value: "Samme kveld" },
            { label: "Betaling", value: "Vipps" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen, med kvittering med en gang. Ingen faktura i etterkant.",
        },
        {
          label: "Ledige timer",
          value: "Sanntidskalender per hall. Du ser hvilke enkelttimer som er ledige og booker direkte, uten forespørsel eller venting.",
        },
        {
          label: "Pris",
          value: "Timepris for hel eller halv flate står på hallen, og totalprisen vises før du bekrefter. Prisen settes av kommunen eller utleier.",
        },
        {
          label: "Utstyr og fasiliteter",
          value: "Hva som er inkludert av mål, nett, matter og garderober står på hver hall, sammen med regler for innesko og rydding.",
        },
        {
          label: "Sesongtildeling",
          value: "Faste treningstider gjennom sesongen fordeles av kommunen i egen tildelingsprosess og bookes ikke her. Digilist viser de ledige enkelttimene utenom.",
        },
        {
          label: "Avbestilling",
          value: "Avbestillingsreglene settes av utleier og vises på hallen. Der det er tillatt, avbestiller du digitalt.",
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
        text: "Ledige timer i hallene der du bor, synlig i sanntid, med pris og regler før du booker. Ikke en telefon til servicetorget og dager med venting.",
        byline: "Slik er Digilist ment å fungere for deg som vil inn i hallen",
      }}
      faq={[
        {
          question: "Kan jeg leie idrettshall eller gymsal som privatperson?",
          answer:
            "Ja. Ledige enkelttimer i kommunale haller kan bookes av privatpersoner og grupper, til trening, bursdag, turnering eller annen aktivitet. Du trenger ikke være klubb eller forening, og du trenger ikke søke, du booker timen direkte og betaler med Vipps.",
        },
        {
          question: "Hva koster det å leie en time i idrettshall?",
          answer:
            "Prisen settes av kommunen eller utleier og varierer med hallstørrelse, om du leier hel eller halv flate, og tidspunkt. En gymsal koster gjerne mindre enn full flate i en stor hall. På Digilist står timeprisen på hallen, og totalprisen vises før du bekrefter.",
        },
        {
          question: "Hvordan ser jeg hvilke timer som er ledige?",
          answer:
            "Kalenderen på hver hall viser ledige enkelttimer i sanntid, altså tidene som ikke er tatt av sesongtildelingen eller andre bookinger. Du velger en ledig time, booker og får bekreftelsen med en gang, uten å ringe eller sende e-post for å sjekke.",
        },
        {
          question: "Hva med faste treningstider gjennom sesongen?",
          answer:
            "Faste, ukentlige treningstider fordeles av kommunen gjennom sesongtildelingen, en egen søknadsprosess med frister og prioriteringer. Den prosessen erstattes ikke av Digilist. Denne siden handler om enkelttimer: de ledige tidene utenom, som du kan booke direkte uten søknad.",
        },
        {
          question: "Er utstyr og garderober inkludert?",
          answer:
            "Det varierer per hall, og det står tydelig på hallen før du booker: hva som er tilgjengelig av mål, nett og matter, om garderober og dusj er inkludert, og hvilke regler som gjelder for innesko og rydding etter bruk.",
        },
        {
          question: "Kan jeg avbestille en time?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hver hall. Der det er tillatt, avbestiller du digitalt, og refusjon følger reglene som gjelder for hallen.",
        },
      ]}
      relatedPosts={[
        {
          title: "Idrettshall: enkelttime, søknad og godkjenning",
          slug: "idrettshall-enkelttime-saksbehandler-soknad-godkjenning-venteliste",
        },
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
      ]}
    />
  );
}
