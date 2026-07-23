import UseCasePage from "@/components/UseCasePage";
import { OccasionGuide } from "@/components/OccasionGuide";

export default function LeieFirmafest() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="firmafest"
      breadcrumb="Firmafest og julebord"
      title="Leie lokale til firmafest og julebord"
      dek="Julebord, sommerfest eller kick-off? Finn ledig lokale for bedriften, se ekte pris for datoen, og book på nett."
      lead="Julebordsesongen er den travleste tiden for utleie av selskapslokaler, og de sentrale lokalene til fredager og lørdager i november og desember bookes ofte fra sommeren av. Som ansvarlig for firmafesten skal du finne et lokale med riktig kapasitet, avklare servering og skjenking, og holde deg innenfor budsjett, gjerne mens du venter på svar fra flere utleiere samtidig. På Digilist finner du selskapslokaler, restauranter med selskapsrom, kulturhus og gårder samlet ett sted, med ledige datoer i sanntid, ekte pris for din dato og trygg betaling, enten det er en avdeling på ti eller hele bedriften på to hundre."
      seoTitle="Leie lokale til firmafest og julebord | Digilist"
      seoDescription="Leie lokale til firmafest, julebord eller sommerfest: finn ledig bedriftslokale, se ekte pris for din dato og book på nett. Selskapslokaler og kulturhus samlet."
      keywords="leie lokale til firmafest, julebord lokale, leie julebordlokale, firmafest lokale, bedriftsarrangement lokale, leie selskapslokale bedrift, lokale til sommerfest bedrift, kick-off lokale"
      audience={[
        { persona: "HR- og kontoransvarlig", context: "Du arrangerer julebordet eller sommerfesten for hele bedriften og trenger oversikt over ledige lokaler, kapasitet og totalpris uten å ringe rundt til ti utleiere." },
        { persona: "Team- og avdelingsleder", context: "En mindre avdelingsfest eller kick-off. Du vil booke et passende lokale raskt, med pris og vilkår synlig, uten en lang godkjenningsrunde." },
        { persona: "Bedrifter i vekst", context: "Dere vokser og trenger et større lokale enn i fjor. Filtrer på kapasitet og fasiliteter, og se hva som faktisk er ledig på ønsket dato." },
      ]}
      problems={[
        "Julebordslokalene i sentrum bookes opp tidlig, men de ligger spredt på Finn, restaurantsider og utleiernes egne nettsider uten ett sted å søke.",
        "Prisen for et bedriftsarrangement er sjelden synlig før du har sendt forespørsel og ventet på tilbud, ofte mens datoen tas av noen andre.",
        "Kapasitet, bordoppsett og om lokalet passer til sittende middag eller mingling med dans er uklart før befaring.",
        "Servering og skjenking må avklares, men det står sjelden tydelig hva lokalet tilbyr eller krever.",
        "Bekreftelse, faktura og bilag til regnskapet blir en manuell runde på e-post i stedet for en ryddig ordre.",
      ]}
      features={[
        { title: "Alle bedriftslokaler nær dere, ett søk", body: "Selskapslokaler, restauranter med selskapsrom, kulturhus og gårder samlet ett sted. Filtrer på kapasitet, sted og fasiliteter i stedet for å lete overalt." },
        { title: "Ekte pris for din dato", body: "Se totalprisen for akkurat din dato og varighet før du booker, inkludert eventuelt depositum. Enklere å holde budsjettet og få det godkjent internt." },
        { title: "Ledige datoer i sanntid", body: "Kalenderen viser hvilke fredager og lørdager i høysesongen som faktisk er ledige. Book direkte og sikre datoen før konkurrenten om lokalet gjør det." },
        { title: "Kapasitet og oppsett synlig", body: "Se hvor mange lokalet tar til sittende middag versus mingling, og hva slags bordoppsett som er mulig, før du booker." },
        { title: "Servering og skjenking avklart", body: "Se om lokalet har eget kjøkken, catering-avtaler eller skjenkerett, slik at serveringen er på plass før arrangementet." },
        { title: "Ryddig ordre og bilag", body: "Bekreftelse og kvittering kommer digitalt, klart for regnskapet. Ingen løs e-posttråd om hva som ble avtalt." },
      ]}
      stories={[
        { customer: "Teknologibedrift i Oslo", role: "HR-ansvarlig", headline: "Booket julebord for 120 i august", body: "De filtrerte på kapasitet over 100 og skjenkerett, så at en fredag i desember fortsatt var ledig, og booket lokalet direkte med totalpris godkjent av ledelsen samme uke.", outcome: [{ label: "Gjester", value: "120" }, { label: "Booket", value: "4 mnd før" }] },
        { customer: "Regnskapskontor i Bergen", role: "Daglig leder", headline: "Avdelingsfest uten e-postrunder", body: "For en mindre sommerfest fant de et selskapsrom med catering-avtale, så prisen med en gang, og fikk kvitteringen rett inn i regnskapet.", outcome: [{ label: "Gjester", value: "24" }, { label: "Bilag", value: "Digitalt" }] },
      ]}
      technical={[
        { label: "Lokaltyper", value: "Selskapslokale, restaurant med selskapsrom, kulturhus, gård" },
        { label: "Kapasitet", value: "Fra små avdelinger til flere hundre gjester" },
        { label: "Servering", value: "Eget kjøkken, catering, skjenkerett der det finnes" },
        { label: "Betaling", value: "Digital bekreftelse og kvittering for regnskap" },
      ]}
      pullQuote={{ text: "Vi booket julebordet i august med totalpris godkjent samme uke, i stedet for å jage tilbud i november.", byline: "HR-ansvarlig, teknologibedrift" }}
      faq={[
        { question: "Når bør bedriften booke julebordlokale?", answer: "Julebord er den travleste sesongen for selskapslokaler. Sentrale lokaler til fredager og lørdager i november og desember bookes ofte fra sommeren av. Med en sanntidskalender ser du med én gang hvilke datoer som fortsatt er ledige, i stedet for å sende forespørsler og vente." },
        { question: "Hva koster det å leie lokale til firmafest?", answer: "Prisen varierer sterkt med kapasitet, beliggenhet, dag, sesong og hva som er inkludert av servering. Et enkelt selskapsrom er rimeligere enn et stort lokale i sentrum på en desemberlørdag. På Digilist ser du totalprisen for din dato og størrelse før du booker, så det er enklere å holde budsjett." },
        { question: "Trenger vi skjenkebevilling til firmafesten?", answer: "Serveres alkohol mot betaling kreves skjenkebevilling, som lokalet eller en cateringleverandør ofte har. Ved lukkede arrangementer der bedriften spanderer, gjelder andre regler. Avklar alltid servering og skjenking med lokalet, det står på hvert lokale på Digilist der informasjonen er tilgjengelig." },
        { question: "Kan vi filtrere på kapasitet og fasiliteter?", answer: "Ja. Du kan søke opp lokaler etter antall gjester, beliggenhet og fasiliteter som kjøkken, scene, lyd og parkering, og se hva som er ledig på din dato." },
        { question: "Får vi kvittering til regnskapet?", answer: "Ja. Bekreftelse og kvittering kommer digitalt etter booking, klart som bilag til regnskapet, uten en manuell e-postrunde om hva som ble avtalt." },
      ]}
      relatedPosts={[
        { title: "Leie selskapslokale til bryllup eller fest", slug: "leie-selskapslokale-bryllup-fest" },
        { title: "Leie lokale i kommunen etter anledning", slug: "leie-lokale-kommune-anledning-guide-innbygger" },
        { title: "Sammenlign lokaltyper og reell pris", slug: "leie-lokale-billigst-kommune-sammenlign-lokaltyper" },
      ]}
      siblings={[
        { title: "Selskapslokale", slug: "selskapslokale" },
        { title: "Konferanselokale", slug: "konferanselokale" },
        { title: "Møterom", slug: "moterom" },
        { title: "Kulturhus", slug: "kulturhus" },
      ]}
      extra={
        <OccasionGuide
          author="Ibrahim Rahmani"
          role="Grunnlegger, Digilist"
          updated="23. juli 2026"
          heading="Slik planlegger du firmafesten"
          intro={[
            "Julebordet er årets store bedriftsarrangement, og det er også da lokalene er vanskeligst å få tak i. De sentrale selskapslokalene til fredager og lørdager i november og desember bookes ofte allerede fra sommeren. Er dere ute etter en bestemt dato, lønner det seg å sikre den tidlig.",
            "Start med to avklaringer: hvor mange dere blir, og om festen skal være en sittende middag eller mer mingling med bordservering og dans. Det avgjør både kapasiteten dere trenger og hvilke lokaler som passer. Deretter avklarer dere servering og skjenking, og om lokalet har eget kjøkken, catering-avtale eller skjenkerett.",
          ]}
          checklist={[
            "Sett datoen og book tidlig — julebordslokaler i sentrum er ofte booket fra sommeren.",
            "Anslå antall gjester og velg mellom sittende middag eller mingling med dans.",
            "Avklar servering: eget kjøkken, catering eller lokalets egen mat- og drikkemeny.",
            "Sjekk skjenking — serveres alkohol mot betaling kreves skjenkebevilling.",
            "Tenk på transport og parkering, særlig for et lokale utenfor sentrum.",
            "Book på nett og få digital bekreftelse og kvittering til regnskapet.",
          ]}
          guidance={[
            { label: "Når bør dere booke", value: "Julebord: fra sommeren for sentrale lokaler. Sommerfest og kick-off: 2–4 måneder før." },
            { label: "Typisk antall gjester", value: "Fra en avdeling på 10–20 til hele bedriften på 100–200+." },
            { label: "Prisnivå", value: "Varierer sterkt med kapasitet, beliggenhet, dag og sesong. Et stort sentrumslokale en desemberlørdag koster mer enn et selskapsrom på en hverdag. Se totalprisen for din dato før du booker." },
            { label: "Format", value: "Sittende middag krever mer plass per gjest enn mingling. Sjekk bordoppsett, scene og dansegulv." },
            { label: "Servering og skjenking", value: "Skjenkebevilling kreves ved salg av alkohol. Mange lokaler og cateringleverandører har dette; avklar før booking." },
            { label: "Praktisk", value: "Vurder transport, parkering og kollektivdekning, og en tydelig sluttid for lokalet." },
          ]}
          links={[
            { label: "Leie selskapslokale", to: "/leie/selskapslokale" },
            { label: "Leie konferanselokale", to: "/leie/konferanselokale" },
            { label: "Leie kulturhus", to: "/leie/kulturhus" },
            { label: "Bookingsystem for utleie", to: "/bookingsystem-utleie" },
            { label: "Alle lokaler til leie", to: "/leie" },
          ]}
        />
      }
    />
  );
}
