import UseCasePage from "@/components/UseCasePage";

export default function ArrangementTeaterOgScene() {
  return (
    <UseCasePage
      basePath="/arrangementer"
      parentCrumb={{ name: "Arrangementer", path: "/arrangementer" }}
      sectionLabel="ARRANGEMENTER"
      slug="teater-og-scene"
      breadcrumb="Teater og scene"
      title="Teater- og scenebilletter"
      dek="Teater, standup eller revy? Finn forestillinger nær deg, kjøp billett med Vipps og få QR-billett med sete på mobilen."
      lead="Skal du på teater, står forestillingene ofte spredt på teatrenes egne nettsider, hver med sitt billettsystem, sin konto og sin kø. Det er vanskelig å se hva som går nær deg, om du kan velge sete, og hva billetten faktisk koster før gebyrene. På Digilist er forestillinger, standup og revy i nærområdet samlet ett sted. Du ser dato, pris og ledige seter, velger plass, og betaler med Vipps uten å opprette ny konto. Billetten kommer som QR-kode på mobilen, med setenummeret ditt, klar til å skannes i døra."
      seoTitle="Teaterbilletter: finn forestilling og kjøp billett | Digilist"
      seoDescription="Teaterbilletter og billetter til forestilling, standup og revy nær deg. Se pris og ledige seter, velg plass og kjøp med Vipps. QR-billett med sete på mobilen."
      keywords="teaterbilletter, billetter til teater, forestilling billetter, standup billetter, revy billetter, scene billetter, kjøp teaterbillett, teater nær meg"
      audience={[
        {
          persona: "Teaterglade",
          context: "Du følger med på premierer og oppsetninger, og vil se hva som spilles nær deg denne måneden, med pris og ledige seter synlig, uten å sjekke fem teatersider.",
        },
        {
          persona: "Venner som skal på standup",
          context: "Dere vil finne et show en fredagskveld, kjøpe billetter til hele gjengen i samme kjøp, og slippe at alle må opprette hver sin konto.",
        },
        {
          persona: "Familier til barneteater",
          context: "Du ser etter en forestilling som passer for barna i helgen, med tydelig aldersanbefaling, barnepris og seter der dere sitter samlet.",
        },
        {
          persona: "Kulturinteresserte lokalt",
          context: "Du vil oppdage revyer, amatørteater og gjestespill i nærområdet, det som sjelden når de store plakatene, samlet på ett sted.",
        },
      ]}
      problems={[
        "Forestillingene ligger spredt på teatrenes egne sider og ulike billettportaler, uten ett sted å søke på det som går nær deg.",
        "Hvert billettsystem krever sin egen konto, sitt eget passord og sitt lagrede kort før du i det hele tatt får kjøpt.",
        "Det er uklart om du kan velge sete, og hvilke plasser som faktisk er ledige, før du er langt inne i kjøpet.",
        "Prisen du ser først er sjelden prisen du betaler, gebyrer og tillegg dukker opp i siste steg.",
        "Billetten kommer som PDF eller utskrift som roter seg bort i innboksen før forestillingskvelden.",
      ]}
      features={[
        {
          title: "Forestillinger samlet ett sted",
          body: "Teater, standup, revy og andre sceneopptredener i nærområdet på ett sted. Du slipper å sjekke hvert teater og hver billettportal hver for seg.",
        },
        {
          title: "Pris og ledige seter synlig",
          body: "Du ser hva billetten koster og hvilke plasser som er ledige før du starter kjøpet. Totalprisen vises før du bekrefter, uten overraskelser i siste steg.",
        },
        {
          title: "Velg sete selv",
          body: "Der salen har nummererte plasser, velger du sete direkte i salkartet. Sitt samlet med gjengen, eller velg raden du liker best.",
        },
        {
          title: "Kjøp med Vipps uten ny konto",
          body: "Betal med Vipps eller kort i samme flyt. Du trenger ikke opprette enda en billettkonto med eget passord for å kjøpe.",
        },
        {
          title: "QR-billett på mobilen",
          body: "Billetten leveres som QR-kode på mobilen, med setenummeret ditt, rett etter kjøpet. Ingen utskrift, ingen PDF å lete etter.",
        },
        {
          title: "Rabattkoder og gavekort",
          body: "Har du en rabattkode eller et gavekort, legger du det inn i kjøpet, og beløpet trekkes fra totalprisen før du betaler.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: venninnegjeng på standup",
          role: "Illustrasjon",
          headline: "Fire billetter i ett kjøp, ingen nye kontoer",
          body: "Slik kan det se ut: Gjengen vil på standup fredag kveld. En av dem søker på sted og dato, finner et show i kulturhuset, ser prisen og de ledige setene, og kjøper fire billetter samlet med Vipps. QR-billettene deles til de andre, og alle har sin billett på mobilen før helgen.",
          outcome: [
            { label: "Kontoer opprettet", value: "0" },
            { label: "Betaling", value: "Vipps" },
            { label: "Billetter", value: "På mobilen" },
          ],
        },
        {
          customer: "Eksempel: familie på barneteater",
          role: "Illustrasjon",
          headline: "Søndagsforestilling med setene samlet",
          body: "Slik kan det se ut: Familien finner en barneforestilling søndag formiddag, ser aldersanbefalingen og barneprisen, og velger fire seter ved midtgangen i salkartet. Billettene kommer som QR-koder med setenummer, og skannes i døra uten kø ved billettluka.",
          outcome: [
            { label: "Setevalg", value: "I salkartet" },
            { label: "Pris synlig", value: "Før kjøp" },
            { label: "Innsjekk", value: "QR i døra" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som kjøpet. Ingen ny billettkonto å opprette, ingen bankoverføring.",
        },
        {
          label: "Billetter",
          value: "Setevalg i salkart der plassene er nummererte, og billettkategorier som ordinær, student, honnør og barn.",
        },
        {
          label: "Pris",
          value: "Totalprisen, inkludert eventuelle gebyrer, vises før du bekrefter kjøpet. Ingen tillegg i siste steg.",
        },
        {
          label: "Levering",
          value: "Billetten leveres som QR-kode på mobilen rett etter kjøpet, med setenummeret ditt på billetten.",
        },
        {
          label: "Innsjekk",
          value: "QR-koden skannes i døra. Du trenger verken utskrift eller egen app, bare mobilen.",
        },
        {
          label: "Rabatt og gavekort",
          value: "Rabattkoder og gavekort legges inn i kjøpet og trekkes fra totalprisen før du betaler.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Kjøpet er knyttet til deg, med kvittering og billettene samlet.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å kjøpe billett.",
        },
      ]}
      pullQuote={{
        text: "Alle forestillingene der du bor, samlet ett sted, med pris og ledige seter synlig. Velg plass, betal med Vipps, og ha billetten som QR-kode på mobilen.",
        byline: "Slik er Digilist ment å fungere for deg som skal på forestilling",
      }}
      faq={[
        {
          question: "Hva koster teaterbilletter?",
          answer:
            "Prisen varierer med forestilling, scene og plassering. Lokale revyer og amatørteater ligger ofte på noen hundre kroner, mens større oppsetninger og kjente standupnavn koster mer. Mange forestillinger har egne priser for student, honnør og barn. På Digilist ser du totalprisen, inkludert eventuelle gebyrer, før du kjøper.",
        },
        {
          question: "Hvordan kjøper jeg billetter til en forestilling?",
          answer:
            "Søk på sted og dato, velg forestillingen, velg antall billetter og eventuelt seter i salkartet, og betal med Vipps eller kort. Billettene kommer som QR-koder på mobilen med en gang, uten at du må opprette en ny konto.",
        },
        {
          question: "Kan jeg velge sete?",
          answer:
            "Ja, der salen har nummererte plasser velger du sete direkte i salkartet og ser hvilke plasser som er ledige. Noen forestillinger har fri plassering, og da står det tydelig på arrangementet før du kjøper.",
        },
        {
          question: "Får jeg billetten på mobilen?",
          answer:
            "Ja. Billetten leveres som QR-kode på mobilen rett etter kjøpet, med setenummeret ditt der det gjelder. Du trenger verken utskrift eller egen app, koden skannes i døra.",
        },
        {
          question: "Kan jeg bruke rabattkode eller gavekort?",
          answer:
            "Ja. Har du en rabattkode eller et gavekort, legger du det inn i kjøpet, og beløpet trekkes fra totalprisen før du betaler med Vipps eller kort.",
        },
        {
          question: "Kan jeg få refundert billetten hvis jeg ikke kan gå?",
          answer:
            "Refusjonsreglene settes av arrangøren og står tydelig på forestillingen før du kjøper. Blir forestillingen avlyst eller flyttet, refunderes billetten etter arrangørens regler, og du får beskjed direkte.",
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
