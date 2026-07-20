import UseCasePage from "@/components/UseCasePage";

export default function UtstyrLydOgLys() {
  return (
    <UseCasePage
      basePath="/utstyr"
      parentCrumb={{ name: "Utstyr", path: "/utstyr" }}
      sectionLabel="UTSTYR"
      slug="lyd-og-lys"
      breadcrumb="Lyd og lys"
      title="Leie lyd og lys"
      dek="Lydanlegg, mikrofon, scenelys og projektor til arrangementet. Finn ledig utstyr nær deg, og book med Vipps."
      lead="Skal du leie lyd og lys til fest, konsert eller konferanse, ender du fort hos fem ulike AV-utleiere med hver sin prisliste, uklare pakker og fagord du ikke kjenner. Trenger du 500 eller 2000 watt? Holder to mikrofoner? Og hvem skal egentlig rigge alt? På Digilist finner du lydanlegg, høyttalere, mikser, scenelys og projektor samlet ett sted, med pris per dag, hva som er ledig for din dato, og tekniker som tilvalg der du trenger det. Book og betal med Vipps, med bekreftelse med en gang."
      seoTitle="Leie lyd og lys: lydanlegg, scenelys og booking | Digilist"
      seoDescription="Leie lydanlegg, mikrofon, scenelys og projektor til fest, konsert eller konferanse: se pris per dag, sjekk ledige datoer og book lyd og lys med Vipps. Nær deg."
      keywords="leie lydanlegg, leie lyd og lys, leie høyttalere, leie mikrofon, leie scenelys, leie projektor, lydanlegg til leie, leie PA-anlegg, leie AV-utstyr"
      audience={[
        {
          persona: "Fest- og bryllupsarrangører",
          context: "Du skal ha musikk til dansegulvet, mikrofon til talene og litt lys som løfter lokalet, uten å kjenne fagordene eller eie noe av utstyret selv.",
        },
        {
          persona: "Band og artister",
          context: "Dere trenger PA-anlegg, mikser og scenelys til konsert eller spillejobb, til en pris som ikke spiser hele honoraret.",
        },
        {
          persona: "Bedrifter",
          context: "Konferanse, lansering eller allmøte med presentasjoner: projektor, lerret, mikrofoner og lyd som bare virker, gjerne med tekniker som styrer det hele.",
        },
        {
          persona: "Lag og foreninger",
          context: "Korpskonsert, loppemarked eller årsmøte trenger lyd som når fram til alle, uten at noen i styret må bli lydtekniker på dugnad.",
        },
      ]}
      problems={[
        "Utstyret ligger spredt hos AV-utleiere, Finn-annonser og Facebook-grupper, uten ett sted å søke og sammenligne.",
        "Prisen er uklar til du har bedt om tilbud, og pakkene er vanskelige å sammenligne fra utleier til utleier.",
        "Du vet ikke hva du faktisk trenger: watt, antall mikrofoner, mikser og lys er fagord uten fasit.",
        "Ingen ekte kalender: du vet ikke om anlegget er ledig for din dato før noen svarer på e-post.",
        "Trenger du hjelp til rigging eller en tekniker, er det en ny runde med telefoner og en ny regning.",
      ]}
      features={[
        {
          title: "Alt AV-utstyr samlet ett sted",
          body: "Lydanlegg, høyttalere, mikrofoner, miksere, scenelys, projektorer og lerret fra utleiere nær deg, i ett søk. Du slipper å lete gjennom Finn, Facebook og AV-firmaenes egne sider.",
        },
        {
          title: "Pris og pakker synlig",
          body: "Se pris per dag og hva som følger med i pakken, kabler, stativer og mikrofoner, før du booker. Ingen tilbudsrunde og ingen skjulte tillegg.",
        },
        {
          title: "Ledig på din dato",
          body: "Kalenderen viser om utstyret faktisk er ledig for arrangementsdatoen din. Du booker direkte og får bekreftelsen med en gang.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Eventuelt depositum håndteres digitalt og frigjøres automatisk etter tilbakelevering.",
        },
        {
          title: "Henting, levering og tekniker",
          body: "Velg om du henter selv eller får utstyret levert og rigget, der utleier tilbyr det. Du kan også legge til tekniker som styrer lyden under arrangementet.",
        },
        {
          title: "Spesifikasjoner uten gjetting",
          body: "Watt, dekning, antall mikrofoner og lystype står oppgitt på hvert utstyr, så du kan velge riktig anlegg til antall gjester og lokalet ditt.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: bryllup i Rogaland",
          role: "Illustrasjon",
          headline: "Lyd og lys til dansegulvet, uten fagsjargong",
          body: "Slik kan det se ut: Paret trenger lyd til taler og dansegulv for 80 gjester. I stedet for å ringe AV-firmaer og tolke tilbud, filtrerer de på dato og sted, finner et komplett anlegg med to trådløse mikrofoner og festlys, ser pris per dag og depositum synlig, og booker med Vipps. Utstyret hentes dagen før og leveres tilbake mandag.",
          outcome: [
            { label: "Tilbud å tolke", value: "0" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Henting", value: "Dagen før" },
          ],
        },
        {
          customer: "Eksempel: lansering for 120 deltakere",
          role: "Illustrasjon",
          headline: "Projektor, PA og tekniker i én booking",
          body: "Slik kan det se ut: En bedrift skal ha lansering med presentasjoner og panelsamtale. De finner et PA-anlegg med mikser, fire mikrofoner, projektor og lerret, ser spesifikasjonene og at datoen er ledig, legger til tekniker som rigger og styrer lyden, og betaler i samme flyt. Kvitteringen går rett til regnskap.",
          outcome: [
            { label: "Utstyr og tekniker", value: "Én booking" },
            { label: "Spesifikasjoner", value: "Oppgitt" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk etter tilbakelevering.",
        },
        {
          label: "Ledig utstyr",
          value: "Sanntidskalender viser om utstyret er ledig for din leieperiode, fra en kveld til en hel helg. Du booker direkte, uten å vente på svar.",
        },
        {
          label: "Pris",
          value: "Pris per dag står på hvert utstyr, sammen med eventuelt depositum. Totalen for hele leieperioden ser du før du bekrefter.",
        },
        {
          label: "Levering og henting",
          value: "Velg mellom å hente selv eller få utstyret levert og rigget, der utleier tilbyr det. Tid og sted avtales i bookingen.",
        },
        {
          label: "Utstyr",
          value: "Spesifikasjoner står på hver annonse: watt og dekning på lydanlegget, antall mikrofoner og kanaler, type lys og om lerret følger med.",
        },
        {
          label: "Tekniker",
          value: "Der utleier tilbyr det, legger du til tekniker som rigger, lydsjekker og styrer anlegget under arrangementet, som tilvalg i samme booking.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å leie.",
        },
      ]}
      pullQuote={{
        text: "Lydanlegg, scenelys og projektor nær deg, samlet ett sted, med pris per dag og ledig dato synlig før du booker. Ikke fem tilbud du må tolke og vente på.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie et lydanlegg?",
          answer:
            "Prisen avhenger av størrelse og hva som følger med. Et lite anlegg til tale og bakgrunnsmusikk kan koste fra noen hundrelapper per dag, mens et komplett PA-anlegg med mikser, mikrofoner og scenelys gjerne ligger fra tusen kroner og oppover. På Digilist ser du pris per dag og eventuelt depositum på hvert utstyr før du booker.",
        },
        {
          question: "Hva slags anlegg trenger jeg til antall gjester?",
          answer:
            "Til taler og bakgrunnsmusikk for opptil 50 gjester holder ofte et kompakt anlegg med en mikrofon. Til dansegulv eller 100 gjester og mer bør du opp i effekt og to høyttalere, gjerne med subwoofer. Spesifikasjonene på hver annonse viser watt og anbefalt antall personer, så du slipper å gjette.",
        },
        {
          question: "Kan jeg få med tekniker som rigger og styrer lyden?",
          answer:
            "Ja, der utleier tilbyr det, legger du til tekniker som tilvalg i samme booking. Teknikeren rigger, lydsjekker og styrer anlegget under arrangementet. Det er lurt hvis du ikke har brukt mikser før, eller det er mange som skal på scenen.",
        },
        {
          question: "Kan jeg få utstyret levert, eller må jeg hente selv?",
          answer:
            "Begge deler. Mange utleiere tilbyr levering og henting, ofte med rigging inkludert, mens annet utstyr henter du selv. Hva som gjelder, og hva det eventuelt koster, står på hvert utstyr før du booker.",
        },
        {
          question: "Må jeg betale depositum?",
          answer:
            "Noen utleiere krever depositum på dyrere utstyr. Det håndteres digitalt i bookingen og frigjøres automatisk etter tilbakelevering, dersom ingenting er skadet eller mangler. Ingen kontanter og ingen bankoverføring til en fremmed.",
        },
        {
          question: "Kan jeg avbestille hvis arrangementet endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert utstyr før du booker. Der det er tillatt, avbestiller du digitalt, og betaling og eventuelt depositum frigjøres etter reglene som gjelder.",
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
