import { Music, Drama, Tent, Medal, Search, Ticket, Wallet } from "lucide-react";
import MarketplaceHub, {
  type HubGroup,
  type HubStep,
  type HubFaqItem,
} from "@/components/MarketplaceHub";
import { getFraunces } from "@/lib/fonts";

const APP = "https://app.digilist.no";

const GROUPS: HubGroup[] = [
  {
    label: "HVA SKJER",
    meta: "KONSERT · TEATER · FESTIVAL · SPORT",
    items: [
      {
        title: "Konsert",
        Icon: Music,
        to: "/arrangementer/konsert",
        body: "Konserter nær deg samlet ett sted. Se pris og ledige billetter, kjøp med Vipps, og få QR-billetten rett på mobilen.",
      },
      {
        title: "Teater og scene",
        Icon: Drama,
        to: "/arrangementer/teater-og-scene",
        body: "Teater, forestilling, standup og revy. Velg sete, kjøp billett med Vipps, og slipp konto hos hvert enkelt teater.",
      },
      {
        title: "Festival",
        Icon: Tent,
        to: "/arrangementer/festival",
        body: "Festivaler med dagspass, helgepass og VIP. Se hva som er igjen, kjøp med Vipps, og få billetten på mobilen.",
      },
      {
        title: "Sport",
        Icon: Medal,
        to: "/arrangementer/sport",
        body: "Kamper og idrettsarrangement, enkeltbillett eller sesongkort. Velg sete eller felt, kjøp med Vipps, og få QR-billetten på mobilen.",
      },
    ],
  },
];

const STEPS: HubStep[] = [
  {
    step: "01",
    Icon: Search,
    title: "Finn arrangement",
    body: "Søk på sted og dato. Du ser konserter, forestillinger og festivaler nær deg, med pris og hvilke billetter som faktisk er igjen.",
  },
  {
    step: "02",
    Icon: Ticket,
    title: "Velg billett",
    body: "Velg billettype og antall. Rabattkoder og gavekort legges inn i kassen, og totalen vises før du bekrefter.",
  },
  {
    step: "03",
    Icon: Wallet,
    title: "Betal med Vipps",
    body: "Betal med Vipps eller kort, og få QR-billetten rett på mobilen. Vis den ved inngangen, ferdig. Ingen ny konto hos hvert arrangement.",
  },
];

const FAQ: HubFaqItem[] = [
  {
    question: "Hva slags arrangementer finner jeg?",
    answer:
      "Konserter, teater og forestillinger, standup, revy og festivaler, samlet på ett sted. Du søker på sted og dato, ser pris og hvilke billetter som er igjen, og kjøper direkte, uten å lete gjennom hver arrangørs egen billettside.",
  },
  {
    question: "Hvordan kjøper jeg billett?",
    answer:
      "Velg arrangement og billettype, legg eventuelt inn rabattkode eller gavekort, og betal med Vipps eller kort i samme flyt. Du får billetten med en gang, uten å lage konto hos hvert enkelt arrangement.",
  },
  {
    question: "Får jeg billetten på mobilen?",
    answer:
      "Ja. Billetten kommer som en QR-kode rett på mobilen etter kjøpet. Ved inngangen viser du QR-koden, den skannes, og du er inne. Ingen papirlapp som blir borte, ingen e-post å lete etter.",
  },
  {
    question: "Kan jeg bruke rabattkode eller gavekort?",
    answer:
      "Ja, der arrangøren tilbyr det. Rabattkoder og gavekort legges inn i kassen, og beløpet trekkes fra totalen før du betaler. Gjenstående saldo på et gavekort følger med til neste kjøp.",
  },
];

export default function Arrangementer() {
  return (
    <MarketplaceHub
      sectionLabel="ARRANGEMENTER"
      seoTitle="Arrangementer: kjøp billetter til konsert, teater og festival | Digilist"
      seoDescription="Finn arrangementer nær deg og kjøp billetter til konsert, teater og festival. Betal med Vipps, få QR-billett på mobilen, bruk rabattkode og gavekort. Samlet ett sted."
      keywords="arrangementer, kjøp billetter, konsertbilletter, teaterbilletter, festivalbilletter, billetter nær meg, billett vipps, arrangement billetter"
      canonical="https://digilist.no/arrangementer"
      breadcrumbsSeo={[
        { name: "Hjem", url: "https://digilist.no/" },
        { name: "Arrangementer", url: "https://digilist.no/arrangementer" },
      ]}
      heroImage="/images/cat/konsert.jpg"
      heroIcon={Music}
      heroHeading={
        <>
          Finn og kjøp billetter til{" "}
          <em className="italic" style={{ fontVariationSettings: getFraunces("display") }}>
            det som skjer
          </em>
          .
        </>
      }
      heroLead="Konserter, forestillinger og festivaler samlet på ett sted. Kjøp billett med Vipps, bruk rabattkode og gavekort, og få QR-billetten rett på mobilen. Ingen ny konto hos hvert arrangement."
      heroCta={{ label: "Finn arrangementer", href: APP }}
      videoLabel="Reklamefilm · Arrangementer"
      videoCaption="Kort film om hvordan du finner og kjøper billetter"
      categoryCaption="HVA VIL DU PÅ?"
      categoryMeta="KONSERT · TEATER · FESTIVAL · SPORT"
      groups={GROUPS}
      stepsMeta="FINN · VELG BILLETT · BETAL MED VIPPS"
      steps={STEPS}
      faq={FAQ}
      closingTitle="Klar for neste arrangement?"
      closingBody="Søk blant konserter, forestillinger og festivaler, se pris og ledige billetter, og kjøp på minutter med Vipps."
      closingCta={{ label: "Finn arrangementer", href: APP }}
      howTo={{
        name: "Slik kjøper du billetter til arrangementer",
        description: "Finn arrangement, velg billett og betal med Vipps på tre steg via Digilist.",
        steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
      }}
    />
  );
}
