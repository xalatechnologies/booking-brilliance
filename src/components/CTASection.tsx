import { SectionRule } from "@/components/editorial";
import { BookDemoBlock } from "@/components/BookDemoBlock";

const CTASection = () => {
  return (
    <section id="kontakt" className="relative py-14 lg:py-20 bg-accent-tinted">
      <div className="container mx-auto px-4">
        <SectionRule label="IX. KONTAKT" />
        <BookDemoBlock source="homepage-kontakt" />
      </div>
    </section>
  );
};

export default CTASection;
