import { motion } from "framer-motion";
import { SectionRule, EditorialHeading } from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const steps = [
  {
    step: "01",
    title: "Søknad",
    description:
      "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart.",
  },
  {
    step: "02",
    title: "Godkjenning",
    description:
      "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie.",
  },
  {
    step: "03",
    title: "Bekreftelse",
    description:
      "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller — vaktmester, renhold, vekter — varsles automatisk.",
  },
  {
    step: "04",
    title: "Oppfølging",
    description:
      "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="funksjonalitet"
      className="py-14 lg:py-20 bg-paper-deep/40"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="IV. FUNKSJONALITET" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Booking med{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                få steg.
              </em>
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Fra forespørsel til oppgjør — én sammenhengende prosess.
            </p>
          </div>
        </div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="relative border-l border-rule pl-10 lg:pl-14"
        >
          {steps.map((s, idx) => (
            <motion.li
              key={s.step}
              variants={staggerChild}
              className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-12 lg:py-16 ${
                idx > 0 ? "border-t border-rule" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[2.75rem] lg:-left-[3.75rem] top-12 lg:top-16 inline-flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-paper border border-hairline-strong rounded-sm font-mono text-xs tracking-widest text-accent-text tabular-nums"
              >
                {s.step}
              </span>
              <div className="col-span-12 lg:col-span-4">
                <span className="editorial-mono-caption text-ink-faint mb-3 block">
                  STEG {s.step} / {String(steps.length).padStart(2, "0")}
                </span>
                <h3
                  className="font-serif text-3xl lg:text-5xl text-ink"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {s.title}
                </h3>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <p className="text-lg lg:text-xl text-ink-soft measure leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
};

export default HowItWorksSection;
