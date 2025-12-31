import { Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    produkt: [
      { label: "Funksjoner", href: "#funksjoner" },
      { label: "Priser", href: "#priser" },
      { label: "Integrasjoner", href: "#integrasjoner" },
      { label: "Demo", href: "#demo" },
    ],
    selskap: [
      { label: "Om oss", href: "#om-oss" },
      { label: "Partnere", href: "#partnere" },
      { label: "Karriere", href: "#karriere" },
      { label: "Kontakt", href: "#kontakt" },
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-xl">
                D
              </div>
              <span className="text-xl font-bold text-foreground">
                igi<span className="text-primary">list</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Norges smarteste bookingsystem for lokaler, ressurser og arrangementer.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:kontakt@digilist.no" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                kontakt@digilist.no
              </a>
              <a href="tel:+4712345678" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                +47 123 45 678
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Oslo, Norge
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produkt</h4>
            <ul className="space-y-3">
              {footerLinks.produkt.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Selskap</h4>
            <ul className="space-y-3">
              {footerLinks.selskap.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
