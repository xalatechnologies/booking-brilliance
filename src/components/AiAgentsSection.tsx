import { motion } from "framer-motion";
import { ShieldCheck, MessagesSquare, CalendarClock, Sunrise, Compass, Wand2 } from "lucide-react";
import { EditorialButton } from "@/components/editorial";
import { SectionHeader } from "@/components/SectionHeader";
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
      "Hver oppføring gjennomgås mot GDPR, NSM, SOC 2 og universell utforming, i både tekst og bilder, før den publiseres. Rent innhold godkjennes, resten stoppes med konkret veiledning.",
  },
  {
    icon: MessagesSquare,
    title: "Svar på henvendelser",
    description:
      "Kundeforespørsler får et varmt, korrekt førstesvar med én gang, og leser formål, dato og antall. Klager, pris og juss løftes alltid til en saksbehandler.",
  },
  {
    icon: CalendarClock,
    title: "Sesongtildeling",
    description:
      "Gjennomgår og forklarer sesongtildeling av halltid. Fanger klubber som faller utenfor, vurderer om resultatet er forsvarlig, og gir hver klubb en begrunnelse. Aldri «systemet bestemte».",
  },
  {
    icon: Sunrise,
    title: "Dagens oversikt",
    description:
      "Vaktmester, renhold, vakthold og brannvern får en rolig, personlig oversikt over dagen, med tidene i riktig rekkefølge og det som må følges opp. Aldri en tom melding.",
  },
  {
    icon: Compass,
    title: "Markedsinnsikt",
    description:
      "Leser tilbud og etterspørsel på tvers av markedsplassen og finner hullene, der det mangler lokaler folk faktisk leter etter, som en kort, rangert mulighetsoversikt.",
  },
  {
    icon: Wand2,
    title: "Lag utkast fra en lenke",
    description:
      "Har du lokalet på Airbnb, Booking.com, Finn eller Eventum, eller i et Word-dokument? Lim inn lenken eller last opp filen, så analyserer agenten innholdet og lager et ferdig utkast til oppføring du bare finpusser.",
  },
];

const AiAgentsSection = () => {
  return (
    <section id="agenter" className="py-10 lg:py-14 bg-paper-tinted border-y border-rule">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label="INNEBYGD INTELLIGENS"
          intro="Under overflaten jobber en flåte av AI-agenter som godkjenner, svarer, forklarer og varsler, så administrasjonen slipper."
        >
          Agenter og{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            automatisering
          </em>
          .
        </SectionHeader>

        {/* Framework trust row — what every listing is checked against */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 lg:mb-14 pb-8 border-b border-rule">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint mr-1">
            Oppføringer kontrolleres mot
          </span>
          {frameworks.map((f) => (
            <span
              key={f}
              className="font-mono text-[11px] uppercase tracking-wider text-accent-text bg-accent-text/5 border border-accent-text/15 rounded-sm px-2.5 py-1"
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
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
        >
          {agents.map((a) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                variants={staggerChild}
                className="group bg-gradient-to-br from-paper to-paper-deep rounded-lg border border-rule p-7 flex flex-col shadow-[0_2px_10px_-4px_rgba(10,18,40,0.12)] transition-all duration-normal ease-editorial hover:-translate-y-0.5 hover:border-accent-text/30 hover:shadow-[0_16px_34px_-18px_rgba(10,18,40,0.4)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 shrink-0 inline-flex items-center justify-center bg-accent-text/10 ring-1 ring-accent-text/25 rounded-md text-accent-text transition-transform duration-normal ease-editorial group-hover:scale-105">
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
