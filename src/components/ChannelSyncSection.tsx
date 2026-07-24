import { motion } from "framer-motion";
import { EditorialHeading, SectionRule, EditorialButton } from "@/components/editorial";
import { Check, RefreshCw, Link2, Sparkles, FileCheck } from "lucide-react";
import { revealUp, viewportOnce } from "@/lib/motion";

const CHANNELS = ["Airbnb", "Booking.com", "Bookup", "Eventum", "Finn"];

const BENEFITS = [
  "Synk kalender, priser og tilgjengelighet automatisk",
  "Legg til nye oppføringer uten dobbeltarbeid",
  "Alltid oppdatert — aldri dobbeltbookinger",
  "Én admin for alle kanaler",
];

// AI-agent import: paste a listing URL from any source and the agent extracts
// everything into a ready-to-publish Digilist draft — so hosts onboard without
// re-keying and can keep using both platforms.
const IMPORT_STEPS = [
  {
    icon: Link2,
    title: "Lim inn lenken",
    body: "Fra Finn, Airbnb, Eventum — eller hvilken som helst kilde.",
  },
  {
    icon: Sparkles,
    title: "Agenten henter alt",
    body: "Tekst, bilder, kalender, priser og konfigurasjon — automatisk.",
  },
  {
    icon: FileCheck,
    title: "Ferdig utkast",
    body: "Gjennomgå, juster og publiser. Ingen manuell inntasting.",
  },
];

const IMPORT_SOURCES = ["Finn", "Airbnb", "Eventum", "Booking.com", "+ alle kilder"];

/**
 * Channel-sync ("channel manager") value prop: connect the systems the host
 * already uses (Airbnb, Booking.com, Bookup, Eventum, Finn) and Digilist keeps
 * calendar + availability in two-way sync automatically — no double work,
 * consistent availability everywhere.
 */
export function ChannelSyncSection() {
  return (
    <section
      id="kanaler"
      className="py-14 lg:py-20 bg-paper-tinted border-y border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="KANALER · TOVEIS SYNK" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealUp}
          className="grid lg:grid-cols-12 gap-10 lg:gap-gutter items-center mt-2"
        >
          {/* Copy */}
          <div className="lg:col-span-6">
            <EditorialHeading as="h2" size="section">
              Én kalender.{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: '"opsz" 96, "wght" 400' }}
              >
                alle kanaler
              </em>
              .
            </EditorialHeading>

            <p className="mt-5 text-lg text-ink-soft measure leading-relaxed">
              Har du lokaler på Airbnb, Booking.com, Bookup eller Eventum? Koble
              dem til Digilist én gang — så holdes kalender og tilgjengelighet i
              sync automatisk. Ingen dobbeltarbeid, ingen dobbeltbookinger,
              alltid oppdatert overalt.
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
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

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <EditorialButton
                variant="primary"
                size="lg"
                href="/bookingsystem-utleie"
              >
                Se hvordan synk fungerer
              </EditorialButton>
              <EditorialButton variant="outline" size="lg" href="/book-demo">
                Book en demo
              </EditorialButton>
            </div>
          </div>

          {/* Two-way sync hub */}
          <div className="lg:col-span-6">
            <div className="rounded-lg border border-rule bg-paper p-8 lg:p-10 shadow-[0_14px_44px_-26px_rgba(10,18,40,0.4)]">
              <p className="editorial-mono-caption text-ink-faint text-center">
                Dine kanaler
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {CHANNELS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 shadow-[0_1px_2px_rgba(10,18,40,0.06)] px-4 py-2 text-sm font-medium text-ink transition-all duration-quick ease-editorial hover:border-accent-text/40 hover:-translate-y-0.5 hover:shadow-[0_7px_16px_-7px_rgba(10,18,40,0.3)]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="my-6 flex flex-col items-center gap-1.5 text-accent-text">
                <RefreshCw className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                <span className="editorial-mono-caption">Toveis synk · sanntid</span>
              </div>

              <div className="rounded-md border border-accent-text/30 bg-gradient-to-b from-paper to-paper-deep shadow-[inset_0_1px_0_hsl(0_0%_100%/0.5),0_2px_6px_-1px_rgba(10,18,40,0.12),0_14px_30px_-16px_rgba(10,18,40,0.3)] px-5 py-5 text-center">
                <p className="editorial-mono-caption text-accent-text">Digilist</p>
                <p
                  className="mt-1.5 font-serif text-xl lg:text-2xl text-ink"
                  style={{ letterSpacing: "-0.015em", lineHeight: 1.15 }}
                >
                  Én kalender, alltid oppdatert
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI-agent import — copy an existing listing over from any source
            (data, images, calendar, config) into a ready Digilist draft, so
            hosts onboard without re-keying and keep using both platforms. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealUp}
          className="mt-12 lg:mt-16 rounded-lg border border-rule bg-paper p-6 lg:p-10 shadow-[0_14px_44px_-26px_rgba(10,18,40,0.4)]"
        >
          <div className="lg:max-w-3xl">
            <p className="editorial-mono-caption text-accent-text mb-3">
              AI-agent · import
            </p>
            <h3
              className="font-serif text-2xl lg:text-3xl text-ink"
              style={{ letterSpacing: "-0.015em", lineHeight: 1.1 }}
            >
              La agenten flytte oppføringene dine
            </h3>
            <p className="mt-3 text-ink-soft measure leading-relaxed">
              Har du allerede oppføringer på Finn, Airbnb eller Eventum? Lim inn
              lenken, så henter AI-agenten data, bilder, kalender og konfigurasjon
              — og lager et ferdig utkast i Digilist. Du godkjenner, og kan trygt
              fortsette å bruke begge plattformer.
            </p>
          </div>

          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {IMPORT_STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="group relative rounded-md border border-rule bg-gradient-to-br from-paper to-paper-deep/60 p-5 shadow-[0_1px_2px_rgba(10,18,40,0.05),0_10px_24px_-18px_rgba(10,18,40,0.3)] transition-all duration-quick ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_30px_-16px_rgba(10,18,40,0.4)]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-tinted text-accent-text ring-1 ring-accent-text/20">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[0.7rem] tracking-widest text-ink-faint">
                    0{i + 1}
                  </span>
                </div>
                <p
                  className="mt-3 font-serif text-lg text-ink"
                  style={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
                >
                  {title}
                </p>
                <p className="mt-1 text-sm text-ink-soft leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="editorial-mono-caption text-ink-faint">Kilder</span>
            {IMPORT_SOURCES.map((s) => (
              <span
                key={s}
                className="rounded-full border border-rule bg-gradient-to-b from-paper to-paper-deep/70 px-3.5 py-1.5 text-sm font-medium text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ChannelSyncSection;
