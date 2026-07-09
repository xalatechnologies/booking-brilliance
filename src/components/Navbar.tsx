import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GlobalSearch } from "./GlobalSearch";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { EditorialButton } from "@/components/editorial";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";

// Product/landing pages — grouped under a "Løsninger" dropdown so their long
// labels don't crowd the top bar.
const SOLUTIONS = [
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
] as const;

// Primary desktop navigation — the curated top-level links that sit inline. The
// remaining routes live in the Løsninger dropdown and the MobileMenu drawer
// (the fallback below `xl` and on mobile).
const PRIMARY_NAV = [
  { label: "Blogg", to: "/blogg" },
  { label: "FAQ", to: "/faq" },
  { label: "Transparens", to: "/transparens" },
  { label: "Book demo", to: "/book-demo" },
] as const;

const NAV_LINK =
  "font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial whitespace-nowrap";
const NAV_LINK_ACTIVE =
  "text-ink underline underline-offset-8 decoration-[0.5px] decoration-ink";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const solutionsActive = SOLUTIONS.some((s) =>
    location.pathname.startsWith(s.to),
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip-to-main link (WCAG 2.1.1 / 2.4.1) — visually hidden until focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-navy focus:text-on-navy focus:px-4 focus:py-2 focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
      >
        Hopp til hovedinnhold
      </a>
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-paper border-b transition-all duration-normal ease-editorial",
        isScrolled
          ? "border-rule-strong py-2 shadow-[0_1px_0_0_hsl(var(--rule))]"
          : "border-rule py-3"
      )}
    >
      <div className="container mx-auto px-4 flex items-center gap-4 lg:gap-6">
        <Link
          to="/"
          aria-label="Digilist — gå til forsiden"
          className="group inline-flex items-center gap-3 shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo-64.webp"
            alt=""
            aria-hidden="true"
            className="h-11 md:h-12 w-auto transition-opacity group-hover:opacity-80"
          />
          <span className="flex flex-col items-start leading-none">
            <span
              className="font-serif text-3xl md:text-[2rem] text-ink leading-none"
              style={{
                fontVariationSettings:
                  '"opsz" 96, "wght" 460, "SOFT" 25, "WONK" 1',
                letterSpacing: "-0.02em",
              }}
            >
              Digilist
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block w-3.5 h-px bg-accent-text"
              />
              <span
                className="font-serif italic text-sm md:text-[0.95rem] text-ink-soft leading-none"
                style={{
                  fontVariationSettings:
                    '"opsz" 16, "wght" 420, "SOFT" 60',
                  letterSpacing: "0.005em",
                }}
              >
                Enkel booking
              </span>
              <span
                aria-hidden="true"
                className="inline-block w-1 h-1 rounded-full bg-accent-text/60"
              />
            </span>
          </span>
        </Link>

        {/* Search — left-aligned, right after the logo. Flexes: grows toward
            360px on wide screens, shrinks first when the nav needs room. */}
        <div className="hidden md:flex shrink min-w-[150px] w-[240px] lg:w-[300px] xl:w-[360px]">
          <GlobalSearch />
        </div>

        {/* Right group: primary nav (xl+) + actions, pushed to the far edge */}
        <div className="flex items-center gap-4 lg:gap-6 ml-auto shrink-0">
          <nav
            aria-label="Hovednavigasjon"
            className="hidden xl:flex items-center gap-6"
          >
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  NAV_LINK,
                  "inline-flex items-center gap-1 outline-none focus-visible:underline focus-visible:underline-offset-8 data-[state=open]:text-ink",
                  solutionsActive && NAV_LINK_ACTIVE,
                )}
              >
                Løsninger
                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={12}
                className="min-w-[17rem] bg-paper border-hairline-strong rounded-sm p-1.5"
              >
                {SOLUTIONS.map((s) => (
                  <DropdownMenuItem key={s.to} asChild>
                    <Link
                      to={s.to}
                      className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-sm cursor-pointer focus:bg-paper-deep hover:bg-paper-deep"
                    >
                      <span className="editorial-mono-caption text-ink-faint">
                        {s.eyebrow}
                      </span>
                      <span className="font-sans text-[0.95rem] text-ink">
                        {s.label}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={NAV_LINK}
                activeClassName={NAV_LINK_ACTIVE}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <EditorialButton
              variant="primary"
              size="md"
              href="https://app.digilist.no"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex"
            >
              Åpne plattformen
            </EditorialButton>
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
