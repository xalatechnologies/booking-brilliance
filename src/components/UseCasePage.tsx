/**
 * UseCasePage — shared editorial layout for /bruksomrader/* deep-dive pages.
 *
 * Each /bruksomrader/<slug> page passes structured content (intro, audience,
 * problem, capability, stories, technical, FAQ) and the layout handles SEO,
 * breadcrumb, section rendering, and CTAs.
 */
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  EditorialButton,
  ProgressRail,
  SectionRule,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

export interface UseCaseAudience {
  persona: string;
  context: string;
}

export interface UseCaseFeature {
  title: string;
  body: string;
}

export interface UseCaseStory {
  customer: string;
  role: string;
  headline: string;
  body: string;
  outcome: Array<{ label: string; value: string }>;
}

export interface UseCaseTechnicalSpec {
  label: string;
  value: string;
}

export interface UseCaseFAQ {
  question: string;
  answer: string;
}

export interface UseCasePageProps {
  slug: string;
  /** e.g. "Selskapslokaler" — short noun for breadcrumb. */
  breadcrumb: string;
  /** Hero H1. */
  title: string;
  /** Hero subtitle/dek (single line, max ~120 chars). */
  dek: string;
  /** Long lead paragraph (~80–120 words). */
  lead: string;
  /** SEO meta title (≤65 chars). */
  seoTitle: string;
  /** SEO description (≤165 chars). */
  seoDescription: string;
  /** Comma-separated keywords for the meta tag. */
  keywords: string;
  audience: UseCaseAudience[];
  /** "Hva utfordringene er i dag" — 3–5 short bullets. */
  problems: string[];
  /** "Hva Digilist gjør med det" — 4–6 feature cards. */
  features: UseCaseFeature[];
  /** 2–3 user stories. */
  stories: UseCaseStory[];
  /** Tech spec rows. */
  technical: UseCaseTechnicalSpec[];
  /** 4–6 questions for this use case. */
  faq: UseCaseFAQ[];
  /** Related blog posts (link out). */
  relatedPosts: Array<{ title: string; slug: string }>;
  /** Optional sibling use-cases for cross-linking footer. */
  siblings?: Array<{ title: string; slug: string }>;
  /** Optional pull-quote rendered in the hero or mid-page. */
  pullQuote?: { text: string; byline: string };
  /** Optional inline ReactNode injected before FAQ. */
  extra?: ReactNode;
}

