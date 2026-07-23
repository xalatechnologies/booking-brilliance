import UseCasePage from "@/components/UseCasePage";
import { OccasionGuide } from "@/components/OccasionGuide";

export default function LeieJubileum() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="jubileum"
      breadcrumb="Jubileum"
      title="Leie lokale til jubileum"
      dek="Runde år eller bedriftsjubileum? Finn ledig lokale med plass til feiringen, se ekte pris for datoen, og book på nett."
      lead="Enten det er en runding på 50, 60 eller 70, et lag som fyller hundre eller en bedrift som markerer et jubileum, trenger feiringen et lokale med riktig størrelse og stemning. De store rundingene planlegges gjerne i god tid, og de beste lokalene til lørdager går fort. På Digilist finner du selskapslokaler, kulturhus, gårder og restauranter med selskapsrom samlet ett sted, med ledige datoer i sanntid, ekte pris for din dato og trygg betaling, slik at du kan sikre lokalet tidlig og bruke tiden på talene, maten og musikken."
      seoTitle="Leie lokale til jubileum og runde år | Digilist"
      seoDescription="Leie lokale til jubileum, runde år eller bedriftsjubileum: finn ledig festlokale, se ekte pris for din dato og book på nett. Selskapslokaler og kulturhus samlet."
      keywords="leie lokale til jubileum, leie lokale til runde år, jubileum lokale, leie festlokale jubileum, bedriftsjubileum lokale, leie lokale 50 år, leie selskapslokale jubileum"
      audience={[
        { persona: "Runde år og milepæler", context: "Du fyller 50, 60 eller 70 og vil samle familie og venner. Du trenger et lokale med god plass, kjøkken eller catering og en pris du kan stole på før invitasjonene sendes." },
        { persona: "Lag og foreninger", context: "Klubben, koret eller foreningen fyller et rundt tall. Et lokale med scene eller god plass til medlemmer og gjester, bookbart uten en lang runde." },
        { persona: "Bedrifter som markerer jubileum", context: "Et bedriftsjubileum for ansatte, kunder og partnere. Filtrer på kapasitet og fasiliteter, og se hva som er ledig på ønsket dato." },
      ]}
      problems={[
        "Festlokaler til jubileum ligger spredt på Finn, Facebook, kommunens sider og utleiernes egne nettsider, uten ett sted å søke.",
        "Prisen er sjelden synlig før du har sendt forespørsel og ventet på svar, ofte mens datoen tas av noen andre.",
        "Kapasitet og om lokalet passer til sittende middag med taler eller mingling med dans er uklart før befaring.",
        "Betaling og depositum håndteres manuelt, gjerne med bankoverføring uten kvittering.",
        "Fasiliteter som scene, lyd, kjøkken og parkering står sjelden tydelig før du booker.",
      ]}
      features={[
        { title: "Alle festlokaler nær deg, ett søk", body: "Selskapslokaler, kulturhus, gårder og restauranter med selskapsrom samlet ett sted. Filtrer på kapasitet, sted og fasiliteter i stedet for å lete overalt." },
        { title: "Ekte pris for din dato", body: "Se totalprisen for din dato og varighet, inkludert eventuelt depositum, før du booker. Ingen prissjokk etter at invitasjonene er sendt." },
        { title: "Ledige datoer i sanntid", body: "Kalenderen viser hvilke lørdager som faktisk er ledige, slik at du sikrer datoen til den store rundingen før noen andre." },
        { title: "Kapasitet og oppsett synlig", body: "Se hvor mange lokalet tar til sittende middag med taler versus mingling med dans, og hva slags oppsett som er mulig." },
        { title: "Scene, lyd og kjøkken", body: "Se hva lokalet tilbyr av scene, lydanlegg, kjøkken og catering-muligheter, slik at taler, musikk og servering er på plass." },
        { title: "Trygg betaling og digitalt depositum", body: "Betal med Vipps eller kort, og få depositum håndtert digitalt og frigjort automatisk etter feiringen." },
      ]}
      stories={[
        { customer: "Familie i Stavanger", role: "Feiret 60 år", headline: "Sikret selskapslokalet et halvt år før", body: "De fant et selskapslokale med scene og kjøkken, så at lørdagen var ledig og at prisen passet, og booket direkte slik at planleggingen kunne handle om talene i stedet for lokalet.", outcome: [{ label: "Gjester", value: "70" }, { label: "Booket", value: "6 mnd før" }] },
        { customer: "Idrettslag på Sørlandet", role: "Jubileumskomité", headline: "Booket kulturhus til 100-årsjubileum", body: "Komiteen fant et kulturhus med scene og god plass, med tydelig pris og ledig dato, og booket på vegne av laget uten en lang e-postrunde.", outcome: [{ label: "Gjester", value: "150" }, { label: "Lokale", value: "Kulturhus" }] },
      ]}
      technical={[
        { label: "Lokaltyper", value: "Selskapslokale, kulturhus, gård, restaurant med selskapsrom" },
        { label: "Kapasitet", value: "Fra intime rundinger til flere hundre gjester" },
        { label: "Fasiliteter", value: "Scene, lyd, kjøkken og catering der lokalet tilbyr det" },
        { label: "Betaling", value: "Vipps og kort, digitalt depositum" },
      ]}
      pullQuote={{ text: "Vi sikret lokalet et halvt år før 60-årsdagen, så planleggingen kunne handle om talene.", byline: "Jubilant, 60 år" }}
      faq={[
        { question: "Hvor kan jeg leie lokale til jubileum?", answer: "Selskapslokaler, kulturhus, gårder og restauranter med selskapsrom leies ut til jubileum og runde år. På Digilist finner du passende lokaler samlet ett sted, med ledige datoer og ekte pris for din dato." },
        { question: "Hva koster det å leie lokale til jubileum?", answer: "Prisen varierer med kapasitet, beliggenhet, dag, sesong og fasiliteter. Et grendehus eller kulturhus ligger ofte lavere enn et stort selskapslokale i sentrum på en lørdag. På Digilist ser du totalprisen for din dato før du booker." },
        { question: "Når bør jeg booke lokale til runde år?", answer: "De store rundingene planlegges gjerne i god tid, og de beste lokalene til lørdager går fort. Med en sanntidskalender ser du med én gang om datoen er ledig, og kan sikre den tidlig i stedet for å vente på svar." },
        { question: "Kan jeg filtrere på kapasitet og fasiliteter?", answer: "Ja. Du kan søke opp lokaler etter antall gjester, beliggenhet og fasiliteter som scene, lyd, kjøkken og parkering, og se hva som er ledig på din dato." },
        { question: "Passer lokalene til bedriftsjubileum?", answer: "Ja. Både selskapslokaler, kulturhus og restauranter med selskapsrom egner seg til bedriftsjubileum for ansatte, kunder og partnere, med plass til taler, servering og mingling." },
      ]}
      relatedPosts={[
        { title: "Leie selskapslokale til bryllup eller fest", slug: "leie-selskapslokale-bryllup-fest" },
        { title: "Sammenlign lokaltyper og reell pris", slug: "leie-lokale-billigst-kommune-sammenlign-lokaltyper" },
        { title: "Leie lokale i kommunen etter anledning", slug: "leie-lokale-kommune-anledning-guide-innbygger" },
      ]}
      siblings={[
        { title: "Selskapslokale", slug: "selskapslokale" },
        { title: "Kulturhus", slug: "kulturhus" },
        { title: "Gård og låve", slug: "gaard" },
        { title: "Konferanselokale", slug: "konferanselokale" },
      ]}
      extra={
        <OccasionGuide
          author="Ibrahim Rahmani"
          role="Grunnlegger, Digilist"
          updated="23. juli 2026"
          heading="Slik planlegger du jubileumsfeiringen"
          intro={[
            "Et jubileum kan være alt fra en intim runding på 50 til et bedriftsjubileum med flere hundre gjester. Start med å bestemme størrelsen og formen: en sittende middag med taler krever mer plass per gjest og et lokale med god akustikk, mens en mer uformell mingling med dans stiller andre krav.",
            "De store rundingene og lagsjubileene planlegges gjerne i god tid, og de beste lokalene til lørdager går fort. Sikre datoen tidlig, og velg lokale ut fra kapasitet, om dere trenger scene og lyd til taler og musikk, og om dere lager maten selv eller bruker catering.",
          ]}
          checklist={[
            "Bestem antall gjester og om det blir sittende middag med taler eller mingling med dans.",
            "Sett datoen tidlig — lørdager i høysesong går først.",
            "Sjekk om lokalet har scene, lyd og god akustikk til taler og musikk.",
            "Avklar servering: eget kjøkken, catering eller lokalets egen meny.",
            "Tenk på parkering, universell utforming og sluttid.",
            "Se pris og ledig dato, og book og betal på nett.",
          ]}
          guidance={[
            { label: "Når bør du booke", value: "3–9 måneder før for større feiringer og lørdager i høysesong." },
            { label: "Typisk antall gjester", value: "Fra en intim runding på 20–40 til lags- og bedriftsjubileer på over 150." },
            { label: "Prisnivå", value: "Grendehus og kulturhus ligger ofte lavere enn store selskapslokaler i sentrum på lørdager. Se totalprisen for din dato før du booker." },
            { label: "Format", value: "Sittende middag med taler krever mer plass og god akustikk enn mingling. Sjekk scene og lyd." },
            { label: "Servering av alkohol", value: "Selges alkohol mot betaling kreves skjenkebevilling; privat servering til inviterte gjester krever normalt ikke bevilling. Avklar med lokalet." },
          ]}
          links={[
            { label: "Leie selskapslokale", to: "/leie/selskapslokale" },
            { label: "Leie kulturhus", to: "/leie/kulturhus" },
            { label: "Leie gård og låve", to: "/leie/gaard" },
            { label: "Bookingsystem for utleie", to: "/bookingsystem-utleie" },
            { label: "Alle lokaler til leie", to: "/leie" },
          ]}
        />
      }
    />
  );
}
