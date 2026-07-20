import {
  Monitor,
  LayoutDashboard,
  Smartphone,
  Zap,
  Database,
  GitBranch,
  ScrollText,
  Plug,
  ChevronDown,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  Sidenote,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { cn } from "@/lib/utils";

type Node = {
  id: string;
  label: string;
  sub: string;
  Icon: typeof Monitor;
  /** Optional small sidenote marker number */
  marker?: number;
};

const clients: Node[] = [
  {
    id: "web",
    label: "Web",
    sub: "Innbygger-app · Digdir designsystem",
    Icon: Monitor,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    sub: "Admin · multi-tenant · RBAC",
    Icon: LayoutDashboard,
  },
  {
    id: "mobile",
    label: "Mobil",
    sub: "iOS · iPadOS · Android (RN)",
    Icon: Smartphone,
  },
];

const runtime: Node = {
  id: "convex",
  label: "Convex",
  sub: "Reaktiv runtime: sanntid uten polling",
  Icon: Zap,
  marker: 1,
};

const infra: Node[] = [
  {
    id: "postgres",
    label: "PostgreSQL 16",
    sub: "Lagret i Norge og EU",
    Icon: Database,
  },
  {
    id: "outbox",
    label: "Outbox-buss",
    sub: "Transaksjonelle hendelser",
    Icon: GitBranch,
    marker: 2,
  },
  {
    id: "audit",
    label: "Revisjon",
    sub: "Audit-log + RBAC",
    Icon: ScrollText,
    marker: 3,
  },
  {
    id: "integrations",
    label: "Integrasjoner",
    sub: "Vipps · BankID · Visma · EHF · RCO",
    Icon: Plug,
  },
];

const ArchNode = ({
  node,
  size = "md",
  accent = false,
}: {
  node: Node;
  size?: "md" | "lg";
  /** Highlight this as the hero of the diagram (the reactive runtime). */
  accent?: boolean;
}) => {
  const Icon = node.Icon;
  const isLg = size === "lg";
  return (
    <article
      className={cn(
        "group relative flex flex-col h-full rounded-md bg-gradient-to-br from-paper to-paper-deep border transition-all duration-quick ease-editorial",
        "shadow-[0_2px_10px_-4px_rgba(10,18,40,0.14)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-16px_rgba(10,18,40,0.4)]",
        accent
          ? "border-accent-text/40 ring-1 ring-accent-text/15"
          : "border-hairline-strong hover:border-ink/40",
        isLg ? "p-6 lg:p-8" : "p-5 lg:p-6",
      )}
    >
      {node.marker && (
        <span
          aria-hidden="true"
          className="absolute -top-3 -right-3 inline-flex items-center justify-center w-7 h-7 bg-navy text-on-navy rounded-full font-mono text-[11px] tabular-nums shadow-hairline"
        >
          {node.marker}
        </span>
      )}

      {/* live badge on the reactive runtime */}
      {accent && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 editorial-mono-caption text-accent-text">
          <span className="relative flex h-2 w-2">
            <span className="motion-reduce:hidden absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-text/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-text" />
          </span>
          Sanntid
        </span>
      )}

      <div
        className={cn(
          "flex items-center gap-3 lg:gap-4",
          isLg ? "mb-2" : "mb-1.5",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-md shrink-0 ring-1",
            accent
              ? "bg-accent-text/10 text-accent-text ring-accent-text/25"
              : "bg-navy/[0.04] text-accent-text ring-hairline-strong",
            isLg ? "w-14 h-14" : "w-11 h-11 lg:w-12 lg:h-12",
          )}
        >
          <Icon
            className={isLg ? "h-7 w-7" : "h-5 w-5 lg:h-6 lg:w-6"}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <h3
          className={cn(
            "font-serif text-ink leading-tight",
            isLg ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl",
          )}
          style={{
            fontVariationSettings: getFraunces("sub"),
            letterSpacing: "-0.015em",
          }}
        >
          {node.label}
        </h3>
      </div>
      <p
        className={cn(
          "text-ink-soft leading-snug",
          isLg ? "text-base lg:text-lg" : "text-sm lg:text-base",
        )}
      >
        {node.sub}
      </p>
    </article>
  );
};

/**
 * Vertical flow connector between two architecture layers. Centered, so it
 * stays aligned to the converging/diverging node rows at any width (unlike a
 * fixed-viewBox SVG). A signal dot travels down the spine to convey the
 * reactive data flow; it's hidden under prefers-reduced-motion.
 */
