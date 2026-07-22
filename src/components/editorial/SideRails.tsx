import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Home,
  Sparkles,
  Users,
  BookOpen,
  Handshake,
  Zap,
  Plug,
  Cpu,
  Network,
  Info,
  Newspaper,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

export type Chapter = {
  /** Empty string means "top of page" (Home) */
  id: string;
  label: string;
  icon: LucideIcon;
};

const CHAPTERS: Chapter[] = [
  { id: "", label: "Hjem", icon: Home },
  { id: "verdi", label: "Verdi", icon: Sparkles },
  { id: "bruksomrader", label: "Bruksområder", icon: Users },
  { id: "brukerhistorier", label: "Brukerhistorier", icon: BookOpen },
  { id: "pilot", label: "Pilot for kommuner", icon: Handshake },
  { id: "blogg-preview", label: "Blogg", icon: Newspaper },
  { id: "funksjonalitet", label: "Funksjonalitet", icon: Zap },
  { id: "integrasjoner", label: "Integrasjoner", icon: Plug },
  { id: "teknologi", label: "Teknologi", icon: Cpu },
  { id: "arkitektur", label: "Arkitektur", icon: Network },
  { id: "om-oss", label: "Om oss", icon: Info },
  { id: "kontakt", label: "Kontakt", icon: Mail },
];

const HOME_ID = "__home__";

/** Left rail — vertical icon dock with magnetic hover + filled active pill. */
function LeftRail({
  chapters,
  activeId,
  onJump,
}: {
  chapters: Chapter[];
  activeId: string;
  onJump: (chapter: Chapter) => void;
}) {
  const navRef = useRef<HTMLElement>(null);
  const mouseY = useMotionValue<number>(Infinity);

  return (
    <motion.nav
      ref={navRef}
      aria-label="Kapittelnavigasjon"
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      // Primary navigation now lives in the top bar, so this floating left rail is
      // retired — kept in the tree but hidden at every breakpoint. (It used to
      // resurface on ultra-wide viewports ≥1740px, which is what still leaked it
      // onto large screens.) To bring it back as a reading indicator, restore the
      // `min-[1740px]:flex` utility below.
      className="hidden fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 py-3 px-2 bg-paper/85 backdrop-blur-md border border-hairline-strong rounded-full shadow-[0_6px_24px_-12px_hsl(var(--ink)/0.25)]"
    >
      {chapters.map((c) => (
        <DockItem
          key={c.id || HOME_ID}
          chapter={c}
          mouseY={mouseY}
          active={
            c.id === "" ? activeId === HOME_ID : activeId === c.id
          }
          onClick={() => onJump(c)}
        />
      ))}
    </motion.nav>
  );
}

