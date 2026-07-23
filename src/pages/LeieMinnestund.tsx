import UseCasePage from "@/components/UseCasePage";
import { OccasionGuide } from "@/components/OccasionGuide";

export default function LeieMinnestund() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="minnestund"
      breadcrumb="Minnestund"
      title="Leie lokale til minnestund"
      dek="Et verdig sted for minnesamværet, nær seremonistedet. Finn ledig lokale og book uten en lang telefonrunde i en tung tid."
      lead="Et minnesamvær planlegges ofte på kort varsel og midt i sorgen, gjerne bare noen dager før. Da er det en lettelse å finne et rolig, verdig lokale nær kirken eller seremonistedet, med plass til dem som kommer, uten å måtte ringe rundt og vente på svar. På Digilist finner du menighetshus, grendehus, kaféer og selskapslokaler samlet ett sted, med ledige datoer i sanntid og pris synlig, slik at én ting blir enklere når mye annet er vanskelig. Mange gravferdsbyrå hjelper også til med å ordne lokalet."
      seoTitle="Leie lokale til minnestund og minnesamvær | Digilist"
      seoDescription="Leie lokale til minnestund etter gravferd: finn et verdig, ledig lokale nær seremonistedet, se pris og book uten lang telefonrunde. Menighetshus og selskapslokaler samlet."
      keywords="leie lokale til minnestund, minnesamvær lokale, lokale til minnestund, leie lokale til begravelse, minnestund etter gravferd, leie menighetshus minnestund, lokale til minnesamvær"
      audience={[
        { persona: "Etterlatte og pårørende", context: "Dere planlegger minnesamværet på kort tid og trenger et rolig lokale nær seremonistedet, med plass til slekt og venner og en pris dere kan forholde dere til." },
        { persona: "Gravferdsbyrå", context: "Dere hjelper familier med å finne og booke lokale raskt. Ett sted å se hva som er ledig og til hvilken pris gjør det enklere å gi familien et godt forslag." },
        { persona: "Menigheter og trossamfunn", context: "Dere har eller formidler lokaler til minnesamvær og ønsker en enkel måte å vise ledige datoer og ta imot booking på." },
      ]}
      problems={[
        "Lokalet må ofte ordnes på få dager, samtidig som mye annet skal på plass i en sårbar tid.",
        "Menighetshus, grendehus og kaféer som passer ligger spredt, uten ett sted å se hva som er ledig.",
        "Prisen er sjelden synlig før du har ringt eller sendt e-post og ventet på svar.",
        "Det er vanskelig å vite på forhånd om lokalet er verdig, rolig og tilgjengelig for eldre og bevegelseshemmede gjester.",
        "Servering av kaffe, kaker og enkel mat må avklares separat, gjerne under tidspress.",
      ]}
      features={[
        { title: "Passende lokaler samlet, ett søk", body: "Menighetshus, grendehus, kaféer og selskapslokaler som egner seg for minnesamvær, samlet ett sted, slik at du slipper å lete flere steder samtidig." },
        { title: "Ledige datoer i sanntid", body: "Kalenderen viser hva som faktisk er ledig på den aktuelle datoen, slik at du kan ordne lokalet raskt uten å vente på svar." },
        { title: "Pris synlig på forhånd", body: "Se prisen for lokalet før du booker, slik at det økonomiske er avklart uten en runde med telefoner og e-post." },
        { title: "Tilgjengelighet og fasiliteter", body: "Se om lokalet er tilrettelagt for eldre og bevegelseshemmede, og hva som finnes av kjøkken og servise for enkel servering." },
        { title: "Enkel booking, også for byrå", body: "Book direkte og få bekreftelsen med en gang. Gravferdsbyrå kan ordne lokalet på vegne av familien i samme flyt." },
        { title: "Nær seremonistedet", body: "Søk opp lokaler i nærheten av kirken eller seremonistedet, slik at gjestene lett kommer seg videre etter seremonien." },
      ]}
      stories={[
        { customer: "Familie på Romerike", role: "Pårørende", headline: "Ordnet minnesamværet på to dager", body: "De fant et menighetshus med kjøkken nær kirken, så at datoen var ledig og at prisen passet, og fikk booket uten en lang telefonrunde i en tung uke.", outcome: [{ label: "Ordnet på", value: "2 dager" }, { label: "Gjester", value: "50" }] },
        { customer: "Gravferdsbyrå", role: "Rådgiver", headline: "Ga familien et forslag samme dag", body: "I stedet for å ringe rundt fant rådgiveren tre ledige, passende lokaler med pris, og familien valgte det som lå nærmest kirken.", outcome: [{ label: "Alternativer", value: "3 samme dag" }, { label: "Booking", value: "På vegne av familien" }] },
      ]}
      technical={[
        { label: "Lokaltyper", value: "Menighetshus, grendehus, kafé, selskapslokale" },
        { label: "Booking", value: "Sanntidskalender, rask bekreftelse" },
        { label: "Tilgjengelighet", value: "Universell utforming der lokalet tilbyr det" },
        { label: "For byrå", value: "Booking på vegne av familien" },
      ]}
      pullQuote={{ text: "Å finne et verdig lokale nær kirken uten å ringe rundt gjorde en tung uke litt enklere.", byline: "Pårørende" }}
      faq={[
        { question: "Hvor kan jeg leie lokale til minnestund?", answer: "Menighetshus, grendehus, kaféer og selskapslokaler leies ofte ut til minnesamvær. På Digilist finner du passende lokaler nær seremonistedet samlet ett sted, med ledige datoer og pris synlig, slik at du kan ordne lokalet raskt." },
        { question: "Hvor raskt kan jeg ordne lokale?", answer: "Fordi minnesamvær ofte planlegges på få dager, viser Digilist ledige datoer i sanntid, slik at du kan booke direkte og få bekreftelsen med en gang, i stedet for å vente på svar på telefon eller e-post." },
        { question: "Hva koster det å leie lokale til minnesamvær?", answer: "Prisen varierer med type lokale, sted og varighet. Menighetshus og grendehus ligger ofte lavest, mens kaféer og selskapslokaler med servering koster mer. På Digilist ser du prisen for lokalet før du booker." },
        { question: "Kan gravferdsbyrået ordne lokalet for oss?", answer: "Ja. Mange gravferdsbyrå hjelper familien med å finne og booke lokale, og kan gjøre dette på vegne av de pårørende i samme flyt." },
        { question: "Er lokalene tilrettelagt for eldre gjester?", answer: "Mange minnesamvær har eldre gjester, og tilgjengelighet er viktig. På hvert lokale ser du informasjon om universell utforming og fasiliteter der utleier har oppgitt det, slik at du kan velge et lokale som passer." },
      ]}
      relatedPosts={[
        { title: "Leie lokale i kommunen etter anledning", slug: "leie-lokale-kommune-anledning-guide-innbygger" },
        { title: "Vilkår, depositum og avbestilling", slug: "leie-lokale-kommune-vilkar-depositum-avbestilling" },
        { title: "Sammenlign lokaltyper og reell pris", slug: "leie-lokale-billigst-kommune-sammenlign-lokaltyper" },
      ]}
      siblings={[
        { title: "Kulturhus og grendehus", slug: "kulturhus" },
        { title: "Selskapslokale", slug: "selskapslokale" },
        { title: "Møterom", slug: "moterom" },
      ]}
      extra={
        <OccasionGuide
          author="Ibrahim Rahmani"
          role="Grunnlegger, Digilist"
          updated="23. juli 2026"
          heading="Slik ordner du minnesamværet"
          intro={[
            "Et minnesamvær holdes gjerne rett etter gravferdsseremonien, og lokalet må ofte ordnes på få dager. Det viktigste er å finne et rolig, verdig sted i nærheten av kirken eller seremonistedet, med plass til dem som kommer og enkel servering av kaffe, kaker eller snitter.",
            "Mange velger menighetshus eller grendehus, som ofte er både rimelige og tilrettelagt for anledningen. Gravferdsbyrået kan hjelpe med å finne og booke lokalet dersom dere ønsker det. Tenk på tilgjengelighet for eldre gjester, og på hvor lett det er å komme fra seremonistedet til lokalet.",
          ]}
          checklist={[
            "Avklar omtrentlig antall gjester og ønsket tidspunkt etter seremonien.",
            "Velg et lokale nær kirken eller seremonistedet, så gjestene lett kommer seg videre.",
            "Sjekk tilgjengelighet og universell utforming for eldre og bevegelseshemmede.",
            "Avklar servering — eget kjøkken, egen mat eller enkel catering av kaffe og kaker.",
            "Se pris og ledig dato, og book direkte, eventuelt via gravferdsbyrået.",
          ]}
          guidance={[
            { label: "Når ordnes lokalet", value: "Ofte bare noen få dager før. Sanntidskalender gjør at du slipper å vente på svar." },
            { label: "Typisk antall gjester", value: "Vanligvis 30–100, avhengig av slekt og omgangskrets." },
            { label: "Prisnivå", value: "Menighetshus og grendehus ligger ofte lavest; kaféer og selskapslokaler med servering høyere. Se prisen for lokalet før du booker." },
            { label: "Servering", value: "Vanligvis kaffe, kaker eller snitter. Velg lokale med eget kjøkken eller mulighet for enkel catering." },
            { label: "Tilgjengelighet", value: "Viktig med tanke på eldre gjester. Se informasjon om universell utforming på hvert lokale." },
          ]}
          stat={{ value: "Rundt 44 000", label: "gravferder holdes i Norge hvert år, og de fleste følges av et minnesamvær.", source: "Statistisk sentralbyrå (SSB), antall dødsfall" }}
          links={[
            { label: "Leie kulturhus og grendehus", to: "/leie/kulturhus" },
            { label: "Leie selskapslokale", to: "/leie/selskapslokale" },
            { label: "Bookingsystem for utleie", to: "/bookingsystem-utleie" },
            { label: "Alle lokaler til leie", to: "/leie" },
          ]}
        />
      }
    />
  );
}
