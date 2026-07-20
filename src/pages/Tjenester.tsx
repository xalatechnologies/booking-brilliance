import { UtensilsCrossed, Disc3, Music2, Sparkles, Search, CalendarCheck, Wallet } from "lucide-react";
import MarketplaceHub, {
  type HubGroup,
  type HubStep,
  type HubFaqItem,
} from "@/components/MarketplaceHub";
import { getFraunces } from "@/lib/fonts";

const APP = "https://app.digilist.no";

const GROUPS: HubGroup[] = [
  {
    label: "BOOK TJENESTER",
    meta: "MAT · MUSIKK · DEKOR",
    items: [
      {
        title: "Catering",
        Icon: UtensilsCrossed,
        to: "/tjenester/catering",
        body: "Koldtbord, tapas eller middag til arrangementet. Se meny og pris per kuvert, sjekk ledig dato, og book leverandør med Vipps.",
      },
      {
        title: "DJ",
        Icon: Disc3,
        to: "/tjenester/dj",
        body: "DJ til bryllup, fest eller firmafest. Se sjanger, pris per kveld og om DJ-en har eget anlegg, og book ledig dato med Vipps.",
      },
      {
        title: "Musiker",
        Icon: Music2,
        to: "/tjenester/musiker",
        body: "Livemusikk, band eller solist til bryllup og selskap. Hør lydprøver, se besetning og pris, og book ledig dato med Vipps.",
      },
      {
        title: "Dekor",
        Icon: Sparkles,
        to: "/tjenester/dekor",
        body: "Blomsterdekor, bordpynt og ballongbuer i ferdige pakker. Se pris, sjekk ledig dato, og book dekoratør med rigging og Vipps.",
      },
    ],
  },
];

const STEPS: HubStep[] = [
  {
    step: "01",
    Icon: Search,
    title: "Finn leverandør",
    body: "Søk på sted og dato. Du ser cateringleverandører, DJ-er, musikere og dekoratører i nærområdet, med pris og hva som er inkludert synlig.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Sjekk ledig dato",
    body: "Leverandørens kalender viser om datoen din er ledig. Du booker direkte, uten forespørsel og uten å vente dagevis på tilbud.",
  },
  {
    step: "03",
    Icon: Wallet,
    title: "Book og betal med Vipps",
    body: "Betal med Vipps eller kort i samme flyt. Bekreftelse og kvittering kommer med en gang. Ingen kontanter eller overføring til en fremmed.",
  },
];

const FAQ: HubFaqItem[] = [
  {
    question: "Hvilke tjenester kan jeg booke?",
    answer:
      "Catering, DJ, musiker og dekor til bryllup, selskap og firmaarrangement, samlet på ett sted. Du ser pris og ledig dato på hver leverandør, og booker direkte i stedet for å sende forespørsler og vente på tilbud.",
  },
  {
    question: "Hvordan vet jeg om leverandøren er ledig?",
    answer:
      "Hver leverandør har en kalender som viser om datoen din er ledig i sanntid. Du booker direkte og får bekreftelsen med en gang, uten forespørsel og venting på svar.",
  },
  {
    question: "Hvordan booker og betaler jeg?",
    answer:
      "Søk på sted og dato, sammenlign leverandører med pris synlig, og book den som passer. Du betaler med Vipps eller kort i samme flyt, og får kvittering og bekreftelse med en gang.",
  },
  {
    question: "Kan jeg lese omtaler fra andre kunder?",
    answer:
      "Ja. Mange leverandører har vurderinger og omtaler fra andre som har booket dem, slik at du kan velge på erfaring i stedet for magefølelse eller et tips på Facebook.",
  },
];

export default function Tjenester() {
  return (
    <MarketplaceHub
      sectionLabel="TJENESTER"
      seoTitle="Book tjenester: catering, DJ, musiker og dekor | Digilist"
      seoDescription="Book tjenester til arrangementet: catering, DJ, musiker og dekor. Se pris, sjekk ledig dato og book leverandør nær deg med Vipps. Alt samlet ett sted."
      keywords="tjenester, bestille catering, leie DJ, leie musiker, leie dekor, catering til bryllup, DJ til fest, book leverandør, tjenester til arrangement"
      canonical="https://digilist.no/tjenester"
      breadcrumbsSeo={[
        { name: "Hjem", url: "https://digilist.no/" },
        { name: "Tjenester", url: "https://digilist.no/tjenester" },
      ]}
      heroImage="/images/cat/dekor.jpg"
      heroIcon={Sparkles}
      heroHeading={
        <>
          Book tjenester til{" "}
          <em className="italic" style={{ fontVariationSettings: getFraunces("display") }}>
            arrangementet ditt
          </em>
          .
        </>
      }
      heroLead="Catering, DJ, musiker og dekor, samlet på ett sted. Se pris og ledig dato på hver leverandør, og book direkte med Vipps. Ingen tilbudsrunder og ingen dager med venting."
      heroCta={{ label: "Finn tjenester", href: APP }}
      videoLabel="Reklamefilm · Tjenester"
      videoCaption="Kort film om hvordan du finner og booker tjenester"
      categoryCaption="HVA TRENGER DU?"
      categoryMeta="MAT · MUSIKK · DEKOR"
      groups={GROUPS}
      stepsMeta="FINN · SJEKK DATO · BOOK MED VIPPS"
      steps={STEPS}
      faq={FAQ}
      closingTitle="Klar til å booke tjenestene?"
      closingBody="Søk blant catering, DJ, musiker og dekor, se pris og ledig dato, og book på minutter med Vipps."
      closingCta={{ label: "Finn tjenester", href: APP }}
      howTo={{
        name: "Slik finner og booker du tjenester",
        description: "Finn, book og betal med Vipps på tre steg via Digilist.",
        steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
      }}
    />
  );
}
