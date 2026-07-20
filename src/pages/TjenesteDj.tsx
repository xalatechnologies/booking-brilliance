import UseCasePage from "@/components/UseCasePage";

export default function TjenesteDj() {
  return (
    <UseCasePage
      basePath="/tjenester"
      parentCrumb={{ name: "Tjenester", path: "/tjenester" }}
      sectionLabel="TJENESTER"
      slug="dj"
      breadcrumb="DJ"
      title="Leie DJ"
      dek="DJ til bryllup, fest eller firmafest. Finn ledig DJ nær deg, se sjanger og pris, og book på nett med Vipps."
      lead="Å finne en god DJ skjer ofte via bekjente, Facebook-grupper eller gamle oppføringer på Gule Sider. Du vet ikke hva kvelden koster, om DJ-en faktisk er ledig på datoen din, eller om musikken og utstyret passer festen. På Digilist finner du DJ-er i nærområdet samlet ett sted, med sjanger, pris per kveld og ledige datoer synlig før du booker. Du ser om DJ-en har eget lydanlegg og lys, sjekker datoen i sanntid, og booker og betaler trygt med Vipps. Ingen ringerunder, ingen venting på svar."
      seoTitle="Leie DJ til bryllup og fest: pris og booking | Digilist"
      seoDescription="Leie DJ til bryllup, fest eller firmafest: se sjanger, pris per kveld og utstyr, sjekk ledig dato og book med Vipps. Finn DJ-er nær deg, samlet ett sted."
      keywords="leie DJ, DJ til bryllup, DJ til fest, leie DJ bryllup, DJ pris, book DJ, DJ til bursdag, DJ firmafest, leie diskjockey"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere planlegger bryllup og vil ha en DJ som treffer begge generasjonene på dansegulvet, med tydelig pris og bekreftet dato i god tid før dagen.",
        },
        {
          persona: "Bursdager og jubileer",
          context: "Runde dager, 30-årsdag eller jubileum hjemme eller i leid lokale. Du trenger en DJ som leser rommet, uten å bruke uker på å lete.",
        },
        {
          persona: "Ungdom og russ",
          context: "Russefest, skoleball eller 18-årsdag. Dere vil ha riktig sjanger og en DJ som faktisk er ledig, med en pris som kan deles i gjengen.",
        },
        {
          persona: "Bedrifter",
          context: "Firmafest, julebord eller sommerfest. Du som har fått ansvaret trenger en profesjonell DJ med eget utstyr, kvittering og ryddig betaling.",
        },
      ]}
      problems={[
        "DJ-ene finnes spredt: via bekjente, Facebook-grupper, Gule Sider og gamle nettsider, uten ett sted å søke og sammenligne.",
        "Prisen er uklar til du har sendt melding og forhandlet, og du vet ikke hva som er normalt å betale for en kveld.",
        "Ingen ekte kalender: du vet ikke om DJ-en er ledig på datoen din før noen svarer, og gode DJ-er blir fort opptatt.",
        "Du vet ikke om DJ-en har eget lydanlegg og lys, eller om du må leie utstyr i tillegg og hva det koster.",
        "Betaling skjer kontant eller med Vipps til en privatperson, uten avtale, kvittering eller trygghet hvis noe går galt.",
      ]}
      features={[
        {
          title: "DJ-er nær deg, samlet ett sted",
          body: "DJ-er til bryllup, fest, bursdag og firmafest samlet på ett sted. Du slipper å spørre rundt i Facebook-grupper og håpe på tips fra bekjente.",
        },
        {
          title: "Sjanger og pris per kveld synlig",
          body: "Hver DJ viser sjanger og repertoar sammen med pris per kveld eller time. Du ser hva kvelden koster før du tar kontakt, uten å forhandle i blinde.",
        },
        {
          title: "Ledige datoer i sanntid",
          body: "Kalenderen viser hvilke DJ-er som faktisk er ledige på datoen din. Du booker direkte og får bekreftelsen med en gang, ingen venting på svar.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Du får kvittering og bekreftelse samlet ett sted, ingen kontanter eller overføring til en fremmed.",
        },
        {
          title: "Eget lydanlegg og lys oppgitt",
          body: "Det står tydelig på hver DJ om lydanlegg og lys er inkludert, eller om lokalet må ha eget anlegg. Ingen overraskelser uken før festen.",
        },
        {
          title: "Vurderinger og omtaler",
          body: "Les hva andre som har booket DJ-en sier om musikkvalg, stemning og punktlighet, før du bestemmer deg. Tryggere enn et tips på Facebook.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: bryllup i Rogaland",
          role: "Illustrasjon",
          headline: "DJ til bryllupet booket på en kveld",
          body: "Slik kan det se ut: I stedet for å spørre rundt i vennekretsen og vente på svar fra tre forskjellige DJ-er, søker paret på dato og sted, sammenligner ledige DJ-er med sjanger og pris per kveld synlig, ser at favoritten har eget lydanlegg og lys, leser omtalene fra andre bryllup, og booker med Vipps samme kveld.",
          outcome: [
            { label: "Ringerunder", value: "0" },
            { label: "Pris", value: "Synlig per kveld" },
            { label: "Dato", value: "Bekreftet med en gang" },
          ],
        },
        {
          customer: "Eksempel: firmafest i Trondheim",
          role: "Illustrasjon",
          headline: "Julebordet fikk DJ uten en eneste purring",
          body: "Slik kan det se ut: Den som har fått ansvaret for julebordet filtrerer på dato og finner tre ledige DJ-er, ser at en av dem har spilt på firmafester før og tar med eget anlegg, booker direkte og betaler med Vipps, og har kvittering klar til regnskapet uten en eneste purremelding.",
          outcome: [
            { label: "Tilbud å vente på", value: "Ingen" },
            { label: "Utstyr", value: "DJ-ens eget" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Du får kvittering og bekreftelse med en gang, ingen kontanter eller overføring til privatperson.",
        },
        {
          label: "Ledig dato",
          value: "DJ-ens kalender viser hva som faktisk er ledig i sanntid. Du booker direkte, uten uforpliktende forespørsel og venting på svar.",
        },
        {
          label: "Pris",
          value: "Pris per kveld eller time står på hver DJ, sammen med eventuell overtidspris. Du ser totalen før du bekrefter.",
        },
        {
          label: "Sjanger og repertoar",
          value: "Hver DJ oppgir sjangre og hva slags arrangementer de spiller på, fra bryllup og fest til firmafest og russearrangement.",
        },
        {
          label: "Utstyr",
          value: "Om DJ-en har eget lydanlegg og lys, og hva det dekker, står tydelig på profilen. Du vet hva du må ordne selv før du booker.",
        },
        {
          label: "Spilletid",
          value: "Standard spilletid og mulighet for overtid står på hver DJ. Vanlig er fire til seks timer, avhengig av arrangementet.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og oversikt samlet ett sted.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "DJ-ene nær deg samlet ett sted, med sjanger, pris per kveld og ledig dato synlig før du booker. Ikke meldinger til fremmede og dagevis med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie en DJ?",
          answer:
            "Prisen varierer med erfaring, spilletid, utstyr og sted. En vanlig kveld ligger ofte mellom 5 000 og 15 000 kroner, mens bryllup med lang spilletid eller etterspurte DJ-er kan koste mer. På Digilist står prisen per kveld på hver DJ, så du ser hva det koster før du booker.",
        },
        {
          question: "Har DJ-en eget lydanlegg og lys?",
          answer:
            "De fleste profesjonelle DJ-er tar med eget lydanlegg og lys, men det varierer. På Digilist står det tydelig på hver DJ hva som er inkludert. Har lokalet eget anlegg, kan noen DJ-er tilby lavere pris for å spille på det.",
        },
        {
          question: "Kan jeg ønske meg sanger eller en bestemt sjanger?",
          answer:
            "Ja. De fleste DJ-er tar gjerne imot en ønskeliste og en liste over sanger som ikke skal spilles. Sjangrene DJ-en dekker står på profilen, og etter booking avtaler dere detaljene for kvelden direkte.",
        },
        {
          question: "Hvor lenge spiller en DJ?",
          answer:
            "Vanlig spilletid er fire til seks timer, for eksempel fra middagen er ferdig til klokken to. Standard spilletid og pris for overtid står på hver DJ, så du kan planlegge kvelden uten overraskelser.",
        },
        {
          question: "Hvordan booker og betaler jeg?",
          answer:
            "Du søker på dato og sted, ser hvilke DJ-er som er ledige, og booker direkte. Betalingen skjer med Vipps eller kort i samme flyt, og du får bekreftelse og kvittering med en gang. Ingen kontanter eller overføring til en fremmed.",
        },
        {
          question: "Kan jeg avbestille hvis planene endrer seg?",
          answer:
            "Avbestillingsreglene settes av DJ-en og står tydelig på profilen før du booker. Der det er tillatt, avbestiller du digitalt, og eventuell refusjon følger reglene som gjelder for bookingen.",
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
