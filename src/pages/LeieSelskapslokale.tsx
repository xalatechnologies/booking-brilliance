import UseCasePage from "@/components/UseCasePage";

export default function LeieSelskapslokale() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="selskapslokale"
      breadcrumb="Selskapslokale"
      title="Leie selskapslokale"
      dek="Bryllup, jubileum, konfirmasjon eller fest. Finn ledig selskapslokale nær deg, se ekte pris, og book på nett med Vipps."
      lead="Skal du feire noe stort, går tiden fort med å ringe rundt, vente på svar og gjette på prisen. På Digilist finner du selskapslokaler, grendehus og kulturhus i nærområdet samlet ett sted, med hva som faktisk er ledig, hva det koster for din dato, og hva som er inkludert, før du booker. Ingen uforpliktende forespørsel, ingen bankoverføring til en fremmed."
      seoTitle="Leie selskapslokale: pris, kapasitet og booking | Digilist"
      seoDescription="Leie selskapslokale til bryllup, jubileum eller fest: finn ledige datoer, se ekte pris og kapasitet, og book på nett med Vipps. Lokaler nær deg, samlet ett sted."
      keywords="leie selskapslokale, selskapslokale pris, hva koster selskapslokale, leie festlokale, book selskapslokale online, selskapslokale bryllup, leie lokale til fest, selskapslokale kapasitet"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere planlegger bryllup og trenger et lokale med riktig kapasitet, kjøkken og en pris dere kan stole på, uten å ringe ti steder.",
        },
        {
          persona: "Familier som feirer",
          context: "Konfirmasjon, dåp, runde dager eller minnestund. Et lokale i nærområdet til en gjeng gjester, bookbart uten stress.",
        },
        {
          persona: "Lag, foreninger og kollegaer",
          context: "Årsfest, julebord eller jubileum. Dere trenger et sted med plass til alle, og en enkel måte å dele booking og betaling.",
        },
        {
          persona: "Naboer i borettslag og velforeninger",
          context: "Felleslokaler og grendehus som booktes for selskap, ofte med depositum og rengjøringsvilkår som bør være tydelige på forhånd.",
        },
      ]}
      problems={[
        "Lokalene ligger spredt: kommunens sider, Finn-annonser, Facebook-grupper og telefonnumre til velhus, uten ett sted å søke.",
        "Prisen er uklar til du har sendt forespørsel og ventet på svar, ofte i flere dager.",
        "Ingen ekte kalender: du vet ikke om datoen er ledig før noen svarer deg.",
        "Betaling skjer med bankoverføring til en ukjent, uten kvittering eller trygghet.",
        "Reglene, kapasitet, alkohol, sluttid, depositum, kommer som overraskelser i stedet for å stå tydelig før du booker.",
      ]}
      features={[
        {
          title: "Alle lokaler nær deg, ett søk",
          body: "Grendehus, kulturhus og private selskapslokaler samlet på ett sted. Du slipper å lete gjennom kommunens sider, Finn og Facebook hver for seg.",
        },
        {
          title: "Ekte pris for din dato",
          body: "Se totalprisen for akkurat din dato, inkludert eventuelt depositum og rengjøring, før du booker. Ingen skjulte tillegg som dukker opp senere.",
        },
        {
          title: "Ledige datoer i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig. Du booker direkte og får bekreftelsen med en gang, ingen uforpliktende forespørsel.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt. Depositum håndteres digitalt og frigjøres automatisk etter arrangementet. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Reglene tydelig på forhånd",
          body: "Kapasitet, om alkohol er tillatt, sluttid, aldersgrense og hva som er inkludert, alt står synlig på lokalet før du bekrefter.",
        },
        {
          title: "Kvittering og oversikt",
          body: "Bekreftelse, kvittering og vilkår samlet ett sted. Du har alt du trenger hvis noe skulle dukke opp før eller etter dagen.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: brudepar i Viken",
          role: "Illustrasjon",
          headline: "Fra ti telefoner til én booking",
          body: "Slik kan det se ut: I stedet for å ringe rundt til grendehus og kulturhus og vente på pristilbud, søker paret på dato og område, sammenligner tre ledige lokaler med pris og kapasitet synlig, og booker det som passer, med depositum betalt via Vipps og bekreftelse med en gang.",
          outcome: [
            { label: "Steder å ringe", value: "0" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: konfirmasjon i bygda",
          role: "Illustrasjon",
          headline: "Grendehuset booket på kvelden",
          body: "En familie finner det lokale grendehuset ledig for konfirmasjonshelgen, ser at kapasiteten og prisen stemmer, leser vilkårene om rengjøring og sluttid, og booker på kvelden, uten å vente på at noen skal svare på en e-post.",
          outcome: [
            { label: "Vilkår", value: "Tydelige" },
            { label: "Booking", value: "På minutter" },
            { label: "Venting på svar", value: "Ingen" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk etter arrangementet.",
        },
        {
          label: "Ledige datoer",
          value: "Sanntidskalender, du ser hva som er ledig og booker direkte. Ingen uforpliktende forespørsel eller venting på svar.",
        },
        {
          label: "Pris",
          value: "Totalpris for din dato, inkludert depositum og eventuell rengjøring, vises før du bekrefter.",
        },
        {
          label: "Vilkår",
          value: "Kapasitet, alkoholregler, sluttid, aldersgrense og avbestilling står tydelig på hvert lokale før booking.",
        },
        {
          label: "Avbestilling",
          value: "Avbestillingsreglene settes av utleier og vises på lokalet. Der det er tillatt, avbestiller du digitalt og depositum frigjøres etter reglene.",
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
        text: "Alle lokalene der du bor, samlet ett sted, med ekte pris og ledig dato synlig før du booker. Ikke ti telefoner og dagevis med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et selskapslokale?",
          answer:
            "Prisen varierer med type lokale, sted, varighet og dag. Et grendehus kan koste fra noen hundre til noen tusen kroner for en helg, mens et større selskapslokale eller kulturhussal ligger høyere. På Digilist ser du totalprisen for din dato, inkludert depositum og rengjøring, før du booker.",
        },
        {
          question: "Hvor mange gjester er det plass til?",
          answer:
            "Kapasiteten står tydelig på hvert lokale, både for bordsetting og mingling. En tommelfingerregel er 1,5 til 2 kvadratmeter per gjest ved bordsetting. Du kan filtrere på antall gjester når du søker.",
        },
        {
          question: "Kan jeg booke på nett og se ledige datoer?",
          answer:
            "Ja. Du søker på sted og dato, ser hva som faktisk er ledig i sanntid, og booker direkte, uten uforpliktende forespørsel og uten å vente på svar. Bekreftelsen kommer med en gang.",
        },
        {
          question: "Hvordan betaler jeg, og hva med depositum?",
          answer:
            "Du betaler med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt og frigjøres automatisk etter arrangementet dersom ingenting er meldt. Ingen bankoverføring til en fremmed.",
        },
        {
          question: "Er alkohol tillatt, og finnes det aldersgrense?",
          answer:
            "Det varierer per lokale, og reglene vises tydelig før du booker. Noen kommunale lokaler tillater ikke alkohol ved private arrangementer, og enkelte utleiere har aldersgrense (ofte 25 år). Sjekk vilkårene på det aktuelle lokalet.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert lokale. Der det er tillatt, avbestiller du digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for lokalet.",
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
        {
          title: "Sømløs betaling med Vipps og EHF",
          slug: "somlos-betaling-vipps-ehf",
        },
      ]}
    />
  );
}
