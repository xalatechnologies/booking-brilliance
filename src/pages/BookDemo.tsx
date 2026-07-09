import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SectionRule, ProgressRail } from "@/components/editorial";
import { BookDemoBlock } from "@/components/BookDemoBlock";

const BookDemo = () => {
  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <SEO
        title="Book demo av Digilist — Norsk bookingplattform for kommuner og utleiere"
        description="Be om en gratis 30–45 minutters demo av Digilist. Vi viser hvordan plattformen håndterer ditt bruksområde — kommune, selskapslokale, idrettsanlegg eller kulturhus."
        canonical="https://digilist.no/book-demo"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Book demo", url: "https://digilist.no/book-demo" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <article className="pt-28 lg:pt-32 pb-16 lg:pb-24">
            <div className="container mx-auto md:px-8 lg:px-12">
              <nav
                className="editorial-mono-caption mb-10"
                aria-label="Brødsmuler"
              >
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2 text-accent-text"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="group-hover:underline underline-offset-4 decoration-[0.5px]">
                    Tilbake til forsiden
                  </span>
                </Link>
              </nav>

              <SectionRule label="IX. KONTAKT" />
              <BookDemoBlock source="book-demo" showByline headingAs="h1" />
            </div>
          </article>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BookDemo;
