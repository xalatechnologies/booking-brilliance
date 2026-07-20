import { SectionRule } from "@/components/editorial";
import { BookDemoBlock } from "@/components/BookDemoBlock";

// The homepage contact section. "BOOK EN DEMO" is the section eyebrow (same
// style as every other section label); BookDemoBlock renders without its big
// display heading so there's no duplicate title. The #kontakt anchor stays on
// the <section> for nav/footer links.
const CTASection = () => {
  return (
    <section id="kontakt" className="relative py-10 lg:py-14 bg-accent-tinted border-t border-rule">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="BOOK EN DEMO" />
        <BookDemoBlock source="homepage-kontakt" heading={false} />
      </div>
    </section>
  );
};

export default CTASection;
