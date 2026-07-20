import UseCasePage from "@/components/UseCasePage";

export default function OvernattingRom() {
  return (
    <UseCasePage
      basePath="/overnatting"
      parentCrumb={{ name: "Overnatting", path: "/overnatting" }}
      sectionLabel="OVERNATTING"
      slug="rom"
      breadcrumb="Rom"
      title="Leie rom"
      dek="Rimelig overnatting i gjesterom eller privat rom. Finn ledig rom nær deg, se pris per natt, og book med Vipps."
      lead="Skal du bare ha en seng for natta, er det rart hvor vanskelig det kan være. Gjesterom og private rom ligger spredt på Finn, Facebook og lapper på butikken, prisen er uklar, og du vet ikke om badet er delt eller om frokost er inkludert, før du har sendt melding og ventet. Ofte ender det med bankoverføring til en fremmed. På Digilist er rom i nærheten samlet ett sted, med pris per natt, ledige netter i sanntid og hva som er inkludert synlig, og du booker trygt med Vipps."
      seoTitle="Leie rom og gjesterom: rimelig overnatting | Digilist"
      seoDescription="Leie rom eller gjesterom for en natt eller flere: finn ledige rom nær deg, se pris per natt og hva som er inkludert, og book med Vipps. Rimelig alternativ til hotell."
      keywords="leie rom, leie gjesterom, privat rom til leie, rom til leie, rimelig overnatting, leie rom natt, bed and breakfast norge, leie enkeltrom, overnatting privat"
      audience={[
        {
          persona: "Budsjettreisende",
          context: "Du skal på tur uten å bruke hotellbudsjett. Et rent og rimelig rom med seng og wifi holder lenge, når du vet prisen og hva som er inkludert på forhånd.",
        },
        {
          persona: "Enkeltreisende på gjennomreise",
          context: "Én natt på veien mellom to steder. Du trenger et enkeltrom nær hovedveien eller stasjonen, bookbart fra mobilen samme kveld.",
        },
        {
          persona: "På kurs eller jobb over natta",
          context: "Kurs, seminar eller et jobboppdrag et annet sted. Et privat rom nær der du skal være, med kvittering til reiseregningen, uten hotellpris.",
        },
        {
          persona: "På besøk hos familie",
          context: "Familiebesøk der huset er fullt. Et gjesterom i nabolaget gjør at du kan være tett på uten å sove på sofaen.",
        },
      ]}
      problems={[
        "Gjesterom og private rom ligger spredt på Finn, Facebook-grupper og lapper i nabolaget, uten ett sted å søke.",
        "Prisen per natt er uklar til du har sendt melding og ventet på svar.",
        "Du vet ikke om badet er delt eller eget, eller om frokost og håndkle er inkludert, før du står i døra.",
        "Ingen ekte kalender: du vet ikke om rommet faktisk er ledig de nettene du trenger.",
        "Betaling skjer med bankoverføring eller kontanter til en fremmed, uten kvittering.",
      ]}
      features={[
        {
          title: "Rom nær deg, samlet ett sted",
          body: "Gjesterom, private rom og B&B-rom i nærområdet samlet på ett sted. Du slipper å lete gjennom Finn og Facebook-grupper hver for seg.",
        },
        {
          title: "Pris per natt synlig",
          body: "Du ser hva rommet koster per natt og totalprisen for dine netter før du booker. Ingen forhandling på melding, ingen overraskelser.",
        },
        {
          title: "Ledige netter i sanntid",
          body: "Kalenderen viser hvilke netter som faktisk er ledige. Velg netter og antall gjester, book direkte og få bekreftelsen med en gang.",
        },
        {
          title: "Trygg betaling med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Ingen bankoverføring eller kontanter til en fremmed, og kvitteringen kommer automatisk.",
        },
        {
          title: "Hva som er inkludert, tydelig",
          body: "Eget eller delt bad, frokost, wifi, håndkle og sengetøy: alt står synlig på rommet før du bekrefter, så du vet hva du får.",
        },
        {
          title: "Enkel innsjekk",
          body: "Innsjekkstid og praktisk info, som nøkkelboks eller hvem som tar imot deg, står i bekreftelsen. Du vet hvordan du kommer inn før du reiser.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: på gjennomreise i Trøndelag",
          role: "Illustrasjon",
          headline: "Én natt, booket fra bilen",
          body: "Slik kan det se ut: En sjåfør på vei nordover trenger en seng for natta. Hun søker på stedet hun stopper, ser to ledige rom med pris per natt og eget bad markert, booker det ene med Vipps fra rasteplassen og får innsjekkinfo med en gang. Neste morgen står frokosten klar, slik det sto på rommet.",
          outcome: [
            { label: "Pris synlig", value: "Før booking" },
            { label: "Booking", value: "Fra mobilen" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: kurshelg i Bergen",
          role: "Illustrasjon",
          headline: "Gjesterom i stedet for hotellpris",
          body: "Slik kan det se ut: En deltaker skal på kurs i to netter og synes hotellene i sentrum er dyre. Han finner et gjesterom ti minutter fra kurslokalet, ser at wifi og delt bad står tydelig beskrevet, booker begge nettene med Vipps og får kvittering til reiseregningen automatisk.",
          outcome: [
            { label: "Netter", value: "2" },
            { label: "Inkludert", value: "Sto tydelig" },
            { label: "Kvittering", value: "Automatisk" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvittering kommer automatisk, ingen bankoverføring eller kontanter til en fremmed.",
        },
        {
          label: "Ledige netter",
          value: "Sanntidskalender per rom. Velg netter og antall gjester, og se hva som faktisk er ledig før du booker.",
        },
        {
          label: "Pris",
          value: "Pris per natt og totalpris for dine netter vises før du bekrefter. Ingen skjulte tillegg som dukker opp senere.",
        },
        {
          label: "Rom",
          value: "Eget eller delt bad, sengetype og hvor mange gjester rommet passer for, står tydelig på hvert rom.",
        },
        {
          label: "Inkludert",
          value: "Om frokost, wifi, håndkle og sengetøy følger med, står på rommet før du booker.",
        },
        {
          label: "Innsjekk",
          value: "Innsjekkstid og praktisk info, som nøkkelboks eller hvem som tar imot deg, følger med bekreftelsen.",
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
        text: "Rom og gjesterom nær deg, samlet ett sted, med pris per natt og ledige netter synlig før du booker. Ikke meldinger frem og tilbake og bankoverføring til en fremmed.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie rom?",
          answer:
            "Prisen varierer med sted, standard og sesong. Et enkelt gjesterom ligger ofte fra noen hundre kroner per natt, godt under hotellpris. På Digilist ser du pris per natt og totalpris for dine netter før du booker, uten skjulte tillegg.",
        },
        {
          question: "Er badet delt eller eget?",
          answer:
            "Det varierer per rom, og det står tydelig på hvert rom før du booker. Mange gjesterom har delt bad med verten eller andre gjester, mens noen har eget bad. Du ser det i beskrivelsen før du velger.",
        },
        {
          question: "Er frokost inkludert?",
          answer:
            "Noen rom drives som bed and breakfast med frokost inkludert, andre ikke. Hva som følger med, som frokost, wifi, håndkle og sengetøy, står på rommet før du bekrefter, så du slipper overraskelser.",
        },
        {
          question: "Kan jeg booke bare én natt?",
          answer:
            "Ja, de fleste rom kan bookes for én natt. Noen verter setter et minimum antall netter, og det står i så fall på rommet. Du velger netter og antall gjester i kalenderen og ser totalprisen med en gang.",
        },
        {
          question: "Hvordan fungerer innsjekk?",
          answer:
            "Innsjekkstid og praktisk info står i bekreftelsen du får når du booker. Noen verter møter deg personlig, andre bruker nøkkelboks eller kodelås. Du vet hvordan du kommer inn før du reiser hjemmefra.",
        },
        {
          question: "Kan jeg avbestille?",
          answer:
            "Avbestillingsreglene settes av verten og står på hvert rom før du booker. Der det er tillatt, avbestiller du digitalt, og refusjon skjer automatisk etter reglene som gjelder for rommet.",
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
