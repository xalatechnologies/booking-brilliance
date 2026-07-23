import UseCasePage from "@/components/UseCasePage";
import { OccasionGuide } from "@/components/OccasionGuide";

export default function LeieKonfirmasjonslokale() {
  return (
    <UseCasePage
      extra={
        <OccasionGuide
          author="Ibrahim Rahmani"
          role="Grunnlegger, Digilist"
          updated="23. juli 2026"
          heading="Slik planlegger du konfirmasjonsfeiringen"
          intro={[
            "Konfirmasjonssesongen i Norge er kort og konsentrert rundt lørdager i mai og juni, og de mest populære lokalene fylles ofte et helt år i forveien. Jo tidligere du sikrer datoen, desto større er utvalget.",
            "Selve feiringen er som regel en sittende middag for slekt og nære venner. Størrelsen varierer, men de fleste planlegger for et sted mellom 20 og 60 gjester. Velg lokale ut fra antall, om dere lager maten selv eller bruker catering, og hvor nær seremonistedet dere vil være.",
          ]}
          checklist={[
            "Sett datoen tidlig — de beste lokalene til lørdager i mai og juni er booket 6–12 måneder i forveien.",
            "Anslå antall gjester og om det blir sittende middag eller koldtbord.",
            "Bestem catering eller egen matlaging, og sjekk om lokalet har kjøkken.",
            "Avklar servering av alkohol og eventuell skjenkebevilling med lokalet.",
            "Sjekk parkering, universell utforming for eldre slektninger og avtalt sluttid.",
            "Book og betal på nett, og få bekreftelsen med en gang.",
          ]}
          guidance={[
            { label: "Når bør du booke", value: "6–12 måneder før. Lørdager i mai og juni fylles først." },
            { label: "Typisk antall gjester", value: "20–60 til en familiefeiring; felles feiringer kan bli større." },
            { label: "Prisnivå", value: "Grendehus og menighetshus ligger ofte lavest, selskapslokaler med kjøkken høyere. Prisen avhenger av sted, dag og sesong — se alltid totalprisen for din dato før du booker." },
            { label: "Servering av alkohol", value: "Privat servering til inviterte gjester krever normalt ikke bevilling; selges alkohol kreves skjenkebevilling. Avklar med lokalet." },
            { label: "Mat", value: "Velg lokale med eget kjøkken for egen matlaging, eller et catering-vennlig lokale." },
          ]}
          links={[
            { label: "Leie selskapslokale", to: "/leie/selskapslokale" },
            { label: "Leie kulturhus og grendehus", to: "/leie/kulturhus" },
            { label: "Leie gård og låve", to: "/leie/gaard" },
            { label: "Bookingsystem for utleie", to: "/bookingsystem-utleie" },
            { label: "Alle lokaler til leie", to: "/leie" },
          ]}
        />
      }
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="konfirmasjonslokale"
      breadcrumb="Konfirmasjonslokale"
      title="Leie konfirmasjonslokale"
      dek="Konfirmasjon til våren? Finn ledig lokale nær deg, se ekte pris for datoen din, og book og betal med Vipps."
      lead="Konfirmasjonssesongen er kort og lokalene fylles opp tidlig, ofte et helt år i forveien for de mest populære lørdagene i mai og juni. Å finne lokale betyr gjerne leting i Facebook-grupper, tips fra andre foreldre og forespørsler på e-post uten å vite om datoen er ledig eller hva det faktisk koster. På Digilist finner du festsaler, grendehus, menighetshus, kaféer og selskapslokaler i nærområdet samlet ett sted, med ledige datoer i sanntid, ekte pris for din dato og trygg betaling med Vipps, enten det er konfirmasjon for én eller felles feiring for flere familier."
      seoTitle="Leie konfirmasjonslokale: pris og ledige datoer | Digilist"
      seoDescription="Leie lokale til konfirmasjon: finn ledig konfirmasjonslokale nær deg, se ekte pris for din dato og book med Vipps. Festsaler, grendehus og menighetshus samlet."
      keywords="leie konfirmasjonslokale, leie lokale til konfirmasjon, konfirmasjon lokale, selskapslokale konfirmasjon, festlokale konfirmasjon, leie festsal konfirmasjon, konfirmasjonsfeiring lokale"
      audience={[
        { persona: "Foreldre til konfirmant", context: "Dere planlegger feiringen i god tid og trenger et lokale med plass til slekt og venner, kjøkken eller catering-mulighet, og en pris dere kan stole på før invitasjonene sendes." },
        { persona: "Familier som feirer felles", context: "To eller flere konfirmanter i samme familie eller vennekrets som slår feiringen sammen. Ett større lokale i nærområdet med plass til alle." },
        { persona: "Menigheter og trossamfunn", context: "Humanistisk, kristen eller annen konfirmasjon der dere ønsker et verdig lokale i nærheten av seremonistedet, bookbart uten runder på e-post." },
      ]}
      problems={[
        "Konfirmasjonslokaler bookes opp svært tidlig, men de ligger spredt på Finn, Facebook, kommunens sider og menighetshus uten ett sted å søke.",
        "Prisen er uklar til du har sendt forespørsel og ventet på svar, ofte mens datoen samtidig blir tatt av noen andre.",
        "Ingen ekte kalender: du vet ikke om lørdagen i mai er ledig før noen svarer på melding.",
        "Betaling skjer ofte med bankoverføring til en privatperson, uten kvittering eller trygghet for depositumet.",
        "Hva som er inkludert, kjøkken, servise, rydding og sluttid, kommer som overraskelser i stedet for å stå tydelig før booking.",
      ]}
      features={[
        { title: "Alle konfirmasjonslokaler nær deg, ett søk", body: "Festsaler, grendehus, menighetshus, kaféer og selskapslokaler samlet ett sted. Du slipper å lete gjennom Finn, Facebook og kommunens sider hver for seg." },
        { title: "Ekte pris for din dato", body: "Se totalprisen for akkurat din dato og varighet, inkludert eventuelt depositum og rengjøring, før du booker. Ingen prissjokk etter at invitasjonene er sendt." },
        { title: "Ledige datoer i sanntid, book tidlig", body: "Kalenderen viser hvilke lørdager i sesongen som faktisk er ledige, slik at du sikrer datoen før noen andre. Du booker direkte og får bekreftelsen med en gang." },
        { title: "Trygg betaling med Vipps", body: "Betal med Vipps eller kort i samme flyt. Depositum håndteres digitalt og frigjøres automatisk etter feiringen, ingen bankoverføring til en fremmed." },
        { title: "Kjøkken, catering og servise synlig", body: "Se hva som følger med, om det er kjøkken for egen mat eller mulighet for catering, servise og bord og stoler, før du booker." },
        { title: "Vilkår uten overraskelser", body: "Sluttid, rydding, aldersregler og hva som er lov står tydelig på hvert lokale, slik at feiringen blir som planlagt." },
      ]}
      stories={[
        { customer: "Familie i Bærum", role: "Foreldre til konfirmant", headline: "Sikret grendehuset et år i forveien, på nett", body: "De fant et grendehus med kjøkken og plass til 60, så at lørdagen i mai var ledig og booket direkte, uten å vente på svar fra en opptatt utleier.", outcome: [{ label: "Booket", value: "12 mnd før" }, { label: "Gjester", value: "60" }] },
        { customer: "To familier på Nesodden", role: "Felles konfirmasjon", headline: "Slo sammen feiringen i ett lokale", body: "Ett større selskapslokale med catering-mulighet dekket begge konfirmantene, med delt pris synlig for begge familiene før de booket.", outcome: [{ label: "Konfirmanter", value: "2" }, { label: "Betaling", value: "Vipps" }] },
      ]}
      technical={[
        { label: "Lokaltyper", value: "Festsal, grendehus, menighetshus, kafé, selskapslokale" },
        { label: "Booking", value: "Sanntidskalender, direkte bekreftelse" },
        { label: "Betaling", value: "Vipps og kort, digitalt depositum" },
        { label: "Marked", value: "Private og kommunale lokaler samlet" },
      ]}
      pullQuote={{ text: "Vi sikret datoen i mai et helt år før konfirmasjonen, uten en eneste e-postrunde.", byline: "Forelder, konfirmant 2026" }}
      faq={[
        { question: "Hva koster det å leie et konfirmasjonslokale?", answer: "Prisen varierer med type lokale, sted, varighet og sesong. Et grendehus eller menighetshus kan koste fra noen hundrelapper til rundt tusenlappen for en dag, mens større selskapslokaler med kjøkken ligger høyere, særlig på lørdager i høysesongen mai og juni. På Digilist ser du totalprisen for din dato før du booker." },
        { question: "Når bør jeg booke konfirmasjonslokale?", answer: "De mest populære lokalene til lørdager i mai og juni bookes ofte 6 til 12 måneder i forveien. På en bookingplattform med sanntidskalender ser du med én gang om datoen er ledig, i stedet for å vente på svar mens noen andre booker." },
        { question: "Hvor finner jeg lokale til konfirmasjon nær meg?", answer: "På Digilist søker du opp konfirmasjonslokaler i nærområdet, festsaler, grendehus, menighetshus og selskapslokaler, samlet ett sted med ledige datoer og pris for din dato." },
        { question: "Kan jeg leie både private og kommunale lokaler til konfirmasjon?", answer: "Ja. Mange grendehus, samfunnshus og kommunale lokaler leies ut til konfirmasjon, og på Digilist ligger både private festlokaler og offentlige lokaler i samme kalender slik at du kan sammenligne tilgjengelighet på ett sted." },
      ]}
      relatedPosts={[
        { title: "Leie selskapslokale til bryllup eller fest", slug: "leie-selskapslokale-bryllup-fest" },
        { title: "Leie lokale i kommunen etter anledning", slug: "leie-lokale-kommune-anledning-guide-innbygger" },
        { title: "Vilkår, depositum og avbestilling", slug: "leie-lokale-kommune-vilkar-depositum-avbestilling" },
      ]}
      siblings={[
        { title: "Selskapslokale", slug: "selskapslokale" },
        { title: "Kulturhus", slug: "kulturhus" },
        { title: "Gård og låve", slug: "gaard" },
        { title: "Bursdagslokale", slug: "bursdagslokale" },
      ]}
    />
  );
}
