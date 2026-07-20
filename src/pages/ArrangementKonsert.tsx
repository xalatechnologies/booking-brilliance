import UseCasePage from "@/components/UseCasePage";

export default function ArrangementKonsert() {
  return (
    <UseCasePage
      basePath="/arrangementer"
      parentCrumb={{ name: "Arrangementer", path: "/arrangementer" }}
      sectionLabel="ARRANGEMENTER"
      slug="konsert"
      breadcrumb="Konsert"
      title="Konsertbilletter"
      dek="Finn konserter nær deg, se pris og ledige billetter, og kjøp med Vipps. QR-billetten kommer rett på mobilen."
      lead="Konserter annonseres litt overalt: på ulike billettsider, artistenes egne sider og i Facebook-eventer. Hver side krever sin egen konto, legger på sine egne gebyrer, og hva billetten faktisk koster ser du ofte ikke før i siste steg. Selve billetten kommer som en e-post eller papirlapp som fort blir borte. På Digilist er konsertene i nærområdet samlet ett sted, med pris og ledige billetter synlig før du kjøper. Du betaler med Vipps uten å opprette ny konto, og QR-billetten ligger klar på mobilen når du skal inn."
      seoTitle="Konsertbilletter: finn konserter og kjøp med Vipps | Digilist"
      seoDescription="Konsertbilletter samlet ett sted: finn konserter nær deg, se pris og ledige billetter, og kjøp billetter til konsert med Vipps. QR-billett rett på mobilen."
      keywords="konsertbilletter, billetter til konsert, kjøp konsertbillett, konsert nær meg, konsert billetter, live konsert billett, konsertbillett vipps, billett konsert"
      audience={[
        {
          persona: "Musikkinteresserte",
          context: "Du følger med på hvem som spiller i byen og vil oppdage konserter nær deg uten å sjekke fem billettsider og en haug med Facebook-eventer.",
        },
        {
          persona: "Venner på konsert",
          context: "Dere skal ut sammen og trenger billetter til alle i samme kjøp, betalt med Vipps, uten at én må opprette konto og legge ut for hele gjengen.",
        },
        {
          persona: "Familier på familiekonsert",
          context: "Barnekonsert eller familieforestilling i helgen. Du vil se pris for voksne og barn, velge sitteplasser og ha billettene klare på mobilen.",
        },
        {
          persona: "Du som vil støtte lokale artister",
          context: "Intimkonserter, kulturhus og lokale scener. Du vil finne det som skjer i nærmiljøet og vite at billettkjøpet går trygt for seg.",
        },
      ]}
      problems={[
        "Konsertene ligger spredt på ulike billettsider, artistsider og Facebook-eventer, uten ett sted å lete.",
        "Hver billettside krever sin egen konto og sitt eget passord før du i det hele tatt får kjøpt noe.",
        "Gebyrer og tillegg dukker opp i siste steg, så prisen du først så stemmer sjelden med det du betaler.",
        "Billetten kommer som en e-post eller PDF som er vanskelig å finne igjen i køen ved inngangen.",
        "Du vet ikke om det faktisk er billetter igjen før du har klikket deg gjennom hele kjøpet.",
      ]}
      features={[
        {
          title: "Konsertene nær deg, samlet ett sted",
          body: "Store scener, klubbkonserter og intimkonserter i nærområdet på samme sted. Du slipper å lete gjennom billettsider, artistsider og Facebook-eventer hver for seg.",
        },
        {
          title: "Pris og ledige billetter synlig",
          body: "Du ser hva billetten faktisk koster og om det er billetter igjen, før du starter kjøpet. Ingen gebyrer som dukker opp i siste steg.",
        },
        {
          title: "Kjøp med Vipps, uten ny konto",
          body: "Betal med Vipps eller kort i samme flyt. Du trenger ikke opprette enda en billettkonto med eget passord for å få kjøpt billett.",
        },
        {
          title: "QR-billett rett på mobilen",
          body: "Billetten kommer som QR-kode på mobilen med en gang kjøpet er bekreftet. Ingen papirlapp å miste, ingen e-post å lete etter i køen.",
        },
        {
          title: "Billettyper som passer kvelden",
          body: "Ståplass, sitteplass eller VIP. Arrangøren setter opp billettypene, og pris og antall står tydelig på hver type før du velger.",
        },
        {
          title: "Rabattkoder og gavekort",
          body: "Har du en rabattkode eller et gavekort, legger du det inn i kjøpet og ser den nye prisen med en gang, før du betaler.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: vennegjeng i Trondheim",
          role: "Illustrasjon",
          headline: "Fire billetter i ett kjøp",
          body: "Slik kan det se ut: I stedet for at én i gjengen oppretter konto på enda en billettside og legger ut for alle, finner de konserten på Digilist, ser pris og ledige ståplasser, kjøper fire billetter i samme kjøp med Vipps, og hver får sin QR-billett på mobilen før kvelden.",
          outcome: [
            { label: "Nye kontoer", value: "0" },
            { label: "Pris synlig", value: "Før kjøp" },
            { label: "Billetter", value: "QR på mobilen" },
          ],
        },
        {
          customer: "Eksempel: familie på søndagskonsert",
          role: "Illustrasjon",
          headline: "Familiekonsert uten papirlapper",
          body: "Slik kan det se ut: En familie finner en familiekonsert på kulturhuset samme helg, ser at det er sitteplasser igjen og hva voksen- og barnebilletter koster, kjøper med Vipps på kvelden og går rett inn søndag med QR-kodene klare på mobilen.",
          outcome: [
            { label: "Kjøp", value: "På minutter" },
            { label: "Papirbilletter", value: "Ingen" },
            { label: "Innsjekk", value: "Ett skann" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som billettkjøpet. Du får kvittering med en gang, og alt er samlet på ett sted.",
        },
        {
          label: "Billetter",
          value: "Arrangøren setter opp billettyper og kvoter, for eksempel ståplass, sitteplass og VIP. Du ser hva som er igjen av hver type.",
        },
        {
          label: "Pris",
          value: "Prisen per billett vises før du kjøper, uten gebyrer som legges på i siste steg.",
        },
        {
          label: "Levering",
          value: "Billetten leveres som QR-kode rett på mobilen så snart kjøpet er bekreftet. Ingen utskrift nødvendig.",
        },
        {
          label: "Innsjekk",
          value: "QR-koden skannes ved inngangen. Hver billett kan bare brukes én gang, så du slipper diskusjoner i døra.",
        },
        {
          label: "Rabatt og gavekort",
          value: "Rabattkoder og gavekort legges inn i kjøpsflyten, og prisen oppdateres før du betaler.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Billettene er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å kjøpe billett.",
        },
      ]}
      pullQuote={{
        text: "Konsertene nær deg samlet ett sted, med pris og ledige billetter synlig før du kjøper. Betal med Vipps, vis QR-koden i døra, og gå inn.",
        byline: "Slik er Digilist ment å fungere for deg som skal på konsert",
      }}
      faq={[
        {
          question: "Hva koster konsertbilletter?",
          answer:
            "Prisen varierer med artist, scene og billettype. En klubbkonsert eller intimkonsert kan koste noen hundre kroner, mens større navn ligger høyere, og VIP-billetter koster mer enn ståplass. På Digilist ser du prisen per billett før du kjøper, uten gebyrer som dukker opp i siste steg.",
        },
        {
          question: "Hvordan kjøper jeg billetter til konsert på Digilist?",
          answer:
            "Finn konserten, velg billettype og antall, og betal med Vipps eller kort i samme flyt. Du trenger ikke opprette en egen billettkonto, og QR-billetten kommer rett på mobilen når kjøpet er bekreftet.",
        },
        {
          question: "Får jeg billetten på mobilen?",
          answer:
            "Ja. Billetten leveres som QR-kode på mobilen med en gang kjøpet er gjennomført, og ligger i oversikten din frem til konserten. Du trenger verken skrive ut noe eller lete etter en e-post i køen, du viser bare QR-koden ved inngangen.",
        },
        {
          question: "Kan jeg bruke rabattkode eller gavekort?",
          answer:
            "Ja. Rabattkoder og gavekort legges inn i kjøpsflyten før du betaler, og du ser den oppdaterte prisen med en gang. Gjelder koden for konserten, trekkes rabatten fra før betalingen går gjennom.",
        },
        {
          question: "Hva skjer hvis konserten blir avlyst?",
          answer:
            "Blir konserten avlyst, får du beskjed, og billetten refunderes etter reglene som gjelder for arrangementet. Refusjonen går tilbake til samme betalingsmåte som du brukte, og vilkårene står på konserten før du kjøper.",
        },
        {
          question: "Kan jeg kjøpe flere billetter samtidig?",
          answer:
            "Ja. Du velger antall i samme kjøp, betaler samlet med Vipps eller kort, og får en QR-billett per person. Hver QR-kode skannes for seg ved inngangen, så dere kan gå inn hver for dere. Noen billettyper har en kvote som begrenser hvor mange du kan kjøpe.",
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
