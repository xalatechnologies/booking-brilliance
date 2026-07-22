import { ReactNode } from "react";
import { cn, logoWebpSrc } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";

interface StoryStat {
  label: string;
  value: string;
}

interface StoryCardProps {
  meta: string[];
  headline: string;
  customer: string;
  logoSrc?: string;
  dek?: string;
  body: ReactNode;
  quote?: { text: string; byline?: string; role?: string };
  stats?: StoryStat[];
  cta?: ReactNode;
  className?: string;
}

export function StoryCard({
  meta,
  headline,
  customer,
  logoSrc,
  dek,
  body,
  quote,
  stats,
  cta,
  className,
}: StoryCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col h-full gap-6 p-8 lg:p-10 rounded-lg border border-rule bg-gradient-to-br from-paper to-paper-deep shadow-[0_2px_14px_-6px_rgba(10,18,40,0.15)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_22px_48px_-24px_rgba(10,18,40,0.45)]",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 editorial-mono-caption">
          {meta.map((label, i) => (
            <span key={label} className="flex items-center gap-3">
              <span>{label}</span>
              {i < meta.length - 1 && (
                <span className="w-px h-3 bg-rule" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
        {logoSrc ? (
          // Fixed w+h box (not h-12 + w-auto) so the badge's footprint is
          // reserved before the logo decodes, regardless of its intrinsic
          // aspect ratio — same technique as the customer logos in
          // HeroSection, which avoids a CLS-scoring shift of the header's
          // justify-between layout as each image loads in.
          <span className="shrink-0 inline-flex items-center justify-center h-12 w-20 px-3 rounded-md border border-rule bg-paper">
            <picture>
              {logoWebpSrc(logoSrc) && (
                <source type="image/webp" srcSet={logoWebpSrc(logoSrc)} />
              )}
              <img
                src={logoSrc}
                alt={customer}
                className="max-h-6 max-w-full object-contain"
                loading="lazy"
              />
            </picture>
          </span>
        ) : (
          <span
            className="font-serif text-sm text-ink-faint"
            style={{ fontVariationSettings: '"opsz" 36, "wght" 460' }}
          >
            {customer}
          </span>
        )}
      </header>

      <h3
        className="font-serif text-3xl md:text-4xl text-ink"
        style={{
          fontVariationSettings: getFraunces("section"),
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
        }}
      >
        {headline}
      </h3>

      {dek && <p className="text-lg text-ink-soft measure">{dek}</p>}

      <div className="text-base text-ink-soft measure leading-relaxed">
        {body}
      </div>

      {quote && (
        <blockquote
          className="border-l-2 border-accent-text pl-5 text-lg lg:text-xl italic text-ink"
          style={{ fontVariationSettings: getFraunces("body-italic") }}
        >
          &ldquo;{quote.text}&rdquo;
          {(quote.byline || quote.role) && (
            <footer className="mt-3 editorial-mono-caption not-italic">
              {quote.byline}
              {quote.byline && quote.role && " · "}
              {quote.role}
            </footer>
          )}
        </blockquote>
      )}

      {stats && stats.length > 0 && (
        <div className="mt-auto grid grid-cols-3 gap-4 border-t border-rule pt-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <span
                className="font-serif text-3xl lg:text-[2.5rem] leading-none text-ink tabular-nums"
                style={{
                  fontVariationSettings: getFraunces("section"),
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </span>
              <span className="editorial-mono-caption text-ink-faint leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {cta && <div className="pt-1">{cta}</div>}
    </article>
  );
}
