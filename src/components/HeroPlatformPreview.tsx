import { Calendar, MapPin, Heart, Share2, Building2, Users, Star } from "lucide-react";
import { getFraunces } from "@/lib/fonts";

/**
 * Inline platform-preview mockup used as the hero image.
 * Composed entirely from DS tokens (paper, ink, navy, rule) so it
 * auto-themes in light and dark mode. No raster screenshots.
 */
export function HeroPlatformPreview() {
  return (
    <div className="relative">
      {/* Dashboard calendar peeking out behind — gives depth + platform taste */}
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-8 lg:-right-12 w-[78%] hidden md:block z-0"
      >
        <DashboardCalendarPeek />
      </div>

      <article className="relative z-10 bg-paper border border-rule-strong rounded-sm overflow-hidden shadow-[0_24px_60px_-30px_hsl(var(--navy)/0.25)]">
        {/* Mock platform chrome */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-rule bg-paper-deep/60">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-64.webp"
              alt=""
              aria-hidden="true"
              className="h-7 w-7 object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold text-ink tracking-tight">DIGILIST</span>
              <span className="text-[0.55rem] text-ink-faint tracking-[0.18em] uppercase">
                Enkel booking
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-ink-faint px-3 py-1.5 rounded-sm border border-rule bg-paper">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
              Sanntid
            </span>
            <span className="text-xs font-medium text-on-navy bg-navy px-3 py-1.5 rounded-sm">
              Kom i gang
            </span>
          </div>
        </header>

        {/* Listing image grid — real venue photos */}
        <div className="grid grid-cols-3 grid-rows-2 gap-px bg-rule">
          <div className="col-span-2 row-span-2 relative aspect-[16/10]">
            <picture>
              <source
                type="image/webp"
                srcSet="/hero/festsal-1-512.webp 512w, /hero/festsal-1-1024.webp 1024w"
                sizes="(max-width: 768px) 66vw, 500px"
              />
              <img
                src="/hero/festsal-1-512.jpg"
                alt="Festsal med lysekroner og runde bord"
                width={1024}
                height={662}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <span className="absolute bottom-3 left-3 font-mono text-[0.65rem] uppercase tracking-widest text-ink bg-paper/90 px-2 py-1 rounded-sm backdrop-blur-sm">
              Festsalen · 8 bilder
            </span>
          </div>
          <div className="relative">
            <picture>
              <source srcSet="/hero/festsal-2-384.webp" type="image/webp" />
              <img
                src="/hero/festsal-2-384.jpg"
                alt="Banquet med dekkede bord"
                width={384}
                height={248}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
          <div className="relative">
            <picture>
              <source srcSet="/hero/festsal-3-384.webp" type="image/webp" />
              <img
                src="/hero/festsal-3-384.jpg"
                alt="Selskap med dekorasjon"
                width={384}
                height={248}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
        </div>

        {/* Listing detail body */}
        <div className="p-5 lg:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block text-[0.65rem] font-mono uppercase tracking-widest text-accent-text bg-accent-tinted px-2 py-0.5 rounded-sm">
                Selskapslokale
              </span>
              <div role="presentation"
                className="mt-2 font-serif text-2xl lg:text-3xl text-ink"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                }}
              >
                Lier Bygdetun — Festsalen
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                Bygdetunveien 4, 3400 Lierbyen
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="w-8 h-8 rounded-sm border border-rule flex items-center justify-center text-ink-soft"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
              <button
                className="w-8 h-8 rounded-sm border border-rule flex items-center justify-center text-ink-soft"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-rule -mx-5 lg:-mx-6 px-5 lg:px-6">
            {["Oversikt", "Galleri", "Aktivitetskalender", "Info & vilkår"].map(
              (tab, i) => (
                <span
                  key={tab}
                  className={`text-xs px-3 py-2.5 border-b-2 -mb-px ${
                    i === 0
                      ? "border-navy text-ink font-medium"
                      : "border-transparent text-ink-faint"
                  }`}
                >
                  {tab}
                </span>
              ),
            )}
          </div>

          {/* Specs row */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <Spec icon={<Users className="w-3.5 h-3.5" />} label="Kapasitet" value="120" />
            <Spec icon={<Calendar className="w-3.5 h-3.5" />} label="Min. leie" value="4 t" />
            <Spec icon={<Star className="w-3.5 h-3.5" />} label="Rating" value="4,9" />
          </div>

          {/* Sticky-style booking row */}
          <div className="flex items-center justify-between gap-3 pt-2 mt-2 border-t border-rule">
            <div>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
                Fra
              </p>
              <p className="font-serif text-xl text-ink leading-none mt-0.5">
                kr 1 800{" "}
                <span className="text-xs text-ink-faint font-sans">/ time</span>
              </p>
            </div>
            <span className="text-sm font-medium text-on-navy bg-navy px-5 py-2.5 rounded-sm inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book nå
            </span>
          </div>
        </div>
      </article>

      {/* Caption */}
      <p className="mt-3 editorial-mono-caption">
        Fig. I — Plattformen, listingvisning · app.digilist.no
      </p>
    </div>
  );
}

/**
 * Inline dashboard-calendar mockup peeking out from behind the listing card.
 * Auto-themes via DS tokens. Only partial corner visible — gives "platform taste"
 * without competing with the main hero composition.
 */
function DashboardCalendarPeek() {
  const days = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const dates = Array.from({ length: 35 }, (_, i) => ({
    day: ((i % 31) + 1).toString(),
    booked: [3, 9, 10, 16, 17, 22, 23, 24, 29].includes(i),
    today: i === 14,
    seasonal: [11, 18, 25].includes(i),
  }));
  return (
    <article className="bg-paper border border-rule-strong rounded-sm overflow-hidden shadow-[0_18px_50px_-25px_hsl(var(--navy)/0.18)]">
      <header className="flex items-center justify-between px-5 py-3 border-b border-rule bg-paper-deep/60">
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
          />
          <span className="text-xs font-bold text-ink tracking-tight">DASHBOARD</span>
          <span className="text-[0.55rem] text-ink-faint tracking-[0.18em] uppercase ml-1">
            Kalender
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-ink-soft">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest">Mai 2026</span>
        </div>
      </header>

      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between mb-4">
          <div role="presentation"
            className="font-serif text-xl text-ink"
            style={{ fontVariationSettings: '"opsz" 36, "wght" 460' }}
          >
            Lier Bygdetun — Festsalen
          </div>
          <div className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-navy" aria-hidden="true" />
              Booket
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-accent-surface" aria-hidden="true" />
              Sesongleie
            </span>
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((d) => (
            <span
              key={d}
              className="text-center font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {dates.map((d, i) => (
            <div
              key={i}
              className={`aspect-square flex flex-col items-center justify-center border rounded-sm text-xs ${
                d.today
                  ? "bg-navy text-on-navy border-navy"
                  : d.booked
                  ? "bg-navy/10 text-ink border-navy/30"
                  : d.seasonal
                  ? "bg-accent-surface text-ink border-accent-surface"
                  : "bg-paper text-ink-soft border-rule"
              }`}
            >
              <span className="font-medium">{d.day}</span>
              {d.booked && (
                <span className="w-1 h-1 rounded-full bg-navy mt-0.5" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border border-rule rounded-sm p-2.5 bg-paper">
      <span className="text-accent-text">{icon}</span>
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
          {label}
        </span>
        <span className="text-sm font-medium text-ink">{value}</span>
      </div>
    </div>
  );
}
