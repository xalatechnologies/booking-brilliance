import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HOMEPAGE_FAQ } from "@/content/faq";
import { getFraunces } from "@/lib/fonts";

/**
 * Homepage FAQ. Renders HOMEPAGE_FAQ (the single source of truth, mirrored in
 * the FAQPage JSON-LD) through the shared <FAQAccordion>. The visible copy
 * matches the schema, which is what makes it an answer-engine (AEO) surface,
 * not just decoration.
 */
const HomepageFAQSection = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 lg:py-24 bg-paper-deep/40 border-y border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="OFTE STILTE SPØRSMÅL" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14 items-end">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section" id="faq-heading">
              Ofte stilte{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: getFraunces("display") }}
              >
                spørsmål
              </em>
              .
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6 lg:items-end">
            <p className="text-lg text-ink-soft leading-relaxed lg:text-right">
              Det folk lurer mest på om Digilist — booking, betaling, sesongleie
              og samsvar. Finner du ikke svaret?
            </p>
            <EditorialButton variant="link" size="md" href="/faq">
              Se alle spørsmål
            </EditorialButton>
          </div>
        </div>

        <FAQAccordion items={HOMEPAGE_FAQ} />

      </div>
    </section>
  );
};

export default HomepageFAQSection;
