import { ReactNode } from "react";
import { SectionRule, EditorialHeading } from "@/components/editorial";

interface SectionHeaderProps {
  /** Eyebrow label (rendered as the SectionRule). */
  label: string;
  /** Heading content — pass an <em> for the italic emphasis word. */
  children: ReactNode;
  /** Optional supporting text in the right column. */
  intro?: ReactNode;
  /** Optional action (link/buttons) rendered under the intro on the right. */
  action?: ReactNode;
  /** id for the heading, when the <section> uses aria-labelledby. */
  headingId?: string;
  /** Override the bottom margin (defaults to the standard section-header gap). */
  className?: string;
}

/**
 * The standard section header used across the homepage: an eyebrow label and a
 * serif heading on the left, with optional regular-sans supporting text (and an
 * optional action) on the right. One component so every section that has a
 * title + right-hand text aligns and reads identically.
 */
export function SectionHeader({
  label,
  children,
  intro,
  action,
  headingId,
  className = "mb-10 lg:mb-14",
}: SectionHeaderProps) {
  return (
    <>
      <SectionRule label={label} />
      <div
        className={`grid lg:grid-cols-12 gap-6 lg:gap-gutter items-start ${className}`}
      >
        <div className="lg:col-span-7">
          <EditorialHeading as="h2" size="section" id={headingId}>
            {children}
          </EditorialHeading>
        </div>
        {(intro || action) && (
          <div className="lg:col-span-5 flex flex-col gap-5">
            {intro && (
              <p className="text-lg text-ink-soft leading-relaxed">{intro}</p>
            )}
            {action}
          </div>
        )}
      </div>
    </>
  );
}

export default SectionHeader;
