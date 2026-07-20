import UseCasePage from "@/components/UseCasePage";

export default function LeieGaard() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="gaard"
      breadcrumb="Gård"
      title="Leie gård"
      dek="Gårdsbryllup, jubileum, selskap eller firmatur. Finn ledig gård eller låve nær deg, se ekte pris, og book med Vipps."
      lead="Drømmer du om gårdsbryllup i låve, sommerfest på tunet eller firmatur på landet, starter letingen ofte på Finn, i Facebook-grupper og gjennom bekjente. Prisen er uklar til noen svarer, ingen kalender viser hva som faktisk er ledig, og betalingen ender gjerne som bankoverføring til en fremmed. På Digilist finner du gårder, låver og landlige lokaler samlet ett sted, med ekte pris for din dato, ledige datoer i sanntid og hva som er inkludert, før du booker og betaler med Vipps."
      seoTitle="Leie gård til bryllup og selskap: pris og booking | Digilist"
      seoDescription="Leie gård eller låve til gårdsbryllup, selskap eller firmatur: finn ledige gårder nær deg, se ekte pris og hva som er inkludert, og book på nett med Vipps."
      keywords="leie gård, gårdsbryllup, leie låve, gård til bryllup, leie gård til selskap, låve til leie, bryllupsgård, gård til leie, leie gård til fest"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere planlegger gårdsbryllup og ser etter en låve eller et tun med plass til gjestene, overnatting i nærheten og en pris dere kan stole på.",
        },
        {
          persona: "Familier som feirer",
          context: "Runde dager, jubileum eller konfirmasjon med hele familien. En gård med låve, uteområde og plass til barna, uten å jakte på eieren i ukesvis.",
        },
        {
          persona: "Bedrifter",
          context: "Kickoff, teambuilding eller retreat på gård. Et sted med plass til workshops i låven, overnatting og natur rett utenfor døra, bookbart uten fakturakrøll.",
        },
        {
          persona: "Fotografer og arrangører",
          context: "Fotoshoot, markeder eller mindre arrangementer. Dere trenger en gård med riktig lys og uttrykk, ledig på en bestemt dato, med tydelige vilkår.",
        },
      ]}
      problems={[
        "Gårdene ligger spredt: Finn-annonser, Airbnb, Facebook-grupper og jungeltelegrafen, uten ett sted å søke.",
        "Prisen er uklar til du har sendt melding og ventet på svar, ofte i flere dager.",
        "Ingen ekte kalender: du vet ikke om bryllupshelgen er ledig før eieren svarer.",
        "Betaling og depositum skjer med bankoverføring til en fremmed, uten kvittering eller trygghet.",
        "Hva som er inkludert, låve, toaletter, strøm, overnatting, parkering, kommer som overraskelser i stedet for å stå tydelig før du booker.",
      ]}
      features={[
        {
          title: "Gårder og låver samlet ett sted",
          body: "Gårdstun, låver og landlige lokaler nær deg, samlet i ett søk. Du slipper å lete gjennom Finn, Airbnb og Facebook-grupper hver for seg.",
        },
        {
          title: "Ekte pris for din dato",
          body: "Se totalprisen for akkurat din helg, inkludert eventuelt depositum og rengjøring, før du booker. Ingen prislapp som dukker opp etter tre meldinger.",
        },
        {
          title: "Ledige datoer i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig. Du booker bryllupshelgen direkte og får bekreftelsen med en gang, ingen uforpliktende forespørsel.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt. Depositum håndteres digitalt og frigjøres automatisk etter arrangementet. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Hva som er inkludert, svart på hvitt",
          body: "Låve, uteområde, overnatting eller plass til telt, kjøkken, toaletter og parkering. Alt står synlig på gården før du bekrefter.",
        },
        {
          title: "Vilkår tydelig på forhånd",
          body: "Kapasitet, sluttid, støy, alkohol og avbestillingsregler står på hvert sted. Ingen overraskelser når dagen nærmer seg.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: brudepar som vil ha låvebryllup",
          role: "Illustrasjon",
          headline: "Fra jungeltelegraf til booket låve",
          body: "Slik kan det se ut: I stedet for å spørre i Facebook-grupper og vente på svar fra gårdeiere, søker paret på dato og område, sammenligner tre ledige gårder med pris, kapasitet og overnatting synlig, og booker låven som passer, med depositum betalt via Vipps og bekreftelse med en gang.",
          outcome: [
            { label: "Meldinger til fremmede", value: "0" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: firma på retreat",
          role: "Illustrasjon",
          headline: "Kickoff på tunet, booket i en kaffepause",
          body: "Et team på tolv finner en gård med låve til workshops, overnatting til alle og natur rett utenfor, ser at prisen og kapasiteten stemmer, leser vilkårene om mat og sluttid, og booker samme dag, med kvittering rett i innboksen.",
          outcome: [
            { label: "Booking", value: "Samme dag" },
            { label: "Venting på svar", value: "Ingen" },
            { label: "Kvittering", value: "Automatisk" },
          ],
        },
        {
          customer: "Eksempel: 50-årsdag i bygda",
          role: "Illustrasjon",
          headline: "Låven ledig, festen i boks",
          body: "Familien finner en låve med langbord, plass til telt på tunet og parkering for gjestene, ser totalprisen for helgen med depositum inkludert, og booker på kvelden, uten å vente på at en eier skal svare på melding.",
          outcome: [
            { label: "Vilkår", value: "Tydelige" },
            { label: "Booking", value: "På minutter" },
            { label: "Depositum", value: "Via Vipps" },
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
          value: "Sanntidskalender, du ser hvilke helger som er ledige og booker direkte. Ingen venting på svar fra eieren.",
        },
        {
          label: "Pris",
          value: "Totalpris for din dato, inkludert depositum og eventuell rengjøring, vises før du bekrefter.",
        },
        {
          label: "Fasiliteter",
          value: "Låve, uteområde, overnatting eller plass til telt, kjøkken, toaletter, strøm og parkering står på hver gård.",
        },
        {
          label: "Kapasitet",
          value: "Antall gjester for bordsetting i låven, mingling på tunet og eventuell overnatting står tydelig på hvert sted.",
        },
        {
          label: "Vilkår",
          value: "Sluttid, støyregler, alkohol, bruk av uteområdet og avbestilling står tydelig på gården før booking.",
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
        text: "Gårdene og låvene der du bor, samlet ett sted, med ekte pris og ledig helg synlig før du booker. Ikke uker med meldinger og venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie en gård til bryllup eller selskap?",
          answer:
            "Prisen varierer med sted, sesong og hva som er inkludert. En enkel låve for en kveld kan koste noen tusen kroner, mens en hel bryllupshelg med overnatting gjerne ligger fra ti tusen og oppover. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
        },
        {
          question: "Kan jeg leie gård til bryllup?",
          answer:
            "Ja. Mange gårder leies ut nettopp til gårdsbryllup, med låve til middag og fest, tun til vielse og fotografering, og ofte overnatting til de nærmeste gjestene. Søk på dato og område, og filtrer på kapasitet og fasiliteter.",
        },
        {
          question: "Hva er inkludert når jeg leier en gård?",
          answer:
            "Det varierer, og derfor står det tydelig på hver gård: låve, bord og stoler, kjøkken, toaletter, strøm, parkering, uteområde og eventuell overnatting eller plass til telt. Du ser hva som følger med før du bekrefter.",
        },
        {
          question: "Hvor mange gjester er det plass til på en gård?",
          answer:
            "Kapasiteten står på hvert sted, både for bordsetting i låven og mingling på tunet. Mange låver tar 60 til 150 gjester til bords. Du kan filtrere på antall gjester når du søker.",
        },
        {
          question: "Hvordan betaler jeg, og hva med depositum?",
          answer:
            "Du betaler med Vipps eller kort i samme flyt som bookingen. Der gården krever depositum, håndteres det digitalt og frigjøres automatisk etter arrangementet dersom ingenting er meldt. Ingen bankoverføring til en fremmed.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hver gård. Der det er tillatt, avbestiller du digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for stedet.",
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
