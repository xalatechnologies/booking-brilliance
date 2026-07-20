import UseCasePage from "@/components/UseCasePage";

export default function ArrangementSport() {
  return (
    <UseCasePage
      basePath="/arrangementer"
      parentCrumb={{ name: "Arrangementer", path: "/arrangementer" }}
      sectionLabel="ARRANGEMENTER"
      slug="sport"
      breadcrumb="Sport"
      title="Sportsbilletter"
      dek="Finn kamper og idrettsarrangement nær deg, se pris og ledige billetter, og kjøp med Vipps. QR-billett på mobilen."
      lead="Billetter til kamper og idrettsarrangement ligger spredt på klubbenes egne sider og i ulike billettsystemer. Hvert sted krever sin egen konto, det er uklart om du får sete eller ståplass og hva billetten faktisk koster, og selve billetten kommer som papir eller PDF som fort blir borte på kampdagen. På Digilist er kampene og idrettsarrangementene i nærområdet samlet ett sted, med pris og ledige billetter synlig før du kjøper. Du betaler med Vipps uten å opprette ny konto, og QR-billetten ligger klar på mobilen når du skal inn."
      seoTitle="Sportsbilletter: billetter til kamp, kjøp med Vipps | Digilist"
      seoDescription="Sportsbilletter samlet ett sted: finn kamper og idrettsarrangement nær deg, se pris og ledige seter, og kjøp billetter til kamp med Vipps. QR-billett på mobilen."
      keywords="sportsbilletter, billetter til kamp, fotballbilletter, kjøp kampbillett, idrettsarrangement billetter, sesongkort, håndball billetter, kamp nær meg"
      audience={[
        {
          persona: "Supportere",
          context: "Du følger laget ditt gjennom sesongen og vil ha billetter til hjemmekampene uten å lete gjennom klubbens sider og ulike billettsystemer hver gang.",
        },
        {
          persona: "Familier på kamp",
          context: "Fotballkamp eller håndballkamp i helgen med barna. Du vil se pris for voksne og barn, sitte samlet og ha billettene klare på mobilen.",
        },
        {
          persona: "Venner på idrettsarrangement",
          context: "Dere skal på cup, stevne eller ishockeykamp sammen og trenger billetter til alle i samme kjøp, uten at én må opprette konto og legge ut for hele gjengen.",
        },
        {
          persona: "Du som vil ha sesongkort",
          context: "Du går på de fleste hjemmekampene og vil ha sesongkort med fast plass, kjøpt én gang og klart på mobilen gjennom hele sesongen.",
        },
      ]}
      problems={[
        "Billettene ligger spredt på klubbenes egne sider og i ulike billettsystemer, uten ett sted å lete.",
        "Hver klubb og hvert billettsystem krever sin egen konto og sitt eget passord før du får kjøpt noe.",
        "Det er uklart om du får sete, felt eller ståplass, og hva billetten faktisk koster, før langt ut i kjøpet.",
        "Billetten kommer som papir eller PDF som er vanskelig å finne igjen i køen ved inngangen på kampdagen.",
        "Sesongkort og enkeltbilletter håndteres ulikt fra klubb til klubb, og oversikten forsvinner fort.",
      ]}
      features={[
        {
          title: "Kamper og idrettsarrangement samlet ett sted",
          body: "Fotball, håndball, ishockey, cuper og stevner i nærområdet på samme sted. Du slipper å lete gjennom klubbenes sider og ulike billettsystemer hver for seg.",
        },
        {
          title: "Pris og ledige billetter synlig",
          body: "Du ser hva billetten koster og om det er billetter eller seter igjen, før du starter kjøpet. Ingen gebyrer som dukker opp i siste steg.",
        },
        {
          title: "Velg sete eller felt",
          body: "Der arrangøren har satt opp seter eller felt, velger du plass i kjøpet. Skal dere flere sammen, kan dere velge seter ved siden av hverandre på tribunen.",
        },
        {
          title: "Kjøp med Vipps, uten ny konto",
          body: "Betal med Vipps eller kort i samme flyt. Du trenger ikke opprette enda en billettkonto hos hver klubb for å komme deg på kamp.",
        },
        {
          title: "QR-billett rett på mobilen",
          body: "Billetten kommer som QR-kode på mobilen med en gang kjøpet er bekreftet, med sete eller felt synlig. Ingen papirlapp å miste på kampdagen.",
        },
        {
          title: "Sesongkort, rabattkoder og gavekort",
          body: "Kjøp sesongkort med fast plass der klubben tilbyr det, og legg inn rabattkoder eller gavekort i kjøpet. Prisen oppdateres før du betaler.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: far og sønn på fotballkamp",
          role: "Illustrasjon",
          headline: "Til hjemmekampen uten papirlapper",
          body: "Slik kan det se ut: I stedet for å opprette konto i klubbens billettsystem, finner de hjemmekampen på Digilist, ser pris for voksen og barn og hvilke felt som har ledige seter, kjøper to billetter side om side med Vipps, og går rett inn lørdag med QR-kodene klare på mobilen.",
          outcome: [
            { label: "Nye kontoer", value: "0" },
            { label: "Seter", value: "Side om side" },
            { label: "Innsjekk", value: "Ett skann" },
          ],
        },
        {
          customer: "Eksempel: vennegjeng på ishockey",
          role: "Illustrasjon",
          headline: "Fem billetter i ett kjøp",
          body: "Slik kan det se ut: Gjengen skal på ishockeykamp og finner den på Digilist, ser at det er ledige seter på samme felt og hva billettene koster, kjøper fem billetter i samme kjøp med Vipps uten at én må legge ut for alle, og hver får sin QR-billett på mobilen med sete synlig før kampstart.",
          outcome: [
            { label: "Kjøp", value: "På minutter" },
            { label: "Pris synlig", value: "Før kjøp" },
            { label: "Billetter", value: "QR på mobilen" },
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
          value: "Enkeltbillett, sesongkort eller billetter per felt og tribune. Arrangøren setter opp typene, og du ser hva som er igjen av hver.",
        },
        {
          label: "Pris",
          value: "Prisen per billett vises før du kjøper, uten gebyrer som legges på i siste steg.",
        },
        {
          label: "Levering",
          value: "Billetten leveres som QR-kode rett på mobilen så snart kjøpet er bekreftet, med sete eller felt synlig. Ingen utskrift nødvendig.",
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
          value: "Trygg pålogging med BankID eller ID-porten. Billettene og sesongkortet er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å kjøpe billett.",
        },
      ]}
      pullQuote={{
        text: "Kampene nær deg samlet ett sted, med pris og ledige seter synlig før du kjøper. Betal med Vipps, vis QR-koden ved inngangen, og finn plassen din.",
        byline: "Slik er Digilist ment å fungere for deg som skal på kamp",
      }}
      faq={[
        {
          question: "Hva koster sportsbilletter?",
          answer:
            "Prisen varierer med idrett, nivå og motstander. En kamp i lokale serier kan koste under hundrelappen, mens toppfotball og store oppgjør ligger høyere, og barnebilletter er ofte rimeligere. På Digilist ser du prisen per billett før du kjøper, uten gebyrer som dukker opp i siste steg.",
        },
        {
          question: "Hvordan kjøper jeg billetter til kamp på Digilist?",
          answer:
            "Finn kampen eller idrettsarrangementet, velg billettype, antall og eventuelt sete eller felt, og betal med Vipps eller kort i samme flyt. Du trenger ikke opprette konto hos hver klubb, og QR-billetten kommer rett på mobilen når kjøpet er bekreftet.",
        },
        {
          question: "Kan jeg velge sete eller felt?",
          answer:
            "Ja, der arrangøren har satt opp seter eller felt. Du ser hvilke plasser som er ledige og velger i kjøpet, og skal dere flere sammen, kan dere velge seter ved siden av hverandre. På mindre arrangementer og stevner er billettene ofte uplasserte.",
        },
        {
          question: "Finnes det sesongkort?",
          answer:
            "Ja, der klubben tilbyr det. Sesongkortet kjøpes på samme måte som en enkeltbillett, gjerne med fast plass, og ligger på mobilen gjennom hele sesongen. Du viser samme QR-kode ved inngangen på hver hjemmekamp.",
        },
        {
          question: "Får jeg billetten på mobilen?",
          answer:
            "Ja. Billetten leveres som QR-kode på mobilen med en gang kjøpet er gjennomført, med sete eller felt synlig, og ligger i oversikten din frem til kampen. Du trenger verken skrive ut noe eller lete etter en e-post i køen, du viser bare QR-koden ved inngangen.",
        },
        {
          question: "Hva skjer hvis kampen blir avlyst eller flyttet?",
          answer:
            "Blir kampen avlyst, får du beskjed, og billetten refunderes etter reglene som gjelder for arrangementet. Flyttes kampen, gjelder billetten som regel den nye datoen. Refusjonen går tilbake til samme betalingsmåte som du brukte, og vilkårene står på arrangementet før du kjøper.",
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
