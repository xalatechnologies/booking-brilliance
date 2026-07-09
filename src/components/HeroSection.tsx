import { motion } from "framer-motion";
import {
  EditorialButton,
  EditorialHeading,
  IntegrationLogo,
} from "@/components/editorial";
import { HeroPlatformPreview } from "./HeroPlatformPreview";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

const customers = [
  {
    name: "Rønningen Selskapslokale",
    sector: "Selskapslokale",
    location: "Asker",
    src: "/clients/ronning.png",
  },
  {
    name: "Nordre Follo kommune",
    sector: "Kommune",
    location: "Viken",
    src: "/clients/nordre-follo.svg",
  },
  {
    name: "RightSize Group",
    sector: "Coworking",
    location: "Nesbru",
  },
  {
    name: "Lier Bygdetun",
    sector: "Selskapslokale",
    location: "Lierbyen",
  },
];

const integrationsByCategory = [
  {
    category: "Betaling",
    items: ["Vipps", "Stripe Connect"],
  },
  {
    category: "Autentisering",
    items: ["BankID", "ID-porten", "Signicat"],
  },
  {
    category: "Offentlig",
    items: ["Altinn", "EHF / Peppol", "Brønnøysund"],
  },
  {
    category: "Regnskap",
    items: ["Visma", "Tripletex", "Fiken", "PowerOffice"],
  },
  {
    category: "Kalender & nøkkel",
    items: ["Microsoft 365", "Outlook", "Salto KS"],
  },
  {
    category: "Samsvar",
    items: ["ISO 27001/27701", "GDPR", "WCAG 2.0 AA"],
  },
];

const HeroSection = () => {
  return (
    <section
      id="hjem"
      className="relative pt-20 lg:pt-24 pb-0 overflow-hidden"
    >
      <div className="container mx-auto md:px-8 lg:px-12 pt-4 lg:pt-6 pb-20 lg:pb-28">
        {/* Hero is above-the-fold — paint in final state immediately so
            Lighthouse measures LCP correctly. The on-mount fade-in was
            blowing LCP up to 12.8s because framer-motion held the
            content at opacity:0 until hydration + animation completed.
            Children below the fold still use whileInView for scroll reveals. */}
        <motion.div
          variants={staggerParent}
          className="grid grid-cols-12 gap-6 lg:gap-gutter items-start"
        >
          <motion.div
            variants={staggerChild}
            className="col-span-12 lg:col-span-7"
          >
            <span className="editorial-mono-caption mb-6 inline-block">
              Bookingplattform · 2026 · Norge
            </span>

            <EditorialHeading as="h1" size="hero" wonk>
              Én plattform for alt som{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 144, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                leies ut
              </em>
              .
            </EditorialHeading>

            <p
              className="mt-8 text-lg lg:text-xl text-ink-soft measure leading-relaxed"
              style={{ fontVariationSettings: '"wght" 380' }}
            >
              Selskapslokaler, idrettshaller, møterom, kantiner og kulturhus.
              Sanntidskalender, betaling, sesongleie og fakturering:{" "}
              <em
                style={{
                  fontVariationSettings: '"wght" 420, "SOFT" 30',
                  fontStyle: "italic",
                }}
              >
                én digital plattform
              </em>{" "}
              for det norske utleiemarkedet.
            </p>

            <div className="mt-8 border-y border-rule py-5">
              <p className="editorial-mono-caption mb-4">
                Sertifisert · Integrert · Norsk
              </p>
              <ul
                className="flex flex-wrap items-center gap-x-5 gap-y-3"
                aria-label="Sertifiseringer og integrasjoner"
              >
                {[
                  "ISO 27001",
                  "ISO 27701",
                  "GDPR",
                  "WCAG 2.0 AA",
                  "Vipps",
                  "BankID",
                  "ID-porten",
                  "EHF / Peppol",
                  "Visma",
                  "RCO",
                  "Outlook",
                ].map((brand) => (
                  <li key={brand}>
                    <IntegrationLogo brand={brand} />
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-base text-ink-soft measure">
              I daglig bruk hos{" "}
              <span className="text-ink font-medium">Nordre Follo kommune</span>,{" "}
              <span className="text-ink font-medium">Rønningen Selskapslokale</span>,{" "}
              <span className="text-ink font-medium">Lier Bygdetun</span> og{" "}
              <span className="text-ink font-medium">RightSize Group</span>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <EditorialButton
                variant="primary"
                size="lg"
                href="https://app.digilist.no"
                target="_blank"
                rel="noopener noreferrer"
              >
                Åpne plattformen
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
          </motion.div>

          <motion.div
            variants={staggerChild}
            className="col-span-12 lg:col-span-5 mt-12 lg:mt-0"
          >
            <HeroPlatformPreview />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent}
        className="border-y border-rule"
      >
        <div className="container mx-auto md:px-8 lg:px-12 py-12 lg:py-14">
          <div className="flex items-baseline justify-between gap-6 mb-10">
            <span className="editorial-mono-caption">Kunder · I bruk</span>
            <span className="editorial-mono-caption text-ink-faint hidden md:inline">
              To av flere: referanser på forespørsel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-sm overflow-hidden">
            {customers.map((c) => (
              <article
                key={c.name}
                aria-label={c.name}
                className="bg-paper px-6 lg:px-10 py-8 lg:py-10 flex items-center gap-6 min-h-[7.5rem]"
              >
                <div className="shrink-0 w-20 h-20 rounded-sm border border-rule bg-paper-deep flex items-center justify-center overflow-hidden">
                  {c.src ? (
                    <img
                      src={c.src}
                      alt={`${c.name} logo`}
                      className="max-w-[80%] max-h-[80%] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="font-serif text-3xl text-accent-text"
                      style={{ fontVariationSettings: getFraunces("section") }}
                    >
                      {c.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  {/* Customer label — not a heading: these cards sit right
                      under the hero <h1>, so an <h3> here skipped a level
                      (H1→H3) and tripped the a11y heading-order audit. The
                      <article aria-label> keeps each card named for AT. */}
                  <p
                    className="font-serif text-2xl lg:text-[1.75rem] text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {c.name}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="editorial-mono-caption text-accent-text">
                      {c.sector}
                    </span>
                    <span className="w-px h-3 bg-rule" aria-hidden="true" />
                    <span className="editorial-mono-caption">{c.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent}
        className="border-b border-rule bg-paper-deep/40"
      >
        <div className="container mx-auto md:px-8 lg:px-12 py-12 lg:py-14">
          <div className="flex items-baseline justify-between gap-6 mb-10">
            <span className="editorial-mono-caption">
              Integrasjoner & samsvar
            </span>
            <span className="editorial-mono-caption text-ink-faint hidden md:inline">
              Bygget for det norske utleiemarkedet
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-rule border-y border-rule">
            {integrationsByCategory.map((col) => (
              <motion.div
                key={col.category}
                variants={staggerChild}
                className="bg-paper-deep/40 px-5 py-8 flex flex-col gap-3"
              >
                <span className="editorial-mono-caption text-accent-text">
                  {col.category}
                </span>
                <ul className="space-y-2.5 mt-2">
                  {col.items.map((item) => (
                    <li key={item}>
                      <IntegrationLogo brand={item} />
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
