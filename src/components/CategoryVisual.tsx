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
  // utstyr
  festutstyr: PartyPopper,
  "verktoy-maskiner": Wrench,
  "lyd-og-lys": Speaker,
  // tjenester
  catering: UtensilsCrossed,
  dj: Disc3,
  musiker: Music2,
  dekor: Sparkles,
  // legacy /bruksomrader
  selskapslokaler: GlassWater,
  "idrettshaller-gymsaler": Trophy,
  "kulturhus-kantiner": Theater,
};

export function iconForSlug(slug: string): LucideIcon {
  return ICONS[slug] ?? Sparkles;
}

export function CategoryVisual({
  icon: Icon,
  label,
  src,
  alt,
  aspect = "16 / 10",
  variant = "primary",
  className = "",
}: {
  icon: LucideIcon;
  label?: string;
  src?: string;
  alt?: string;
  aspect?: string;
  variant?: "primary" | "texture";
  className?: string;
}) {
  const patternId = useId();

  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-sm border border-rule bg-paper-deep ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={alt ?? label ?? ""}
          className="h-full w-full object-cover"
          loading="lazy"
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
