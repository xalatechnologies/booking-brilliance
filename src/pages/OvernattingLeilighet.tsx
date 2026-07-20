import UseCasePage from "@/components/UseCasePage";

export default function OvernattingLeilighet() {
  return (
    <UseCasePage
      basePath="/overnatting"
      parentCrumb={{ name: "Overnatting", path: "/overnatting" }}
      sectionLabel="OVERNATTING"
      slug="leilighet"
      breadcrumb="Leilighet"
      title="Leie leilighet"
      dek="Byferie, jobbreise eller mellombolig. Finn ledig leilighet nær deg, se totalprisen per natt, og book med Vipps."
      lead="Skal du leie leilighet for noen netter, ligger tilbudet spredt på Airbnb, Finn og ulike bookingsider, med hver sin kalender og hver sin pris. Totalprisen er uklar til du er nesten ferdig: rengjøring, servicegebyr og depositum dukker opp i siste steg. Ingen samlet oversikt viser hvilke netter som faktisk er ledige, og du vet sjelden hvordan innsjekken foregår før du står utenfor døra. På Digilist er korttidsleiligheter samlet ett sted, med totalpris synlig fra start, ledige netter i sanntid, og booking og betaling med Vipps."
      seoTitle="Leie leilighet: korttidsleie, totalpris og booking | Digilist"
      seoDescription="Leie leilighet for korttid: byferie, jobbreise eller mellombolig. Se ledige netter, totalpris med rengjøring og gebyr, og book korttidsleie av leilighet med Vipps."
      keywords="leie leilighet, korttidsleie leilighet, leie leilighet korttid, leilighet til leie, leie leilighet ferie, leie leilighet jobbreise, mellombolig, book leilighet, leie leilighet natt"
      audience={[
        {
          persona: "Byferie-reisende",
          context: "En helg i Oslo, Bergen eller Tromsø. Du vil bo sentralt med eget kjøkken, og vite totalprisen for nettene før du booker.",
        },
        {
          persona: "På jobbreise",
          context: "Noen netter nær kontoret eller oppdraget. Du trenger wifi, ro til å jobbe, og en kvittering som er enkel å legge i reiseregningen.",
        },
        {
          persona: "I mellombolig",
          context: "Flytting, oppussing eller ventetid mellom to boliger. Du trenger et sted å bo i noen uker, med vaskemaskin og plass til hverdagen.",
        },
        {
          persona: "Familie og venner på besøk",
          context: "Besøk til studenter, nybakte foreldre eller høytider hjemme. En leilighet i nærheten gir plass til alle, uten å fylle opp stua til dem du besøker.",
        },
      ]}
      problems={[
        "Leilighetene ligger spredt på Airbnb, Finn og ulike bookingsider, uten ett sted å søke på område og netter.",
        "Totalprisen er uklar: rengjøring, servicegebyr og depositum dukker først opp i siste steg av bestillingen.",
        "Ingen samlet kalender viser hvilke netter som faktisk er ledige, så du sjekker side etter side.",
        "Du vet sjelden hvordan innsjekken foregår, eller når du får nøkkel, før kort tid før ankomst.",
        "Hva som er inkludert, sengetøy, wifi, parkering og sluttvask, varierer fra annonse til annonse uten tydelig oversikt.",
      ]}
      features={[
        {
          title: "Alle korttidsleiligheter ett sted",
          body: "Leiligheter fra sentrum til nabolagene samlet på ett sted. Du slipper å lete gjennom Airbnb, Finn og bookingsider hver for seg med hver sin kalender.",
        },
        {
          title: "Totalpris synlig fra start",
          body: "Pris per natt, rengjøring og eventuelle gebyrer er regnet inn i totalprisen du ser før du booker. Ingen overraskelser i siste steg.",
        },
        {
          title: "Ledige netter i sanntid",
          body: "Kalenderen viser hvilke netter som faktisk er ledige for ditt antall gjester. Du booker direkte og får bekreftelsen med en gang.",
        },
        {
          title: "Betal med Vipps, depositum digitalt",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Eventuelt depositum holdes digitalt og frigjøres automatisk etter utsjekk.",
        },
        {
          title: "Se hva som er inkludert",
          body: "Soverom og senger, kjøkken, wifi, parkering og sluttvask står tydelig på hver leilighet, slik at du vet hva du får før du bekrefter.",
        },
        {
          title: "Enkel innsjekk med digital nøkkel",
          body: "Der verten tilbyr det, får du nøkkelkode eller nøkkelboks og tydelige instruksjoner etter booking. Sjekk inn når det passer deg, uten å vente på noen.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: jobbreise til Oslo",
          role: "Illustrasjon",
          headline: "Fire netter booket i lunsjpausen",
          body: "Slik kan det se ut: I stedet for å sammenligne hotell og tre ulike utleiesider, søker konsulenten på område og datoer, filtrerer på wifi og eget kjøkken, ser totalprisen for fire netter med rengjøring inkludert, og booker med Vipps. Kvitteringen ligger klar til reiseregningen med en gang.",
          outcome: [
            { label: "Netter", value: "4" },
            { label: "Totalpris synlig", value: "Før booking" },
            { label: "Kvittering", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: mellombolig under oppussing",
          role: "Illustrasjon",
          headline: "Tre uker med eget kjøkken, ikke hotellrom",
          body: "En familie skal pusse opp badet og trenger et sted å bo i tre uker. De finner en leilighet i nabolaget med to soverom, vaskemaskin og parkering, ser totalprisen for hele oppholdet før de booker, og får digital nøkkelkode på innsjekksdagen. Hverdagen fortsetter som normalt, med skole og jobb i gangavstand.",
          outcome: [
            { label: "Soverom", value: "2" },
            { label: "Pris", value: "For hele oppholdet" },
            { label: "Innsjekk", value: "Digital nøkkel" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Du får kvittering med en gang, og bookingen er bekreftet når betalingen er gjennomført.",
        },
        {
          label: "Ledige netter",
          value: "Sanntidskalender per leilighet. Du velger netter og antall gjester, ser hva som faktisk er ledig, og booker direkte uten forespørsel.",
        },
        {
          label: "Pris",
          value: "Totalpris for oppholdet, inkludert rengjøring og eventuelle gebyrer, vises før du bekrefter. Ingen tillegg i siste steg.",
        },
        {
          label: "Kapasitet",
          value: "Antall soverom, senger og maks antall gjester står på hver leilighet. Du kan filtrere på antall gjester når du søker.",
        },
        {
          label: "Fasiliteter",
          value: "Kjøkken, wifi, vaskemaskin og parkering er merket tydelig per leilighet, slik at du ser hva som er inkludert før du booker.",
        },
        {
          label: "Innsjekk",
          value: "Digital nøkkelkode eller nøkkelboks der verten tilbyr det. Instruksjonene kommer etter booking, og du sjekker inn når det passer deg.",
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
        text: "Korttidsleiligheter nær deg, samlet ett sted, med totalpris og ledige netter synlig før du booker. Ikke fem faner og gebyrer som dukker opp i siste steg.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie leilighet for korttid?",
          answer:
            "Prisen varierer med by, størrelse, standard og sesong. En liten leilighet utenfor sentrum kan koste noen hundrelapper per natt, mens en stor og sentral leilighet i høysesong ligger høyere. På Digilist ser du totalprisen for dine netter, inkludert rengjøring og eventuelle gebyrer, før du booker.",
        },
        {
          question: "Kan jeg leie leilighet i noen uker eller som mellombolig?",
          answer:
            "Ja. Mange leiligheter kan bookes for alt fra én natt til flere uker, og passer som mellombolig ved flytting, oppussing eller ventetid mellom to boliger. Du velger netter i kalenderen og ser totalprisen for hele oppholdet, og enkelte verter tilbyr egne priser for lengre opphold.",
        },
        {
          question: "Hva er inkludert i leiligheten?",
          answer:
            "Det står på hver leilighet: antall soverom og senger, kjøkken, wifi, vaskemaskin, parkering og om sengetøy og håndklær følger med. Sluttvask er regnet inn i totalprisen der verten krever det, slik at du ser alt før du booker.",
        },
        {
          question: "Hvordan foregår innsjekk, og hvordan får jeg nøkkel?",
          answer:
            "De fleste leiligheter har digital innsjekk med nøkkelkode eller nøkkelboks. Du får instruksjonene etter booking, med kode, adresse og tidspunkt for innsjekk, og sjekker inn selv når det passer deg. Der verten møter deg personlig, står det på leiligheten.",
        },
        {
          question: "Kan bedriften min betale, eller kan jeg få faktura for jobbreise?",
          answer:
            "Du betaler med Vipps eller kort og får kvittering med en gang, klar til reiseregningen. Enkelte verter tilbyr faktura til bedrifter ved lengre opphold, og det står i så fall på leiligheten. Spør gjerne verten via Digilist før du booker.",
        },
        {
          question: "Kan jeg avbestille bookingen?",
          answer:
            "Avbestillingsreglene settes av verten og står tydelig på hver leilighet før du booker. Der det er tillatt, avbestiller du digitalt, og beløpet refunderes etter reglene som gjelder for leiligheten. Eventuelt depositum frigjøres automatisk.",
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
