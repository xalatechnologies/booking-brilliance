import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Salgsvilkar = () => {
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
            Salgsvilkår
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Vilkår for bruk av DigiList sine tjenester
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
            
            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Om DigiList og utleieaktører
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                DigiList (<a href="https://www.digilist.no" className="text-primary hover:underline">www.digilist.no</a>) er en digital portal som formidler leie av lokaler og ressurser fra flere utleieaktører. Hver utleier er ansvarlig for sine utleieobjekter, inkludert drift, vedlikehold, tilgjengelighet, priser og egne vilkår. Når en booking blir bekreftet, kan utleier gi supplerende vilkår for bruk. Du må gjøre deg kjent med vilkårene før du bekrefter leie.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Bestilling og bekreftelse
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                En booking kan være enten direkte bekreftet eller sendes inn som forespørsel for godkjenning, avhengig av utleiers regler for det aktuelle utleieobjektet. Booking regnes som bindende når den er bekreftet av utleier, eller når betaling/aksept er gjennomført i henhold til flyten som gjelder for utleieobjektet.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Bruk av reservert leieobjekt
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Dersom leietaker ikke benytter et reservert leieobjekt i avtalt tidsrom, kan fullt leiebeløp belastes. Dersom leietaker benytter leieobjektet utover avtalt tid eller leverer tilbake utstyr/leieobjekt for sent, kan leietaker belastes for overtid/ekstra brukstid etter utleiers satser og regler.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Avbestilling og kansellering
              </h2>
              
              <div className="ml-4 space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    4.1 Forespørsler som venter på godkjenning
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Forespørsler som ikke er godkjent kan kanselleres av leietaker frem til utleier har behandlet forespørselen.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    4.2 Godkjente bookinger
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Utleier kan ha egne vilkår for avbestilling. Dersom booking er godkjent, kan kansellering kreve godkjenning fra utleier og eventuelle gebyrer kan gjelde i tråd med utleiers regler.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    4.3 Manglende avbestillingsvilkår
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dersom utleier ikke har oppgitt avbestillingsvilkår, kan leietaker normalt kansellere før leiestart uten å bli belastet for leie. Der utleier har oppgitt egne vilkår, gjelder disse.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    4.4 Force majeure
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Utleier og leietaker kan avbestille en reservasjon dersom gjennomføring hindres av forhold utenfor partenes kontroll, og som ikke med rimelighet kunne forutsees eller unngås (force majeure).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                5. Betaling
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Betaling i DigiList kan skje enten som forskuddsbetaling (kort eller Vipps) eller etterskuddsvis via faktura. Hvilken betalingsmetode som gjelder bestemmes av utleier for hvert utleieobjekt. Ved spørsmål om faktura eller betalingsbetingelser, må leietaker kontakte utleier.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                6. Kortbetaling
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Kortbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Kortbetaling behandles via betalingstjenesteleverandør (for eksempel Stripe). Betaling kan gjennomføres med vanlige debit- og kredittkort. Betalingsdata håndteres kryptert i henhold til leverandørens sikkerhetsmekanismer.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                7. Betaling med Vipps
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vippsbetaling gjennomføres etter at leie er godkjent, dersom utleieobjektet krever godkjenning. Dersom leie ikke krever godkjenning kan betaling skje umiddelbart ved bestilling. Ved Vipps-betaling kan beløpet reserveres i henhold til Vipps sine standardrutiner og overføres i tråd med avtalte betingelser mellom utleier og betalingsleverandør.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                8. Betaling med faktura
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Utleier kan ha egne rutiner for fakturering, inkludert tidspunkt for utsendelse, betalingsfrist, gebyrer og eventuell samlefakturering. Spørsmål om faktura, innhold, beløp eller betalingsstatus må rettes til utleier.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                9. Angrerett
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ved leie av lokaler og tjenester knyttet til fritidsaktiviteter eller arrangement som leveres på et bestemt tidspunkt eller innenfor en bestemt periode, gjelder normalt ikke angrerett etter angrerettreglene. Utleier kan likevel ha egne vilkår. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                10. Reklamasjon og ansvar
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                DigiList er en digital formidlingsplattform som kobler leietaker og utleier. DigiList er ikke part i leieforholdet mellom utleier og leietaker, og leier ikke ut lokaler eller utstyr i eget navn. Eventuelle reklamasjoner, innsigelser og erstatningskrav knyttet til leieobjektet eller leieforholdet håndteres direkte mellom leietaker og utleier.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Utleier er ansvarlig for at utleieobjektet beskrives korrekt, og at informasjon om tilstand, bruksområde og vilkår er oppdatert.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                11. Refusjon
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Utleier kan ha egne vilkår for refusjon, for eksempel dersom leieobjektet ikke er i forventet stand eller ikke kan benyttes som avtalt. Leietaker må gjøre seg kjent med utleiers vilkår før booking bekreftes.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                12. Utestengelse fra DigiList
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Bruk av DigiList forutsetter at vilkårene overholdes, samt gjeldende lov og forskrift. DigiList kan begrense eller stenge en brukers tilgang til hele eller deler av tjenesten ved brudd på vilkårene, misbruk, forsøk på svindel, eller handlinger som kan skade tjenestens integritet eller andre brukere. Bruker kan når som helst avslutte bruk av tjenesten ved å stenge sin konto der dette tilbys.
              </p>
            </div>

            {/* Section 13 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                13. Utestengelse hos enkeltutleier
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Utleiere kan ha egne rutiner for å avvise eller utestenge leietakere fra sine utleieobjekter, basert på interne retningslinjer eller tidligere kundeforhold. Slik utestengelse gjelder kun for den aktuelle utleieren.
              </p>
            </div>

            {/* Dates */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Opprettet: 07.01.2026
              </p>
              <p className="text-sm text-muted-foreground">
                Sist publisert: 07.01.2026
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Salgsvilkar;
