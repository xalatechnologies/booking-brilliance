import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section id="kontakt" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 orb-large bg-primary/15 rounded-full blur-large" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-heading mb-6">
            Book gratis demo
          </h2>
          <p className="text-xl text-foreground/80 mb-10 font-medium">
            Vi tilbyr en gratis og uforpliktende presentasjon av Digilist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-demo">
              <Button variant="hero" size="xl" className="group shadow-lg">
                Book demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group shadow-md">
              <Mail className="w-5 h-5" />
              Ta kontakt
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