const FlowConnector = ({ note }: { note?: string }) => {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col items-center my-2 lg:my-3"
    >
      {note && (
        <span className="editorial-mono-caption text-ink-faint text-center px-2 mb-1.5">
          {note}
        </span>
      )}
      <div className="relative h-9 lg:h-12 w-px bg-gradient-to-b from-rule-strong/20 via-rule-strong to-rule-strong/20">
        {!reduce && (
          <motion.span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-text ring-4 ring-accent-text/15"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5,
            }}
          />
        )}
        <ChevronDown
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-4 w-4 text-rule-strong"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};

const ArchitectureSection = () => {
  return (
    <section id="arkitektur" className="py-16 lg:py-24 bg-paper">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="ARKITEKTUR" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12 lg:mb-16">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Schema.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Tre klienter mot én reaktiv runtime, med transaksjonell
              hendelsesbus og fullstendig revisjon.
            </p>
          </div>
        </div>

        {/* Architecture diagram — hand-laid editorial illustration */}
        <figure className="relative">
          <div className="relative bg-gradient-to-br from-paper-deep/50 to-paper border border-hairline-strong rounded-lg p-6 sm:p-10 lg:p-14 overflow-hidden">
            {/* Decorative grid background */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none text-ink/[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="arch-grid"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#arch-grid)" />
            </svg>

            {/* Soft glow behind the reactive core */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/5 rounded-full bg-accent-text/[0.05] blur-3xl pointer-events-none"
            />

            <div className="relative">
              {/* Layer label — KLIENTER */}
              <div className="flex items-center gap-3 mb-4 lg:mb-5">
                <span className="editorial-mono-caption text-accent-text">
                  I · KLIENTER
                </span>
                <span className="flex-1 h-px bg-rule" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {clients.map((n) => (
                  <ArchNode key={n.id} node={n} />
                ))}
              </div>

              {/* Connector — clients → runtime */}
              <FlowConnector note="Sanntidsabonnement" />

              {/* Layer label — RUNTIME */}
              <div className="flex items-center gap-3 mb-4 lg:mb-5">
                <span className="editorial-mono-caption text-accent-text">
                  II · REAKTIV RUNTIME
                </span>
                <span className="flex-1 h-px bg-rule" />
              </div>
              <div className="max-w-2xl mx-auto">
                <ArchNode node={runtime} size="lg" accent />
              </div>

              {/* Connector — runtime → infra */}
              <FlowConnector note="Transaksjonell skriving" />

              {/* Layer label — INFRA */}
              <div className="flex items-center gap-3 mb-4 lg:mb-5">
                <span className="editorial-mono-caption text-accent-text">
                  III · LAGRING · BUSS · SAMSVAR · INTEGRASJONER
                </span>
                <span className="flex-1 h-px bg-rule" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {infra.map((n) => (
                  <ArchNode key={n.id} node={n} />
                ))}
              </div>
            </div>
          </div>

          <figcaption className="mt-4 flex items-baseline justify-between editorial-mono-caption">
            <span className="text-ink-faint">
              FIG. II · Systemarkitektur (forenklet)
            </span>
            <span className="text-ink-faint">
              3 KLIENTER · 1 RUNTIME · 4 TJENESTER
            </span>
          </figcaption>
        </figure>

        {/* Numbered annotations */}
        <div className="mt-12 lg:mt-16 grid lg:grid-cols-3 gap-6 lg:gap-8">
          <Sidenote marker={1}>
            <strong className="font-serif italic text-ink not-italic">
              Convex
            </strong>{" "}
            er en reaktiv runtime: spørringer abonnerer på data og oppdateres
            umiddelbart når underliggende tabeller endres, uten polling, uten
            refresh.
          </Sidenote>
          <Sidenote marker={2}>
            <strong className="font-serif italic text-ink not-italic">
              Outbox-bussen
            </strong>{" "}
            sikrer transaksjonell publisering: hendelsen lagres i samme
            transaksjon som mutasjonen, og distribueres deretter til
            abonnenter med backoff og dead-letter.
          </Sidenote>
          <Sidenote marker={3}>
            <strong className="font-serif italic text-ink not-italic">
              Revisjonsloggen
            </strong>{" "}
            registrerer hver mutasjon (booking, godkjenning, prisendring,
            sletting) med tidsstempel, brukerident og endringsdetaljer.
            Uforanderlig og eksporterbar.
          </Sidenote>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
