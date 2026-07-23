import { EditorialHeading, SectionRule, EditorialButton } from "@/components/editorial";
import { Check, RefreshCw } from "lucide-react";

const CHANNELS = ["Airbnb", "Booking.com", "Bookup", "Eventum", "Finn"];

const BENEFITS = [
  "Synk kalender, priser og tilgjengelighet automatisk",
  "Legg til nye oppføringer uten dobbeltarbeid",
  "Alltid oppdatert — aldri dobbeltbookinger",
  "Én admin for alle kanaler",
];

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

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter items-center mt-2">
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
                href="/booking-av-lokaler-og-moterom"
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
        </div>
      </div>
    </section>
  );
}

export default ChannelSyncSection;
