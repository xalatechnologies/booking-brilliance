import { useEffect } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cookies og informasjonskapsler · Digilist"
        description="Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies: ingen sporing, ingen tredjepart, full GDPR-suverenitet."
        canonical="https://digilist.no/cookies"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Cookies", url: "https://digilist.no/cookies" },
        ]}
      />
      <Navbar />

      <main id="main">
      {/* Content */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Informasjonskapsler (cookies)
            </h1>
            
            {/* Intro */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              Digilist benytter informasjonskapsler (cookies) og lignende teknologier for å sikre grunnleggende funksjonalitet, forbedre brukeropplevelsen og gi innsikt i hvordan tjenesten brukes.
            </p>

            {/* Hva er informasjonskapsler */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Hva er informasjonskapsler
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Informasjonskapsler er små tekstfiler som lagres på din enhet når du besøker en nettside. De brukes blant annet for å huske innstillinger, håndtere innlogging og sikre at tjenester fungerer som de skal.
              </p>
            </div>

            {/* Hvilke typer */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Hvilke typer informasjonskapsler brukes i Digilist
              </h2>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">
                Nødvendige informasjonskapsler
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Disse er påkrevd for at Digilist skal fungere korrekt. De brukes blant annet til:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>innlogging og autentisering</li>
                <li>sikkerhet og sesjonshåndtering</li>
                <li>gjennomføring av bookingflyt</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Disse informasjonskapslene kan ikke slås av.
              </p>

              <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">
                Analyse og statistikk (valgfritt)
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Digilist kan benytte analyseverktøy for å samle anonymisert informasjon om bruk av tjenesten, som for eksempel:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>antall besøk</li>
                <li>hvilke sider som benyttes</li>
                <li>generell bruksmønster</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Disse opplysningene brukes kun til å forbedre tjenesten og deles ikke for markedsføringsformål. Slike informasjonskapsler settes kun dersom du samtykker.
              </p>
            </div>

            {/* Tredjeparter */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Informasjonskapsler fra tredjeparter
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ved bruk av betalingsløsninger eller andre integrasjoner kan tredjeparts informasjonskapsler benyttes, for eksempel i forbindelse med betaling. Disse leverandørene behandler informasjon i henhold til sine egne personvernerklæringer og gjeldende regelverk.
              </p>
            </div>

            {/* Samtykke */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Samtykke til bruk av informasjonskapsler
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Når du besøker Digilist første gang, blir du bedt om å ta stilling til bruk av informasjonskapsler som ikke er strengt nødvendige. Du kan når som helst endre eller trekke tilbake ditt samtykke via innstillinger i nettleseren eller gjennom tilgjengelige valg i løsningen.
              </p>
            </div>

            {/* Slette/blokkere */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Hvordan slette eller blokkere informasjonskapsler
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Du kan selv administrere eller slette informasjonskapsler via innstillingene i din nettleser. Vær oppmerksom på at blokkering av nødvendige informasjonskapsler kan føre til at deler av Digilist ikke fungerer som forutsatt.
              </p>
            </div>

          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
