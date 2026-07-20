import UseCasePage from "@/components/UseCasePage";

export default function TjenesteCatering() {
  return (
    <UseCasePage
      basePath="/tjenester"
      parentCrumb={{ name: "Tjenester", path: "/tjenester" }}
      sectionLabel="TJENESTER"
      slug="catering"
      breadcrumb="Catering"
      title="Bestille catering"
      dek="Koldtbord, tapas eller middag til arrangementet. Finn ledig cateringleverandør nær deg, og book trygt med Vipps."
      lead="Skal du servere gjestene noe godt, går tiden fort med å lete etter cateringleverandører på nettsider, i Facebook-grupper og via anbefalinger, sende forespørsler og vente dagevis på tilbud. Prisen per kuvert er uklar til noen svarer, og du vet ikke om leverandøren i det hele tatt er ledig på datoen din. På Digilist finner du cateringleverandører i nærområdet samlet ett sted, med meny, pris per kuvert og ledige datoer synlig før du bestiller. Du booker leverandøren direkte og betaler trygt med Vipps, uten venting og uten gjetting."
      seoTitle="Bestille catering: meny, pris per kuvert og booking | Digilist"
      seoDescription="Bestille catering til bryllup, konfirmasjon eller firmafest: se meny og pris per kuvert, sjekk ledige datoer, og book cateringleverandør nær deg med Vipps."
      keywords="bestille catering, catering til bryllup, catering til selskap, catering pris, koldtbord catering, catering nær meg, leie catering, catering firmaarrangement, tapas catering"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere planlegger bryllup og trenger en meny som passer gjestene og budsjettet, med pris per kuvert dere kan stole på, uten å vente en uke på tilbud.",
        },
        {
          persona: "Familier som feirer",
          context: "Konfirmasjon, dåp, jubileum eller minnestund. Koldtbord eller middag til hele familien, bestilt uten stress og lange e-posttråder.",
        },
        {
          persona: "Bedrifter",
          context: "Sommerfest, julebord eller kundearrangement. Dere trenger en leverandør som kan levere til mange, med tydelig pris og ryddig betaling.",
        },
        {
          persona: "Arrangører av større selskap",
          context: "Fest med mange gjester krever en meny som fungerer i stor skala, servering som tilvalg og en leverandør som faktisk er ledig på datoen.",
        },
      ]}
      problems={[
        "Cateringleverandørene ligger spredt: egne nettsider, Facebook-grupper og anbefalinger fra kjente, uten ett sted å søke.",
        "Du må sende forespørsel til hver enkelt leverandør og vente dagevis på tilbud, ofte uten svar.",
        "Prisen per kuvert er uklar, og tilbudene er satt opp så ulikt at de er vanskelige å sammenligne.",
        "Ingen ekte kalender: du vet ikke om leverandøren er ledig på datoen din før noen svarer deg.",
        "Allergihensyn, servering og levering avklares i lange e-posttråder frem og tilbake i stedet for å stå tydelig før du bestiller.",
      ]}
      features={[
        {
          title: "Leverandørene samlet ett sted",
          body: "Cateringleverandører i nærområdet samlet på ett sted, med koldtbord, tapas, grill, middag og kaker. Du slipper å lete gjennom nettsider og Facebook-grupper hver for seg.",
        },
        {
          title: "Meny og pris per kuvert synlig",
          body: "Se menyene og prisen per kuvert på hver leverandør, og sammenlign uten å be om tilbud. Du vet hva det koster for ditt antall gjester før du bestiller.",
        },
        {
          title: "Ledig dato i sanntid",
          body: "Leverandørens kalender viser om datoen din er ledig. Du bestiller direkte og får bekreftelsen med en gang, ingen forespørsel og venting på svar.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Bestill og betal med Vipps eller kort i samme flyt. Kvittering og bekreftelse kommer med en gang, ingen bankoverføring til en fremmed.",
        },
        {
          title: "Tilvalg når du trenger det",
          body: "Servering, oppdekking og allergihensyn velges som tilvalg i bestillingen, med pris synlig for hvert tilvalg. Alt avklares før du bekrefter, ikke i e-posttråder etterpå.",
        },
        {
          title: "Vurderinger fra andre kunder",
          body: "Les omtaler fra andre som har bestilt fra leverandøren, og se hvordan maten og leveringen faktisk ble. Du velger på erfaring, ikke på magefølelse.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: bryllup i Rogaland",
          role: "Illustrasjon",
          headline: "Fra tilbudsjakt til bestilt meny på en kveld",
          body: "Slik kan det se ut: I stedet for å sende forespørsler til fem leverandører og vente på tilbud, søker paret på dato og område, sammenligner tre ledige leverandører med meny og pris per kuvert synlig, merker av for allergihensyn, og bestiller treretters middag til 80 gjester med Vipps og bekreftelse med en gang.",
          outcome: [
            { label: "Tilbud å vente på", value: "0" },
            { label: "Pris per kuvert", value: "Synlig før booking" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: firmafest med 60 gjester",
          role: "Illustrasjon",
          headline: "Tapas til hele avdelingen, uten e-posttråder",
          body: "Slik kan det se ut: En bedrift finner en tapasleverandør som er ledig på datoen, legger til servering og oppdekking som tilvalg med pris synlig, noterer allergihensyn i bestillingen, og betaler i samme flyt. Ingen lange e-posttråder for å avklare detaljene.",
          outcome: [
            { label: "E-posttråder", value: "Ingen" },
            { label: "Tilvalg", value: "Valgt i bestillingen" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps, kort eller faktura i samme flyt som bestillingen. Kvittering kommer med en gang.",
        },
        {
          label: "Ledig dato",
          value: "Leverandørens kalender viser om datoen din er ledig. Du bestiller direkte, uten forespørsel og venting på svar.",
        },
        {
          label: "Pris",
          value: "Pris per kuvert vises på hver meny. Tilvalg som servering og oppdekking prises tydelig før du bekrefter.",
        },
        {
          label: "Meny",
          value: "Koldtbord, tapas, grill, middag og kaker. Allergener og spesialkost er merket på menyene.",
        },
        {
          label: "Antall gjester",
          value: "Du oppgir antall kuverter i bestillingen. Eventuelt minimum antall står tydelig på leverandøren.",
        },
        {
          label: "Levering og servering",
          value: "Velg mellom levering, henting eller full servering med oppdekking, der leverandøren tilbyr det.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bestillingen er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å bestille.",
        },
      ]}
      pullQuote={{
        text: "Cateringleverandørene nær deg, samlet ett sted, med meny, pris per kuvert og ledig dato synlig før du bestiller. Ikke ti forespørsler og en uke med venting.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster catering per kuvert?",
          answer:
            "Prisen varierer med meny og antall gjester. Et enkelt koldtbord ligger ofte fra rundt 200 til 400 kroner per kuvert, tapas og buffet gjerne fra 300 til 500, og en flerretters middag fra 500 kroner og oppover. På Digilist ser du prisen per kuvert og prisen på tilvalg på hver leverandør før du bestiller.",
        },
        {
          question: "Hvordan bestiller jeg catering på Digilist?",
          answer:
            "Søk på sted og dato, sammenlign leverandører med meny og pris per kuvert synlig, og velg den som passer. Du oppgir antall gjester og eventuelle tilvalg, bestiller direkte og betaler med Vipps eller kort. Bekreftelsen kommer med en gang.",
        },
        {
          question: "Kan leverandøren ta hensyn til allergier og spesialkost?",
          answer:
            "Ja. Allergener er merket på menyene, og du noterer allergier og spesialkost som vegetar, vegansk eller glutenfritt direkte i bestillingen. Leverandøren får beskjeden sammen med bestillingen, så ingenting glipper i en e-posttråd.",
        },
        {
          question: "Er det et minimum antall gjester for catering?",
          answer:
            "Det varierer fra leverandør til leverandør. Mange har et minimum på 10 til 20 kuverter for levering, mens andre tar små bestillinger. Eventuelt minimum står tydelig på leverandørens side før du bestiller.",
        },
        {
          question: "Er servering og oppdekking inkludert?",
          answer:
            "Det avhenger av leverandøren. Noen leverer maten ferdig anrettet, andre tilbyr full servering med oppdekking og rydding som tilvalg. Hva som er inkludert, og hva tilvalgene koster, står synlig før du bekrefter bestillingen.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av leverandøren og står på hver meny før du bestiller. Der det er tillatt, avbestiller du digitalt, og refusjon følger reglene som gjelder for bestillingen din.",
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
