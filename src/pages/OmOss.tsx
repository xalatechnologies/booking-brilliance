import { Building2 } from "lucide-react";
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
import { CategoryVisual } from "@/components/CategoryVisual";
import AboutUsSection from "@/components/AboutUsSection";

export default function OmOss() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Om Digilist: norsk bookingplattform fra Xala Technologies | Digilist"
        description="Digilist er utviklet av Xala Technologies AS, et norsk teknologiselskap på Nesbru. Vi bygger én plattform for utleie og kommunal booking, med samsvar og norsk datalagring."
        keywords="om digilist, xala technologies, norsk bookingplattform, leverandør bookingsystem, digilist selskap, nesbru"
        canonical="https://digilist.no/om-oss"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Om oss", url: "https://digilist.no/om-oss" },
        ]}
        aboutPage
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          {/* Hero */}
          <section className="pt-28 lg:pt-32 pb-8 lg:pb-12 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="OM DIGILIST" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-center">
                <div className="lg:col-span-7">
                  <EditorialHeading as="h1" size="display">
                    Én plattform for alt{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      som leies ut
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Digilist er utviklet av Xala Technologies AS, et norsk
                    teknologiselskap på Nesbru. Vi bygger digitale løsninger for
                    offentlig sektor og næringsliv, med samsvar, universell
                    utforming og norsk datalagring som utgangspunkt.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="/teknologi">
                      Teknologi &amp; sikkerhet
                    </EditorialButton>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <CategoryVisual
                    icon={Building2}
                    label="XALA TECHNOLOGIES AS · NESBRU"
                    aspect="4 / 3"
                    variant="primary"
                    eager
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Relocated colophon — the Fakta / manifest content, now on a
              focused, indexable URL instead of buried in the homepage scroll. */}
          <AboutUsSection />

          {/* Closing CTA */}
          <section className="pb-20 lg:pb-28 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
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
                      Snakk med folkene bak plattformen.
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Book en demo eller ta kontakt, så viser vi hvordan Digilist
                      passer for din kommune eller virksomhet.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton variant="primary" size="lg" href="/book-demo">
                      Book demo
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
