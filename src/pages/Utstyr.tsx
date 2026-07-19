import { PartyPopper, Wrench, Speaker, Bike, Search, CalendarCheck, PackageCheck } from "lucide-react";
import MarketplaceHub, {
  type HubGroup,
  type HubStep,
  type HubFaqItem,
} from "@/components/MarketplaceHub";
import { getFraunces } from "@/lib/fonts";

const APP = "https://app.digilist.no";

const GROUPS: HubGroup[] = [
  {
    label: "LEIE UTSTYR",
    meta: "PRIS · DEPOSITUM · LEDIG",
    items: [
      {
        title: "Festutstyr",
        Icon: PartyPopper,
        to: "/utstyr/festutstyr",
        body: "Telt, bord, stoler og servise til bryllup, konfirmasjon eller bursdag. Pris, depositum og ledig dato synlig, med henting eller levering.",
      },
      {
        title: "Verktøy og maskiner",
        Icon: Wrench,
        to: "/utstyr/verktoy-maskiner",
        body: "Minigraver, høytrykksspyler, stillas og verktøy til oppussing, hage og bygg. Pris per dag eller helg, med depositum og ledighet synlig.",
      },
      {
        title: "Lyd og lys",
        Icon: Speaker,
        to: "/utstyr/lyd-og-lys",
        body: "Lydanlegg, mikrofon, scenelys og projektor til fest, konsert eller konferanse. Spesifikasjoner, pris og tekniker som tilvalg.",
      },
      {
        title: "Sport og friluft",
        Icon: Bike,
        to: "/utstyr/sport-og-friluft",
        body: "Sykkel, ski, kajakk og turutstyr. Prøv en aktivitet uten å kjøpe dyrt utstyr, med pris, ledig dato og Vipps.",
      },
    ],
  },
];

const STEPS: HubStep[] = [
  {
    step: "01",
    Icon: Search,
    title: "Finn",
    body: "Søk på sted og dato. Du ser festutstyr, verktøy, maskiner, lyd og lys i nærområdet, med pris per dag, depositum og hva som faktisk er ledig.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Book leieperiode",
    body: "Velg leieperioden og book direkte. Vilkår, depositum og om du henter eller får levert er synlig før du bekrefter.",
  },
  {
    step: "03",
    Icon: PackageCheck,
    title: "Hent eller få levert",
    body: "Betal med Vipps eller kort. Depositum håndteres digitalt og frigjøres automatisk etter retur. Hent selv eller få utstyret levert.",
  },
];

const FAQ: HubFaqItem[] = [
  {
    question: "Hva slags utstyr kan jeg leie?",
    answer:
      "Festutstyr som telt, bord, stoler og servise, verktøy og maskiner til oppussing og hage, og lyd- og lysutstyr til arrangementer. Alt samlet på ett sted, med pris og ledighet synlig før du booker.",
  },
  {
    question: "Må jeg betale depositum?",
    answer:
      "Mange utleiere krever depositum, særlig på dyrere maskiner og utstyr. Der det gjelder, står beløpet på utstyret, og depositumet håndteres digitalt og frigjøres automatisk når utstyret er levert tilbake i avtalt stand.",
  },
  {
    question: "Kan jeg få utstyret levert, eller må jeg hente selv?",
    answer:
      "Det varierer per utleier, og begge deler finnes. Hvert utstyr viser om levering tilbys og hva det koster, eller om du henter selv, slik at du vet det før du booker.",
  },
  {
    question: "Hvordan booker og betaler jeg?",
    answer:
      "Søk på sted og dato, velg leieperiode og book direkte. Du betaler med Vipps eller kort i samme flyt, og får bekreftelse med en gang. Ingen ringerunde og ingen venting på svar.",
  },
];

export default function Utstyr() {
  return (
    <MarketplaceHub
      sectionLabel="UTSTYR"
      seoTitle="Leie utstyr: festutstyr, verktøy, maskiner, lyd og lys | Digilist"
      seoDescription="Leie utstyr på ett sted: festutstyr og telt, verktøy og maskiner, lyd og lys. Se pris per dag, depositum og ledighet, og book med Vipps. Henting eller levering."
      keywords="leie utstyr, leie festutstyr, leie telt, leie verktøy, leie maskiner, leie minigraver, leie lydanlegg, utstyr til leie, book utstyr"
      canonical="https://digilist.no/utstyr"
      breadcrumbsSeo={[
        { name: "Hjem", url: "https://digilist.no/" },
        { name: "Utstyr", url: "https://digilist.no/utstyr" },
      ]}
      heroImage="/images/cat/festutstyr.jpg"
      heroIcon={PartyPopper}
      heroHeading={
        <>
          Leie utstyr til{" "}
          <em className="italic" style={{ fontVariationSettings: getFraunces("display") }}>
            hva enn du planlegger
          </em>
          .
        </>
      }
      heroLead="Festutstyr, verktøy og maskiner, lyd og lys, samlet på ett sted. Pris per dag, depositum og ledighet synlig, henting eller levering avklart på forhånd, og trygg betaling med Vipps."
      heroCta={{ label: "Finn utstyr", href: APP }}
      videoLabel="Reklamefilm · Utstyr"
      videoCaption="Kort film om hvordan du finner og leier utstyr"
      categoryCaption="HVA TRENGER DU?"
      categoryMeta="FEST · VERKTØY · LYD · FRILUFT"
      groups={GROUPS}
      stepsMeta="FINN · BOOK · HENT ELLER FÅ LEVERT"
      steps={STEPS}
      faq={FAQ}
      closingTitle="Klar til å finne utstyret?"
      closingBody="Søk blant festutstyr, verktøy, maskiner, lyd og lys, se pris og depositum, og book på minutter med Vipps."
      closingCta={{ label: "Finn utstyr", href: APP }}
      howTo={{
        name: "Slik finner og leier du utstyr",
        description: "Finn, book og betal med Vipps på tre steg via Digilist.",
        steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
      }}
    />
  );
}
