import { motion } from "framer-motion";
import { SectionRule, EditorialHeading } from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const values = [
  {
    numeral: "I",
    title: "Alt på ett sted",
    description:
      "Bestilling, kalender, priser, vilkår og administrasjon samlet i én plattform. Slutt med Excel, e-poster og dobbeltbookinger.",
  },
  {
    numeral: "II",
    title: "Enkel for brukere",
    description:
      "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring. Universelt utformet, WCAG 2.0 AA.",
  },
  {
    numeral: "III",
    title: "Effektiv for administrasjon",
    description:
      "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid. Driftsroller varsles automatisk ved bookinger.",
  },
  {
    numeral: "IV",
    title: "Skalerbar løsning",
    description:
      "Tilpasset alt fra ett selskapslokale til kommune med tolv anlegg. Sesongleie, lag og foreninger, tilskudd og fakturering.",
  },
];

const ValuePropositionSection = () => {
  return (
    <section id="verdi" className="py-14 lg:py-20 bg-paper">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="I. PLATTFORMEN" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Fire prinsipper.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Hvorfor velge Digilist? Fire grunner som gjelder uansett størrelse,
              fra ett lokale til en hel kommune.
            </p>
          </div>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="border-t border-rule"
        >
          {values.map((v) => (
            <motion.li
              key={v.numeral}
              variants={staggerChild}
              className="grid grid-cols-12 gap-6 lg:gap-gutter py-10 lg:py-14 border-b border-rule"
            >
              <div className="col-span-2 lg:col-span-1">
                <span
                  className="font-mono text-2xl lg:text-3xl text-accent-text tabular-nums"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {v.numeral}
                </span>
              </div>
              <div className="col-span-10 lg:col-span-7">
                <h3
                  className="font-serif text-3xl lg:text-4xl text-ink mb-4"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    lineHeight: 1.1,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {v.title}
                </h3>
                <p className="text-lg text-ink-soft measure leading-relaxed">
                  {v.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
