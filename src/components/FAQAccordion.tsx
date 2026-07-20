import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { getFraunces } from "@/lib/fonts";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";

export interface FAQItem {
  q: string;
  a: string;
}

/**
 * Presentational FAQ accordion. Native <details> elements so every answer
 * stays in the DOM whether open or closed — crawlable, prerenders cleanly,
 * works without JS. Shared by the homepage FAQ and the /teknologi page; the
 * caller owns the surrounding section, heading and the matching FAQPage schema
 * so the visible copy always equals the structured data.
 */
export function FAQAccordion({
  items,
  openFirst = true,
}: {
  items: FAQItem[];
  /** Render the first item expanded (nice default for a short list). */
  openFirst?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent}
      className="border-t border-rule"
    >
      {items.map((item, i) => (
        <motion.details
          key={item.q}
          variants={staggerChild}
          open={openFirst && i === 0}
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
  );
}

export default FAQAccordion;
