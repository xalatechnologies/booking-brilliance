import UseCasePage from "@/components/UseCasePage";

export default function LeiePadelbane() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="padelbane"
      breadcrumb="Padelbane"
      title="Leie padelbane"
      dek="Book padelbane per time. Finn ledig padelbane nær deg, se ledige tider i sanntid, og book og betal med Vipps."
      lead="Har du prøvd å finne en ledig padelbane en torsdag kveld, vet du hvordan det er. Banene ligger spredt på ulike anlegg med hver sin app, du må lage konto hvert sted, og ingen viser deg hva som faktisk er ledig på tvers. Om du får leid racket og baller er heller ikke alltid klart før du står der. På Digilist samles ledige padelbaner nær deg ett sted, med ledig tid synlig i sanntid, pris per time, og book og betal med Vipps i samme flyt."
      seoTitle="Leie padelbane: book padel per time nær deg | Digilist"
      seoDescription="Leie padelbane per time: finn ledige padelbaner nær deg, se pris og ledige tider i sanntid, og book padel med Vipps. Utstyrsleie og innendørs og utendørs baner."
      keywords="leie padelbane, book padel, padelbane til leie, book padelbane, ledig padelbane, padel bane, leie padel, padelbane pris, spille padel"
      audience={[
        {
          persona: "Venner som vil spille",
          context: "Dere er to eller fire som vil spille i kveld eller i helgen, og trenger en bane som faktisk er ledig, uten å sjekke fem apper først.",
        },
        {
          persona: "Nybegynnere som vil prøve",
          context: "Du har lyst til å teste padel, men eier verken racket eller baller, og vet ikke hvilke baner som leier ut utstyr til nybegynnere.",
        },
        {
          persona: "Bedrifter og kollegaer",
          context: "Sosial aktivitet etter jobb eller på teamdag. Dere trenger flere baner samtidig, en tid som passer alle, og enkel betaling.",
        },
        {
          persona: "Padel-grupper med fast tid",
          context: "Gjengen som spiller hver uke og vil booke samme bane til samme tid, uten å måtte jakte ledige timer på nytt hver gang.",
        },
      ]}
      problems={[
        "Padelbanene ligger spredt på ulike anlegg og sentre, hver med sin egen app eller bookingside, uten ett sted å søke.",
        "Du må lage ny konto og legge inn kort hos hvert eneste anlegg du vil spille på.",
        "Ingen viser deg hva som er ledig på tvers: du åpner app etter app for å finne en time som passer.",
        "Utstyret er usikkert: du vet ikke om banen leier ut racket og baller før du står der.",
        "Betalingen varierer fra sted til sted, med klippekort, medlemskap og løsninger du ikke kjenner.",
      ]}
      features={[
        {
          title: "Padelbaner nær deg, samlet ett sted",
          body: "Baner fra ulike anlegg, sentre og haller i nærområdet, samlet i ett søk. Du slipper å sjekke hver enkelt app for å finne et sted å spille.",
        },
        {
          title: "Ledige tider i sanntid",
          body: "Kalenderen viser hvilke baner som faktisk er ledige, time for time. Finn en tid som passer, book den, og få bekreftelsen med en gang.",
        },
        {
          title: "Book uten ny konto hvert sted",
          body: "Én innlogging gir deg tilgang til alle banene på Digilist. Ingen ny konto, ingen ny app og ingen nytt kort å legge inn for hvert anlegg.",
        },
        {
          title: "Pris per time synlig før du booker",
          body: "Timeprisen står på hver bane, med eventuelle forskjeller mellom gunstige og populære tider. Du vet hva det koster før du bekrefter, og betaler med Vipps.",
        },
        {
          title: "Lei racket og baller samtidig",
          body: "Der anlegget tilbyr utstyrsleie, legger du til racket og baller i samme booking. Perfekt for nybegynnere og for gjester som ikke har eget utstyr.",
        },
        {
          title: "Innendørs eller utendørs, med tilgang oppgitt",
          body: "Du ser om banen er innendørs eller utendørs, og hvordan du kommer inn, for eksempel med digital adgangskode som sendes før spilletid.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: fire venner en torsdag kveld",
          role: "Illustrasjon",
          headline: "Fra fem apper til én booking",
          body: "Slik kan det se ut: I stedet for å sjekke appene til hvert enkelt padelsenter, søker gjengen på område og tidspunkt, ser tre ledige baner med pris per time, velger en innendørsbane klokken 20, og booker og betaler med Vipps. Adgangskoden kommer før spilletid.",
          outcome: [
            { label: "Apper å sjekke", value: "1" },
            { label: "Pris synlig", value: "Før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: nybegynnere uten utstyr",
          role: "Illustrasjon",
          headline: "Første padeltime uten å eie noe",
          body: "To kollegaer vil prøve padel for første gang. De finner en ledig bane i lunsjpausen, ser at anlegget leier ut racketer og baller, legger utstyret til i samme booking, og betaler alt samlet med Vipps. Ingen medlemskap, ingen ny app, ingen overraskelser i døra.",
          outcome: [
            { label: "Eget utstyr", value: "Ikke nødvendig" },
            { label: "Medlemskap", value: "Ingen" },
            { label: "Booket på", value: "Minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvitteringen kommer med en gang, uten klippekort eller medlemskap.",
        },
        {
          label: "Ledige tider",
          value: "Sanntidskalender per bane, time for time. Du ser hva som er ledig på tvers av anleggene og booker direkte.",
        },
        {
          label: "Pris per time",
          value: "Timeprisen vises på hver bane før du booker, inkludert eventuelle forskjeller mellom dag- og kveldstid.",
        },
        {
          label: "Utstyr",
          value: "Racket og baller kan leies der anlegget tilbyr det, og legges til i samme booking som banen.",
        },
        {
          label: "Bane",
          value: "Hver bane viser om den er innendørs eller utendørs, underlag og antall baner på anlegget, så du vet hva du kommer til.",
        },
        {
          label: "Tilgang",
          value: "Mange anlegg bruker digital adgang. Kode eller nøkkelinformasjon sendes automatisk før spilletid.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Én konto gir tilgang til alle banene, med bookinger og kvitteringer samlet.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "Alle padelbanene der du bor, samlet ett sted, med ledig tid og pris per time synlig før du booker. Ikke fem apper og en konto hvert sted.",
        byline: "Slik er Digilist ment å fungere for deg som skal spille",
      }}
      faq={[
        {
          question: "Hva koster det å leie en padelbane?",
          answer:
            "Prisen varierer med sted, tidspunkt og om banen er innendørs eller utendørs. En time koster typisk fra rundt 200 til 500 kroner for hele banen, altså delt på fire spillere ved dobbel. På Digilist står prisen per time på hver bane før du booker.",
        },
        {
          question: "Hvordan booker jeg en padelbane?",
          answer:
            "Søk på sted og tidspunkt, se hvilke baner som er ledige i sanntid, velg en time og betal med Vipps eller kort. Bekreftelsen kommer med en gang, og eventuell adgangskode sendes før spilletid. Du trenger ikke lage konto hos hvert enkelt anlegg.",
        },
        {
          question: "Kan jeg leie racket og baller?",
          answer:
            "Ja, der anlegget tilbyr utstyrsleie. Det står på banen om racketer og baller kan leies, og du legger utstyret til i samme booking som banen. Det gjør det enkelt å prøve padel uten å kjøpe eget utstyr først.",
        },
        {
          question: "Er banene innendørs eller utendørs?",
          answer:
            "Begge deler finnes. Hver bane på Digilist viser om den er innendørs eller utendørs, slik at du kan velge etter vær og årstid. Innendørsbaner kan bookes hele året, mens utendørsbaner ofte er rimeligere i sesong.",
        },
        {
          question: "Hvor mange kan spille på en padelbane?",
          answer:
            "Padel spilles vanligvis som dobbel med fire spillere, to på hvert lag. Mange spiller også single med to spillere på vanlig bane, og noen anlegg har egne singlebaner. Du booker hele banen per time, uansett hvor mange dere er.",
        },
        {
          question: "Kan jeg avbestille timen hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av hvert anlegg og står tydelig på banen før du booker. Der det er tillatt, avbestiller du digitalt i samme løsning, og refusjonen følger reglene som gjelder for banen.",
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
