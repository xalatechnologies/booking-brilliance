import { useState, useEffect } from "react";
import { X, Cookie, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-card/95 dark:bg-card/90 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Left: Icon and Content */}
            <div className="flex gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">Vi bruker informasjonskapsler</h3>
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Vi bruker nødvendige cookies for å sikre grunnleggende funksjonalitet og forbedre din opplevelse på vår nettside. 
                  Ved å klikke "Godta alle" samtykker du til bruk av cookies i henhold til vår{" "}
                  <Link to="/cookies" className="text-primary hover:underline font-medium">
                    cookie-policy
                  </Link>
                  {" "}og{" "}
                  <Link to="/personvern" className="text-primary hover:underline font-medium">
                    personvernerklæring
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={rejectCookies}
                className="w-full sm:w-auto"
              >
                Kun nødvendige
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={acceptCookies}
                className="w-full sm:w-auto shadow-lg shadow-primary/30"
              >
                Godta alle
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={rejectCookies}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Lukk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
