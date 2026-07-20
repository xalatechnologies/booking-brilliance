import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketplaceSection from "@/components/MarketplaceSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import AudienceSection from "@/components/AudienceSection";
import BrukerhistorierSection from "@/components/BrukerhistorierSection";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AiAgentsSection from "@/components/AiAgentsSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import TechnologyStackSection from "@/components/TechnologyStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import AboutUsSection from "@/components/AboutUsSection";
import CTASection from "@/components/CTASection";
import HomepageFAQSection from "@/components/HomepageFAQSection";
import Footer from "@/components/Footer";
import { GrainOverlay, ProgressRail } from "@/components/editorial";
import { SideRails } from "@/components/editorial/SideRails";
import { HOMEPAGE_FAQ } from "@/content/faq";

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
        faq={HOMEPAGE_FAQ.map((e) => ({ question: e.q, answer: e.a }))}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
        ]}
        aboutPage
        service
        howTo={{
          name: "Slik booker du med Digilist",
          description:
            "Fra forespørsel til oppgjør på fire steg, gjennom Digilist-plattformen.",
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
              text: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller (vaktmester, renhold, vekter) varsles automatisk.",
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
      <SideRails />
      <Navbar />
      <main id="main">
        <HeroSection />
        <MarketplaceSection />
        <ValuePropositionSection />
        <AudienceSection />
        <BrukerhistorierSection />
        <PilotInvitationSection />
        <BlogPreviewSection />
        <HowItWorksSection />
        <AiAgentsSection />
        <IntegrationsSection />
        <TechnologyStackSection />
        <ArchitectureSection />
        <AboutUsSection />
        <HomepageFAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