function DockItem({
  chapter,
  mouseY,
  active,
  onClick,
}: {
  chapter: Chapter;
  mouseY: MotionValue<number>;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform<number, number>(mouseY, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    const center = rect.y + rect.height / 2;
    return val - center;
  });
  const rawScale = useTransform(distance, [-100, 0, 100], [1, 1.4, 1]);
  const scale = useSpring(rawScale, { mass: 0.1, stiffness: 220, damping: 18 });
  const Icon = chapter.icon;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      style={{ scale }}
      aria-label={`Gå til ${chapter.label}`}
      title={chapter.label}
      className={`group relative z-10 w-10 h-10 inline-flex items-center justify-center rounded-full transition-colors duration-quick ease-editorial ${
        active
          ? "bg-navy text-on-navy shadow-md"
          : "bg-paper-deep/70 text-ink-soft hover:bg-paper-deep hover:text-ink"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute left-[calc(100%+0.65rem)] top-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-xs uppercase tracking-widest text-on-navy opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-quick ease-editorial pointer-events-none bg-navy px-2.5 py-1 rounded-sm shadow-md"
      >
        {chapter.label}
      </span>
    </motion.button>
  );
}

/**
 * Right rail (slim) — only surfaced on ultra-wide viewports (≥1740px), where the
 * centered 1600px container leaves a real right gutter. Below that the container
 * is full-width and a fixed rail at the viewport edge would overlap the content.
 */
function SlimRightRail({
  chapters,
  activeId,
  activeIndex,
  scrollPct,
  onJump,
}: {
  chapters: Chapter[];
  activeId: string;
  activeIndex: number;
  scrollPct: number;
  onJump: (chapter: Chapter) => void;
}) {
  return (
    <nav
      aria-label="Lese-indikator"
      className="hidden min-[1740px]:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-2 py-3 px-2 bg-paper/85 backdrop-blur-md border border-hairline-strong rounded-full shadow-[0_6px_24px_-12px_hsl(var(--ink)/0.25)]"
    >
      {/* Vertical hairline column + animated Navy fill behind the dots */}
      <div className="absolute inset-x-0 top-3 bottom-3 flex justify-center pointer-events-none">
        <span
          aria-hidden="true"
          className="block w-px bg-rule h-full relative"
        >
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-navy rounded-full"
            style={{
              height: `${Math.max(0, Math.min(1, scrollPct)) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </span>
      </div>

      {chapters.map((c, idx) => {
        const active =
          c.id === "" ? activeId === HOME_ID : activeId === c.id;
        const passed = idx <= activeIndex;
        return (
          <button
            key={c.id || HOME_ID}
            type="button"
            onClick={() => onJump(c)}
            aria-label={`Gå til ${c.label}`}
            aria-current={active ? "true" : undefined}
            className={`group relative z-10 w-10 h-10 inline-flex items-center justify-center rounded-full transition-colors duration-quick ease-editorial ${
              active
                ? "bg-navy text-on-navy shadow-md"
                : "bg-paper-deep/60 hover:bg-paper-deep"
            }`}
          >
            {/* Dot */}
            <span
              aria-hidden="true"
              className={`block rounded-full transition-all duration-normal ease-editorial ${
                active
                  ? "h-2 w-2 bg-on-navy"
                  : passed
                  ? "h-1.5 w-1.5 bg-navy/70 group-hover:h-2 group-hover:w-2"
                  : "h-1.5 w-1.5 bg-rule-strong group-hover:bg-ink group-hover:h-2 group-hover:w-2"
              }`}
            />
            {/* Hover label — floats LEFT, away from content edge */}
            <span
              aria-hidden="true"
              className="absolute right-[calc(100%+0.65rem)] top-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-xs uppercase tracking-widest text-on-navy opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-quick ease-editorial pointer-events-none bg-navy px-2.5 py-1 rounded-sm shadow-md"
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function SideRails({ chapters = CHAPTERS }: { chapters?: Chapter[] }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Build ids list for the activeSection hook — skip the synthetic "home" entry
  const ids = useMemo(
    () => chapters.filter((c) => c.id !== "").map((c) => c.id),
    [chapters],
  );

  const sectionActive = useActiveSection(ids);

  // If user is above the first section, show HOME as active.
  const [aboveFirst, setAboveFirst] = useState(true);
  useEffect(() => {
    const firstId = ids[0];
    if (!firstId) return;
    const compute = () => {
      const el = document.getElementById(firstId);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setAboveFirst(window.scrollY + window.innerHeight * 0.35 < top);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);

  const activeId = aboveFirst ? HOME_ID : sectionActive;

  // Index of active chapter (for "X / N" counter + node-passed coloring)
  const activeIndex = useMemo(() => {
    if (activeId === HOME_ID) return 0;
    const i = chapters.findIndex((c) => c.id === activeId);
    return i === -1 ? 0 : i;
  }, [activeId, chapters]);

  // Overall scroll progress (0..1) used by the Navy fill on the right rail.
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : window.scrollY / max;
      setScrollPct(Math.max(0, Math.min(1, pct)));
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const onHomepage = location.pathname === "/";

  const handleJump = (chapter: Chapter) => {
    if (chapter.id === "") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        navigate("/");
      }
      return;
    }
    const href = `#${chapter.id}`;
    if (location.pathname === "/") {
      const el = document.getElementById(chapter.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(chapter.id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  if (!onHomepage) return null;

  // Right rail temporarily hidden — flip to bring back the reading-progress
  // indicator. Typed `boolean` so it reads as a real toggle, not a constant
  // expression the linter rejects.
  const showRightRail: boolean = false;

  return (
    <>
      <LeftRail chapters={chapters} activeId={activeId} onJump={handleJump} />
      {showRightRail && (
        <SlimRightRail
          chapters={chapters}
          activeId={activeId}
          activeIndex={activeIndex}
          scrollPct={scrollPct}
          onJump={handleJump}
        />
      )}
    </>
  );
}
