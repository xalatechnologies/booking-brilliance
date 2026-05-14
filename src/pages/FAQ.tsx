import { useMemo } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  ProgressRail,
} from "@/components/editorial";
import { FAQ_CATEGORIES, allFAQEntries } from "@/content/faq";
import { getFraunces } from "@/lib/fonts";

const FAQ = () => {
  const faqForSEO = useMemo(
    () => allFAQEntries().map((e) => ({ question: e.q, answer: e.a })),
    [],
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="FAQ — Digilist | Vanlige spørsmål om kommunal booking, sesongleie og samsvar"
        description="Svar på de vanligste spørsmålene om Digilist — bookingsystem for kommuner og utleiere. SSA-L 2026, GDPR, ISO 27001, Vipps, BankID, sesongleie og mer."
        canonical="https://digilist.no/faq"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "FAQ", url: "https://digilist.no/faq" },
        ]}
        faq={faqForSEO}
      />
      <ProgressRail />
      <Navbar />

      <main>
        <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
          <div className="container mx-auto px-4">
            <SectionRule label="DIGILIST · FAQ" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-12">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="display">
                  Vanlige{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("display") }}
                  >
                    spørsmål
                  </em>
                  .
                </EditorialHeading>
                <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                  Alt du trenger å vite om Digilist — fra SSA-L 2026 og GDPR
                  til sesongleie, betaling og integrasjoner.
                </p>
              </div>
            </div>

            <nav
              aria-label="Kategorier"
              className="border-t border-rule pt-6 pb-10"
            >
              <ul className="flex flex-wrap gap-x-6 gap-y-3 editorial-mono-caption">
                {FAQ_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#${cat.id}`}
                      className="text-accent-text hover:underline underline-offset-8 decoration-[0.5px]"
                    >
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-16 lg:space-y-24">
              {FAQ_CATEGORIES.map((cat) => (
                <section
                  key={cat.id}
                  id={cat.id}
                  aria-labelledby={`${cat.id}-heading`}
                  className="scroll-mt-32"
                >
                  <div className="border-t border-rule pt-8">
                    <span className="editorial-mono-caption text-accent-text">
                      {cat.label}
                    </span>
                    <h2
                      id={`${cat.id}-heading`}
                      className="font-serif text-3xl lg:text-5xl text-ink mt-3 mb-4"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.05,
                      }}
                    >
                      {cat.label}
                    </h2>
                    <p className="text-lg text-ink-soft measure leading-relaxed mb-10">
                      {cat.description}
                    </p>

                    <dl className="border-t border-rule">
                      {cat.questions.map((entry, idx) => (
                        <div
                          key={`${cat.id}-${idx}`}
                          className="border-b border-rule py-8 lg:py-10 grid lg:grid-cols-12 gap-4 lg:gap-gutter"
                        >
                          <dt className="lg:col-span-5">
                            <h3
                              className="font-serif text-2xl lg:text-3xl text-ink"
                              style={{
                                fontVariationSettings: getFraunces("sub"),
                                lineHeight: 1.15,
                              }}
                            >
                              {entry.q}
                            </h3>
                          </dt>
                          <dd className="lg:col-span-7">
                            <p className="text-base lg:text-lg text-ink-soft measure leading-relaxed">
                              {entry.a}
                            </p>
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-20 lg:mt-28 border-t border-rule pt-12">
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end">
                <div className="lg:col-span-8">
                  <span className="editorial-mono-caption text-accent-text">
                    FORTSATT SPØRSMÅL?
                  </span>
                  <h2
                    className="font-serif text-3xl lg:text-5xl text-ink mt-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                      lineHeight: 1.05,
                    }}
                  >
                    Snakk med oss direkte.
                  </h2>
                  <p className="mt-4 text-lg text-ink-soft measure leading-relaxed">
                    Vi svarer raskt på e-post, eller booker en gratis 30
                    minutters demo der vi viser plattformen i ditt bruksområde.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                  <EditorialButton variant="primary" size="md" href="/book-demo">
                    Book demo
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="md"
                    href="mailto:kontakt@digilist.no"
                  >
                    Send e-post
                  </EditorialButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
