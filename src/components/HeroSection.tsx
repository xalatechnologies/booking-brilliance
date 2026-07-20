import { motion } from "framer-motion";
import {
  EditorialButton,
  EditorialHeading,
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
          {/* Unified H1 spanning both audiences */}
          <motion.div variants={staggerChild} className="col-span-12">
            <span className="editorial-mono-caption mb-6 inline-block">
              Bookingplattform · 2026 · Norge
            </span>

            <EditorialHeading as="h1" size="hero" wonk>
              Lokalet du trenger{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 144, "wght" 400, "SOFT" 30, "WONK" 0',
                }}
              >
                — og plattformen som drifter det
              </em>
              .
            </EditorialHeading>

            <p
              className="mt-8 text-lg lg:text-xl text-ink-soft measure leading-relaxed"
              style={{ fontVariationSettings: '"wght" 380' }}
            >
              Digilist samler lokaler du kan leie, og gir utleiere og kommuner
              plattformen som drifter dem. Finn et lokale, eller book en demo.
            </p>
          </motion.div>

          {/* Two doors: renter (Privat) + operator (Bedrift) */}
          <motion.div
            variants={staggerChild}
            className="col-span-12 lg:col-span-7 flex flex-col gap-4 mt-8 lg:mt-10"
          >
            {/* Privat door */}
            <div className="border border-rule rounded-sm p-6 lg:p-7 bg-paper">
              <p className="editorial-mono-caption text-accent-text mb-3">
                ◆ For deg som skal leie
              </p>
              <h2
                className="font-serif text-2xl lg:text-3xl text-ink"
                style={{
                  fontVariationSettings: getFraunces("sub"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                Finn og book lokale, der du bor
              </h2>
              <p className="mt-2 text-base text-ink-soft leading-relaxed">
                Grendehus, kulturhus og selskapslokaler samlet, med ekte pris,
                ledig dato og betaling med Vipps.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Selskapslokale", "Møterom", "Kulturhus", "Idrettshall"].map((c) => (
                  <span
                    key={c}
                    className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft border border-rule rounded-full px-3 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <EditorialButton variant="primary" size="lg" href="/leie">
                  Finn lokale
                </EditorialButton>
              </div>
            </div>

            {/* Bedrift door */}
            <div className="border border-rule rounded-sm p-6 lg:p-7 bg-paper-deep/30">
              <p className="editorial-mono-caption text-ink-faint mb-3">
                ■ For utleier &amp; kommune
              </p>
              <h2
                className="font-serif text-2xl lg:text-3xl text-ink"
                style={{
                  fontVariationSettings: getFraunces("sub"),
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                Plattformen som drifter utleien
              </h2>
              <p className="mt-2 text-base text-ink-soft leading-relaxed">
                Booking, sesongtildeling og innbyggerdialog i én plattform, med
                innebygd etterlevelse (GDPR, universell utforming, NSM).
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <EditorialButton
                  variant="primary"
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
                <EditorialButton
                  variant="outline"
                  size="lg"
                  href="https://app.digilist.no"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Åpne plattformen
                </EditorialButton>
              </div>
            </div>
          </motion.div>

          {/* Product preview */}
          <motion.div
            variants={staggerChild}
            className="col-span-12 lg:col-span-5 mt-8 lg:mt-10"
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

    </section>
  );
};

export default HeroSection;
