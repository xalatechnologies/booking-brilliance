import { TreePine, Building2, BedDouble, Home, Search, CalendarCheck, Wallet } from "lucide-react";
import MarketplaceHub, {
  type HubGroup,
  type HubStep,
  type HubFaqItem,
} from "@/components/MarketplaceHub";
import { getFraunces } from "@/lib/fonts";

const APP = "https://app.digilist.no";

const GROUPS: HubGroup[] = [
  {
    label: "STED Å BO",
    meta: "HYTTE · LEILIGHET · ROM · FERIEHUS",
    items: [
      {
        title: "Hytte",
        Icon: TreePine,
        to: "/overnatting/hytte",
        body: "Helgetur, ferie eller familiesamling. Hytter i hele Norge med totalpris uten skjulte gebyrer og ledige netter synlig.",
      },
      {
        title: "Leilighet",
        Icon: Building2,
        to: "/overnatting/leilighet",
        body: "Byferie, jobbreise eller mellombolig. Korttidsleiligheter med eget kjøkken, totalpris og digital innsjekk.",
      },
      {
        title: "Rom",
        Icon: BedDouble,
        to: "/overnatting/rom",
        body: "Rimelig overnatting i gjesterom eller privat rom, med pris per natt og hva som er inkludert synlig før du booker.",
      },
      {
        title: "Feriehus",
        Icon: Home,
        to: "/overnatting/feriehus",
        body: "Familieferie eller gjenforening. Store hus med flere soverom og hage, ofte ved sjøen eller fjellet, med totalpris synlig.",
      },
    ],
  },
];

const STEPS: HubStep[] = [
  {
    step: "01",
    Icon: Search,
    title: "Finn",
    body: "Søk på sted og datoer. Du ser hytter, leiligheter og rom i nærområdet, med totalpris uten skjulte gebyrer og hva som faktisk er ledig.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Book",
    body: "Velg ledige netter og book direkte. Ingen forespørsel og ingen venting. Innsjekk, kapasitet og vilkår er synlig før du bekrefter.",
  },
  {
    step: "03",
    Icon: Wallet,
    title: "Betal med Vipps",
    body: "Betal trygt med Vipps eller kort. Bekreftelse og innsjekkinfo kommer med en gang. Ingen bankoverføring til en fremmed.",
  },
];

const FAQ: HubFaqItem[] = [
  {
    question: "Hva slags overnatting finner jeg?",
    answer:
      "Hytter, korttidsleiligheter og private rom og gjesterom, samlet på ett sted. Du slipper å lete gjennom Finn, Airbnb og Facebook-grupper hver for seg, og ser totalpris og ledige netter før du booker.",
  },
  {
    question: "Er totalprisen synlig, eller kommer det gebyrer på slutten?",
    answer:
      "Totalprisen, inkludert vask og eventuelle gebyrer, vises før du booker. Ingen tillegg som dukker opp i siste steg, slik at du vet nøyaktig hva oppholdet koster.",
  },
  {
    question: "Hvordan booker jeg og betaler?",
    answer:
      "Søk på sted og datoer, velg ledige netter og book direkte. Du betaler med Vipps eller kort i samme flyt, og får bekreftelse og innsjekkinfo med en gang.",
  },
  {
    question: "Hvordan fungerer innsjekk?",
    answer:
      "Innsjekkstid og nøkkelløsning står i bekreftelsen. Mange steder bruker nøkkelboks eller digital nøkkel, slik at du sjekker inn når det passer deg, uten å avtale overlevering på melding.",
  },
];

export default function Overnatting() {
  return (
    <MarketplaceHub
      sectionLabel="OVERNATTING"
      seoTitle="Overnatting: leie hytte, leilighet eller rom | Digilist"
      seoDescription="Finn og book overnatting i Norge: leie hytte, leilighet eller rom. Se totalpris uten skjulte gebyrer og ledige netter, og book trygt med Vipps. Samlet ett sted."
      keywords="overnatting, leie hytte, leie leilighet, leie rom, korttidsleie, overnatting norge, book overnatting, hytte til leie, leilighet til leie"
      canonical="https://digilist.no/overnatting"
      breadcrumbsSeo={[
        { name: "Hjem", url: "https://digilist.no/" },
        { name: "Overnatting", url: "https://digilist.no/overnatting" },
      ]}
      heroImage="/images/cat/hytte.jpg"
      heroIcon={TreePine}
      heroHeading={
        <>
          Finn og book overnatting,{" "}
          <em className="italic" style={{ fontVariationSettings: getFraunces("display") }}>
            der du skal
          </em>
          .
        </>
      }
      heroLead="Hytter, leiligheter og rom samlet på ett sted. Totalpris uten skjulte gebyrer, ledige netter i sanntid og trygg betaling med Vipps. Slutt med å lete gjennom Finn, Airbnb og Facebook-grupper hver for seg."
      heroCta={{ label: "Finn overnatting", href: APP }}
      videoLabel="Reklamefilm · Overnatting"
      videoCaption="Kort film om hvordan du finner og booker overnatting"
      categoryCaption="HVA LETER DU ETTER?"
      categoryMeta="HYTTE · LEILIGHET · ROM · FERIEHUS"
      groups={GROUPS}
      stepsMeta="FINN · BOOK · BETAL MED VIPPS"
      steps={STEPS}
      faq={FAQ}
      closingTitle="Klar til å finne overnatting?"
      closingBody="Søk blant hytter, leiligheter og rom, se totalpris og ledige netter, og book på minutter med Vipps."
      closingCta={{ label: "Finn overnatting", href: APP }}
      howTo={{
        name: "Slik finner og booker du overnatting",
        description: "Finn, book og betal med Vipps på tre steg via Digilist.",
        steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
      }}
    />
  );
}
