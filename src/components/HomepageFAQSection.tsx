import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { HOMEPAGE_FAQ } from "@/content/faq";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";

/**
 * Homepage FAQ accordion. Renders HOMEPAGE_FAQ (the single source of truth,
 * mirrored in the FAQPage JSON-LD) as native <details> elements — every answer
 * stays in the DOM whether open or closed, so it's crawlable, prerenders
 * cleanly, and works without JS. The visible copy matches the schema, which is
 * what makes it an answer-engine (AEO) surface, not just decoration.
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="border-t border-rule"
        >
          {HOMEPAGE_FAQ.map((item, i) => (
            <motion.details
              key={item.q}
              variants={staggerChild}
              open={i === 0}
              className="group border-b border-rule"
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none py-6 lg:py-7 [&::-webkit-details-marker]:hidden">
                <h3
                  className="font-serif text-xl lg:text-2xl text-ink leading-snug transition-colors duration-quick group-open:text-accent-text"
                  style={{
                    fontVariationSettings: getFraunces("sub"),
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border border-hairline-strong text-accent-text transition-transform duration-normal ease-editorial group-open:rotate-45"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </summary>
              <div className="pb-7 lg:pb-8 -mt-1 lg:pr-16">
                <p className="text-base lg:text-lg text-ink-soft measure leading-relaxed">
                  {item.a}
                </p>
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomepageFAQSection;
