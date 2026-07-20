import { LayoutGrid, Users2, Gauge, Scaling, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { EditorialButton } from "@/components/editorial";
import { SectionHeader } from "@/components/SectionHeader";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

interface Value {
  Icon: LucideIcon;
  title: string;
  description: string;
}

// The four platform principles (merged from the old ValueProposition section)
// framed for the operator/kommune audience.
const VALUES: Value[] = [
  {
    Icon: LayoutGrid,
    title: "Alt samlet",
    description:
      "Bestilling, kalender, priser, vilkår og administrasjon i én plattform. Slutt med Excel, e-poster og dobbeltbookinger.",
  },
  {
    Icon: Users2,
    title: "Enkel å bruke",
    description:
      "Innbyggere og leietakere finner ledig tid, sender forespørsel og betaler uten opplæring. Universelt utformet, WCAG 2.0 AA.",
  },
  {
    Icon: Gauge,
    title: "Effektiv drift",
    description:
      "Automatiserte regler, godkjenninger og oversikt reduserer manuelt arbeid. Driftsroller varsles automatisk ved bookinger.",
  },
  {
    Icon: Scaling,
    title: "Skalerbar",
    description:
      "Fra ett selskapslokale til en kommune med tolv anlegg: sesongleie, lag og foreninger, tilskudd og fakturering.",
  },
];

/**
 * B2B lane — the single doorway for operators (utleiere) and municipalities
 * (kommuner). Consolidates the old ValueProposition principles, the Audience
 * "one platform, many uses" message and a teaser for the free kommune pilot,
 * with two clear next actions so a public-sector buyer can leave the homepage
 * for /bookingsystem-kommune without wading through B2C content.
 */
const B2BLaneSection = () => {
  return (
    <section
      id="for-utleiere"
      aria-labelledby="for-utleiere-heading"
      className="py-10 lg:py-14 bg-paper"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label="FOR UTLEIERE OG KOMMUNER"
          headingId="for-utleiere-heading"
          intro="Digilist drifter privat utleie og kommunal booking i samme løsning: privatbookinger, sesongleie til lag og foreninger, sambruk mellom avdelinger og innbyggerdialog med ID-porten."
        >
          Fra ett lokale til{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            hele kommunen
          </em>
          .
        </SectionHeader>

        {/* Four principles */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {VALUES.map((v) => {
            const Icon = v.Icon;
            return (
              <motion.article
                key={v.title}
                variants={staggerChild}
                className="group flex flex-col h-full rounded-lg bg-gradient-to-br from-paper to-paper-deep border border-hairline-strong p-6 lg:p-7 shadow-[0_2px_10px_-4px_rgba(10,18,40,0.12)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/40 hover:shadow-[0_18px_40px_-18px_rgba(10,18,40,0.4)]"
              >
                <header className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-accent-text/10 ring-1 ring-accent-text/25 text-accent-text shrink-0 transition-transform duration-normal ease-editorial group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3
                    className="font-serif text-lg lg:text-xl text-ink leading-snug"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {v.title}
                  </h3>
                </header>
                <p className="text-sm lg:text-base text-ink-soft leading-relaxed">
                  {v.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Pilot teaser + CTAs */}
        <div className="mt-8 lg:mt-10 rounded-lg border border-rule bg-paper p-6 lg:p-8 grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center">
          <div className="lg:col-span-8">
            <span className="editorial-mono-caption text-accent-text mb-2 block">
              GRATIS PILOT FOR NORSKE KOMMUNER
            </span>
            <p className="text-base lg:text-lg text-ink leading-relaxed">
              Vi hjelper kommunen med oppsett og publisering uten kostnad i
              pilotfasen, og dere får egen administrativ tilgang for videre
              drift. Målet er å supplere eksisterende prosesser, ikke erstatte
              dem.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
            <EditorialButton
              variant="primary"
              size="lg"
              href="/bookingsystem-kommune"
              icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
            >
              Se løsning for kommuner
            </EditorialButton>
            <EditorialButton
              variant="outline"
              size="lg"
              icon={false}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("kontakt");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Book demo
            </EditorialButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BLaneSection;
