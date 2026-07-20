import UseCasePage from "@/components/UseCasePage";

export default function TjenesteMusiker() {
  return (
    <UseCasePage
      basePath="/tjenester"
      parentCrumb={{ name: "Tjenester", path: "/tjenester" }}
      sectionLabel="TJENESTER"
      slug="musiker"
      breadcrumb="Musiker"
      title="Leie musiker"
      dek="Livemusikk, band eller solist til bryllup og selskap. Finn ledig musiker nær deg, se pris, og book med Vipps."
      lead="Skal du ha livemusikk til bryllupet, selskapet eller arrangementet, starter letingen ofte hos bekjente, i Facebook-grupper og på spredte nettsider. Prisen er uklar til du har sendt e-post og ventet på tilbud, du vet ikke om musikeren er ledig på datoen din, og det er vanskelig å vurdere sjanger og besetning uten å ha hørt dem. På Digilist er musikere, band, solister og trioer samlet ett sted, med sjanger, besetning, pris og ledig dato synlig, og du booker trygt med Vipps."
      seoTitle="Leie musiker eller band til bryllup og fest | Digilist"
      seoDescription="Leie musiker eller band til bryllup og selskap: se sjanger, besetning og pris, sjekk ledig dato og book med Vipps. Finn ledige musikere nær deg, samlet ett sted."
      keywords="leie musiker, leie band, leie band til bryllup, musiker til bryllup, live musikk bryllup, leie artist, leie solist, musiker til selskap, book band"
      audience={[
        {
          persona: "Brudepar",
          context: "Dere vil ha levende musikk til vielsen og et band som løfter festen, med repertoar, pris og spilletid avklart lenge før dagen.",
        },
        {
          persona: "Jubileum og private selskaper",
          context: "Rund dag, jubileum eller fest. Du vil ha en musiker eller trio som treffer stemningen, uten å måtte kjenne noen i bransjen.",
        },
        {
          persona: "Bedrifter",
          context: "Julebord, sommerfest eller kundearrangement. Dere trenger profesjonell underholdning med ryddig pris og en bekreftelse regnskapet godtar.",
        },
        {
          persona: "Begravelse og minnestund",
          context: "En solist eller musiker som spiller vakkert og verdig, booket enkelt i en periode der du har mer enn nok å tenke på.",
        },
      ]}
      problems={[
        "Musikere finnes via bekjente, Facebook-grupper og spredte nettsider, uten ett sted å søke og sammenligne.",
        "Prisen er uklar til du har sendt forespørsel og ventet på tilbud, ofte i flere dager.",
        "Du vet ikke om musikeren eller bandet faktisk er ledig på datoen din før noen svarer.",
        "Det er vanskelig å vurdere sjanger, repertoar og besetning uten lydprøver eller referanser.",
        "Avtale og betaling skjer ofte uformelt, uten kvittering, vilkår eller trygghet hvis noe endrer seg.",
      ]}
      features={[
        {
          title: "Musikere og band samlet ett sted",
          body: "Solister, duoer, trioer og fulle band i ditt område, samlet på ett sted. Du slipper å lete via bekjente og spredte grupper.",
        },
        {
          title: "Sjanger, besetning og pris synlig",
          body: "Hver profil viser sjanger, repertoar, besetning og pris for din type arrangement, før du tar kontakt eller booker.",
        },
        {
          title: "Ledig dato i sanntid",
          body: "Kalenderen viser hvilke datoer musikeren faktisk er ledig. Du booker direkte og får bekreftelsen med en gang, uten å vente på svar.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen. Kvittering og bekreftelse kommer automatisk, ingen kontanter eller uformell overføring.",
        },
        {
          title: "Lydprøver og klipp",
          body: "Hør lydprøver og se klipp fra tidligere spillejobber, så du vet hvordan musikeren låter før du bestemmer deg.",
        },
        {
          title: "Vurderinger fra andre kunder",
          body: "Les omtaler fra andre som har booket samme musiker eller band, til bryllup, selskaper og firmaarrangementer.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: brudepar på Østlandet",
          role: "Illustrasjon",
          headline: "Solist til vielsen og band til festen",
          body: "Slik kan det se ut: Paret søker på dato og område, hører lydprøver fra tre solister til vielsen og to band til festen, ser pris og besetning på hver profil, og booker begge med Vipps samme kveld, med sangønsker sendt inn i god tid før dagen.",
          outcome: [
            { label: "Lydprøver hørt", value: "Før booking" },
            { label: "Pris", value: "Synlig på forhånd" },
            { label: "Bekreftelse", value: "Med en gang" },
          ],
        },
        {
          customer: "Eksempel: julebord i en mellomstor bedrift",
          role: "Illustrasjon",
          headline: "Trio booket i arbeidstiden",
          body: "Slik kan det se ut: Den som har ansvar for julebordet finner en jazztrio med ledig dato, ser pris per sett og hva som er inkludert av utstyr, booker med kort og har kvittering og bekreftelse klar til regnskapet, uten en eneste telefonrunde.",
          outcome: [
            { label: "Telefonrunder", value: "0" },
            { label: "Kvittering", value: "Automatisk" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Kvittering kommer automatisk, ingen kontanter eller uformell overføring.",
        },
        {
          label: "Ledig dato",
          value: "Sanntidskalender per musiker og band. Du ser hvilke datoer som er ledige og booker direkte.",
        },
        {
          label: "Pris",
          value: "Pris vises per opptreden eller per sett, med eventuelle tillegg for reise og utstyr synlig før du bekrefter.",
        },
        {
          label: "Besetning",
          value: "Solist, duo, trio eller fullt band. Besetningen står på profilen, og mange tilbyr flere formater.",
        },
        {
          label: "Sjanger og repertoar",
          value: "Sjanger, repertoarliste og mulighet for sangønsker står på hver profil, slik at du vet hva du får.",
        },
        {
          label: "Spilletid og pauser",
          value: "Antall sett, lengde per sett og pauser avtales i bookingen og står i bekreftelsen.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til deg, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Du deler kun det som trengs for å booke.",
        },
      ]}
      pullQuote={{
        text: "Musikere, band og solister nær deg, samlet ett sted, med sjanger, pris og ledig dato synlig før du booker. Ikke jakt via bekjente og ubesvarte meldinger.",
        byline: "Slik er Digilist ment å fungere for deg som skal booke",
      }}
      faq={[
        {
          question: "Hva koster det å leie musiker eller band?",
          answer:
            "Prisen varierer med besetning, spilletid og reisevei. En solist til en vielse ligger ofte fra noen tusen kroner, mens et fullt band til en hel kveld gjerne koster fra ti tusen og oppover. På Digilist ser du prisen på hver profil før du booker, med eventuelle tillegg synlig.",
        },
        {
          question: "Kan jeg ønske meg bestemte sanger til vielsen?",
          answer:
            "Ja, de fleste solister og musikere tar imot sangønsker. Repertoaret står på profilen, og du kan sende ønsker i bookingen. Er sangen utenfor repertoaret, avklarer dere det direkte med musikeren i god tid før dagen.",
        },
        {
          question: "Bør jeg velge solist, trio eller fullt band?",
          answer:
            "Det avhenger av anledning, lokale og budsjett. En solist passer fint til vielser, minnestunder og mindre selskaper, en trio gir mer fylde uten å ta stor plass, og et fullt band løfter dansegulvet i bryllup og på firmafest. Besetningen står på hver profil, og mange tilbyr flere formater.",
        },
        {
          question: "Har musikerne eget lyd- og lysutstyr?",
          answer:
            "De fleste band og musikere stiller med eget utstyr til vanlige selskapslokaler, og det står på profilen hva som er inkludert. Til større lokaler eller utendørs arrangementer kan det være behov for ekstra anlegg, avklar det i bookingen.",
        },
        {
          question: "Hvor lenge spiller et band i et bryllup eller selskap?",
          answer:
            "Et vanlig oppsett er to til tre sett på 45 minutter med pauser imellom, ofte med mulighet for ekstra sett. Spilletid og pauser avtales i bookingen og står i bekreftelsen, så begge parter vet hva som gjelder.",
        },
        {
          question: "Kan jeg avbestille hvis noe endrer seg?",
          answer:
            "Avbestillingsreglene settes av musikeren og står på profilen før du booker. Der det er tillatt, avbestiller du digitalt, og en eventuell refusjon følger reglene som gjelder for bookingen.",
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
