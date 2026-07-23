import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { getFraunces } from "@/lib/fonts";
import { EditorialButton } from "@/components/editorial";
import { openChatbot } from "@/lib/chatbot/open";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Hide the Footer CTA strip on individual blog posts — those pages already
  // render a full-bleed tinted "NESTE STEG" band right above the footer.
  const isBlogPost = /^\/blogg\/[^/]+\/?$/.test(location.pathname);

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
    { label: "Spørsmål", hash: "#faq" },
    { label: "Kontakt", hash: "#kontakt" },
  ];

  const markedsplass = [
    { label: "Lokaler", href: "/leie" },
    { label: "Lokaler til leie", href: "/lokaler-til-leie" },
    { label: "Overnatting", href: "/overnatting" },
    { label: "Arrangementer", href: "/arrangementer" },
    { label: "Utstyr", href: "/utstyr" },
    { label: "Tjenester", href: "/tjenester" },
    { label: "Billettsystem", href: "/billettsystem" },
    { label: "Booking av lokaler og møterom", href: "/booking-av-lokaler-og-moterom" },
  ];

  const losninger = [
    { label: "Bookingsystem for utleie", href: "/bookingsystem-utleie" },
    { label: "Bookingsystem for kommuner", href: "/bookingsystem-kommune" },
    { label: "Pilot for kommuner", href: "/bookingsystem-kommune#pilot" },
    { label: "Teknologi og sikkerhet", href: "/teknologi" },
    { label: "Sikkerhet og personvern", href: "/sikkerhet" },
    { label: "Om oss", href: "/om-oss" },
    { label: "Blogg", href: "/blogg" },
    { label: "Utleiemarkedet 2026", href: "/rapport/utleiemarkedet-norge-2026" },
    { label: "FAQ", href: "/faq" },
    { label: "Transparens", href: "/transparens" },
  ];

  const juridisk = [
    { label: "Personvern", href: "/personvern" },
    { label: "Salgsvilkår", href: "/salgsvilkar" },
    { label: "Cookies", href: "/cookies" },
  ];

  // SEO internal-link cluster — the private-market pages, rendered site-wide in
  // a dense block below the main columns so every prerendered page passes
  // authority into them (they were previously only reachable via sitemap).
  const byer = [
    { label: "Oslo", href: "/lokaler-til-leie/oslo" },
    { label: "Bergen", href: "/lokaler-til-leie/bergen" },
    { label: "Trondheim", href: "/lokaler-til-leie/trondheim" },
    { label: "Stavanger", href: "/lokaler-til-leie/stavanger" },
    { label: "Kristiansand", href: "/lokaler-til-leie/kristiansand" },
    { label: "Tromsø", href: "/lokaler-til-leie/tromso" },
    { label: "Drammen", href: "/lokaler-til-leie/drammen" },
    { label: "Bærum", href: "/lokaler-til-leie/baerum" },
  ];

  const lokaltyper = [
    { label: "Selskapslokale", href: "/leie/selskapslokale" },
    { label: "Møterom", href: "/leie/moterom" },
    { label: "Konferanselokale", href: "/leie/konferanselokale" },
    { label: "Kulturhus", href: "/leie/kulturhus" },
    { label: "Idrettshall", href: "/leie/idrettshall" },
    { label: "Hall", href: "/leie/hall" },
    { label: "Gård", href: "/leie/gaard" },
    { label: "Kontorlokaler", href: "/leie/kontorlokaler" },
    { label: "Bursdagslokale", href: "/leie/bursdagslokale" },
    { label: "Coworking", href: "/leie/coworking" },
    { label: "Padelbane", href: "/leie/padelbane" },
    { label: "Svømmehall", href: "/leie/svommehall" },
  ];

  const anledninger = [
    { label: "Konfirmasjon", href: "/leie/konfirmasjonslokale" },
    { label: "Firmafest og julebord", href: "/leie/firmafest" },
    { label: "Minnestund", href: "/leie/minnestund" },
    { label: "Dåp og navnefest", href: "/leie/daap" },
    { label: "Jubileum", href: "/leie/jubileum" },
  ];

  const verktoy = [
    { label: "Leiepriskalkulator", href: "/verktoy/leiepriskalkulator" },
    { label: "Kapasitetskalkulator", href: "/verktoy/kapasitetskalkulator" },
    { label: "Alle verktøy", href: "/verktoy" },
  ];

  const linkClass =
    "group inline-flex items-baseline gap-1.5 font-serif text-lg text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial no-underline";
  const linkUnderline =
    "border-b border-transparent group-hover:border-ink transition-colors duration-quick ease-editorial pb-0.5";

  // Footer nav sections are top-level page landmarks — use h2, not h3. On
  // pages whose main content is client-fetched (e.g. /transparens renders a
  // loading spinner during prerender), the footer headings are the first
  // headings after the page h1, so h3 here produced an h1→h3 outline skip
  // that the a11y auditor flags. h2 is a clean, skip-free level everywhere.
  const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="flex items-center gap-3 mb-6 editorial-mono-caption text-accent-text">
      <span aria-hidden="true" className="w-6 h-px bg-accent-text" />
      {children}
    </h2>
  );

  return (
    <footer className="bg-paper-deep border-t border-hairline-strong">
      <div className="container mx-auto md:px-8 lg:px-12 pt-16 lg:pt-24 pb-8 lg:pb-10">
        {/* Editorial colophon header */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <Link
              to="/"
              className="group inline-flex items-center gap-4 mb-6"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/logo-64.webp"
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                className="h-16 lg:h-20 w-auto transition-opacity group-hover:opacity-80"
              />
              <span className="flex flex-col items-start leading-none">
                <span
                  className="font-serif text-5xl lg:text-6xl text-ink leading-none"
                  style={{
                    fontVariationSettings:
                      '"opsz" 96, "wght" 460',
                    letterSpacing: "-0.02em",
                  }}
                >
                  Digilist
                </span>
                <span className="mt-1 inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 h-px bg-accent-text"
                  />
                  <span
                    className="font-serif italic text-base lg:text-lg text-ink-soft leading-none"
                    style={{
                      fontVariationSettings:
                        '"opsz" 16, "wght" 420',
                    }}
                  >
                    Enkel booking
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full bg-accent-text/60"
                  />
                </span>
              </span>
            </Link>
            <p
              className="text-2xl lg:text-3xl text-ink-soft italic measure leading-snug"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Én plattform for norske lokaler. Finn og book som privatperson,
              drift og forvalt som kommune eller utleier.
            </p>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-8 flex flex-col justify-end gap-3">
            <span className="editorial-mono-caption text-accent-text">
              KONTOR · OSLO-REGIONEN
            </span>
            <p
              className="font-serif text-2xl text-ink leading-snug"
              style={{
                fontVariationSettings: getFraunces("sub"),
                letterSpacing: "-0.01em",
              }}
            >
              Nesbruveien 75
              <br />
              1394 Nesbru
            </p>
            <div className="flex flex-col gap-1 mt-3">
              <a
                href="tel:+4796665001"
                className="group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  T
                </span>
                <span className="border-b border-rule group-hover:border-accent-text pb-0.5">
                  +47 96 66 50 01
                </span>
              </a>
              <a
                href="mailto:kontakt@digilist.no"
                className="group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  E
                </span>
                <span className="border-b border-rule group-hover:border-accent-text pb-0.5">
                  kontakt@digilist.no
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Always-on CTA strip — tinted, hidden on individual blog posts */}
        {!isBlogPost && (
          <div className="mb-14 lg:mb-20 bg-accent-tinted border border-hairline-strong rounded-sm px-6 lg:px-10 py-10 lg:py-12">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end">
              <div className="lg:col-span-7">
                <span className="editorial-mono-caption text-accent-text">
                  NESTE STEG
                </span>
                <p
                  className="mt-3 font-serif text-3xl lg:text-4xl text-ink leading-tight"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                  }}
                >
                  Klar for å se Digilist i praksis?
                </p>
                <p className="mt-3 text-lg text-ink-soft measure leading-relaxed">
                  Book en personlig demo, eller still spørsmål direkte i chat.
                  Vi svarer på under et minutt i kontortid.
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
                <EditorialButton variant="primary" size="md" href="/book-demo">
                  Book demo
                </EditorialButton>
                <EditorialButton
                  variant="outline"
                  size="md"
                  onClick={() => openChatbot({ mode: "chat" })}
                >
                  Snakk med oss
                </EditorialButton>
              </div>
            </div>
          </div>
        )}

        {/* Four columns of links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <nav aria-label="Navigasjon">
            <ColumnHeading>I · NAVIGASJON</ColumnHeading>
            <ul className="space-y-3.5">
              {navigasjon.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    onClick={(e) => handleNavClick(link.hash, e)}
                    className={linkClass}
                  >
                    <span className={linkUnderline}>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Markedsplass">
            <ColumnHeading>II · MARKEDSPLASS</ColumnHeading>
            <ul className="space-y-3.5">
              {markedsplass.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className={linkClass}>
                    <span className={linkUnderline}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Løsninger">
            <ColumnHeading>III · LØSNINGER</ColumnHeading>
            <ul className="space-y-3.5">
              {losninger.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className={linkClass}>
                    <span className={linkUnderline}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Juridisk">
            <ColumnHeading>IV · JURIDISK</ColumnHeading>
            <ul className="space-y-3.5">
              {juridisk.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className={linkClass}>
                    <span className={linkUnderline}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* SEO internal-link cluster — site-wide links into the private-market
            pages (byer, lokaltyper, anledninger, verktøy). */}
        <div className="mt-14 lg:mt-16 pt-10 border-t border-rule">
          <h2 className="flex items-center gap-3 mb-8 editorial-mono-caption text-accent-text">
            <span aria-hidden="true" className="w-6 h-px bg-accent-text" />
            V · LOKALER TIL LEIE
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {[
              { title: "BYER", items: byer, label: "Byer" },
              { title: "LOKALTYPER", items: lokaltyper, label: "Lokaltyper" },
              { title: "ANLEDNINGER", items: anledninger, label: "Anledninger" },
              { title: "VERKTØY", items: verktoy, label: "Verktøy" },
            ].map((col) => (
              <nav key={col.title} aria-label={col.label}>
                <p className="editorial-mono-caption text-ink-faint mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="font-sans text-[0.95rem] text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors duration-quick ease-editorial no-underline pb-0.5"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom colophon */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-rule">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="editorial-mono-caption">
              <span className="text-ink">
                © {new Date().getFullYear()} Digilist
              </span>
              <span className="mx-3 text-ink-faint">·</span>
              <span className="text-ink-faint">Et produkt av</span>{" "}
              <a
                href="https://xala.no"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent-text transition-colors"
              >
                Xala Technologies AS
              </a>
            </p>
            <p className="editorial-mono-caption text-ink-faint md:text-right">
              TRYKKET DIGITALT · OSLO · SATT MED NEWSREADER OG INTER
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
