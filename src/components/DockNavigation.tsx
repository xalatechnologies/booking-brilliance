import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type SectionItem = {
  kind: "section";
  href: string;
  numeral: string;
  label: string;
};
type RouteItem = {
  kind: "route";
  to: string;
  numeral: string;
  label: string;
};

const navItems: Array<SectionItem | RouteItem> = [
  { kind: "section", href: "#funksjonalitet", numeral: "I", label: "Funksjonalitet" },
  { kind: "section", href: "#brukerhistorier", numeral: "II", label: "Brukerhistorier" },
  { kind: "route", to: "/blogg", numeral: "III", label: "Blogg" },
  { kind: "route", to: "/faq", numeral: "IV", label: "FAQ" },
  { kind: "section", href: "#kontakt", numeral: "V", label: "Kontakt" },
];

const DockNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const sectionItems = navItems.filter(
      (i): i is SectionItem => i.kind === "section",
    );
    const updateActiveHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHash(hash);
        return;
      }
      const scrollPosition = window.scrollY + 200;
      for (const item of sectionItems) {
        const sectionId = item.href.substring(1);
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveHash(`#${sectionId}`);
          return;
        }
      }
      setActiveHash("");
    };

    updateActiveHash();
    window.addEventListener("scroll", updateActiveHash);
    window.addEventListener("hashchange", updateActiveHash);
    return () => {
      window.removeEventListener("scroll", updateActiveHash);
      window.removeEventListener("hashchange", updateActiveHash);
    };
  }, []);

  const handleSectionClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
        setActiveHash(hash);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActiveHash(hash);
      }, 50);
    }
  };

  const itemClass = (isActive: boolean) =>
    cn(
      "group inline-flex items-center gap-2.5 py-2 transition-colors duration-quick ease-editorial",
      isActive ? "text-ink" : "text-ink-faint hover:text-ink",
    );

  const numeralClass = (isActive: boolean) =>
    cn(
      "font-mono text-[0.65rem] tracking-widest tabular-nums",
      isActive ? "text-accent-text" : "text-ink-faint group-hover:text-accent-text",
    );

  const labelClass = (isActive: boolean) =>
    cn(
      "font-sans text-xs uppercase tracking-widest",
      isActive &&
        "underline underline-offset-8 decoration-[0.5px] decoration-ink",
    );

  return (
    <div className="hidden lg:flex items-center gap-6 xl:gap-7">
      {navItems.map((item) => {
        if (item.kind === "route") {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={itemClass(isActive)}
            >
              <span className={numeralClass(isActive)}>{item.numeral}</span>
              <span className="w-px h-3 bg-rule" aria-hidden="true" />
              <span className={labelClass(isActive)}>{item.label}</span>
            </Link>
          );
        }
        if (item.kind === "action") {
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              onClick={item.onClick}
              className={itemClass(false)}
            >
              <span className={numeralClass(false)}>{item.numeral}</span>
              <span className="w-px h-3 bg-rule" aria-hidden="true" />
              <span className={labelClass(false)}>{item.label}</span>
            </button>
          );
        }
        const isActive = activeHash === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            onClick={(e) => handleSectionClick(item.href, e)}
            className={itemClass(isActive)}
          >
            <span className={numeralClass(isActive)}>{item.numeral}</span>
            <span className="w-px h-3 bg-rule" aria-hidden="true" />
            <span className={labelClass(isActive)}>{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DockNavigation;
