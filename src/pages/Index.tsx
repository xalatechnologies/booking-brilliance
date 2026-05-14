import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import AudienceSection from "@/components/AudienceSection";
import BrukerhistorierSection from "@/components/BrukerhistorierSection";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import TechnologyStackSection from "@/components/TechnologyStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import AboutUsSection from "@/components/AboutUsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { GrainOverlay, ProgressRail } from "@/components/editorial";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };

    scrollToHash();

    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        faq={[
          {
            question: "Hva er Digilist?",
            answer:
              "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning.",
          },
          {
            question: "Hvilke kommuner og utleiere bruker Digilist?",
            answer:
              "Digilist brukes av norske kommuner og private utleiere — blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group.",
          },
          {
            question: "Hvilke betalingsmetoder støttes?",
            answer:
              "Digilist støtter Vipps, BankID, Stripe Connect for kort, samt EHF/Peppol-fakturering. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap er aktive.",
          },
          {
            question: "Er Digilist GDPR- og ISO-sertifisert?",
            answer:
              "Ja. Digilist oppfyller GDPR, er ISO 27001 og ISO 27701 sertifisert og følger WCAG 2.0 AA for universell utforming. Data lagres i Norge og EU.",
          },
          {
            question: "Hvordan håndteres sesongleie til lag og foreninger?",
            answer:
              "Digilist har en egen sesongleie-modul med søknadsbehandling, regelstyrt fordeling og rapportering. Lag og foreninger søker via egen portal, og fordelingen kan automatiseres etter kommunens regler.",
          },
          {
            question: "Støtter Digilist sanntidstilgjengelighet?",
            answer:
              "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid. Endringer fra bookinger, avlysninger eller administrasjon oppdateres umiddelbart hos innbyggere og saksbehandlere.",
          },
        ]}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
        ]}
        aboutPage
        service
        howTo={{
          name: "Slik booker du med Digilist",
          description:
            "Fra forespørsel til oppgjør på fire steg — gjennom Digilist-plattformen.",
          steps: [
            {
              name: "Søknad",
              text: "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart.",
            },
            {
              name: "Godkjenning",
              text: "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie.",
            },
            {
              name: "Bekreftelse",
              text: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller — vaktmester, renhold, vekter — varsles automatisk.",
            },
            {
              name: "Oppfølging",
              text: "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform.",
            },
          ],
        }}
      />
      <ProgressRail />
      <GrainOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <ValuePropositionSection />
        <AudienceSection />
        <BrukerhistorierSection />
        <PilotInvitationSection />
        <BlogPreviewSection />
        <HowItWorksSection />
        <IntegrationsSection />
        <TechnologyStackSection />
        <ArchitectureSection />
        <AboutUsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