export default function UseCasePage({
  slug,
  breadcrumb,
  title,
  dek,
  lead,
  seoTitle,
  seoDescription,
  keywords,
  audience,
  problems,
  features,
  stories,
  technical,
  faq,
  relatedPosts,
  siblings,
  pullQuote,
  extra,
}: UseCasePageProps) {
  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical={`https://digilist.no/bruksomrader/${slug}`}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          {
            name: "Bruksområder",
            url: "https://digilist.no/booking-av-lokaler-og-moterom",
          },
          {
            name: breadcrumb,
            url: `https://digilist.no/bruksomrader/${slug}`,
          },
        ]}
        faq={faq}
        service
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <article className="pt-20 lg:pt-24 pb-16 lg:pb-24">
            <div className="container mx-auto md:px-8 lg:px-12">
              {/* Breadcrumb + section label */}
              <div className="flex items-baseline justify-between gap-4 mb-10 pb-4 border-b border-rule">
                <nav
                  className="editorial-mono-caption text-accent-text flex flex-wrap items-baseline gap-2"
                  aria-label="Brødsmuler"
                >
                  <Link to="/" className="hover:underline">
                    Hjem
                  </Link>
                  <span aria-hidden className="text-ink-faint">·</span>
                  <Link
                    to="/booking-av-lokaler-og-moterom"
                    className="hover:underline"
                  >
                    Bruksområder
                  </Link>
                  <span aria-hidden className="text-ink-faint">·</span>
                  <span className="text-ink">{breadcrumb}</span>
                </nav>
                <p className="editorial-mono-caption text-ink-faint hidden lg:block">
                  BRUKSOMRÅDE
                </p>
              </div>

              {/* Hero */}
              <header className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20 items-end">
                <div className="lg:col-span-8">
                  <h1
                    className="font-serif text-5xl lg:text-7xl text-ink leading-[1.04] tracking-tight"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    {title}
                  </h1>
                  <p
                    className="mt-6 text-xl lg:text-2xl text-ink measure leading-relaxed font-serif italic"
                    style={{ fontVariationSettings: getFraunces("quote") }}
                  >
                    {dek}
                  </p>
                </div>
                <div className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-rule">
                  <p className="text-base text-ink leading-relaxed">{lead}</p>
                </div>
              </header>

              {/* Audience */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="HVEM BRUKER DETTE" />
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {audience.map((a, i) => (
                    <div key={a.persona} className="bg-paper p-6 lg:p-7">
                      <header className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-[0.65rem] text-navy bg-navy/5 border border-navy/15 rounded-sm w-8 h-8 inline-flex items-center justify-center tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className="font-serif text-xl text-ink leading-tight flex-1"
                          style={{ fontVariationSettings: getFraunces("sub") }}
                        >
                          {a.persona}
                        </h3>
                      </header>
                      <p className="text-base text-ink leading-relaxed">
                        {a.context}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Problems */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="UTFORDRINGEN" />
                <div className="mt-8 grid lg:grid-cols-12 gap-8 lg:gap-gutter">
                  <div className="lg:col-span-5">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink leading-tight"
                      style={{ fontVariationSettings: getFraunces("section") }}
                    >
                      Det vi ser i dag
                    </h2>
                  </div>
                  <ul className="lg:col-span-7 space-y-3">
                    {problems.map((p, i) => (
                      <li
                        key={i}
                        className="flex gap-4 text-base text-ink-soft leading-relaxed border-b border-rule pb-3"
                      >
                        <span className="font-mono text-xs text-ink-faint pt-1 tabular-nums w-8 flex-shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Features */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="SLIK FUNGERER DET" />
                <h2
                  className="mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  Hva Digilist gjør for {breadcrumb.toLowerCase()}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                  {features.map((f) => (
                    <div key={f.title} className="bg-paper p-7">
                      <header className="flex items-center gap-3 mb-3">
                        <span className="flex-shrink-0 w-9 h-9 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <h3
                          className="font-serif text-xl text-ink leading-tight flex-1"
                          style={{ fontVariationSettings: getFraunces("sub") }}
                        >
                          {f.title}
                        </h3>
                      </header>
                      <p className="text-base text-ink leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pull quote */}
              {pullQuote && (
                <section className="mb-14 lg:mb-20">
                  <blockquote className="border-l-2 border-navy pl-6 lg:pl-10 max-w-3xl">
                    <p
                      className="font-serif italic text-3xl lg:text-4xl text-ink leading-tight"
                      style={{ fontVariationSettings: getFraunces("quote") }}
                    >
                      &ldquo;{pullQuote.text}&rdquo;
                    </p>
                    <footer className="mt-4 editorial-mono-caption text-ink-faint">
                      — {pullQuote.byline}
                    </footer>
                  </blockquote>
                </section>
              )}

              {/* User stories */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="BRUKERHISTORIER" />
                <h2
                  className="mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  Hvordan kunder bruker det
                </h2>
                <div className="grid lg:grid-cols-2 gap-px bg-rule border border-rule">
                  {stories.map((s, i) => (
                    <article key={i} className="bg-paper p-8">
                      <p className="editorial-mono-caption text-accent-text">
                        {s.customer.toUpperCase()} · {s.role.toUpperCase()}
                      </p>
                      <h3 className="font-serif text-2xl text-ink mt-2 mb-3 leading-tight">
                        {s.headline}
                      </h3>
                      <p className="text-base text-ink leading-relaxed mb-5">
                        {s.body}
                      </p>
                      <dl className="border-t border-rule pt-4 space-y-1.5">
                        {s.outcome.map((o, j) => (
                          <div
                            key={j}
                            className="flex items-baseline justify-between gap-3"
                          >
                            <dt className="text-sm text-ink-soft">{o.label}</dt>
                            <dd className="font-mono text-sm text-ink font-medium">
                              {o.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
                </div>
              </section>

              {/* Technical specs */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="TEKNISKE DETALJER" />
                <h2
                  className="mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  Hva som er bygget inn
                </h2>
                <div className="border border-rule rounded-sm overflow-hidden">
                  <dl className="divide-y divide-rule">
                    {technical.map((t, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 px-5 py-4"
                      >
                        <dt className="font-mono text-xs uppercase tracking-widest text-ink-faint pt-1">
                          {t.label}
                        </dt>
                        <dd className="text-base text-ink leading-relaxed">
                          {t.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              {extra}

              {/* FAQ */}
              <section className="mb-14 lg:mb-20">
                <SectionRule label="OFTE STILTE SPØRSMÅL" />
                <h2
                  className="mt-8 mb-10 font-serif text-3xl lg:text-4xl text-ink leading-tight max-w-prose"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  Spørsmål om {breadcrumb.toLowerCase()}
                </h2>
                <dl className="divide-y divide-rule border-t border-b border-rule">
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
              </section>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <section className="mb-14 lg:mb-20">
                  <SectionRule label="LES MER" />
                  <h2 className="mt-8 mb-8 font-serif text-3xl text-ink">
                    Relaterte artikler
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
                    {relatedPosts.map((p) => (
                      <Link
                        key={p.slug}
                        to={`/blogg/${p.slug}`}
                        className="bg-paper p-6 hover:bg-paper-deep/40 transition-colors flex flex-col group"
                      >
                        <p className="editorial-mono-caption text-accent-text mb-3">
                          ARTIKKEL
                        </p>
                        <h3 className="font-serif text-lg text-ink leading-tight mb-4 flex-1">
                          {p.title}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-text">
                          Les artikkel
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA */}
              <section className="mb-12">
                <SectionRule label="NESTE STEG" />
                <div className="mt-8 grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                  <div className="lg:col-span-7">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink leading-tight mb-3"
                      style={{ fontVariationSettings: getFraunces("section") }}
                    >
                      Vil du se det fungere?
                    </h2>
                    <p className="text-base text-ink-soft leading-relaxed">
                      Book 30 minutter — vi viser plattformen med dine
                      konkrete bookingscenarier. Ingen forpliktelser.
                    </p>
                  </div>
                  <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                    <EditorialButton
                      variant="outline"
                      size="lg"
                      href="https://app.digilist.no"
                    >
                      Åpne plattformen
                    </EditorialButton>
                  </div>
                </div>
              </section>

              {/* Sibling cross-links */}
              {siblings && siblings.length > 0 && (
                <section className="border-t border-rule pt-8 mt-12">
                  <p className="editorial-mono-caption text-ink-faint mb-4">
                    ANDRE BRUKSOMRÅDER
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {siblings.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/bruksomrader/${s.slug}`}
                        className="inline-flex items-center gap-1.5 border border-hairline rounded-sm px-3 py-1.5 text-sm hover:bg-paper-deep transition-colors text-ink"
                      >
                        {s.title}
                        <ArrowUpRight className="h-3 w-3 text-ink-faint" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
