import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Personvern = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Personvernerklæring og informasjonskapsler
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            DigiList
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            
            {/* Intro */}
            <p className="text-muted-foreground leading-relaxed mb-10">
              Denne personvernerklæringen beskriver hvordan DigiList behandler personopplysninger i forbindelse med bruk av tjenesten. Erklæringen gir informasjon du har krav på når DigiList samler inn personopplysninger, samt generell informasjon om hvordan opplysningene behandles i henhold til personvernforordningen (GDPR).
            </p>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Behandlingsansvarlig
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Behandlingsansvarlig er den virksomheten eller organisasjonen som tilbyr utleie av lokaler eller ressurser gjennom DigiList, og som bestemmer formålet med behandlingen av personopplysninger og hvilke hjelpemidler som benyttes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hvem som er behandlingsansvarlig for en konkret booking fremgår av informasjonen knyttet til det aktuelle utleieobjektet.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Databehandler
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                DigiList fungerer som teknisk plattform og er databehandler på vegne av utleier (behandlingsansvarlig).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">Databehandler:</p>
              <p className="text-muted-foreground leading-relaxed">Xala Technologies AS</p>
              <p className="text-muted-foreground leading-relaxed mb-4">Organisasjonsnummer: 920 972 454</p>
              <p className="text-muted-foreground leading-relaxed">
                DigiList behandler personopplysninger kun i henhold til inngåtte databehandleravtaler og gjeldende regelverk.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Underleverandører og drift
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                DigiList benytter underleverandører for drift, lagring og teknisk infrastruktur. Personopplysninger lagres på servere lokalisert innen EU/EØS og behandles i samsvar med gjeldende personvernregler.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">Underleverandører kan blant annet benyttes til:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>drift og hosting</li>
                <li>betalingsformidling</li>
                <li>utsendelse av varsler</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Alle underleverandører er underlagt databehandleravtaler som sikrer tilfredsstillende informasjonssikkerhet.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Hvordan og hvorfor samles personopplysninger inn
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Når du oppretter en bruker i DigiList eller benytter tjenesten for å booke lokaler, blir du bedt om å oppgi personopplysninger som lagres i løsningen. Ved bruk av tilgjengelige innloggingsmetoder samtykker du til at DigiList kan motta nødvendige identitets- og kontaktopplysninger.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-2">Enkelte utleiere kan kreve ytterligere autentisering for å:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>bekrefte identitet</li>
                <li>verifisere alder</li>
                <li>sikre korrekt fakturering</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-2">Personopplysninger benyttes blant annet for å:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>muliggjøre kontakt mellom leietaker og utleier</li>
                <li>gjennomføre og administrere bookinger</li>
                <li>håndtere betaling og fakturering</li>
                <li>sende varsler knyttet til booking og tilgang</li>
                <li>sikre sporbarhet og etterlevelse av lovpålagte krav</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                DigiList vil aldri selge eller leie ut personopplysninger til tredjepart for markedsføringsformål.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Deling av personopplysninger
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kontaktopplysninger deles med aktuell utleier i forbindelse med booking.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Betalingsopplysninger behandles av godkjente betalingsleverandører og deles ikke med utleier utover det som er nødvendig for fakturering og oppfølging.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Hvilke personopplysninger behandles
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">For å kunne bruke DigiList kan følgende opplysninger behandles:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>navn</li>
                <li>mobilnummer</li>
                <li>e-postadresse</li>
                <li>alder eller alderskategori</li>
                <li>adresse (der dette kreves av utleier)</li>
                <li>organisasjonsnummer (for organisasjoner)</li>
                <li>booking- og transaksjonshistorikk</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Betalingsopplysninger behandles av eksterne betalingsleverandører i henhold til deres egne vilkår og sikkerhetsrutiner.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Informasjonskapsler (cookies)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                DigiList benytter informasjonskapsler og lignende teknologier for å sikre funksjonalitet og forbedre brukeropplevelsen. Dette kan blant annet omfatte:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>tekniske sesjonskapsler</li>
                <li>midlertidige identifikatorer knyttet til pågående bestillinger</li>
                <li>analyse av bruksmønstre</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Informasjonskapsler benyttes ikke til markedsføring uten særskilt samtykke.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Lagringstid
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">Opplysninger knyttet til bookinger lagres så lenge det er nødvendig for å:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>oppfylle avtaleforpliktelser</li>
                <li>oppfylle lovpålagte krav, herunder regnskaps- og arkivplikt</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Brukeropplysninger lagres frem til brukeren selv sletter sin konto, med mindre lengre lagring er påkrevd etter lov.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Rett til innsyn
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Som innlogget bruker har du rett til innsyn i hvilke personopplysninger som er lagret om deg. Dette kan gjøres via din brukerkonto.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Dataportabilitet
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Du har rett til å få utlevert personopplysninger du har gitt DigiList i et strukturert og maskinlesbart format, der dette er teknisk mulig og rettslig grunnlag foreligger.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Retting, sletting og begrensning
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Du kan selv rette uriktige eller ufullstendige opplysninger via din brukerkonto.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Du kan også be om sletting av konto og personopplysninger. Enkelte opplysninger kan ikke slettes umiddelbart dersom lagring er påkrevd etter lov.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Samtykke
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ved å ta i bruk DigiList samtykker du til behandling av personopplysninger som beskrevet i denne erklæringen. Dersom du ikke samtykker, kan du benytte tjenesten til å søke og se tilgjengelighet, men ikke gjennomføre booking.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Samtykke kan trekkes tilbake når som helst ved å slette brukerkontoen.
              </p>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Endringer i personvernerklæringen
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                DigiList kan oppdatere denne personvernerklæringen ved endringer i tjenesten eller regelverket. Oppdatert versjon publiseres på nettsiden.
              </p>
            </div>

            {/* Dates */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Opprettet: 07.01.2026
              </p>
              <p className="text-sm text-muted-foreground">
                Sist oppdatert: 07.01.2026
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Personvern;
