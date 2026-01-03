import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

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
      { label: "Om oss", hash: "#om-oss" },
      { label: "Funksjoner", hash: "#funksjoner" },
      { label: "Partnere", hash: "#partnere" },
      { label: "Kontakt", hash: "#kontakt" },
    ],
    juridisk: [
      { label: "Personvern", href: "#personvern" },
      { label: "Vilkår", href: "#vilkar" },
      { label: "Cookies", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="mb-6 inline-block">
              <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Digi<span className="text-primary">list</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              En helhetlig og brukervennlig SaaS-løsning for booking og administrasjon. Utviklet med moderne design, betaling, kalender og rapportering i én plattform.
            </p>
          </div>

          {/* Contact info - moved to center */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontakt</h4>
            <div className="space-y-3">
              <a href="mailto:kontakt@digilist.no" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                kontakt@digilist.no
              </a>
              <a href="tel:+4796665001" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +47 96 66 50 01
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Nesbruveien 75, 1394 Nesbru
              </div>
            </div>
          </div>

          {/* Juridisk */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Juridisk</h4>
            <ul className="space-y-3">
              {footerLinks.juridisk.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Digilist. Alle rettigheter forbeholdt.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
