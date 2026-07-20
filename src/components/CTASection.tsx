import { BookDemoBlock } from "@/components/BookDemoBlock";

// The homepage contact section. "Book en demo." (inside BookDemoBlock) is the
// section title, so no separate SectionRule eyebrow — the #kontakt anchor stays
// on the <section> for nav/footer links.
const CTASection = () => {
  return (
    <section id="kontakt" className="relative py-14 lg:py-20 bg-accent-tinted">
      <div className="container mx-auto md:px-8 lg:px-12">
        <BookDemoBlock source="homepage-kontakt" />
      </div>
    </section>
  );
};

export default CTASection;
