import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import DockNavigation from "./DockNavigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 section-border-bottom ${
        isScrolled
          ? "glass-effect py-2 shadow-lg"
          : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="group flex items-center gap-2"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img 
            src="/logo.svg" 
            alt="Digilist" 
            className="h-14 md:h-16 w-auto transition-opacity group-hover:opacity-80"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              DIGILIST
            </span>
            <span className="text-xs md:text-sm text-muted-foreground mt-0.5">
              ENKEL BOOKING
            </span>
          </div>
        </Link>

        {/* Dock Navigation */}
        <DockNavigation />

        {/* CTA Button and Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button 
            variant="hero" 
            size="lg" 
            className="hidden md:inline-flex group shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
            onClick={() => {
              const element = document.getElementById('kontakt');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Book demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
