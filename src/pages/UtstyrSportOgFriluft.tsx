import UseCasePage from "@/components/UseCasePage";

export default function UtstyrSportOgFriluft() {
  return (
    <UseCasePage
      basePath="/utstyr"
      parentCrumb={{ name: "Utstyr", path: "/utstyr" }}
      sectionLabel="UTSTYR"
      slug="sport-og-friluft"
      breadcrumb="Sport og friluft"
      title="Leie sport- og friluftsutstyr"
      dek="Sykkel, ski, kajakk og turutstyr til dagen eller helgen. Finn ledig utstyr nær deg, se ekte pris, og book med Vipps."
      lead="Skal du prøve havkajakk, sykle en helgetur eller gå på ski med barna, ligger utstyret ofte spredt hos sportsbutikker, utleiefirmaer og privatpersoner. Dagsprisen og depositumet er uklart før du har ringt rundt, du vet ikke om sykkelen finnes i din størrelse eller hvilken stand skiene er i, og å kjøpe alt nytt for å prøve en aktivitet én gang blir fort dyrt. På Digilist finner du sport- og friluftsutstyr i nærområdet samlet ett sted, med dagspris, depositum og ledige datoer synlig, og trygg betaling med Vipps. Du booker, betaler og får bekreftelsen med en gang."
      seoTitle="Leie sportsutstyr: sykkel, ski og kajakk nær deg | Digilist"
      seoDescription="Leie sportsutstyr og friluftsutstyr nær deg: leie sykkel, ski, kajakk, SUP og telt per dag eller helg. Se pris og depositum, og book med Vipps."
      keywords="leie sportsutstyr, leie friluftsutstyr, leie sykkel, leie elsykkel, leie ski, leie kajakk, leie SUP, leie telt, leie turutstyr"
      audience={[
        {
          persona: "Deg som vil prøve noe nytt",
          context: "Du har lyst til å teste havkajakk, SUP eller randonee før du bruker titusener på eget utstyr. Lei for en dag eller helg og finn ut om aktiviteten er noe for deg.",
        },
        {
          persona: "Turister og besøkende",
          context: "Du er på besøk i en ny by eller bygd og vil ut på tur, men sykkelen og skiene står hjemme. Lei lokalt i stedet for å frakte utstyr på tog og fly.",
        },
        {
          persona: "Familier på ferie",
          context: "Vinterferie eller sommerferie med barn som vokser ut av alt. Lei ski, skøyter og sykler i riktig størrelse der dere er, i stedet for å kjøpe nytt hvert år.",
        },
        {
          persona: "Venner på helgetur",
          context: "Dere skal på topptur, padletur eller teltweekend og mangler deler av utstyret. Lei kajakker, telt og soveposer til hele gjengen for helgen.",
        },
      ]}
      problems={[
        "Utstyret er spredt hos sportsbutikker, utleiefirmaer og privatpersoner, og du må lete gjennom Finn, Facebook og lokale nettsider hver for seg.",
        "Dagsprisen og depositumet er uklart før du har ringt eller sendt melding, og svaret kan ta dager.",
        "Du vet ikke om sykkelen finnes i din størrelse eller hvilken stand skiene og kajakken faktisk er i før du står der.",
        "Ingen ekte kalender: du vet ikke om utstyret er ledig i helgen din før noen svarer deg.",
        "Å kjøpe alt nytt for å prøve en aktivitet én gang koster fort mange tusen kroner, og utstyret blir stående i boden.",
      ]}
      features={[
        {
          title: "Alt utstyret ett sted",
          body: "Sykler, elsykler, ski, langrennsski, kajakker, SUP-brett, telt, skøyter og turutstyr samlet i ett søk. Du slipper å lete hos sportsbutikker, utleiefirmaer og privatpersoner hver for seg.",
        },
        {
          title: "Dagspris og depositum synlig",
          body: "Se pris per dag eller helg, og eventuelt depositum, før du booker. Totalprisen for din leieperiode vises samlet, uten overraskelser når du henter.",
        },
        {
          title: "Ledig i sanntid",
          body: "Kalenderen viser hva som faktisk er ledig for dagen eller helgen din. Du booker direkte og får bekreftelsen med en gang, uten å vente på svar.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Depositum håndteres digitalt og frigjøres automatisk etter at utstyret er levert tilbake.",
        },
        {
          title: "Henting eller levering",
          body: "Du ser på forhånd om utleier tilbyr levering, eller om du henter selv. Praktisk når kajakken ikke får plass på taket eller du er på ferie uten bil.",
        },
        {
          title: "Størrelse, stand og tilbehør oppgitt",
          body: "Rammestørrelse på sykkelen, lengde på skiene, vekt på kajakken og hva som følger med av hjelm, årer og vester står tydelig på hvert utstyr før du booker.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: prøve havkajakk for første gang",
          role: "Illustrasjon",
          headline: "Kajakk, vest og åre uten å kjøpe noe",
          body: "Slik kan det se ut: To venninner vil prøve havkajakk en sommerhelg, men eier verken kajakk eller vester. I stedet for å ringe padleklubber og sportsbutikker, søker de på område og dato, finner to havkajakker hos en utleier ved fjorden med vest og åre inkludert, ser dagspris og depositum, og betaler med Vipps. De henter ved brygga lørdag morgen og leverer tilbake søndag kveld.",
          outcome: [
            { label: "Investering i eget utstyr", value: "0 kr" },
            { label: "Pris og depositum", value: "Synlig før booking" },
            { label: "Tilbehør", value: "Vest og åre inkludert" },
          ],
        },
        {
          customer: "Eksempel: vinterferie uten skiboks",
          role: "Illustrasjon",
          headline: "Ski og skøyter i riktig størrelse på hytta",
          body: "Slik kan det se ut: En familie skal på vinterferie og barna har vokst ut av fjorårets ski og skøyter. I stedet for å kjøpe nytt for én uke, finner de langrennsski, alpinski og skøyter i riktige størrelser hos utleiere nær hytta, ser at alt er ledig i vinterferieuka, og booker med Vipps hjemmefra. Utstyret hentes første feriedag, og depositumet frigjøres automatisk etter retur.",
          outcome: [
            { label: "Nytt utstyr kjøpt", value: "0" },
            { label: "Størrelser", value: "Oppgitt per utstyr" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Depositum holdes digitalt og frigjøres automatisk etter godkjent retur.",
        },
        {
          label: "Ledige perioder",
          value: "Sanntidskalender per utstyr. Du velger leieperiode, ser hva som er ledig for dagen eller helgen din, og booker direkte uten å vente på svar.",
        },
        {
          label: "Pris",
          value: "Pris per dag eller helg, pluss eventuelt depositum, vises samlet for din leieperiode før du bekrefter.",
        },
        {
          label: "Levering og henting",
          value: "Hvert utstyr viser om utleier tilbyr levering og hva det koster, eller om du henter selv. Tidspunkt avtales i bookingen.",
        },
        {
          label: "Utstyr",
          value: "Type, størrelse og stand står på hvert utstyr: rammestørrelse på sykler, lengde på ski, vekt og lengde på kajakker og SUP-brett.",
        },
        {
          label: "Tilbehør",
          value: "Det som følger med, som hjelm, årer, vester, staver eller pumpe, står tydelig oppgitt, så du vet hva du må ha med selv.",
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
        text: "Sykkel, ski, kajakk og telt nær deg, samlet ett sted, med dagspris, depositum og ledige datoer synlig før du booker. Prøv aktiviteten før du kjøper utstyret.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie sykkel, ski eller kajakk?",
          answer:
            "Prisen varierer med utstyr, kvalitet og leieperiode. En vanlig sykkel eller et par langrennsski leies gjerne for noen hundrelapper per dag, mens elsykkel, alpinutstyr og havkajakk ofte koster noe mer. På Digilist ser du dagspris og eventuelt depositum for din leieperiode før du booker, så totalen er kjent på forhånd.",
        },
        {
          question: "Leier jeg per dag eller per helg?",
          answer:
            "Begge deler. Du velger leieperiode selv i kalenderen, fra ett døgn til en hel uke. Mange utleiere har egen helgepris fra fredag til søndag, og prisen for hele perioden vises samlet før du bekrefter.",
        },
        {
          question: "Må jeg betale depositum?",
          answer:
            "Mange utleiere krever depositum på sport- og friluftsutstyr, særlig på elsykler, kajakker og annet verdifullt utstyr. På Digilist håndteres depositumet digitalt i samme betaling som leien, og det frigjøres automatisk etter at utstyret er levert tilbake i avtalt stand.",
        },
        {
          question: "Kan jeg få utstyret levert, eller må jeg hente selv?",
          answer:
            "Det varierer per utleier, og begge deler finnes på Digilist. Hvert utstyr viser om levering tilbys og hva det koster, eller om du henter selv. Kajakker og SUP-brett leies ofte ut rett ved vannet, mens sykler og ski som regel hentes hos utleier.",
        },
        {
          question: "Hvordan vet jeg at størrelsen passer og hva som følger med?",
          answer:
            "Størrelse og stand står på hvert utstyr før du booker: rammestørrelse på sykler, lengde på ski og vekt på kajakker. Tilbehør som hjelm, årer, vester og staver står oppgitt der det er inkludert, så du vet hva du må ta med selv.",
        },
        {
          question: "Kan jeg avbestille hvis været eller planene endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står tydelig på hvert utstyr før du booker. Der det er tillatt, avbestiller du digitalt, og betalt beløp og depositum frigjøres automatisk etter reglene som gjelder for utstyret.",
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
