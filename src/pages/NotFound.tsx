import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="404 · Siden ble ikke funnet | Digilist"
        description="Vi fant ikke siden du leter etter. Gå til forsiden, blogg eller FAQ for å fortsette."
        robots="noindex, follow"
      />
      <ProgressRail />
      <Navbar />

      <main className="flex-1 flex items-center pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto md:px-8 lg:px-12">
          <SectionRule label="ERR. 404 · IKKE FUNNET" />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start mt-10 lg:mt-16">
            <div className="lg:col-span-7 lg:col-start-2">
              <span className="editorial-mono-caption text-accent-text mb-5 block">
                STATUS 404
              </span>
              <EditorialHeading as="h1" size="display" className="mb-6">
                Siden{" "}
                <em
                  className="italic"
                  style={{ fontVariationSettings: getFraunces("display") }}
                >
                  finnes ikke
                </em>
                .
              </EditorialHeading>
              <p className="text-xl text-ink-soft measure leading-relaxed mb-8">
                Lenken er kanskje feil, eller siden er flyttet. Du kan gå
                tilbake til forsiden, eller fortsette til en av de mest
                besøkte sidene under.
              </p>
              <div className="flex flex-wrap gap-3">
                <EditorialButton variant="primary" size="md" href="/">
                  Tilbake til forsiden
                </EditorialButton>
                <EditorialButton variant="outline" size="md" href="/blogg">
                  Til bloggen
                </EditorialButton>
                <EditorialButton variant="outline" size="md" href="/faq">
                  Vanlige spørsmål
                </EditorialButton>
              </div>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <div className="bg-paper border border-hairline-strong rounded-sm p-6">
                <h2
                  className="font-serif text-xl text-ink mb-4 pb-3 border-b border-rule"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Forslag
                </h2>
                <ul className="space-y-3 text-base text-ink-soft">
                  <li>
                    <Link
                      to="/bookingsystem-kommune"
                      className="hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      Bookingsystem for kommuner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/book-demo"
                      className="hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      Book demo
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blogg"
                      className="hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      Blogg
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-ink hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
