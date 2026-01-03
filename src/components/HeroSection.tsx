import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CreditCard, Fingerprint } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import heroMockup from "@/assets/hero-mockup.png";

const HeroSection = () => {
  const certifications = [
    { icon: CreditCard, label: "Vipps", color: "text-orange-500" },
    { icon: Fingerprint, label: "BankID", color: "text-foreground" },
    { icon: Shield, label: "GDPR", color: "text-primary" },
    { icon: Shield, label: "ISO 27001", color: "text-foreground" },
    { icon: Shield, label: "ISO 27701", color: "text-foreground" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient-overlay" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 orb-large bg-primary/10 rounded-full blur-large animate-float" />
      <div className="absolute bottom-1/4 left-1/4 orb-medium bg-primary/5 rounded-full blur-large animate-float delay-slowest" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Smart booking. Enkelt for alle.</span>
            </div>

            {/* Heading */}
            <h1 className="animate-slide-up text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gradient">En helhetlig</span>{" "}
              <span className="text-foreground">bookingløsning</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up delay-normal text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
              Skybasert bookingløsning utviklet med moderne design, betaling, kalender og rapportering i én plattform.
            </p>

            {/* CTA Buttons */}
            <div className="animate-slide-up delay-slow flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/book-demo">
                <Button variant="hero" size="xl" className="group">
                  Mer om DigiList
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl">
                Kontakt oss
              </Button>
            </div>

            {/* Certifications */}
            <div className="animate-slide-up delay-slower">
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Integrasjoner & Sertifisering
              </p>
              <div className="flex flex-wrap gap-6">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <cert.icon className={`w-5 h-5 ${cert.color}`} />
                    <span className="text-sm font-medium text-foreground">{cert.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in delay-slow">
            <img 
              src={heroMockup} 
              alt="DigiList booking platform mockup" 
              className="w-full h-auto max-w-3xl xl:max-w-4xl scale-125 xl:scale-150 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
