import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarDays,
  Wallet,
  RefreshCw,
  Sparkles,
  Building2,
  Check,
} from "lucide-react";
import { EditorialButton } from "@/components/editorial";

type Interest = {
  id: string;
  label: string;
  icon: typeof Search;
  to: string;
};

const INTERESTS: Interest[] = [
  { id: "finn", label: "Finn og book lokale", icon: Search, to: "/leie" },
  { id: "kalender", label: "Booking & kalender", icon: CalendarDays, to: "/booking-av-lokaler-og-moterom" },
  { id: "betaling", label: "Betaling & oppgjør", icon: Wallet, to: "/booking-av-lokaler-og-moterom" },
  { id: "kanaler", label: "Kanaler & synk", icon: RefreshCw, to: "/booking-av-lokaler-og-moterom" },
  { id: "ai", label: "AI-agenter", icon: Sparkles, to: "/ai-agenter" },
  { id: "kommune", label: "Bookingsystem for kommune", icon: Building2, to: "/bookingsystem-kommune" },
];

/**
 * "Hva er du mest interessert i?" — interactive interest picker (inspired by
 * Guesty's hero segmentation widget). Multi-select the areas you care about,
 * then "Kom i gang" routes to the most relevant page (or Book demo if nothing
 * is picked).
 */
export function InterestSelector() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onStart = () => {
    const first = INTERESTS.find((i) => selected.includes(i.id));
    navigate(first ? first.to : "/book-demo");
  };

  return (
    <div className="mb-14 lg:mb-20 rounded-lg border border-rule bg-paper p-6 lg:p-10 shadow-[0_14px_44px_-26px_rgba(10,18,40,0.4)]">
      <h3
        className="font-serif text-2xl lg:text-3xl text-ink text-center"
        style={{ letterSpacing: "-0.015em", lineHeight: 1.1 }}
      >
        Hva er du mest interessert i?
      </h3>
      <p className="mt-2 text-center text-ink-soft">
        Velg det som passer deg — så viser vi veien.
      </p>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INTERESTS.map((it) => {
          const on = selected.includes(it.id);
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              aria-pressed={on}
              className={`group relative flex items-center gap-3 rounded-md border p-4 text-left shadow-[0_1px_2px_rgba(10,18,40,0.05)] transition-all duration-quick ease-editorial ${
                on
                  ? "border-accent-text bg-accent-tinted shadow-[0_12px_26px_-16px_rgba(10,18,40,0.32)]"
                  : "border-rule bg-gradient-to-br from-paper to-paper-deep/50 hover:border-accent-text/40 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(10,18,40,0.34)]"
              }`}
            >
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors duration-quick ${
                  on
                    ? "bg-accent-text text-on-navy"
                    : "bg-paper text-accent-text ring-1 ring-accent-text/20"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-sm lg:text-base font-medium text-ink">
                {it.label}
              </span>
              {on && (
                <Check
                  className="absolute right-3 top-3 h-4 w-4 text-accent-text"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <EditorialButton variant="primary" size="lg" onClick={onStart}>
          {selected.length ? "Kom i gang" : "Book en demo"}
        </EditorialButton>
      </div>
    </div>
  );
}

export default InterestSelector;
