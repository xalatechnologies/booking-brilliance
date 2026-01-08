import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import AudienceSection from "@/components/AudienceSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationsSection from "@/components/IntegrationsSection";
import TechnologyStackSection from "@/components/TechnologyStackSection";
import ArchitectureSection from "@/components/ArchitectureSection";
import AboutUsSection from "@/components/AboutUsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };

    // Handle initial hash
    scrollToHash();

    // Handle hash changes
    const handleHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Navbar />
      <HeroSection />
      <ValuePropositionSection />
      <AudienceSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <TechnologyStackSection />
      <ArchitectureSection />
      <AboutUsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
