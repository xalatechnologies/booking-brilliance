import { CheckCircle2, ArrowUpRight, Package, ClipboardList } from "lucide-react";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  Byline,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { openChatbot } from "@/lib/chatbot/open";

const DELIVERS = [
  "Sanntids tilgjengelighetskalender",
  "Enkel booking og forespørsler",
  "Håndtering av sesongleie for lag og foreninger",
  "Oversikt over lokaler og idrettsanlegg",
  "Digital saksbehandlingsflyt",
  "Administrativ godkjenning av forespørsler",
  "Fakturagrunnlag og betalingsoversikt",
  "Mobilvennlig og universelt utformet løsning",
  "Enkel administrasjon og oppdatering av innhold",
  "Bedre synlighet av kommunale tilbud og aktiviteter",
];

const NEEDS = [
  "Lokaler eller anlegg kommunen administrerer",
  "Korte beskrivelser",
  "Bilder eller lenker, dersom tilgjengelig",
  "Kontaktinformasjon",
  "Eventuell informasjon om booking eller sesongleie",
];

const PilotInvitationSection = () => {
  return (
    <section
      id="pilot"
      className="py-14 lg:py-20 bg-accent-tinted"
      aria-labelledby="pilot-heading"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="PILOT FOR NORSKE KOMMUNER" />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-gutter">
          {/* Left — invitation copy */}
          <div className="lg:col-span-7">
            <EditorialHeading
              as="h2"
              size="display"
              className="mb-8"
              {...({ id: "pilot-heading" } as object)}
            >
              En invitasjon til{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: getFraunces("display") }}
              >
                norske kommuner
              </em>
              .
            </EditorialHeading>

            <div className="space-y-5 text-lg text-ink-soft leading-relaxed measure">
              <p>
                Digilist er en moderne og universelt utformet plattform for
                håndtering og synliggjøring av kommunale lokaler, idrettsanlegg,
                møterom og arrangementer.
              </p>
              <p>
                Vi inviterer kommunen til å delta i et pilotinitiativ der vi
                hjelper med å gjøre kommunale utleieobjekter og aktiviteter mer
                tilgjengelige, enklere å administrere og lettere å finne for
                innbyggere, lag, organisasjoner og arrangører.
              </p>
              <p>
                <strong className="text-ink">
                  Målet er ikke å erstatte eksisterende løsninger
                </strong>{" "}
                eller arbeidsprosesser, men å utforske hvordan Digilist kan
                fungere som et moderne supplement for innbyggere og
                administrasjon.
              </p>
              <p className="text-ink font-medium">
                Vi hjelper med oppsett og publisering uten kostnad i pilotfasen.
                Kommunen får egen administrativ tilgang for videre drift.
              </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <EditorialButton
                variant="primary"
                size="lg"
                href="mailto:kontakt@digilist.no?subject=Pilot%20for%20kommune"
                icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              >
                Be om pilot
              </EditorialButton>
              <EditorialButton
                variant="outline"
                size="lg"
                icon={false}
                onClick={(e) => {
                  e.preventDefault();
                  openChatbot({ mode: "chat" });
                }}
              >
                Snakk med oss
              </EditorialButton>
            </div>

            <Byline
              author="Ibrahim Rahmani"
              role="Xala Technologies AS"
              date="Oslo · 2026"
              className="mt-10"
            />
          </div>

          {/* Right — what we deliver + what we need */}
          <div className="lg:col-span-5 space-y-6">
            <EditorialCard className="bg-paper">
              <header className="mb-6 pb-5 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text mb-3 block">
                  TILBUDSPAKKE
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                    <Package
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Digilist{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings:
                          '"opsz" 36, "wght" 420',
                      }}
                    >
                      leverer
                    </em>
                  </h3>
                </div>
              </header>
              <ul className="space-y-3.5">
                {DELIVERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="h-4 w-4 mt-1 shrink-0 text-accent-text"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span
                      className="text-base lg:text-[1.0625rem] text-ink leading-snug"
                      style={{
                        fontVariationSettings: '"opsz" 24, "wght" 400',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </EditorialCard>

            <EditorialCard className="bg-paper">
              <header className="mb-6 pb-5 border-b border-rule">
                <span className="editorial-mono-caption text-accent-text mb-3 block">
                  INPUT FRA KOMMUNEN
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 border border-hairline-strong rounded-sm text-accent-text shrink-0">
                    <ClipboardList
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>
                  <h3
                    className="font-serif text-2xl lg:text-3xl text-ink leading-tight"
                    style={{
                      fontVariationSettings: getFraunces("sub"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Vi trenger{" "}
                    <em
                      className="italic"
                      style={{
                        fontVariationSettings:
                          '"opsz" 36, "wght" 420',
                      }}
                    >
                      fra kommunen
                    </em>
                  </h3>
                </div>
              </header>
              <ul className="space-y-3.5">
                {NEEDS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="h-4 w-4 mt-1.5 shrink-0 inline-flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent-text" />
                    </span>
                    <span
                      className="text-base lg:text-[1.0625rem] text-ink leading-snug"
                      style={{
                        fontVariationSettings: '"opsz" 24, "wght" 400',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className="mt-6 italic text-sm lg:text-base text-ink-faint border-t border-rule pt-5"
                style={{
                  fontFamily: '"Newsreader", Georgia, serif',
                  fontVariationSettings:
                    '"opsz" 24, "wght" 380',
                }}
              >
                Pilotfasen er gratis. Kommunen forplikter seg ikke til
                videre bruk eller anskaffelse.
              </p>
            </EditorialCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotInvitationSection;
