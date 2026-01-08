import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CreditCard, Fingerprint, Accessibility, CheckCircle, Building2, Briefcase, Globe, Mail, Lock, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import heroBg from "@/assets/hero-bg.jpg";
import heroMockup from "@/assets/hero-mockup.png";

const PartnerLogo = ({ partner }: { partner: { name: string; logo: string } }) => {
  return (
    <div className="group flex items-center justify-center w-40 md:w-48 h-20 md:h-24 rounded-xl bg-white dark:bg-slate-100 backdrop-blur-sm border border-border/30 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 mx-4 px-4">
      <img 
        src={`/clients/${partner.logo}`}
        alt={partner.name}
        className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
};

const HeroSection = () => {
  const integrations = [
    { icon: CreditCard, label: "Vipps", color: "text-orange-500" },
    { icon: Fingerprint, label: "BankID", color: "text-blue-500" },
    { icon: Shield, label: "ISO 27001 & 27701", color: "text-primary" },
    { icon: Shield, label: "GDPR", color: "text-green-500" },
  ];

  const partners = [
    { name: "Altinn", logo: "altinn.svg" },
    { name: "Furst", logo: "furst.png" },
    { name: "Globelconnect", logo: "globelconnect.png" },
    { name: "NHN", logo: "nhn.svg" },
    { name: "Nordre Follo", logo: "nordre-follo.svg" },
    { name: "Norwegian", logo: "norwegian.svg" },
    { name: "NOV", logo: "nov2.svg" },
    { name: "OCHA", logo: "ocha.png" },
    { name: "Ruter", logo: "ruter.png" },
    { name: "Sparebank", logo: "sparebank.png" },
    { name: "SSB", logo: "ssb.svg" },
    { name: "Sykehuspartner", logo: "sykehuspartner.svg" },
    { name: "Telia", logo: "telia.png" },
    { name: "UNICEF", logo: "unicef.png" },
    { name: "USAID", logo: "usaid.png" },
  ];


  return (
    <section className="relative min-h-[75vh] flex items-center pt-24 pb-32 md:pt-28 md:pb-40 overflow-hidden section-border">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient-overlay" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 orb-large bg-primary/15 rounded-full blur-large animate-float" />
      <div className="absolute bottom-1/4 left-1/4 orb-medium bg-primary/8 rounded-full blur-large animate-float delay-slowest" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float delay-slow" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Heading */}
            <h1 className="animate-slide-up text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80 drop-shadow-lg">
                En helhetlig
              </span>{" "}
              <span className="text-foreground drop-shadow-md">bookingløsning</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up delay-normal text-xl md:text-2xl text-foreground/90 mb-10 max-w-2xl font-semibold leading-relaxed">
              Skybasert bookingløsning utviklet med moderne design, betaling, kalender og rapportering i én plattform.
            </p>

            {/* CTA Buttons */}
            <div className="animate-slide-up delay-slow flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => {
                  const element = document.getElementById('kontakt');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Button variant="hero" size="xl" className="group shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 w-full sm:w-auto">
                  Book gratis demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </button>
              <Button 
                variant="heroOutline" 
                size="xl"
                type="button"
                className="group shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('funksjonalitet');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Funksjonalitet
              </Button>
            </div>

            {/* Integrations & Certifications - Desktop Left Side */}
            <div className="hidden lg:block animate-slide-up delay-slower">
              <div className="text-xs text-foreground/80 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider">
                <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                <Globe className="w-3.5 h-3.5 text-primary animate-pulse" />
                Integrasjoner & Sertifisering
              </div>
              <div className="flex flex-wrap gap-2.5 justify-start">
                {integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-md border border-border/70 hover:border-primary/80 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 hover:scale-105"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center transition-all duration-300 group-hover:from-primary/30 group-hover:via-primary/25 group-hover:to-primary/20 group-hover:scale-110 shadow-sm`}>
                      <integration.icon className={`w-4 h-4 ${integration.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <span className="text-xs font-bold text-foreground leading-tight">{integration.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations & Certifications - Mobile */}
            <div className="lg:hidden animate-slide-up delay-slower">
              <div className="text-xs text-foreground/80 font-bold mb-3 flex items-center gap-2 uppercase tracking-wider">
                <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
                <Globe className="w-3.5 h-3.5 text-primary animate-pulse" />
                Integrasjoner & Sertifisering
              </div>
              <div className="flex flex-wrap gap-2.5">
                {integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-md border border-border/70 hover:border-primary/80 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 hover:scale-105"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center transition-all duration-300 group-hover:from-primary/30 group-hover:via-primary/25 group-hover:to-primary/20 group-hover:scale-110 shadow-sm ${integration.color.includes('primary') ? 'from-primary/25 via-primary/20 to-primary/15 group-hover:from-primary/35 group-hover:via-primary/30 group-hover:to-primary/25' : ''}`}>
                      <integration.icon className={`w-4 h-4 ${integration.color} transition-all duration-300 group-hover:scale-110`} />
                    </div>
                    <span className="text-xs font-bold text-foreground leading-tight">{integration.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in delay-slow ml-5">
            <div className="flex items-start justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img 
                src={heroMockup} 
                alt="DigiList booking platform mockup" 
                className="w-full h-auto max-w-3xl xl:max-w-4xl scale-110 xl:scale-125 drop-shadow-2xl hover:scale-[1.15] xl:hover:scale-[1.3] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Partner Strip */}
      <div className="absolute bottom-0 left-0 right-0 pt-4 pb-4 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm border-t border-border/30">
        <div className="relative flex w-full items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:80s]">
            {partners.map((partner, index) => (
              <PartnerLogo key={`${partner.name}-${index}`} partner={partner} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
