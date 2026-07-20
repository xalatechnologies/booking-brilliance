import UseCasePage from "@/components/UseCasePage";

export default function UtstyrFestutstyr() {
  return (
    <UseCasePage
      basePath="/utstyr"
      parentCrumb={{ name: "Utstyr", path: "/utstyr" }}
      sectionLabel="UTSTYR"
      slug="festutstyr"
      breadcrumb="Festutstyr"
      title="Leie festutstyr"
      dek="Telt, bord, stoler og servise til festen. Finn ledig festutstyr nær deg, se ekte pris, og book med Vipps."
      lead="Skal du arrangere bryllup, konfirmasjon eller bursdag, ligger festutstyret ofte spredt hos ulike utleiere: teltet ett sted, bord og stoler et annet, serviset et tredje. Prisen og depositumet er uklart før du har ringt rundt og ventet på svar, og du vet ikke om utstyret kan leveres eller må hentes. På Digilist finner du festutstyr i nærområdet samlet ett sted, med pris, depositum og ledige datoer synlig for din leieperiode, henting eller levering avklart på forhånd, og trygg betaling med Vipps. Du booker, betaler og får bekreftelsen med en gang."
      seoTitle="Leie festutstyr: telt, bord, stoler og servise | Digilist"
      seoDescription="Leie festutstyr til bryllup, selskap eller bursdag: leie telt, bord, stoler og servise nær deg. Se pris og ledige datoer, og book med Vipps. Henting eller levering."
      keywords="leie festutstyr, leie telt, leie partytelt, leie bord og stoler, leie servise, festutstyr til leie, leie utstyr til bryllup, leie utstyr til fest, telt til leie"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere planlegger bryllup i hagen eller låven og trenger partytelt, bord, stoler og servise til alle gjestene, uten å jage fem ulike utleiere.",
        },
        {
          persona: "Familier som feirer",
          context: "Jubileum, konfirmasjon eller rund dag hjemme. Ekstra bord og stoler, servise til alle, og kanskje en varmeovn til teltet eller terrassen.",
        },
        {
          persona: "Arrangører av bygdefest",
          context: "Grendelag og foreninger som rigger sommerfest eller bygdedager, og trenger telt, langbord, benker og lysslynger til hele bygda.",
        },
        {
          persona: "Bedrifter med sommerfest",
          context: "Sommerfest eller firmajubileum på egen tomt. Telt, møblering og popcornmaskin, bestilt av en travel arrangementsansvarlig uten tid til ringerunder.",
        },
      ]}
      problems={[
        "Festutstyret er spredt hos ulike utleiere: teltet hos en, bord og stoler hos en annen, servise og glass hos en tredje.",
        "Prisen og depositumet er uklart før du har ringt eller sendt melding, og svaret kan ta dager.",
        "Ingen ekte kalender: du vet ikke om teltet er ledig på datoen din før noen svarer deg.",
        "Levering og henting er uavklart: får du plass i tilhengeren, eller koster levering ekstra?",
        "Betaling skjer med bankoverføring eller Vipps til en privatperson, uten kvittering, og depositumet er basert på tillit.",
      ]}
      features={[
        {
          title: "Alt festutstyret ett sted",
          body: "Partytelt, bord, stoler, servise, glass, varmeovner, lysslynger, popcornmaskin og sjokoladefontene samlet i ett søk. Du slipper å lete gjennom Finn, Facebook og lokale utleiere hver for seg.",
        },
        {
          title: "Pris og depositum synlig",
          body: "Se pris per dag eller helg, og eventuelt depositum, før du booker. Totalprisen for din leieperiode vises samlet, uten overraskelser når du henter.",
        },
        {
          title: "Ledig på din dato",
          body: "Kalenderen viser i sanntid hva som faktisk er ledig for datoen din. Du booker direkte og får bekreftelsen med en gang, uten å vente på svar.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Depositum håndteres digitalt og frigjøres automatisk etter at utstyret er levert tilbake.",
        },
        {
          title: "Henting eller levering",
          body: "Du ser på forhånd om utleier tilbyr levering og hva det koster, eller om du henter selv. Ingen forhandling på telefon etter at du har booket.",
        },
        {
          title: "Komplette pakker",
          body: "Mange utleiere tilbyr pakker med telt, bord og stoler i én booking, dimensjonert for antall gjester. Én pris, én henting, ett sted å forholde seg til.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: bryllup i hagen",
          role: "Illustrasjon",
          headline: "Telt, bord og stoler i én booking",
          body: "Slik kan det se ut: Et brudepar skal ha 60 gjester i hagen og trenger partytelt, åtte bord, stoler og servise. I stedet for å ringe tre utleiere og vente på pristilbud, søker de på dato og område, finner en komplett pakke i nabolaget med pris og depositum synlig, velger levering fredag morgen, og betaler med Vipps. Bekreftelsen kommer med en gang.",
          outcome: [
            { label: "Utleiere å ringe", value: "0" },
            { label: "Pris og depositum", value: "Synlig før booking" },
            { label: "Levering", value: "Avklart på forhånd" },
          ],
        },
        {
          customer: "Eksempel: konfirmasjon hjemme",
          role: "Illustrasjon",
          headline: "Bord, stoler og varmeovn booket på kvelden",
          body: "En familie skal ha konfirmasjon hjemme i mai og trenger ekstra bord, stoler, servise til 30 og en varmeovn i tilfelle kjølig vær. De finner alt hos en utleier i nærheten, ser at det er ledig for helgen, leser vilkårene om retur og rengjøring, og booker på kvelden. Utstyret hentes med tilhenger fredag og leveres tilbake mandag.",
          outcome: [
            { label: "Vilkår", value: "Tydelige" },
            { label: "Booking", value: "På minutter" },
            { label: "Depositum", value: "Frigjøres automatisk" },
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
          value: "Sanntidskalender per utstyr. Du velger leieperiode, ser hva som er ledig for datoene dine, og booker direkte uten å vente på svar.",
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
          label: "Innhold",
          value: "Teltstørrelse, antall bord og stoler, antall kuverter i servisesettet og hva som følger med, står tydelig på hvert utstyr.",
        },
        {
          label: "Retur og rengjøring",
          value: "Krav til rengjøring, nedrigg og returtidspunkt står i vilkårene før du booker, ikke som en overraskelse etterpå.",
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
        text: "Telt, bord, stoler og servise nær deg, samlet ett sted, med pris, depositum og ledig dato synlig før du booker. Ikke fem utleiere og en uke med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal leie",
      }}
      faq={[
        {
          question: "Hva koster det å leie festutstyr og telt?",
          answer:
            "Prisen varierer med utstyr, størrelse og leieperiode. Bord og stoler leies ofte per stykk for noen titalls kroner per døgn, mens et partytelt gjerne koster fra rundt tusenlappen til flere tusen kroner for en helg, avhengig av størrelse. På Digilist ser du pris per dag og eventuelt depositum for din leieperiode før du booker.",
        },
        {
          question: "Kan jeg få festutstyret levert, eller må jeg hente selv?",
          answer:
            "Det varierer per utleier, og begge deler finnes på Digilist. Hvert utstyr viser om levering tilbys og hva det koster, eller om du henter selv. Store telt krever ofte levering og montering, mens bord, stoler og servise som regel får plass i en tilhenger.",
        },
        {
          question: "Må jeg betale depositum?",
          answer:
            "Mange utleiere krever depositum på festutstyr, særlig på telt og servise. På Digilist håndteres depositumet digitalt i samme betaling som leien, og det frigjøres automatisk etter at utstyret er levert tilbake i avtalt stand. Ingen kontanter eller bankoverføring til en fremmed.",
        },
        {
          question: "Hvor lenge kan jeg leie festutstyret?",
          answer:
            "Du velger leieperiode selv i kalenderen, fra ett døgn til flere dager. Mange leier fra fredag til mandag for å få god tid til rigging og nedrigg rundt helgen. Prisen for hele perioden vises før du bekrefter.",
        },
        {
          question: "Må jeg vaske serviset og utstyret før retur?",
          answer:
            "Det varierer, og vilkårene står på hvert utstyr før du booker. Noen utleiere vil ha servise og glass tilbake rengjort, andre tilbyr rengjøring inkludert eller mot et tillegg. Telt skal som regel leveres tørt og sammenpakket slik det ble hentet.",
        },
        {
          question: "Kan jeg avbestille hvis festen endrer seg?",
          answer:
            "Avbestillingsreglene settes av utleier og står tydelig på hvert utstyr. Der det er tillatt, avbestiller du digitalt, og betalt beløp og depositum frigjøres automatisk etter reglene som gjelder for utstyret.",
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
