import { EditorialButton } from "@/components/editorial";
import { SectionHeader } from "@/components/SectionHeader";
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
      className="py-10 lg:py-14 bg-paper"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label="OFTE STILTE SPØRSMÅL"
          headingId="faq-heading"
          intro="Det folk lurer mest på om Digilist: booking, betaling, sesongleie og samsvar. Finner du ikke svaret?"
          action={
            <EditorialButton variant="link" size="md" href="/faq">
              Se alle spørsmål
            </EditorialButton>
          }
        >
          Ofte stilte{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            spørsmål
          </em>
          .
        </SectionHeader>

        <FAQAccordion items={HOMEPAGE_FAQ} />

      </div>
    </section>
  );
};

export default HomepageFAQSection;
