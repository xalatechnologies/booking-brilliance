import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, MapPin, Mail, ArrowRight, Building2, Globe, Briefcase, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const footerLinks = {
    navigasjon: [
      { label: "Verdi", hash: "#verdi" },
      { label: "Funksjonalitet", hash: "#funksjonalitet" },
      { label: "Teknologi", hash: "#teknologi" },
      { label: "Om oss", hash: "#om-oss" },
    ],
    juridisk: [
      { label: "Personvern", href: "/personvern", isRoute: true },
      { label: "Salgsvilkår", href: "/salgsvilkar", isRoute: true },
      { label: "Cookies", href: "/cookies", isRoute: true },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-secondary/30 via-secondary/20 to-background border-t border-border/50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-10 md:py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link 
              to="/" 
              className="group flex items-center gap-3 mb-6"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src="/logo.svg" 
                alt="Digilist" 
                className="h-12 w-auto transition-opacity group-hover:opacity-80"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-foreground tracking-tight">
                  DIGILIST
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  ENKEL BOOKING
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm text-sm leading-relaxed">
              En helhetlig og brukervennlig SaaS-løsning for booking og administrasjon. Utviklet med moderne design, betaling, kalender og rapportering i én plattform.
            </p>
            
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Navigasjon</h4>
            <ul className="space-y-3">
              {footerLinks.navigasjon.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.hash} 
                    onClick={(e) => handleNavClick(link.hash, e)}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Kontakt</h4>
            <div className="space-y-4">
              <a 
                href="tel:+4796665001" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground/80">Telefon</span>
                  <span className="font-semibold">+47 96 66 50 01</span>
                </div>
              </a>
              <a 
                href="mailto:kontakt@digilist.no" 
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground/80">E-post</span>
                  <span className="font-semibold">kontakt@digilist.no</span>
                </div>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground/80">Adresse</span>
                  <span className="font-semibold">Nesbruveien 75</span>
                  <span className="text-sm">1394 Nesbru</span>
                </div>
              </div>
            </div>
          </div>

          {/* Juridisk */}
          <div>
            <h4 className="font-bold text-foreground mb-6 text-lg">Juridisk</h4>
            <ul className="space-y-3">
              {footerLinks.juridisk.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="mt-6 pt-4 border-t border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} Digilist. Alle rettigheter forbeholdt.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Et produkt av</span>
              <a 
                href="https://xala.no" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10"
              >
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Xala Technologies AS
                </span>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
