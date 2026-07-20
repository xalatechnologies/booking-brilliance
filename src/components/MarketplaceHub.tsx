/**
 * MarketplaceHub — shared editorial hub layout for the B2C marketplace verticals
 * (/leie uses its own bespoke page; /overnatting, /utstyr and /tjenester use
 * this). Renders a hero, a grouped category grid that links to the per-category
 * SEO guides, a "slik funker det" step list, FAQ and a closing CTA.
 */
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, type LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import {
  CategoryVisual,
  imageForSlug,
  bundledSrcSet,
} from "@/components/CategoryVisual";

/** The category slug is the last segment of its route (e.g. /overnatting/hytte). */
function slugOf(to: string): string {
  return to.split("/").filter(Boolean).pop() ?? "";
}

export interface HubCategory {
  title: string;
  Icon: LucideIcon;
  to: string;
  body: string;
}

export interface HubGroup {
  label: string;
  meta: string;
  items: HubCategory[];
}

export interface HubStep {
  step: string;
  Icon: LucideIcon;
  title: string;
  body: string;
}

export interface HubFaqItem {
  question: string;
  answer: string;
}

export interface MarketplaceHubProps {
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  canonical: string;
  sectionLabel: string;
  breadcrumbsSeo: Array<{ name: string; url: string }>;
  /** Optional hero photo (right of the heading). */
  heroImage?: string;
  /** Icon used for the hero visual's illustration fallback. */
  heroIcon?: LucideIcon;
  /** Hero H1 (rich node with an <em> allowed). */
  heroHeading: ReactNode;
  heroLead: string;
  heroCta: { label: string; href: string };
  videoLabel: string;
  videoCaption: string;
  categoryCaption: string;
  categoryMeta: string;
  groups: HubGroup[];
  stepsMeta: string;
  steps: HubStep[];
  faq: HubFaqItem[];
  closingTitle: string;
  closingBody: string;
  closingCta: { label: string; href: string };
  howTo?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string }>;
  };
}

export default function MarketplaceHub({
  seoTitle,
  seoDescription,
  keywords,
  canonical,
  sectionLabel,
  breadcrumbsSeo,
  heroImage,
  heroIcon,
  heroHeading,
  heroLead,
  heroCta,
  videoLabel,
  videoCaption,
  categoryCaption,
  categoryMeta,
  groups,
  stepsMeta,
  steps,
  faq,
  closingTitle,
  closingBody,
  closingCta,
  howTo,
}: MarketplaceHubProps) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={canonical}
        breadcrumbs={breadcrumbsSeo}
        faq={faq.map((f) => ({ q: f.question, a: f.answer }))}
        service
        howTo={howTo}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label={sectionLabel} />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-center">
                <div className={heroImage ? "lg:col-span-7" : "lg:col-span-9"}>
                  <EditorialHeading as="h1" size="display">
                    {heroHeading}
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    {heroLead}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={heroCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heroCta.label}
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="#slik">
                      Slik funker det
                    </EditorialButton>
                  </div>
                </div>
                {heroImage && (
                  <div className="lg:col-span-5">
                    <CategoryVisual
                      icon={heroIcon ?? Sparkles}
                      label={`DIGILIST · ${sectionLabel}`}
                      src={heroImage}
                      aspect="4 / 3"
                      variant="primary"
                      eager
                    />
                  </div>
                )}
              </div>

              {/* Explainer video */}
              <div>
                <VideoPlaceholder label={videoLabel} caption={videoCaption} />
              </div>
            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Categories */}
              <div>
                <div className="flex items-baseline justify-between mb-8 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    {categoryCaption}
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                    {categoryMeta}
                  </span>
                </div>
                <div className="space-y-10 lg:space-y-14">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <div className="flex items-baseline justify-between mb-4">
                        <h3 className="editorial-mono-caption text-ink">
                          {group.label}
                        </h3>
                        <span className="editorial-mono-caption text-ink-faint hidden sm:inline">
                          {group.meta}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                        {group.items.map((c) => {
                          const Icon = c.Icon;
                          const photo = imageForSlug(slugOf(c.to));
                          return (
                            <Link
                              key={c.title}
                              to={c.to}
                              className="group bg-paper border border-rule rounded-2xl flex flex-col shadow-md transition-all duration-300 ease-editorial hover:-translate-y-1 hover:shadow-2xl hover:border-accent-text/40"
                            >
                              <div className="p-1.5 lg:p-2">
                                <div
                                  className="relative w-full overflow-hidden rounded-xl ring-1 ring-ink/10 bg-paper-deep"
                                  style={{ aspectRatio: "16 / 9" }}
                                >
                                  {photo ? (
                                    <img
                                      src={photo}
                                      srcSet={bundledSrcSet(photo)}
                                      sizes="(min-width: 640px) 45vw, 90vw"
                                      alt=""
                                      aria-hidden="true"
                                      className="h-full w-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.06]"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <CategoryVisual
                                      icon={Icon}
                                      aspect="16 / 9"
                                      variant="texture"
                                      className="!border-0 !rounded-none"
                                    />
                                  )}
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/0 to-ink/0"
                                  />
                                  <span className="absolute left-4 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-paper/90 backdrop-blur-sm border border-hairline-strong text-navy shadow-sm transition-transform duration-quick ease-editorial group-hover:-translate-y-0.5">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </div>
                              </div>
                              <div className="px-6 lg:px-7 pb-6 lg:pb-7 pt-1 flex flex-col flex-1">
                                <header className="flex items-center gap-3 mb-2">
                                  <h4
                                    className="font-serif text-2xl text-ink leading-tight flex-1"
                                    style={{
                                      fontVariationSettings: getFraunces("sub"),
                                      letterSpacing: "-0.015em",
                                    }}
                                  >
                                    {c.title}
                                  </h4>
                                  <ArrowUpRight
                                    className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                  />
                                </header>
                                <p className="text-base text-ink leading-relaxed flex-1">
                                  {c.body}
                                </p>
                                <p className="mt-4 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                                  Les mer
                                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* How it works */}
              <div id="slik" className="scroll-mt-28">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    SLIK FUNKER DET
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    {stepsMeta}
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {steps.map((s, i) => {
                    const Icon = s.Icon;
                    return (
                      <li
                        key={s.step}
                        className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${i > 0 ? "border-t border-rule" : ""}`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-[2.5rem] lg:-left-[3.5rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 bg-paper border border-hairline-strong rounded-sm font-mono text-xs text-accent-text tabular-nums"
                        >
                          {s.step}
                        </span>
                        <div className="col-span-12 lg:col-span-4">
                          <h3
                            className="font-serif text-2xl lg:text-3xl text-ink inline-flex items-center gap-3"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            <Icon
                              className="h-6 w-6 text-accent-text"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            {s.title}
                          </h3>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                          <p className="text-base lg:text-lg text-ink leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper-tinted border-y border-rule">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* FAQ */}
              <div>
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    OFTE STILTE SPØRSMÅL
                  </h2>
                </div>
                <dl className="divide-y divide-rule border-b border-rule">
                  {faq.map((q, i) => (
                    <div key={i} className="py-6 grid lg:grid-cols-12 gap-4">
                      <dt className="lg:col-span-5 font-serif text-xl text-ink leading-tight">
                        {q.question}
                      </dt>
                      <dd className="lg:col-span-7 text-base text-ink leading-relaxed">
                        {q.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

            </div>
          </section>

          <section className="py-12 lg:py-16 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Closing CTA */}
              <EditorialCard className="bg-paper-deep/40">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
                  <div className="lg:col-span-8">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      {closingTitle}
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      {closingBody}
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={closingCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {closingCta.label}
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
