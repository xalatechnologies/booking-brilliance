import UseCasePage from "@/components/UseCasePage";

export default function LeieKulturhus() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="kulturhus"
      breadcrumb="Kulturhus"
      title="Leie kulturhus"
      dek="Konsert, forestilling, storselskap eller bygdefest. Finn ledig kulturhus, samfunnshus eller grendehus nær deg, se pris og kapasitet, og book med Vipps."
      lead="Skal du arrangere noe som trenger sal, scene eller plass til mange, er kulturhuset og samfunnshuset ofte det beste lokalet i nærområdet. Men å finne ut hva det koster, om datoen er ledig og hvem du skal spørre, betyr gjerne telefoner til kulturkontoret i åpningstiden og venting på svar. På Digilist finner du kulturhus, samfunnshus og grendehus i nærheten samlet ett sted, med pris, kapasitet og fasiliteter som scene og lydanlegg synlig, og ledige datoer du kan booke direkte og betale med Vipps."
      seoTitle="Leie kulturhus: pris, kapasitet og booking | Digilist"
      seoDescription="Leie kulturhus, samfunnshus eller grendehus til konsert, forestilling eller storselskap: se pris, kapasitet og scene/lyd-fasiliteter, finn ledig dato og book med Vipps."
      keywords="leie kulturhus, leie samfunnshus, leie grendehus, kulturhussal til leie, leie kulturhus pris, leie sal med scene, leie lokale til konsert, samfunnshus til leie, grendehus til leie"
      audience={[
        {
          persona: "Musikere og amatørkulturliv",
          context: "Kor, korps, band og teatergrupper som trenger en sal med scene, lyd og plass til publikum, til konsert eller forestilling.",
        },
        {
          persona: "Familier som feirer stort",
          context: "Konfirmasjon, runde dager eller markeringer med flere gjester enn stua tar. Samfunnshuset eller grendehuset har plassen, og bør være like enkelt å booke.",
        },
        {
          persona: "Bygdelag og velforeninger",
          context: "Bygdefest, julemesse, basar eller årsmøte. Dere trenger huset en hel dag eller helg, med kjøkken og vilkår som er tydelige på forhånd.",
        },
        {
          persona: "Arrangører av åpne arrangementer",
          context: "Foredrag, quiz, danseoppvisning eller lokal festival. Kulturhussalen passer, hvis du finner ut hva den koster og når den er ledig.",
        },
      ]}
      problems={[
        "Kulturhus og samfunnshus leies ut via kommunens sider, e-post til kulturkontoret eller en telefon i åpningstiden, sjelden med booking på nett.",
        "Prisen står ofte ikke oppgitt, eller er delt i satser du må tolke selv, og svaret kommer først etter dager.",
        "Du vet ikke om salen er ledig for din dato før noen har sjekket en intern kalender for deg.",
        "Hva som følger med av scene, lydanlegg, prosjektor og kjøkken er uklart til du spør, eller til du står der.",
        "Grendehus bookes gjerne via en frivillig kontaktperson, med betaling til konto og vilkår på et ark.",
      ]}
      features={[
        {
          title: "Kulturhus og grendehus samlet",
          body: "Kulturhus, samfunnshus og grendehus i nærområdet på ett sted. Du søker på sted og dato i stedet for å lete på kommunens sider og ringe kontaktpersoner.",
        },
        {
          title: "Pris og kapasitet synlig",
          body: "Se hva salen koster for din dato og hvor mange den tar, både med bordsetting og publikumsrader, før du booker. Ingen prisliste du må tolke selv.",
        },
        {
          title: "Scene, lyd og fasiliteter oppgitt",
          body: "Om huset har scene, lydanlegg, prosjektor, kjøkken eller garderobe står på lokalet. Du vet hva du får før du bekrefter, ikke når du står der.",
        },
        {
          title: "Ledige datoer i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig. Du booker direkte og får bekreftelsen med en gang, uten å vente på at kulturkontoret svarer.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Depositum håndteres digitalt og frigjøres etter arrangementet. Ingen bankoverføring til en kontaktperson.",
        },
        {
          title: "Vilkårene før du bekrefter",
          body: "Sluttid, rengjøring, alkoholregler og hva du selv må rigge står tydelig på hvert hus før du booker, i stedet for å komme som overraskelser.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: kor i innlandet",
          role: "Illustrasjon",
          headline: "Konsertsalen booket uten en eneste telefon",
          body: "Slik kan det se ut: Koret trenger en sal med scene og plass til publikum til vårkonserten. I stedet for å ringe kulturkontoret finner de kulturhussalen på Digilist, ser kapasitet, lydanlegg og pris for lørdagen, og booker med bekreftelse med en gang.",
          outcome: [
            { label: "Telefoner", value: "0" },
            { label: "Fasiliteter", value: "Synlige før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: konfirmasjon på samfunnshuset",
          role: "Illustrasjon",
          headline: "Storselskapet på plass en kveld i februar",
          body: "En familie med mange gjester finner samfunnshuset ledig for konfirmasjonshelgen, ser at kjøkkenet og kapasiteten holder, leser vilkårene om rengjøring og sluttid, og booker på kvelden med depositum betalt via Vipps.",
          outcome: [
            { label: "Venting på svar", value: "Ingen" },
            { label: "Vilkår", value: "Tydelige" },
            { label: "Booking", value: "På minutter" },
          ],
        },
        {
          customer: "Eksempel: bygdefest i grendehuset",
          role: "Illustrasjon",
          headline: "Hele helgen sikret for bygdelaget",
          body: "Bygdelaget trenger grendehuset fra fredag til søndag for årets fest. De ser at helgen er ledig, hva hele perioden koster, og hva som gjelder for alkohol og opprydding, og booker uten å jakte på kontaktpersonen med nøkkelen.",
          outcome: [
            { label: "Hele helgen", value: "Én booking" },
            { label: "Pris", value: "Kjent på forhånd" },
            { label: "Betaling", value: "Vipps" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres etter arrangementet.",
        },
        {
          label: "Ledige datoer",
          value: "Sanntidskalender for hver sal og hvert hus. Du ser hva som er ledig og booker direkte, uten forespørsel og venting.",
        },
        {
          label: "Pris",
          value: "Totalpris for din dato og varighet, inkludert depositum og eventuell rengjøring, vises før du bekrefter.",
        },
        {
          label: "Fasiliteter",
          value: "Scene, lydanlegg, prosjektor, kjøkken, garderobe og annet utstyr står oppgitt på hvert lokale.",
        },
        {
          label: "Kapasitet",
          value: "Antall personer oppgis per lokale, gjerne både for bordsetting og publikumsrader. Du kan filtrere på antall gjester.",
        },
        {
          label: "Vilkår",
          value: "Sluttid, alkoholregler, rengjøring og avbestilling står tydelig på hvert hus før booking.",
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
        text: "Kulturhuset, samfunnshuset og grendehuset i bygda, samlet ett sted, med pris, kapasitet og ledig dato synlig. Ikke en telefon til kulturkontoret i åpningstiden.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et kulturhus eller samfunnshus?",
          answer:
            "Prisen varierer mye med hus, sal, varighet og om du er privatperson eller forening. Et grendehus kan koste fra noen hundre til noen tusen kroner for en helg, mens en kulturhussal med scene og lydanlegg gjerne ligger høyere. På Digilist ser du totalprisen for din dato, inkludert depositum og rengjøring, før du booker.",
        },
        {
          question: "Kan jeg leie kulturhus som privatperson?",
          answer:
            "Ja, de fleste kulturhus, samfunnshus og grendehus leies ut til privatpersoner til selskap, markeringer og arrangementer. Noen hus har egne satser for lag og foreninger. Vilkårene som gjelder for deg står på lokalet før du booker.",
        },
        {
          question: "Har salen scene og lydanlegg?",
          answer:
            "Det varierer per hus, og derfor står fasilitetene oppgitt på hvert lokale: scene, lydanlegg, prosjektor, kjøkken, garderobe og annet utstyr. Trenger du noe spesielt til konsert eller forestilling, ser du det før du booker i stedet for å oppdage det på dagen.",
        },
        {
          question: "Hvor mange personer er det plass til?",
          answer:
            "Kapasiteten står på hvert lokale, ofte både for bordsetting og publikumsrader, som gir ulike tall for samme sal. Du kan filtrere på antall gjester når du søker, enten det er 40 til konfirmasjon eller flere hundre til konsert.",
        },
        {
          question: "Hvordan betaler jeg, og hva med depositum?",
          answer:
            "Du betaler med Vipps eller kort i samme flyt som bookingen. Der huset krever depositum, håndteres det digitalt og frigjøres etter arrangementet dersom ingenting er meldt. Ingen bankoverføring til en kontaktperson du aldri har møtt.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert lokale. Der det er tillatt, avbestiller du digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for huset.",
        },
      ]}
      relatedPosts={[
        {
          title: "Leie kultursal i kommunen: priser og kapasitet",
          slug: "leie-kultursal-kommune-priser-og-kapasitet",
        },
        {
          title: "Booking på 90 sekunder, for innbyggeren",
          slug: "booking-paa-90-sekunder-innbygger",
        },
      ]}
    />
  );
}
