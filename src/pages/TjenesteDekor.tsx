import UseCasePage from "@/components/UseCasePage";

export default function TjenesteDekor() {
  return (
    <UseCasePage
      basePath="/tjenester"
      parentCrumb={{ name: "Tjenester", path: "/tjenester" }}
      sectionLabel="TJENESTER"
      slug="dekor"
      breadcrumb="Dekor"
      title="Leie dekor og pynt"
      dek="Blomsterdekor, bordpynt og ballongbuer til fest. Finn ledig dekoratør nær deg, se pris per pakke, og book med Vipps."
      lead="Skal du pynte til bryllup, konfirmasjon eller fest, ligger dekoratørene spredt på Instagram, Facebook og egne nettsider uten pris, og gjør-det-selv-pynting spiser dagene før festen. Du vet heller ikke om dekoratøren er ledig på din dato før du har sendt melding og ventet på svar. På Digilist er dekoratører og pyntepakker samlet ett sted, med pris per pakke, ledig dato i sanntid og betaling med Vipps. Rigging og henting er inkludert der det tilbys, så du kan komme til ferdig pyntet lokale i stedet for å stå på stige selv."
      seoTitle="Leie dekor og pynt til fest: pakker, pris og booking | Digilist"
      seoDescription="Leie dekor til bryllup og fest: blomsterdekor, bordpynt og ballongbuer i ferdige pakker. Se pris, sjekk ledig dato og book dekoratør nær deg med Vipps."
      keywords="leie dekor, leie pynt, bordpynt bryllup, blomsterdekor bryllup, ballongbue, leie dekor til fest, festpynt, bryllupsdekor, leie bakvegg photobooth"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere vil ha helhetlig blomsterdekor, bordpynt og kanskje en bakvegg til bilder, uten å koordinere fem forskjellige leverandører selv.",
        },
        {
          persona: "Familier til konfirmasjon og dåp",
          context: "Selskapet skal se fint ut for slekt og gjester, men dagene før går til mat og logistikk. En ferdig pyntepakke sparer kvelder med klipping og liming.",
        },
        {
          persona: "Bursdager og jubileer",
          context: "Runde dager fortjener ballongbue, festpynt og et hjørne som gjør seg på bilder, levert og rigget uten at du må frakte alt selv.",
        },
        {
          persona: "Bedrifter til lansering og fest",
          context: "Lansering, sommerfest eller julebord skal se profesjonelt ut. Dere trenger en dekoratør med tydelig pris og bekreftet dato, ikke en lang e-posttråd.",
        },
      ]}
      problems={[
        "Dekoratører, blomsterbindere og pynteutleie ligger spredt på Instagram, Facebook og enkeltsider, uten ett sted å søke.",
        "Prisen er uklar til du har sendt melding og ventet på tilbud, ofte i flere dager.",
        "Gjør-det-selv-pynting tar kvelder og bilturer, og du vet ikke om resultatet står til bildene du så for deg.",
        "Du vet ikke om dekoratøren er ledig på din dato før noen svarer deg.",
        "Hva som faktisk er inkludert, blomster, rigging, henting etterpå, kommer som overraskelser i stedet for å stå tydelig før du booker.",
      ]}
      features={[
        {
          title: "Dekoratører og pakker samlet ett sted",
          body: "Blomsterdekor, bordpynt, ballongbuer og bakvegger fra dekoratører nær deg, samlet på ett sted. Du slipper å lete gjennom Instagram og Facebook-grupper hver for seg.",
        },
        {
          title: "Pris per pakke synlig",
          body: "Hver pyntepakke viser pris og hva som er inkludert før du booker. Ingen uforpliktende forespørsel og ingen tilbud du må vente på.",
        },
        {
          title: "Ledig dato i sanntid",
          body: "Kalenderen viser om dekoratøren faktisk er ledig på festdatoen din. Du booker direkte og får bekreftelsen med en gang.",
        },
        {
          title: "Book med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Kvittering og vilkår samles ett sted, ingen bankoverføring til en fremmed.",
        },
        {
          title: "Rigging og henting inkludert der det tilbys",
          body: "Mange pakker inkluderer at dekoratøren rigger før festen og henter etterpå. Hva som inngår står tydelig på pakken, så du vet om du må løfte en finger.",
        },
        {
          title: "Velg stil, tema og farger",
          body: "Oppgi tema og fargepalett når du booker, og del gjerne inspirasjonsbilder. Dekoratøren tilpasser pakken så pynten matcher resten av festen.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: bryllup på Østlandet",
          role: "Illustrasjon",
          headline: "Blomster, bordpynt og bakvegg fra én booking",
          body: "Slik kan det se ut: I stedet for å koordinere blomsterbinder, ballongfirma og en venn med lift, finner paret en dekoratør med bryllupspakke, ser pris og innhold, velger farger som matcher, og booker med Vipps. Dekoratøren rigger i lokalet dagen før og henter alt etter festen.",
          outcome: [
            { label: "Leverandører å koordinere", value: "1" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Rigging og henting", value: "Inkludert" },
          ],
        },
        {
          customer: "Eksempel: konfirmasjon i nabolaget",
          role: "Illustrasjon",
          headline: "Ballongbue og bordpynt uten kvelder med DIY",
          body: "Slik kan det se ut: En familie ser at en lokal dekoratør er ledig på konfirmasjonshelgen, velger en pakke med ballongbue og bordpynt i konfirmantens farger, og booker på kvelden. Pynten står klar i lokalet før gjestene kommer, og hentes dagen etter.",
          outcome: [
            { label: "Kvelder med DIY", value: "Ingen" },
            { label: "Booking", value: "På minutter" },
            { label: "Henting", value: "Dagen etter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen, med kvittering og oversikt samlet ett sted.",
        },
        {
          label: "Ledig dato",
          value: "Sanntidskalender per dekoratør, du ser om festdatoen din er ledig og booker direkte, uten å vente på svar.",
        },
        {
          label: "Pris",
          value: "Pris per pakke vises før du bekrefter, inkludert eventuelle tillegg for levering og rigging.",
        },
        {
          label: "Innhold",
          value: "Blomster, bordpynt, ballonger, bakvegg og lyssetting, hva som inngår står tydelig på hver pakke.",
        },
        {
          label: "Rigging og henting",
          value: "Inkludert der dekoratøren tilbyr det, og det står på pakken om du får rigging før og henting etter festen.",
        },
        {
          label: "Stil og tema",
          value: "Velg tema og farger når du booker, og del inspirasjonsbilder så dekoratøren treffer uttrykket du ønsker.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og historikk.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "Dekoratører og pyntepakker nær deg, samlet ett sted, med pris og ledig dato synlig før du booker. Ikke ti meldinger på Instagram og en helg på stige.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster dekor til bryllup eller fest?",
          answer:
            "Prisen varierer med omfang. En enkel bordpyntpakke kan koste noen hundre kroner per bord, en ballongbue fra rundt tusenlappen, mens helhetlig bryllupsdekor med blomster, bakvegg og rigging gjerne ligger fra noen tusen kroner og oppover. På Digilist ser du prisen per pakke før du booker.",
        },
        {
          question: "Hva er inkludert i en pyntepakke?",
          answer:
            "Det står tydelig på hver pakke: blomsterdekor, bordpynt, ballonger, bakvegg, lyssetting, og om levering, rigging og henting inngår. Du vet nøyaktig hva du får før du bekrefter, uten overraskelser på festdagen.",
        },
        {
          question: "Rigger dekoratøren selv, eller må jeg gjøre det?",
          answer:
            "Mange pakker inkluderer at dekoratøren rigger i lokalet før festen og henter alt etterpå. Der rigging tilbys, står det på pakken. Velger du en pakke uten rigging, får du pynten levert eller klar til henting, med beskrivelse av hvordan den settes opp.",
        },
        {
          question: "Kan jeg velge tema og farger?",
          answer:
            "Ja. Du oppgir tema og fargepalett når du booker, og kan dele inspirasjonsbilder med dekoratøren. De fleste pakker kan tilpasses i farger og stil, slik at pynten matcher invitasjoner, blomster og resten av festen.",
        },
        {
          question: "Hva skjer med pynten etter festen?",
          answer:
            "Der henting er inkludert, kommer dekoratøren og tar med utstyret etter festen. Leide elementer som bakvegg, ballongstativ og lysutstyr leveres tilbake, mens blomster ofte kan beholdes eller gis bort til gjestene. Hva som gjelder står på pakken.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av dekoratøren og står på hver pakke før du booker. Der det er tillatt, avbestiller du digitalt, og refusjon følger reglene som gjelder for pakken. Merk at ferske blomster ofte har kortere frist enn leid utstyr.",
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
      ]}
    />
  );
}
