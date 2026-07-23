import { motion } from "framer-motion";
import {
  EditorialButton,
  EditorialHeading,
} from "@/components/editorial";
import { Check, Zap, Accessibility, ShieldCheck, CalendarCheck } from "lucide-react";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";
import { logoWebpSrc } from "@/lib/utils";

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
          <motion.div variants={staggerChild} className="col-span-12 lg:col-span-7">
            <span className="editorial-mono-caption mb-6 inline-block">
              Bookingplattform · 2026 · Norge
            </span>

            {/* XAL-316: this H1 is the confirmed LCP element (verified via
                PerformanceObserver's largest-contentful-paint entry, not a
                guess) — not the hero image below. Don't add an image
                preload/fetchpriority here; see docs/xal-316-lcp-handoff.md. */}
            <EditorialHeading as="h1" size="hero">
              Lokaler du trenger,{" "}
              <em
                className="italic"
                style={{
                  fontVariationSettings: '"opsz" 144, "wght" 400',
                }}
              >
                og plattformen som drifter det
              </em>
              .
            </EditorialHeading>

            <p className="mt-8 text-lg lg:text-xl text-ink-soft measure leading-relaxed">
              Finn og book lokaler med ekte priser og ledige datoer — betal trygt
              med Vipps. Og for utleiere og kommuner: plattformen som drifter det
              hele, fra kalender til oppgjør.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <EditorialButton variant="primary" size="lg" href="/leie">
                Finn ledig lokale
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

            <ul className="mt-9 space-y-3">
              {[
                "Ekte priser og ledige datoer i sanntid",
                "Betal trygt med Vipps eller faktura",
                "Bygd for norske krav — BankID, GDPR og universell utforming",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink-soft">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent-text"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="text-base lg:text-lg">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product preview — a browser-window mockup of the live app, with a
              row of feature cards beneath it. The reel is cropped near-native
              16:9 so the app fills the window edge-to-edge (no letterbox band
              under the URL bar). */}
          <motion.div
            variants={staggerChild}
            className="col-span-12 lg:col-span-5 mt-8 lg:mt-0"
          >
            <div className="w-full">
              {/* Browser window */}
              <div className="rounded-xl border border-rule bg-[#0a1628] shadow-[0_44px_100px_-44px_rgba(10,18,40,0.65)] overflow-hidden">
                {/* Chrome bar */}
                <div className="flex items-center gap-2 h-10 px-4 border-b border-white/[0.06] bg-[#0d1c33]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
                  <span className="ml-3 inline-flex flex-1 max-w-[240px] items-center justify-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[0.7rem] tracking-wide text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" aria-hidden="true" />
                    app.digilist.no
                  </span>
                </div>
                <video
                  className="w-full block"
                  style={{ aspectRatio: "16 / 9" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/videos/digilist-hero-demo-poster.jpg"
                  aria-label="Digilist i praksis — fra søk til booking"
                >
                  <source src="/videos/digilist-hero-demo.webm" type="video/webm" />
                  <source src="/videos/digilist-hero-demo.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Feature cards — the value + norske-krav story, under the demo. */}
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                {[
                  { icon: Zap, label: "Book på 90 sekunder", sub: "Enkelt og raskt" },
                  { icon: Accessibility, label: "Universelt utformet", sub: "WCAG 2.1 AA" },
                  { icon: ShieldCheck, label: "BankID & Vipps", sub: "Trygg betaling" },
                  { icon: CalendarCheck, label: "Ledige datoer i sanntid", sub: "Ekte priser" },
                ].map(({ icon: Icon, label, sub }) => (
                  <li
                    key={label}
                    className="group flex items-center gap-3 rounded-lg border border-rule bg-gradient-to-br from-paper to-paper-deep/60 px-3.5 py-3 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_24px_-18px_rgba(10,18,40,0.3)] transition-all duration-quick ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_30px_-16px_rgba(10,18,40,0.4)]"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-tinted text-accent-text ring-1 ring-accent-text/20">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="text-sm font-semibold text-ink truncate">{label}</p>
                      <p className="editorial-mono-caption text-ink-faint mt-0.5 truncate">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Two doors: renter (Privat) + operator (Bedrift) — side by side */}
          <motion.div
            variants={staggerChild}
            className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch mt-10 lg:mt-14"
          >
            {/* Privat door */}
            <div className="group flex flex-col border border-rule rounded-sm p-6 lg:p-7 bg-gradient-to-br from-paper to-paper-deep/60 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]">
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
                ledig dato og betaling med Vipps. Book direkte, uten ringerunder
                eller ventetid på svar, med alt samlet på ett sted.
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
              <div className="mt-auto pt-6">
                <EditorialButton variant="primary" size="lg" href="/leie">
                  Finn lokale
                </EditorialButton>
              </div>
            </div>

            {/* Bedrift door */}
            <div className="group flex flex-col border border-rule rounded-sm p-6 lg:p-7 bg-gradient-to-br from-paper-deep/60 to-paper-tinted/40 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_28px_-20px_rgba(10,18,40,0.28)] transition-all duration-normal ease-editorial hover:-translate-y-1 hover:border-accent-text/30 hover:shadow-[0_24px_48px_-24px_rgba(10,18,40,0.5)]">
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
                innebygd etterlevelse (GDPR, universell utforming, NSM). Ett
                system som erstatter regneark, e-post og løse betalingsløsninger,
                slik at dere beholder full oversikt og kontroll. Innbyggere, lag
                og foreninger booker selv, hele døgnet, uten telefonkø og uten
                dobbeltbookinger.
              </p>
              <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
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

        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent}
        className="border-y border-rule bg-paper-tinted"
      >
        <div className="container mx-auto md:px-8 lg:px-12 py-12 lg:py-14">
          <div className="flex items-baseline justify-between gap-6 mb-8 lg:mb-10">
            <span className="editorial-mono-caption text-accent-text">
              Kunder · I bruk
            </span>
            <span className="editorial-mono-caption text-ink-faint hidden md:inline">
              To av flere: referanser på forespørsel
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {customers.map((c) => (
              <motion.article
                key={c.name}
                variants={staggerChild}
                aria-label={c.name}
                className="group bg-paper rounded-lg border border-rule shadow-[0_2px_10px_-4px_rgba(10,18,40,0.12)] px-6 lg:px-7 py-6 lg:py-7 flex items-center gap-5 transition-all duration-normal ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_34px_-18px_rgba(10,18,40,0.45)]"
              >
                <div className="shrink-0 w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] rounded-lg border border-rule bg-paper-deep flex items-center justify-center overflow-hidden">
                  {c.src ? (
                    <picture>
                      {logoWebpSrc(c.src) && (
                        <source type="image/webp" srcSet={logoWebpSrc(c.src)} />
                      )}
                      <img
                        src={c.src}
                        alt={`${c.name} logo`}
                        className="max-w-[78%] max-h-[78%] object-contain"
                        loading="lazy"
                      />
                    </picture>
                  ) : (
                    <span
                      className="font-serif text-3xl text-accent-text"
                      style={{ fontVariationSettings: getFraunces("section") }}
                    >
                      {c.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  {/* Customer label, not a heading: these cards sit right under
                      the hero <h1>, so an <h3> here would skip a level (H1->H3)
                      and trip the a11y heading-order audit. The <article
                      aria-label> keeps each card named for assistive tech. */}
                  <p
                    className="font-serif text-xl lg:text-2xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {c.name}
                  </p>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="editorial-mono-caption text-accent-text">
                      {c.sector}
                    </span>
                    <span className="w-px h-3 bg-rule" aria-hidden="true" />
                    <span className="editorial-mono-caption">{c.location}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
