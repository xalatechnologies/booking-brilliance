import { Link } from "react-router-dom";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { SectionRule, EditorialHeading, EditorialCard, Byline } from "@/components/editorial";

export interface OccasionGuideRow {
  label: string;
  value: string;
}

export interface OccasionGuideStat {
  value: string;
  label: string;
  source: string;
}

export interface OccasionGuideLink {
  label: string;
  to: string;
}

export interface OccasionGuideProps {
  /** E-E-A-T — named author + role + human-readable update date. */
  author: string;
  role: string;
  updated: string;
  /** Heading for the planning section, e.g. "Slik planlegger du konfirmasjonen". */
  heading: string;
  /** 1–2 paragraphs of genuine, occasion-specific expertise. */
  intro: string[];
  /** Practical planning steps, in order. */
  checklist: string[];
  /** Honest specifics: timing, antall gjester, prisintervall (with caveats), format, praktiske hensyn. */
  guidance: OccasionGuideRow[];
  /** Optional real statistic with an attributable source (e.g. SSB). */
  stat?: OccasionGuideStat;
  /** Strong contextual internal links to relevant lokaltyper + the pillar/hub. */
  links: OccasionGuideLink[];
}

/**
 * Rich, occasion-specific planning section injected into UseCasePage via `extra`.
 * Genuine expertise a person planning the occasion would want — not a template:
 * a planning checklist, honest timing/capacity/price/format guidance, an optional
 * sourced statistic, contextual internal links, and an E-E-A-T byline.
 */
export function OccasionGuide({ author, role, updated, heading, intro, checklist, guidance, stat, links }: OccasionGuideProps) {
  return (
    <section className="mb-14 lg:mb-20">
      <SectionRule label="PLANLEGGING" />
      <div className="mt-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <EditorialHeading as="h2" size="lg">{heading}</EditorialHeading>
          <Byline author={author} role={role} date={updated} className="mt-4" />
          <div className="mt-6 space-y-4">
            {intro.map((p, i) => (
              <p key={i} className="text-ink-secondary leading-relaxed">{p}</p>
            ))}
          </div>

          <h3 className="mt-10 mb-4 text-sm font-semibold uppercase tracking-wide text-ink">Sjekkliste</h3>
          <ul className="space-y-3">
            {checklist.map((item, i) => (
              <li key={i} className="flex gap-3 text-ink-secondary">
                <CheckCircle2 className="h-5 w-5 flex-none text-accent mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {stat && (
            <EditorialCard as="div" className="mt-10 p-6">
              <p className="font-fraunces text-3xl text-ink leading-none">{stat.value}</p>
              <p className="mt-2 text-ink-secondary">{stat.label}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-ink-tertiary">Kilde: {stat.source}</p>
            </EditorialCard>
          )}
        </div>

        <div className="lg:col-span-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink">Godt å vite</h3>
          <dl className="divide-y divide-rule border-y border-rule">
            {guidance.map((row, i) => (
              <div key={i} className="py-4">
                <dt className="text-xs uppercase tracking-wide text-ink-tertiary">{row.label}</dt>
                <dd className="mt-1 text-ink-secondary">{row.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 mb-4 text-sm font-semibold uppercase tracking-wide text-ink">Passende lokaler og ressurser</h3>
          <ul className="space-y-2">
            {links.map((l, i) => (
              <li key={i}>
                <Link to={l.to} className="group inline-flex items-center gap-1.5 text-ink hover:text-accent transition-colors">
                  <span className="underline decoration-rule underline-offset-4 group-hover:decoration-accent">{l.label}</span>
                  <ArrowUpRight className="h-4 w-4 flex-none" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default OccasionGuide;
