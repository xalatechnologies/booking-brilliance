import type { Persona } from "./types";

export const PERSONA_OPTIONS: Array<{
  value: NonNullable<Persona>;
  label: string;
  hint: string;
}> = [
  {
    value: "kommune",
    label: "Norsk kommune",
    hint: "Booking, sesongleie, SSA-L, ID-porten",
  },
  {
    value: "utleier",
    label: "Privat utleier",
    hint: "Selskapslokale, kulturhus, idrettshall",
  },
  {
    value: "annet",
    label: "Annet",
    hint: "Konsulent, partner, presse",
  },
];

/**
 * Topic autocomplete suggestions per persona. Picked at the
 * inquiry-topic step to skip free-typing for the common cases.
 */
export const TOPIC_SUGGESTIONS: Record<NonNullable<Persona>, string[]> = {
  kommune: [
    "Pilot for kommunen",
    "Tilbud i SSA-L 2026-anskaffelse",
    "Migrasjon fra RCO booking",
    "Sesongleie og lag/foreninger",
    "ID-porten og EHF",
    "Demo for ledergruppen",
  ],
  utleier: [
    "Bookingplattform for selskapslokale",
    "Bookingplattform for kulturhus",
    "Bookingplattform for idrettsanlegg",
    "Vipps og automatisk fakturering",
    "Sambruk mellom rom og ressurser",
    "Demo og pristilbud",
  ],
  annet: [
    "Partnerskap og integrasjon",
    "Presse og medieforespørsler",
    "Rekruttering og åpne stillinger",
    "Generell informasjon",
  ],
};

export function topicSuggestionsFor(persona: Persona): string[] {
  if (!persona) return [];
  return TOPIC_SUGGESTIONS[persona];
}

/** Build a single-line summary of an inquiry for email/Slack. */
export function summarizeInquiry(draft: {
  persona: Persona;
  topic: string;
  organization: string;
  name: string;
  email: string;
  phone?: string;
}): string {
  const personaLabel =
    PERSONA_OPTIONS.find((p) => p.value === draft.persona)?.label ?? "Ukjent";
  return `${personaLabel} · ${draft.organization || "—"} · ${draft.topic}`;
}
