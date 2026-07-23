import UseCasePage from "@/components/UseCasePage";
import { OccasionGuide } from "@/components/OccasionGuide";

export default function LeieDaap() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="daap"
      breadcrumb="Dåp og navnefest"
      title="Leie lokale til dåp og navnefest"
      dek="Dåpsselskap eller navnefest? Finn et hyggelig lokale nær kirken eller seremonistedet, se pris og book på nett."
      lead="Etter dåpen eller navnefesten samles familie og nære venner til et selskap, ofte en lunsj eller et koldtbord midt på dagen. De fleste dåpsselskaper er mindre enn bryllup og konfirmasjoner, men de gode lokalene nær kirken går fort, særlig på lørdager og søndager i vår og høst. På Digilist finner du selskapslokaler, kaféer, grendehus og gårder samlet ett sted, med ledige datoer i sanntid, ekte pris for din dato og trygg betaling med Vipps, slik at du kan sikre datoen tidlig og bruke tiden på selve feiringen."
      seoTitle="Leie lokale til dåp og navnefest: pris og booking | Digilist"
      seoDescription="Leie lokale til dåp eller navnefest: finn et hyggelig, ledig lokale nær kirken, se ekte pris for din dato og book med Vipps. Selskapslokaler og kaféer samlet."
      keywords="leie lokale til dåp, dåpsselskap lokale, barnedåp lokale, navnefest lokale, leie lokale til dåpsselskap, leie lokale til navnefest, dåp selskap lokale"
      audience={[
        { persona: "Foreldre og faddere", context: "Dere planlegger dåpsselskapet for familie og nære venner og trenger et hyggelig lokale nær kirken, med plass til et koldtbord og en pris dere kan stole på." },
        { persona: "Familier med navnefest", context: "En borgerlig navnefest eller feiring uten seremoni i kirken. Et lokale i nærområdet med god plass og mulighet for egen mat eller catering." },
        { persona: "Besteforeldre som arrangerer", context: "Dere ordner selskapet på vegne av småbarnsfamilien og vil ha et lokale som er enkelt å booke, med tydelig pris og ledige datoer." },
      ]}
      problems={[
        "Lokaler som passer til et mindre dåpsselskap ligger spredt på Finn, Facebook og kaféenes egne sider, uten ett sted å søke.",
        "Prisen for en lunsj eller et koldtbord er sjelden synlig før du har sendt forespørsel og ventet på svar.",
        "De gode lokalene nær kirken går fort på helgene i vår og høst, men du vet ikke hva som er ledig før noen svarer.",
        "Betaling skjer ofte med bankoverføring til en privatperson, uten kvittering eller trygghet.",
        "Om lokalet er barnevennlig, har stellemulighet og plass til barnevogner er vanskelig å vite på forhånd.",
      ]}
      features={[
        { title: "Passende lokaler nær deg, ett søk", body: "Selskapslokaler, kaféer, grendehus og gårder som egner seg til dåp og navnefest, samlet ett sted, uten leting flere steder." },
        { title: "Ekte pris for din dato", body: "Se totalprisen for din dato og varighet før du booker, inkludert eventuelt depositum. Ingen prissjokk etter at invitasjonene er sendt." },
        { title: "Ledige datoer i sanntid", body: "Kalenderen viser hvilke helgedager som faktisk er ledige, slik at du sikrer datoen nær kirken før noen andre." },
        { title: "Trygg betaling med Vipps", body: "Betal med Vipps eller kort i samme flyt. Depositum håndteres digitalt og frigjøres automatisk etter selskapet." },
        { title: "Barnevennlige fasiliteter synlig", body: "Se hva lokalet tilbyr av plass til barnevogner, stellemulighet og kjøkken, før du booker." },
        { title: "Egen mat eller catering", body: "Velg lokaler med eget kjøkken for koldtbord og kaker, eller catering-vennlige lokaler om du vil slippe å lage maten selv." },
      ]}
      stories={[
        { customer: "Familie i Trondheim", role: "Foreldre", headline: "Booket dåpsselskapet tre måneder før", body: "De fant en kafé med selskapsrom nær kirken, så at søndagen var ledig og at prisen for et koldtbord passet, og booket direkte med Vipps.", outcome: [{ label: "Gjester", value: "35" }, { label: "Betaling", value: "Vipps" }] },
        { customer: "Besteforeldre på Jæren", role: "Arrangør", headline: "Ordnet navnefest for barnebarnet", body: "De ordnet et grendehus med kjøkken slik at familien kunne lage maten selv, med tydelig pris og ledig dato på ett sted.", outcome: [{ label: "Lokale", value: "Grendehus" }, { label: "Mat", value: "Eget kjøkken" }] },
      ]}
      technical={[
        { label: "Lokaltyper", value: "Selskapslokale, kafé, grendehus, gård" },
        { label: "Booking", value: "Sanntidskalender, direkte bekreftelse" },
        { label: "Betaling", value: "Vipps og kort, digitalt depositum" },
        { label: "Fasiliteter", value: "Kjøkken, barnevennlig der lokalet tilbyr det" },
      ]}
      pullQuote={{ text: "Vi fant en kafé med selskapsrom nær kirken og booket søndagen på nett, uten en eneste telefon.", byline: "Forelder, dåpsselskap" }}
      faq={[
        { question: "Hvor kan jeg leie lokale til dåp?", answer: "Selskapslokaler, kaféer med selskapsrom, grendehus og gårder leies ofte ut til dåpsselskap. På Digilist finner du passende lokaler nær kirken samlet ett sted, med ledige datoer og pris for din dato." },
        { question: "Hva koster det å leie lokale til dåpsselskap?", answer: "Prisen varierer med type lokale, sted, varighet og servering. Et grendehus med eget kjøkken ligger ofte lavest, mens en kafé eller et selskapslokale med servering koster mer. På Digilist ser du totalprisen for din dato før du booker." },
        { question: "Når bør jeg booke lokale til dåp?", answer: "De gode lokalene nær kirken går fort på lørdager og søndager i vår og høst. Med en sanntidskalender ser du med én gang om helgedagen din er ledig, og kan sikre den tidlig i stedet for å vente på svar." },
        { question: "Er lokalene barnevennlige?", answer: "Mange dåpsselskaper har små barn til stede. På hvert lokale ser du informasjon om plass til barnevogner, stellemulighet og kjøkken der utleier har oppgitt det, slik at du kan velge et lokale som passer familien." },
        { question: "Kan jeg lage maten selv?", answer: "Ja. Velger du et lokale med eget kjøkken kan du lage koldtbord og kaker selv. Vil du slippe det, finner du også catering-vennlige lokaler." },
      ]}
      relatedPosts={[
        { title: "Leie selskapslokale til bryllup eller fest", slug: "leie-selskapslokale-bryllup-fest" },
        { title: "Leie lokale i kommunen etter anledning", slug: "leie-lokale-kommune-anledning-guide-innbygger" },
        { title: "Sammenlign lokaltyper og reell pris", slug: "leie-lokale-billigst-kommune-sammenlign-lokaltyper" },
      ]}
      siblings={[
        { title: "Selskapslokale", slug: "selskapslokale" },
        { title: "Bursdagslokale", slug: "bursdagslokale" },
        { title: "Kulturhus og grendehus", slug: "kulturhus" },
        { title: "Gård og låve", slug: "gaard" },
      ]}
      extra={
        <OccasionGuide
          author="Ibrahim Rahmani"
          role="Grunnlegger, Digilist"
          updated="23. juli 2026"
          heading="Slik planlegger du dåpsselskapet"
          intro={[
            "Dåpsselskapet holdes gjerne rett etter seremonien, ofte som en lunsj eller et koldtbord midt på dagen. De fleste selskapene er mindre enn bryllup og konfirmasjoner, med familie og nære venner, men de gode lokalene nær kirken går fort på helgene i vår og høst.",
            "Velg lokale ut fra antall gjester, om dere vil lage maten selv eller bruke catering, og hvor nær kirken eller seremonistedet dere ønsker å være. Har dere med små barn, er det verdt å sjekke om lokalet har plass til barnevogner og stellemulighet.",
          ]}
          checklist={[
            "Anslå antall gjester — de fleste dåpsselskaper er mindre, ofte 20–40.",
            "Velg et lokale nær kirken eller seremonistedet.",
            "Bestem egen matlaging eller catering, og sjekk om lokalet har kjøkken.",
            "Sjekk barnevennlige fasiliteter: plass til barnevogner og stellemulighet.",
            "Se pris og ledig dato, og book og betal på nett med Vipps.",
          ]}
          guidance={[
            { label: "Når bør du booke", value: "2–4 måneder før. Helgedager nær kirken i vår og høst går først." },
            { label: "Typisk antall gjester", value: "Ofte 20–40 — mindre enn bryllup og konfirmasjon." },
            { label: "Prisnivå", value: "Grendehus med eget kjøkken ligger ofte lavest; kaféer og selskapslokaler med servering høyere. Se totalprisen for din dato før du booker." },
            { label: "Format", value: "Vanligvis lunsj eller koldtbord midt på dagen. Sjekk at lokalet har nok plass og kjøkken." },
            { label: "Med barn", value: "Se etter plass til barnevogner og stellemulighet på lokalet." },
          ]}
          stat={{ value: "Rundt 50 000", label: "barn blir født i Norge hvert år, og mange markeres med dåp eller navnefest.", source: "Statistisk sentralbyrå (SSB), antall fødte" }}
          links={[
            { label: "Leie selskapslokale", to: "/leie/selskapslokale" },
            { label: "Leie kulturhus og grendehus", to: "/leie/kulturhus" },
            { label: "Leie gård og låve", to: "/leie/gaard" },
            { label: "Bookingsystem for utleie", to: "/bookingsystem-utleie" },
            { label: "Alle lokaler til leie", to: "/leie" },
          ]}
        />
      }
    />
  );
}
