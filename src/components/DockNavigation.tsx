import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Settings, Info, Users, Mail, Home, Sparkles, Network, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { href: "#verdi", icon: Sparkles, label: "Verdi" },
  { href: "#funksjonalitet", icon: Settings, label: "Funksjonalitet" },
  { href: "#teknologi", icon: Code2, label: "Teknologi" },
  { href: "#arkitektur", icon: Network, label: "Arkitektur" },
  { href: "#om-oss", icon: Info, label: "Om oss" },
];

const DockNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const updateActiveHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHash(hash);
      } else {
        // Check scroll position to determine active section
        const sections = navItems.map(item => item.href.substring(1));
        const scrollPosition = window.scrollY + 200; // Offset for navbar height
        
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              setActiveHash(`#${sectionId}`);
              break;
            }
          }
        }
      }
    };

    updateActiveHash();
    window.addEventListener("scroll", updateActiveHash);
    window.addEventListener("hashchange", updateActiveHash);
    
    return () => {
      window.removeEventListener("scroll", updateActiveHash);
      window.removeEventListener("hashchange", updateActiveHash);
    };
  }, []);

  const handleNavClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (location.pathname === "/") {
      // Already on homepage, just scroll
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update URL hash
        window.history.pushState(null, "", hash);
        setActiveHash(hash);
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
        setActiveHash(hash);
      }, 50);
    }
  };

  const isHomeActive = location.pathname === "/" && !activeHash && window.scrollY < 100;

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link
        to="/"
        aria-label="Hjem"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveHash("");
        }}
        className={cn(
          "flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105",
          isHomeActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
        )}
      >
        <div className={cn(
          "flex items-center justify-center size-10 rounded-full transition-all duration-300",
          isHomeActive ? "bg-primary/10" : "hover:bg-accent"
        )}>
          <Home className="size-5" />
        </div>
        <span className="text-sm font-semibold">Hjem</span>
      </Link>
      {navItems.map((item) => {
        const isActive = activeHash === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            onClick={(e) => handleNavClick(item.href, e)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105",
              isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center size-10 rounded-full transition-all duration-300",
              isActive ? "bg-primary/10" : "hover:bg-accent"
            )}>
              <item.icon className="size-5" />
            </div>
            <span className="text-sm font-semibold">{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DockNavigation;
