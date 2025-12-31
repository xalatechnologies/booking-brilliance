import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section id="kontakt" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-medium text-primary mb-4 block">Kom i gang i dag</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Klar til å komme i gang?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Book en demo eller ta kontakt for å se hvordan Digilist kan hjelpe din organisasjon.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Book demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl" className="group">
              <Mail className="w-5 h-5" />
              Ta kontakt
            </Button>
          </div>

          <p className="mt-8 text-muted-foreground text-sm">
            Gratis demo • Ingen forpliktelser
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
