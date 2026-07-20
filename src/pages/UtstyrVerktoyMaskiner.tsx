import UseCasePage from "@/components/UseCasePage";

export default function UtstyrVerktoyMaskiner() {
  return (
    <UseCasePage
      basePath="/utstyr"
      parentCrumb={{ name: "Utstyr", path: "/utstyr" }}
      sectionLabel="UTSTYR"
      slug="verktoy-maskiner"
      breadcrumb="Verktøy og maskiner"
      title="Leie verktøy og maskiner"
      dek="Minigraver, høytrykksspyler, stillas og verktøy til prosjektet. Finn hva som er ledig nær deg, og book med Vipps."
      lead="Skal du pusse opp, ruste opp hagen eller flytte, ender du fort med å lete etter utstyr hos ulike utleiere, spørre naboer og vente på svar. Dagsprisen er uklar, depositumet dukker opp i siste liten, og du vet ikke om minigraveren faktisk er ledig den helgen du trenger den. Henting og levering blir en kabal for seg. På Digilist er verktøy og maskiner i nærområdet samlet ett sted, med pris per dag eller helg, depositum og ledighet synlig før du booker, og betaling med Vipps i samme flyt."
      seoTitle="Leie verktøy og maskiner: pris og booking | Digilist"
      seoDescription="Leie verktøy og maskiner til oppussing, hage og bygg: minigraver, høytrykksspyler og stillas. Se pris per dag, ledighet og depositum, og book med Vipps."
      keywords="leie verktøy, leie maskiner, leie minigraver, leie høytrykksspyler, leie stillas, verktøy til leie, maskiner til leie, leie tilhenger, leie utstyr oppussing"
      audience={[
        {
          persona: "Gjør-det-selv til oppussing",
          context: "Du skal pusse opp bad, kjøkken eller kjeller og trenger slagbormaskin, fliskutter eller stillas i noen dager, ikke et eierskap for alltid.",
        },
        {
          persona: "Hageprosjektet",
          context: "Drenering, ny plen eller hekk som skal vekk. Minigraver, høytrykksspyler eller kantklipper for en helg, uten å kjøpe utstyr du bruker en gang.",
        },
        {
          persona: "Småbedrifter og håndverkere",
          context: "Dere trenger en ekstra maskin i en travel periode, eller spesialverktøy til et enkeltoppdrag, med kvittering rett i regnskapet.",
        },
        {
          persona: "Flyttingen",
          context: "Tilhenger til helgen, kanskje en sekketralle og noen stropper. Bookbart på minutter, med henting når det passer deg.",
        },
      ]}
      problems={[
        "Utstyret ligger spredt: maskinutleiere, byggevarehus, Finn-annonser og nabolagsgrupper, uten ett sted å søke.",
        "Dagsprisen og depositumet er uklart til du har ringt eller sendt melding og ventet på svar.",
        "Ingen ekte kalender: du vet ikke om minigraveren er ledig den helgen du har satt av, før noen svarer deg.",
        "Henting og levering blir en kabal, med tilhenger du kanskje ikke har og åpningstider som ikke passer prosjektet.",
        "Tilstand og bruksanvisning er et sjansespill, du vet ikke hva du får før du står der med maskinen.",
      ]}
      features={[
        {
          title: "Alt utstyr nær deg, ett søk",
          body: "Minigraver, høytrykksspyler, slagbormaskin, stillas, tilhenger, fliskutter og gressklipper samlet på ett sted. Du slipper å lete hos utleiere, i Finn-annonser og nabolagsgrupper hver for seg.",
        },
        {
          title: "Dagspris og depositum synlig",
          body: "Pris per dag eller helg og eventuelt depositum står på hvert utstyr før du booker. Ingen overraskelser når du står ved disken eller får sluttregningen.",
        },
        {
          title: "Ledig i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig for dine datoer. Du booker leieperioden direkte og får bekreftelsen med en gang, uten å vente på svar.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Depositum håndteres digitalt og frigjøres automatisk når utstyret er levert tilbake. Ingen bankoverføring til en fremmed.",
        },
        {
          title: "Henting eller levering",
          body: "Hver annonse viser om du henter selv eller kan få utstyret kjørt ut, med tidspunkt og eventuell leveringskostnad oppgitt før du bekrefter.",
        },
        {
          title: "Tilstand og bruksanvisning oppgitt",
          body: "Alder, tilstand, drivstoff og tilbehør står på maskinen, og bruksanvisning følger med der det trengs. Du vet hva du får før du booker.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: drenering i rekkehushagen",
          role: "Illustrasjon",
          headline: "Minigraver booket til helgen, uten ringerunde",
          body: "Slik kan det se ut: Familien skal drenere langs husveggen og trenger minigraver en helg. I stedet for å ringe maskinutleiere og spørre i nabolagsgruppen, søker de på sted og dato, sammenligner helgepris og depositum på tre ledige gravere, velger en som kan hentes fredag ettermiddag, og betaler med Vipps. Bekreftelsen kommer med en gang.",
          outcome: [
            { label: "Ringerunde", value: "Ingen" },
            { label: "Pris og depositum", value: "Synlig før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: håndverker med maskinstopp",
          role: "Illustrasjon",
          headline: "Ekstra fliskutter til neste morgen",
          body: "Slik kan det se ut: Et lite håndverkerfirma står midt i et baderomsprosjekt når fliskutteren ryker. I stedet for å kjøre innom flere utleiere på måfå, finner de en ledig fliskutter i nærheten, ser dagspris og tilstand, booker den til dagen etter og henter den på vei til jobben. Kvitteringen ligger klar til regnskapet.",
          outcome: [
            { label: "Leting", value: "Minutter" },
            { label: "Dagspris", value: "Synlig" },
            { label: "Prosjektet", value: "I rute" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk når utstyret er levert tilbake.",
        },
        {
          label: "Ledig",
          value: "Sanntidskalender per maskin. Du velger leieperiode, ser med en gang om utstyret er ledig, og booker direkte uten å vente på svar.",
        },
        {
          label: "Pris",
          value: "Pris per dag eller helg vises sammen med eventuelt depositum, slik at du ser totalkostnaden før du bekrefter.",
        },
        {
          label: "Levering/henting",
          value: "Hver annonse viser om du henter selv eller kan få utstyret levert, med tidspunkt og eventuell kostnad oppgitt på forhånd.",
        },
        {
          label: "Maskin",
          value: "Type, modell, alder, drivstoff og tilbehør står på hver maskin, sammen med bruksanvisning der det er relevant.",
        },
        {
          label: "Forsikring/ansvar",
          value: "Vilkår for skade, forsikring og ansvar står på hvert utstyr før du booker, ikke som en overraskelse i etterkant.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Leien er knyttet til deg, med kvittering og full oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å leie.",
        },
      ]}
      pullQuote={{
        text: "Minigraveren, spyleren og stillaset der du bor, samlet ett sted, med dagspris, depositum og ledighet synlig før du booker. Ikke en runde med telefoner og nabospørsmål.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie verktøy eller minigraver?",
          answer:
            "Prisen varierer med type utstyr, sted og varighet. En slagbormaskin eller høytrykksspyler kan koste fra et par hundre kroner per dag, mens en minigraver gjerne ligger fra rundt tusen kroner per dag og oppover. På Digilist ser du pris per dag eller helg og eventuelt depositum på hvert utstyr før du booker.",
        },
        {
          question: "Leier jeg per dag eller per helg?",
          answer:
            "Begge deler. De fleste maskiner kan leies per dag, og mange utleiere tilbyr helgepris som ofte er rimeligere enn to enkeltdager. Du velger leieperioden i kalenderen og ser totalprisen for akkurat dine datoer før du bekrefter.",
        },
        {
          question: "Må jeg betale depositum?",
          answer:
            "Noen utleiere krever depositum, særlig på større maskiner som minigraver og tilhenger. Der det gjelder, står beløpet tydelig på utstyret før du booker. Depositumet håndteres digitalt gjennom Digilist og frigjøres automatisk når utstyret er levert tilbake i avtalt stand.",
        },
        {
          question: "Kan jeg få utstyret levert, eller må jeg hente selv?",
          answer:
            "Det varierer per annonse. Mange utleiere tilbyr henting til avtalt tid, og noen leverer større maskiner mot et tillegg. Hva som gjelder, og hva levering eventuelt koster, står på utstyret før du booker, så du slipper å ordne tilhenger i siste liten.",
        },
        {
          question: "Hva skjer hvis noe blir skadet?",
          answer:
            "Vilkår for skade, forsikring og ansvar står på hvert utstyr før du booker. Normal slitasje er utleiers ansvar, mens skader utover dette håndteres etter vilkårene, ofte via depositumet. Meld fra med en gang hvis noe skjer, så dokumenteres saken gjennom bookingen.",
        },
        {
          question: "Kan jeg avbestille hvis prosjektet endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert utstyr. Der det er tillatt, avbestiller du digitalt, og betaling og eventuelt depositum frigjøres automatisk etter reglene som gjelder for leien.",
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
