import UseCasePage from "@/components/UseCasePage";

export default function ArrangementFestival() {
  return (
    <UseCasePage
      basePath="/arrangementer"
      parentCrumb={{ name: "Arrangementer", path: "/arrangementer" }}
      sectionLabel="ARRANGEMENTER"
      slug="festival"
      breadcrumb="Festival"
      title="Festivalbilletter"
      dek="Finn festivaler nær deg og kjøp dagspass eller helgepass med Vipps. QR-billetten kommer rett på mobilen."
      lead="Skal du på musikkfestival, matfestival eller kulturfestival, ligger billettene ofte spredt på hver sin billettside, med egne kontoer, egne gebyrer og egne regler. Det er uklart om du bør ta dagspass eller helgepass, hva som faktisk er igjen, og hva totalen blir før gebyrene dukker opp i kassen. På Digilist er festivalene i nærområdet samlet ett sted. Du ser billettyper og pris opp mot hverandre, kjøper passet med Vipps uten å opprette enda en konto, og får QR-billetten rett på mobilen, klar til innsjekk og armbånd."
      seoTitle="Festivalbilletter og festivalpass: finn og kjøp | Digilist"
      seoDescription="Finn festivalbilletter og festivalpass nær deg: musikk-, mat- og kulturfestivaler samlet ett sted. Kjøp dagspass eller helgepass med Vipps, QR-billett på mobilen."
      keywords="festivalbilletter, festivalpass, billetter til festival, kjøp festivalbillett, dagspass festival, helgepass festival, musikkfestival billetter, festival nær meg"
      audience={[
        {
          persona: "Festivalgjengere",
          context: "Du følger med på hvilke festivaler som kommer nær deg, og vil sikre deg pass tidlig, før prisene stiger eller helgepassene blir utsolgt.",
        },
        {
          persona: "Venner som drar sammen",
          context: "Dere skal på festival som gjeng og trenger billetter til alle, uten å samle inn penger over flere apper og håpe at alle husker å kjøpe.",
        },
        {
          persona: "Familier på matfestival og kulturfestival",
          context: "Dere ser etter en matfestival eller kulturfestival som passer for både store og små, med tydelig pris og program før dere bestemmer dere.",
        },
        {
          persona: "Folk på dagspass",
          context: "Du vil bare ha én dag, gjerne den med artisten eller programmet du bryr deg om, og trenger å se hvilke dagspass som fortsatt er ledige.",
        },
      ]}
      problems={[
        "Festivalene ligger spredt på hver sin billettside, med egne kontoer og innlogginger for hvert kjøp.",
        "Det er uklart hva dagspass og helgepass faktisk koster, og hvilke pass som fortsatt er igjen.",
        "Gebyrer dukker opp først i kassen, etter at du har bestemt deg.",
        "Du må opprette ny konto og legge inn kortet ditt på en side du aldri har brukt før.",
        "Billetten kommer som PDF på e-post som du må lete fram i køen inn til området.",
      ]}
      features={[
        {
          title: "Festivalene samlet ett sted",
          body: "Musikkfestivaler, matfestivaler og kulturfestivaler i nærområdet samlet i ett søk. Du slipper å lete gjennom hver enkelt festivals billettside.",
        },
        {
          title: "Pris og ledige pass synlig",
          body: "Du ser hva passene koster og hvilke som fortsatt er ledige før du velger, ikke etter. Gebyrene er med i prisen som vises.",
        },
        {
          title: "Dagspass, helgepass eller VIP",
          body: "Velg det som passer: dagspass for den ene dagen, helgepass for hele festivalen, eller VIP der festivalen tilbyr det. Forskjellene står forklart før du velger.",
        },
        {
          title: "Kjøp med Vipps, uten ny konto",
          body: "Betal med Vipps eller kort i samme flyt. Du trenger ikke opprette enda en konto hos enda en billettleverandør for å sikre deg passet.",
        },
        {
          title: "QR-billett på mobilen",
          body: "Billetten kommer som QR-kode rett på mobilen etter kjøpet, klar til skanning i inngangen. Ingen PDF å lete fram i køen.",
        },
        {
          title: "Rabattkoder og gavekort",
          body: "Har du rabattkode eller gavekort, legger du det inn i kassen og ser den nye totalen med en gang, før du betaler.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: vennegjeng til musikkfestival",
          role: "Illustrasjon",
          headline: "Helgepass til hele gjengen på ett kjøp",
          body: "Slik kan det se ut: Fire venner skal på sommerens musikkfestival. I stedet for at alle kjøper hver for seg på festivalens egen side, finner de festivalen på Digilist, ser at helgepass fortsatt er ledig, og kjøper fire pass i ett kjøp med Vipps. QR-billettene ligger på mobilen til hver enkelt før helgen starter.",
          outcome: [
            { label: "Pass kjøpt", value: "4 i ett kjøp" },
            { label: "Nye kontoer", value: "0" },
            { label: "Billett", value: "QR på mobilen" },
          ],
        },
        {
          customer: "Eksempel: familie på matfestival",
          role: "Illustrasjon",
          headline: "Dagspass til lørdagen, bestemt på fredag",
          body: "Slik kan det se ut: En familie vurderer den lokale matfestivalen, men vil bare ha lørdagen. På Digilist ser de prisen for dagspass, at det fortsatt er ledig, og hva som skjer på scenen den dagen. De kjøper med Vipps fredag kveld og skanner QR-billetten i inngangen dagen etter.",
          outcome: [
            { label: "Billettype", value: "Dagspass" },
            { label: "Pris synlig", value: "Før kjøp" },
            { label: "Innsjekk", value: "QR-skanning" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som kjøpet. Du ser totalprisen, med gebyrer, før du bekrefter.",
        },
        {
          label: "Billetter",
          value: "Dagspass, helgepass og VIP der festivalen tilbyr det. Forskjellene mellom passene står forklart før du velger.",
        },
        {
          label: "Pris",
          value: "Prisen per pass vises åpent på festivalsiden, inkludert gebyrer. Ingen overraskelser i kassen.",
        },
        {
          label: "Levering",
          value: "QR-billetten kommer rett på mobilen etter kjøpet, og ligger klar i oversikten din fram til festivalen.",
        },
        {
          label: "Innsjekk",
          value: "Billetten skannes i inngangen. Mange festivaler bytter QR-koden mot et armbånd som gjelder resten av festivalen.",
        },
        {
          label: "Rabatt og gavekort",
          value: "Rabattkoder og gavekort legges inn i kassen, og totalen oppdateres før du betaler.",
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
        text: "Festivalene nær deg samlet ett sted, med pris og ledige pass synlig før du kjøper. Dagspass eller helgepass med Vipps, og QR-billett rett på mobilen.",
        byline: "Slik er Digilist ment å fungere for deg som skal på festival",
      }}
      faq={[
        {
          question: "Hva koster et festivalpass?",
          answer:
            "Prisen varierer med festival, størrelse og billettype. Et dagspass til en lokal festival kan koste fra noen hundrelapper, mens helgepass til større musikkfestivaler gjerne ligger fra rundt tusen kroner og oppover. På Digilist ser du prisen for hvert pass, inkludert gebyrer, før du kjøper.",
        },
        {
          question: "Hva er forskjellen på dagspass og helgepass?",
          answer:
            "Dagspass gjelder én bestemt dag av festivalen, helgepass gjelder alle dagene. Skal du bare se ett program eller én artist, holder ofte dagspasset. Skal du ha med deg hele festivalen, er helgepasset som regel billigere enn å kjøpe flere dagspass hver for seg.",
        },
        {
          question: "Hvordan kjøper jeg festivalbillett?",
          answer:
            "Du finner festivalen på Digilist, velger billettype og antall, og betaler med Vipps eller kort i samme flyt. Du trenger ikke opprette ny konto, og bekreftelsen med QR-billetten kommer med en gang.",
        },
        {
          question: "Får jeg billetten på mobilen?",
          answer:
            "Ja. Billetten kommer som QR-kode rett på mobilen etter kjøpet, og ligger klar i oversikten din. I inngangen skannes koden, og på mange festivaler byttes den mot et armbånd som gjelder resten av festivalen.",
        },
        {
          question: "Kan jeg bruke rabattkode eller gavekort?",
          answer:
            "Ja, der festivalen tilbyr det. Du legger inn rabattkoden eller gavekortet i kassen, og totalprisen oppdateres før du betaler. Gavekort kan ofte kombineres med Vipps eller kort for resten av beløpet.",
        },
        {
          question: "Kan jeg få refundert billetten hvis jeg ikke kan dra?",
          answer:
            "Refusjonsreglene settes av arrangøren og står på festivalsiden før du kjøper. Blir festivalen avlyst, refunderes billetten. Kan du selv ikke dra, avhenger det av arrangørens vilkår for det aktuelle passet.",
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
