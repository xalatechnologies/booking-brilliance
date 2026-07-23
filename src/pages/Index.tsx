import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketplaceSection from "@/components/MarketplaceSection";
import { GrainOverlay, ProgressRail } from "@/components/editorial";
import { SideRails } from "@/components/editorial/SideRails";
import { HOMEPAGE_FAQ } from "@/content/faq";

// Below-the-fold homepage sections — lazy so the initial hydration only
// has to run the JS for what's visible without scrolling (Hero + the
// marketplace tiles). The SSR prerender loop (entry-server.tsx) still
// resolves this Suspense boundary into real static HTML at build time, so
// there's no fallback flash for real visitors or crawlers; it just delays
// *hydrating* this subtree until its chunk loads, which cuts the JS the
// browser must parse/execute before the page becomes interactive.
const AiAgentsSection = lazy(() => import("@/components/AiAgentsSection"));
const B2BLaneSection = lazy(() => import("@/components/B2BLaneSection"));
const ChannelSyncSection = lazy(() => import("@/components/ChannelSyncSection"));
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const BrukerhistorierSection = lazy(() => import("@/components/BrukerhistorierSection"));
const BlogPreviewSection = lazy(() => import("@/components/BlogPreviewSection"));
const HomepageFAQSection = lazy(() => import("@/components/HomepageFAQSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

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
        <Suspense fallback={null}>
          <AiAgentsSection />
          <B2BLaneSection />
          <ChannelSyncSection />
          <HowItWorksSection />
          <BrukerhistorierSection />
          <BlogPreviewSection />
          <HomepageFAQSection />
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
