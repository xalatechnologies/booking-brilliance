import UseCasePage from "@/components/UseCasePage";

export default function LeieBursdagslokale() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="bursdagslokale"
      breadcrumb="Bursdagslokale"
      title="Leie bursdagslokale"
      dek="Barnebursdag eller voksenbursdag? Finn ledig lokale nær deg, se ekte pris, og book og betal med Vipps."
      lead="Å finne lokale til bursdag betyr ofte leting i Facebook-grupper, Finn-annonser og tips fra andre foreldre, uten å vite hva det koster eller om datoen er ledig før noen svarer. Og når svaret endelig kommer, skal du gjerne betale med bankoverføring til en du aldri har møtt. På Digilist finner du festrom, grendehus, kaféer og aktivitetslokaler i nærområdet samlet ett sted, med ekte pris for din dato, ledige datoer i sanntid og trygg betaling med Vipps, enten det er barnebursdag eller runde år."
      seoTitle="Leie bursdagslokale: pris, ledige datoer og booking | Digilist"
      seoDescription="Leie bursdagslokale til barnebursdag eller voksenbursdag: finn ledig lokale til bursdag nær deg, se ekte pris og book med Vipps. Alt samlet ett sted."
      keywords="leie bursdagslokale, leie lokale til bursdag, barnebursdag lokale, lokale til bursdag, bursdagsselskap lokale, leie lokale til barnebursdag, voksenbursdag lokale, leie festlokale bursdag"
      audience={[
        {
          persona: "Foreldre til barnebursdag",
          context: "Dere trenger et lokale med plass til hele klassen, gjerne med kjøkken eller aktivitet, og en pris dere kan stole på før invitasjonene sendes.",
        },
        {
          persona: "Voksne som fyller runde år",
          context: "30, 40, 50 eller 60. Du vil ha et lokale med kjøkken og god plass til gjestene, bookbart på nett uten å ringe rundt og vente på svar.",
        },
        {
          persona: "Familier som feirer sammen",
          context: "Flere bursdager slått sammen, besteforeldre som fyller år, eller storfamilien samlet. Ett lokale i nærområdet med plass til alle generasjoner.",
        },
        {
          persona: "Ungdom og konfirmanter",
          context: "Bursdag for tenåringer eller feiring i konfirmasjonsåret. Et trygt lokale der sluttid, regler og hva som er lov står tydelig på forhånd.",
        },
      ]}
      problems={[
        "Bursdagslokalene ligger spredt: Finn-annonser, Facebook-grupper, kommunens sider og tips fra andre foreldre, uten ett sted å søke.",
        "Prisen er uklar til du har sendt en forespørsel og ventet på svar, ofte tett opp mot bursdagen.",
        "Ingen ekte kalender: du vet ikke om lørdagen er ledig før noen svarer på melding eller e-post.",
        "Betaling skjer med bankoverføring til en privatperson du aldri har møtt, uten kvittering eller trygghet.",
        "Hva som er inkludert, kjøkken, bord og stoler, rydding og sluttid, kommer som overraskelser i stedet for å stå tydelig før du booker.",
      ]}
      features={[
        {
          title: "Alle bursdagslokaler nær deg, ett søk",
          body: "Festrom, grendehus, kaféer, aktivitetslokaler og gymsaler samlet på ett sted. Du slipper å lete gjennom Finn, Facebook og kommunens sider hver for seg.",
        },
        {
          title: "Ekte pris for din dato",
          body: "Se totalprisen for akkurat din dato og varighet, inkludert eventuelt depositum og rengjøring, før du booker. Ingen prissjokk etter at invitasjonene er sendt.",
        },
        {
          title: "Ledige datoer i sanntid",
          body: "Kalenderen viser hvilke lørdager og søndager som faktisk er ledige. Du booker direkte og får bekreftelsen med en gang, ingen uforpliktende forespørsel.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt. Depositum håndteres digitalt og frigjøres automatisk etter bursdagen. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Hva som er inkludert, synlig",
          body: "Kjøkken, bord og stoler, prosjektor, lekerom eller aktivitet. Alt som følger med lokalet står tydelig oppført, så du vet hva du må ta med selv.",
        },
        {
          title: "Vilkår uten overraskelser",
          body: "Rydding, sluttid, aldersgrense og om du kan komme dagen før for å pynte. Alt står på lokalet før du bekrefter, ikke i en e-post etterpå.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: barnebursdag for 2. klasse",
          role: "Illustrasjon",
          headline: "Hele klassen invitert, lokalet booket på kvelden",
          body: "Slik kan det se ut: I stedet for å spørre i Facebook-gruppa og vente på tips, søker en forelder på dato og område, finner et aktivitetslokale med plass til 25 barn, ser at kjøkken, bord og stoler er inkludert, og booker med Vipps samme kveld, med bekreftelse med en gang.",
          outcome: [
            { label: "Steder å spørre", value: "0" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Booket", value: "Samme kveld" },
          ],
        },
        {
          customer: "Eksempel: 40-årsdag i nabolaget",
          role: "Illustrasjon",
          headline: "Grendehuset med kjøkken, uten ti telefoner",
          body: "Slik kan det se ut: Et par som skal feire 40-årsdag finner grendehuset ledig den lørdagen de ønsker, ser at kjøkken og bord til 40 gjester er inkludert, leser vilkårene om rydding og sluttid, og booker med depositum betalt via Vipps, uten å vente på at noen skal svare.",
          outcome: [
            { label: "Vilkår", value: "Tydelige" },
            { label: "Venting på svar", value: "Ingen" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk etter bursdagen.",
        },
        {
          label: "Ledige datoer",
          value: "Sanntidskalender, du ser hvilke datoer som er ledige og booker direkte. Ingen forespørsel og venting på svar.",
        },
        {
          label: "Pris",
          value: "Totalpris for din dato og varighet, inkludert depositum og eventuell rengjøring, vises før du bekrefter.",
        },
        {
          label: "Utstyr",
          value: "Kjøkken, bord og stoler, kjøleskap, prosjektor og eventuelt lekeutstyr står oppført på hvert lokale, så du vet hva som følger med og hva du tar med selv.",
        },
        {
          label: "Kapasitet",
          value: "Antall gjester lokalet passer for står tydelig, både for bordsetting og lek. Du kan filtrere på antall gjester når du søker.",
        },
        {
          label: "Vilkår",
          value: "Rydding, sluttid, aldersgrense og regler for pynting står tydelig på hvert lokale før du booker.",
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
        text: "Lokale til barnebursdag eller runde år, med ekte pris og ledig lørdag synlig før du booker. Ikke leting i Facebook-grupper og dagevis med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et bursdagslokale?",
          answer:
            "Prisen varierer med type lokale, sted og varighet. Et festrom eller grendehus til barnebursdag kan koste fra noen hundrelapper for noen timer, mens et større lokale med kjøkken til voksenbursdag gjerne ligger fra tusenlappen og oppover for en kveld. På Digilist ser du totalprisen for din dato, inkludert depositum og rengjøring, før du booker.",
        },
        {
          question: "Hvor finner jeg lokale til barnebursdag?",
          answer:
            "Søk på sted og dato på Digilist, så ser du festrom, grendehus, aktivitetslokaler og gymsaler i nærområdet som faktisk er ledige. Du kan filtrere på antall barn og se om kjøkken, bord og lekeutstyr er inkludert, før du booker direkte.",
        },
        {
          question: "Hva er inkludert når jeg leier bursdagslokale?",
          answer:
            "Det varierer, og derfor står det tydelig på hvert lokale. Mange har kjøkken med kjøleskap og kaffetrakter, bord og stoler til alle gjestene, og noen har prosjektor, lydanlegg eller lekerom. Det som ikke følger med, som duker, pynt og servise, tar du med selv.",
        },
        {
          question: "Hvor mange gjester er det plass til?",
          answer:
            "Kapasiteten står på hvert lokale. Til barnebursdag bør du regne med plass til noen foreldre som blir igjen, og til voksenbursdag skille mellom bordsetting og mingling. Du kan filtrere på antall gjester når du søker.",
        },
        {
          question: "Hvordan betaler jeg, og hva med depositum?",
          answer:
            "Du betaler med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt og frigjøres automatisk etter bursdagen dersom ingenting er meldt. Ingen bankoverføring til en privatperson du ikke kjenner.",
        },
        {
          question: "Kan jeg avbestille hvis bursdagen må flyttes?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert lokale før du booker. Der det er tillatt, avbestiller du digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for lokalet.",
        },
      ]}
      relatedPosts={[
        {
          title: "Leie bryllupslokale: pris, kapasitet og booking",
          slug: "leie-bryllupslokale",
        },
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
      ]}
    />
  );
}
