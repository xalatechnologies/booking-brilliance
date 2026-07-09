import { motion } from "framer-motion";
import {
  SectionRule,
  EditorialHeading,
  DropCap,
  PullQuote,
} from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const segments = [
  {
    title: "Idrettshaller & svømmehaller",
    body: "Hele eller halve haller, gymsaler, fotballbaner. Sanntid, sesongleie og lag-/foreningsfordeling.",
  },
  {
    title: "Selskapslokaler & kulturhus",
    body: "Selskap, bryllup, jubileer, konserter, kurs. Depositum, leieavtale og digital nøkkel.",
  },
  {
    title: "Møterom & kantiner",
    body: "Kommunale, næring og foreninger. Sambruk mellom avdelinger, prising og varsling av drift.",
  },
  {
    title: "Ressurser & tjenester",
    body: "AV-utstyr, instrumenter, kjøretøy, vaktmestertjenester. Pakker og legg-til-tjenester på booking.",
  },
];

const AudienceSection = () => {
  return (
    <section
      id="bruksomrader"
      className="py-14 lg:py-20 bg-paper-deep/40"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="II. PUBLIKUM" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-10 lg:mb-14">
          <div className="lg:col-span-8">
            <EditorialHeading as="h2" size="section">
              Én plattform.{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                Mange bruksområder.
              </em>
            </EditorialHeading>
          </div>
        </div>

        <div className="columns-1 lg:columns-2 gap-12 mb-12 text-ink-soft">
          <DropCap>
            Digilist er bygd for norske utleiere — fra eieren av et selskapslokale med
            bookinger til kommunale fritidsetater med tolv anlegg. Den samme plattformen
            håndterer privatbookinger, sesongleie til lag og foreninger, sambruk mellom
            avdelinger og offentlige bookinger med kommunal innbyggerautentisering via
            ID-porten.
          </DropCap>
          <p className="mt-6 text-lg leading-relaxed">
            Betaling tas direkte via Vipps eller kort med øyeblikkelig kvittering.
            Driftsroller — vaktmestere, renholdspersonell, vektere — varsles
            automatisk når en booking bekreftes. Faktura og bilag genereres til
            ditt regnskapssystem (Visma, Tripletex, Fiken, PowerOffice, DNB
            Regnskap eller EHF/Peppol).
          </p>
          <PullQuote
            byline="Kommunal kulturkonsulent"
            role="Bruker av Digilist"
            className="my-10"
          >
            Vi har redusert dobbeltbookinger til null og fått tilbake fire timer i
            uka som tidligere gikk til regnearkjusteringer.
          </PullQuote>
          <p className="text-lg leading-relaxed">
            Plattformen er universelt utformet, oppfyller WCAG 2.0 AA, GDPR og er
            ISO 27001/27701-sertifisert. Alle data lagres i Norge og Europa.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule"
        >
          {segments.map((s) => (
            <motion.div
              key={s.title}
              variants={staggerChild}
              className="bg-paper p-6 lg:p-8 min-h-[12rem] flex flex-col"
            >
              <h3
                className="font-serif text-xl lg:text-2xl text-ink mb-3"
                style={{
                  fontVariationSettings: getFraunces("sub"),
                  fontStyle: "normal",
                  letterSpacing: "0",
                }}
              >
                {s.title}
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AudienceSection;
