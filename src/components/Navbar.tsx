import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import DockNavigation from "./DockNavigation";
import { EditorialButton } from "@/components/editorial";
import { cn } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-paper border-b transition-all duration-normal ease-editorial",
        isScrolled
          ? "border-rule-strong py-2 shadow-[0_1px_0_0_hsl(var(--rule))]"
          : "border-rule py-3"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Digilist — gå til forsiden"
          className="group inline-flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo.svg"
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

        <DockNavigation />

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <EditorialButton
            variant="primary"
            size="md"
            href="https://app.digilist.no"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex"
          >
            Åpne plattformen
          </EditorialButton>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
