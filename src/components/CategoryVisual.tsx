import { useId } from "react";
import {
  GlassWater,
  Warehouse,
  Cake,
  Theater,
  Users2,
  Presentation,
  Building2,
  Laptop,
  Trophy,
  Dumbbell,
  Waves,
  TreePine,
  BedDouble,
  PartyPopper,
  Wrench,
  Speaker,
  UtensilsCrossed,
  Disc3,
  Music2,
  Sparkles,
  Music,
  Drama,
  Tent,
  Medal,
  Home,
  Bike,
  type LucideIcon,
} from "lucide-react";

/**
 * On-brand generated illustration for a category, used where a real photo
 * isn't available yet. Renders the category's icon on a tinted dot-grid
 * canvas (editorial, no licensing). Pass `src` (+ `alt`) to render a real
 * <img> instead — no layout change, so photos drop in later via the same slot.
 */

// slug -> icon. Covers the /leie, /overnatting, /utstyr, /tjenester children
// and the legacy /bruksomrader slugs. Unknown slugs fall back to a neutral mark.
const ICONS: Record<string, LucideIcon> = {
  // leie
  selskapslokale: GlassWater,
  gaard: Warehouse,
  bursdagslokale: Cake,
  kulturhus: Theater,
  moterom: Users2,
  konferanselokale: Presentation,
  kontorlokaler: Building2,
  coworking: Laptop,
  idrettshall: Trophy,
  padelbane: Dumbbell,
  svommehall: Waves,
  // overnatting
  hytte: TreePine,
  leilighet: Building2,
  rom: BedDouble,
  feriehus: Home,
  // utstyr
  festutstyr: PartyPopper,
  "verktoy-maskiner": Wrench,
  "lyd-og-lys": Speaker,
  "sport-og-friluft": Bike,
  // tjenester
  catering: UtensilsCrossed,
  dj: Disc3,
  musiker: Music2,
  dekor: Sparkles,
  // arrangementer
  konsert: Music,
  "teater-og-scene": Drama,
  festival: Tent,
  sport: Medal,
  // legacy /bruksomrader
  selskapslokaler: GlassWater,
  "idrettshaller-gymsaler": Trophy,
  "kulturhus-kantiner": Theater,
};

export function iconForSlug(slug: string): LucideIcon {
  return ICONS[slug] ?? Sparkles;
}

// slug -> bundled Pexels photo (public/images/cat/<slug>.jpg, free Pexels
// license). Missing slugs fall back to the generated illustration.
const CAT = "/images/cat";
const IMAGES: Record<string, string> = {
  selskapslokale: `${CAT}/selskapslokale.jpg`,
  gaard: `${CAT}/gaard.jpg`,
  bursdagslokale: `${CAT}/bursdagslokale.jpg`,
  kulturhus: `${CAT}/kulturhus.jpg`,
  moterom: `${CAT}/moterom.jpg`,
  konferanselokale: `${CAT}/konferanselokale.jpg`,
  kontorlokaler: `${CAT}/kontorlokaler.jpg`,
  coworking: `${CAT}/coworking.jpg`,
  idrettshall: `${CAT}/idrettshall.jpg`,
  padelbane: `${CAT}/padelbane.jpg`,
  svommehall: `${CAT}/svommehall.jpg`,
  hytte: `${CAT}/hytte.jpg`,
  leilighet: `${CAT}/leilighet.jpg`,
  rom: `${CAT}/rom.jpg`,
  feriehus: `${CAT}/feriehus.jpg`,
  festutstyr: `${CAT}/festutstyr.jpg`,
  "verktoy-maskiner": `${CAT}/verktoy-maskiner.jpg`,
  "lyd-og-lys": `${CAT}/lyd-og-lys.jpg`,
  "sport-og-friluft": `${CAT}/sport-og-friluft.jpg`,
  catering: `${CAT}/catering.jpg`,
  dj: `${CAT}/dj.jpg`,
  musiker: `${CAT}/musiker.jpg`,
  dekor: `${CAT}/dekor.jpg`,
  konsert: `${CAT}/konsert.jpg`,
  "teater-og-scene": `${CAT}/teater-og-scene.jpg`,
  festival: `${CAT}/festival.jpg`,
  sport: `${CAT}/sport.jpg`,
  // legacy /bruksomrader slugs reuse the closest photo
  selskapslokaler: `${CAT}/selskapslokale.jpg`,
  "idrettshaller-gymsaler": `${CAT}/idrettshall.jpg`,
  "kulturhus-kantiner": `${CAT}/kulturhus.jpg`,
};

export function imageForSlug(slug: string): string | undefined {
  return IMAGES[slug];
}

export function CategoryVisual({
  icon: Icon,
  label,
  src,
  alt,
  aspect = "16 / 10",
  variant = "primary",
  eager = false,
  className = "",
}: {
  icon: LucideIcon;
  label?: string;
  src?: string;
  alt?: string;
  aspect?: string;
  variant?: "primary" | "texture";
  /** Load the image eagerly — set on above-the-fold heroes (LCP). */
  eager?: boolean;
  className?: string;
}) {
  const patternId = useId();

  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-rule/70 bg-paper-deep shadow-sm ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt ?? label ?? ""}
          className="h-full w-full object-cover"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/15 via-ink/0 to-ink/0"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-sm border border-rule bg-gradient-to-br from-paper-deep to-paper ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={label ?? "Illustrasjon"}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-navy/10"
      >
        <defs>
          <pattern
            id={patternId}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {variant === "primary" ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-paper border border-hairline-strong text-navy shadow-sm">
              <Icon className="h-9 w-9" strokeWidth={1.25} aria-hidden="true" />
            </span>
          </div>
          {label && (
            <span className="absolute left-4 bottom-3 editorial-mono-caption text-ink-faint">
              {label}
            </span>
          )}
        </>
      ) : (
        <Icon
          className="absolute -bottom-4 -right-3 h-24 w-24 text-navy/[0.08]"
          strokeWidth={1}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default CategoryVisual;
