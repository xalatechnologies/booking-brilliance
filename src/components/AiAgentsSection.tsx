import { motion } from "framer-motion";
import { ShieldCheck, MessagesSquare, CalendarClock, Sunrise, Compass, Wand2 } from "lucide-react";
import { SectionRule, EditorialHeading, EditorialButton } from "@/components/editorial";
import { staggerParent, staggerChild, viewportOnce } from "@/lib/motion";
import { getFraunces } from "@/lib/fonts";

// NOTE (for review): these are the real customer-facing "domain agents" from the
// Digilist agent fleet — see xala-agent-fleet/core/fleet-registry.ts (category:"domain").
// Descriptions are grounded in each agent's registry entry + prompts. Verify before publishing.

// The compliance frameworks the Listing Approver checks every listing against.
const frameworks = ["GDPR", "NSM", "SOC 2", "WCAG 2.1 AA", "Markedsføringsloven"];

const agents = [
  {
    icon: ShieldCheck,
    title: "Godkjenning & compliance",
    description:
      "Hver oppføring gjennomgås mot GDPR, NSM, SOC 2 og universell utforming — i både tekst og bilder — før den publiseres. Rent innhold godkjennes, resten stoppes med konkret veiledning.",
  },
  {
    icon: MessagesSquare,
    title: "Svar på henvendelser",
    description:
      "Kundeforespørsler får et varmt, korrekt førstesvar med én gang — leser formål, dato og antall. Klager, pris og juss løftes alltid til en saksbehandler.",
  },
  {
    icon: CalendarClock,
    title: "Sesongtildeling",
    description:
      "Gjennomgår og forklarer sesongtildeling av halltid — fanger klubber som faller utenfor, vurderer om resultatet er forsvarlig, og gir hver klubb en begrunnelse. Aldri «systemet bestemte».",
  },
  {
    icon: Sunrise,
    title: "Dagens oversikt",
    description:
      "Vaktmester, renhold, vakthold og brannvern får en rolig, personlig oversikt over dagen — tidene i riktig rekkefølge og det som må følges opp. Aldri en tom melding.",
  },
  {
    icon: Compass,
    title: "Markedsinnsikt",
    description:
      "Leser tilbud og etterspørsel på tvers av markedsplassen og finner hullene — hvor det mangler lokaler folk faktisk leter etter — som en kort, rangert mulighetsoversikt.",
  },
  {
    icon: Wand2,
    title: "Lag utkast fra en lenke",
    description:
      "Har du lokalet på Airbnb, Booking.com, Finn eller Eventum — eller i et Word-dokument? Lim inn lenken eller last opp filen, så analyserer agenten innholdet og lager et ferdig utkast til oppføring du bare finpusser.",
  },
];

const AiAgentsSection = () => {
  return (
    <section id="agenter" className="py-14 lg:py-20 bg-paper-tinted">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label="INNEBYGD INTELLIGENS" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-8 lg:mb-10">
          <div className="lg:col-span-7">
            <EditorialHeading as="h2" size="section">
              Agenter som gjør jobben.
            </EditorialHeading>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p
              className="text-xl text-ink-soft italic"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              Under overflaten jobber en flåte av AI-agenter — de godkjenner,
              svarer, forklarer og varsler, så administrasjonen slipper.
            </p>
          </div>
        </div>

        {/* Framework trust row — what every listing is checked against */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 lg:mb-14 pb-8 border-b border-rule">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
            Oppføringer kontrolleres mot
          </span>
          {frameworks.map((f) => (
            <span
              key={f}
              className="font-mono text-[11px] uppercase tracking-wider text-navy bg-navy/5 border border-navy/15 rounded-sm px-2.5 py-1"
            >
              {f}
            </span>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerParent}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule"
        >
          {agents.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div key={a.title} variants={staggerChild} className="bg-paper p-7 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 shrink-0 inline-flex items-center justify-center bg-navy/5 border border-navy/15 rounded-sm text-navy">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3
                    className="font-serif text-xl lg:text-2xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), lineHeight: 1.15 }}
                  >
                    {a.title}
                  </h3>
                </div>
                <p className="text-base text-ink-soft leading-relaxed">{a.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 lg:mt-12">
          <EditorialButton href="/ai-agenter" variant="outline">
            Se hvordan agentene jobber →
          </EditorialButton>
        </div>
      </div>
    </section>
  );
};

export default AiAgentsSection;
