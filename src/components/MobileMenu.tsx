import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { EditorialButton } from "@/components/editorial";
import { openChatbot } from "@/lib/chatbot/open";
import { cn } from "@/lib/utils";

const ROUTES: Array<{ label: string; to: string; eyebrow?: string }> = [
  { label: "Forsiden", to: "/", eyebrow: "Hjem" },
  { label: "Lokaler", to: "/leie", eyebrow: "Selskap · møte · idrett · kultur" },
  { label: "Overnatting", to: "/overnatting", eyebrow: "Hytte · leilighet · rom" },
  { label: "Arrangementer", to: "/arrangementer", eyebrow: "Konsert · teater · festival" },
  { label: "Utstyr", to: "/utstyr", eyebrow: "Fest · verktøy · lyd & lys" },
  { label: "Tjenester", to: "/tjenester", eyebrow: "Catering · DJ · musiker · dekor" },
  { label: "Blogg", to: "/blogg", eyebrow: "Artikler" },
  { label: "FAQ", to: "/faq", eyebrow: "Vanlige spørsmål" },
  { label: "Transparens", to: "/transparens", eyebrow: "Live kvalitetsrapport" },
  {
    label: "Booking av lokaler og møterom",
    to: "/booking-av-lokaler-og-moterom",
    eyebrow: "Landingsside",
  },
  {
    label: "Bookingsystem for kommuner",
    to: "/bookingsystem-kommune",
    eyebrow: "SSA-L 2026",
  },
  {
    label: "Billettsystem",
    to: "/billettsystem",
    eyebrow: "Rabatt · kupong · gavekort",
  },
  {
    label: "Teknologi og sikkerhet",
    to: "/teknologi",
    eyebrow: "Plattform · samsvar",
  },
  { label: "Om oss", to: "/om-oss", eyebrow: "Xala Technologies" },
  { label: "Book demo", to: "/book-demo", eyebrow: "30–45 min" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Åpne meny"
        aria-expanded={open}
        aria-controls="mobile-menu-drawer"
        className="xl:hidden inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "xl:hidden fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-normal ease-editorial",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Drawer */}
      <aside
        id="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Hovedmeny"
        className={cn(
          "xl:hidden fixed right-0 top-0 bottom-0 z-50 w-[88%] max-w-sm bg-paper border-l border-hairline-strong shadow-2xl flex flex-col transition-transform duration-normal ease-editorial",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-hairline-strong">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-3"
            aria-label="Digilist, forsiden"
          >
            <img src="/logo.svg" alt="" aria-hidden="true" width={64} height={64} className="h-9 w-auto" />
            <span
              className="font-serif text-2xl text-ink leading-none"
              style={{
                fontVariationSettings:
                  '"opsz" 96, "wght" 460',
                letterSpacing: "-0.02em",
              }}
            >
              Digilist
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Lukk meny"
            className="inline-flex items-center justify-center w-10 h-10 border border-hairline-strong rounded-sm text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial"
          >
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        <nav
          aria-label="Sider"
          className="flex-1 overflow-y-auto px-5 py-6 space-y-1"
        >
          <p className="editorial-mono-caption text-ink-faint mb-4">
            NAVIGASJON
          </p>
          {ROUTES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group block border-b border-rule py-4 transition-colors duration-quick ease-editorial hover:bg-paper-deep/50"
            >
              {r.eyebrow && (
                <span className="editorial-mono-caption text-ink-faint">
                  {r.eyebrow}
                </span>
              )}
              <span
                className="mt-1 flex items-baseline justify-between gap-3 font-serif text-2xl text-ink leading-tight"
                style={{
                  fontVariationSettings: '"opsz" 36, "wght" 480',
                  letterSpacing: "-0.01em",
                }}
              >
                {r.label}
                <ArrowUpRight
                  className="h-4 w-4 text-ink-faint shrink-0 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </nav>

        <footer className="border-t border-hairline-strong px-5 py-5 space-y-3 bg-accent-tinted">
          <EditorialButton
            variant="primary"
            size="lg"
            href="/leie"
            className="w-full"
          >
            Finn lokale
          </EditorialButton>
          <EditorialButton
            variant="outline"
            size="lg"
            href="/book-demo"
            className="w-full"
          >
            Book demo
          </EditorialButton>
          <EditorialButton
            variant="outline"
            size="lg"
            onClick={() => {
              setOpen(false);
              openChatbot({ mode: "chat" });
            }}
            className="w-full"
          >
            Snakk med oss
          </EditorialButton>
          <a
            href="https://app.digilist.no"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center font-mono text-xs uppercase tracking-widest text-accent-text hover:underline underline-offset-4 decoration-[0.5px] pt-2"
          >
            Åpne plattformen ↗
          </a>
        </footer>
      </aside>
    </>
  );
}
