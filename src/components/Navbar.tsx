import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Om oss", hash: "#om-oss" },
    { label: "Funksjoner", hash: "#funksjoner" },
    { label: "Partnere", hash: "#partnere" },
    { label: "Kontakt", hash: "#kontakt" },
  ];

  const handleNavClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname === "/") {
      // Already on homepage, just scroll
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash
        window.history.pushState(null, "", hash);
      }
    } else {
      // Navigate to homepage, then set hash
      navigate("/");
      // Use setTimeout to ensure navigation completes before setting hash
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect border-b border-border/50 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group">
          <span className="text-2xl font-extrabold text-foreground tracking-tight">
            Digi<span className="text-primary">list</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.hash}
              href={`/${link.hash}`}
              onClick={(e) => handleNavClick(link.hash, e)}
              className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-semibold cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Button and Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/book-demo">
            <Button variant="hero" size="lg" className="group">
              Book demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-border/50 mt-4">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`/${link.hash}`}
                onClick={(e) => handleNavClick(link.hash, e)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <Link to="/book-demo" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="hero" size="lg" className="mt-4 w-full group">
                Book demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
