import { Link, useLocation, useNavigate } from "react-router-dom";

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
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const navigasjon = [
    { label: "Funksjonalitet", hash: "#funksjonalitet" },
    { label: "Brukerhistorier", hash: "#brukerhistorier" },
    { label: "Teknologi", hash: "#teknologi" },
    { label: "Arkitektur", hash: "#arkitektur" },
    { label: "Om oss", hash: "#om-oss" },
    { label: "Kontakt", hash: "#kontakt" },
  ];

  const ressurser = [
    { label: "Blogg", href: "/blogg" },
    { label: "FAQ", href: "/faq" },
    { label: "Bookingsystem for kommuner", href: "/bookingsystem-kommune" },
    { label: "Pilot for kommuner", href: "/#pilot" },
  ];

  const juridisk = [
    { label: "Personvern", href: "/personvern" },
    { label: "Salgsvilkår", href: "/salgsvilkar" },
    { label: "Cookies", href: "/cookies" },
  ];

  return (
    <footer className="bg-paper-deep border-t border-hairline-strong">
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-px lg:bg-rule">
          <div className="lg:bg-paper-deep lg:p-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-3 mb-6"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/logo.svg"
                alt="Digilist"
                className="h-10 w-auto transition-opacity group-hover:opacity-80"
              />
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold text-ink tracking-tight">
                  DIGILIST
                </span>
                <span className="text-[0.65rem] text-ink-faint tracking-[0.18em] uppercase">
                  Enkel booking
                </span>
              </div>
            </Link>
            <p className="text-base text-ink-soft leading-relaxed measure-narrow">
              En helhetlig bookingløsning for norske kommuner og utleiere — booking, betaling, kalender og rapportering i én plattform.
            </p>
          </div>

          <nav className="lg:bg-paper-deep lg:p-8" aria-label="Navigasjon">
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent-text mb-5">
              Navigasjon
            </h3>
            <ul className="space-y-3">
              {navigasjon.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    onClick={(e) => handleNavClick(link.hash, e)}
                    className="text-base text-ink-soft hover:text-ink transition-colors hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:bg-paper-deep lg:p-8">
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent-text mb-5">
              Kontakt
            </h3>
            <ul className="space-y-3 text-base text-ink-soft">
              <li>
                <a
                  href="tel:+4796665001"
                  className="hover:text-ink transition-colors"
                >
                  +47 96 66 50 01
                </a>
              </li>
              <li>
                <a
                  href="mailto:kontakt@digilist.no"
                  className="hover:text-ink transition-colors"
                >
                  kontakt@digilist.no
                </a>
              </li>
              <li className="pt-2 text-ink-faint">
                Nesbruveien 75<br />
                1394 Nesbru
              </li>
            </ul>
          </div>

          <div className="lg:bg-paper-deep lg:p-8">
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent-text mb-5">
              Ressurser
            </h3>
            <ul className="space-y-3 mb-7">
              {ressurser.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-base text-ink-soft hover:text-ink transition-colors hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent-text mb-5">
              Juridisk
            </h3>
            <ul className="space-y-3">
              {juridisk.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-base text-ink-soft hover:text-ink transition-colors hover:underline underline-offset-4 decoration-[0.5px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-rule">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="editorial-mono-caption">
              <span className="text-ink">© {new Date().getFullYear()} Digilist</span>
              <span className="mx-3">·</span>
              Et produkt av{" "}
              <a
                href="https://xala.no"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                Xala Technologies AS
              </a>
            </p>
            <p className="editorial-mono-caption text-center md:text-right">
              Trykket digitalt · Oslo · Satt med Fraunces og Public Sans
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
