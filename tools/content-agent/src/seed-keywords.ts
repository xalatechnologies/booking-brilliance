/**
 * Seed terms the Keyword Intelligence Agent uses as its starting set.
 *
 * Drawn from the user's V1 spec — kommunale lokaler, idrettshall, etc.
 * The seed-expand source feeds these to Claude and asks for variations,
 * long-tails, related search intents and Norwegian dialectal forms.
 *
 * Update this list as Digilist's positioning evolves. Each entry is an
 * `intent` group + the canonical Norwegian phrase a kommune-IT-leder or
 * innbygger would actually type into Google.
 */

export type SearchIntent =
  | "commercial"     // "kjøp", "demo", "pris", "leverandør"
  | "informational"  // "hva er", "hvordan", "guide", "tips"
  | "municipal"      // kommune-specific terminology
  | "event"          // event booking, arrangement
  | "venue"          // physical space: hall, rom, lokale
  | "booking";       // booking process itself

export interface SeedTerm {
  term: string;
  intent: SearchIntent;
}

export const SEED_TERMS: SeedTerm[] = [
  // venue
  { term: "kommunale lokaler", intent: "venue" },
  { term: "booking av idrettshall", intent: "venue" },
  { term: "leie idrettshall", intent: "venue" },
  { term: "leie idrettshall i kommunen", intent: "venue" },
  { term: "leie møterom kommune", intent: "venue" },
  { term: "leie kulturhus", intent: "venue" },
  { term: "leie selskapslokaler", intent: "venue" },
  { term: "gymsal til leie", intent: "venue" },
  { term: "kommunal kantine leie", intent: "venue" },

  // booking
  { term: "bookingsystem kommune", intent: "booking" },
  { term: "digital booking offentlig sektor", intent: "booking" },
  { term: "sesongleie kommune", intent: "booking" },
  { term: "tildeling lag og foreninger", intent: "booking" },
  { term: "bookingkalender", intent: "booking" },
  { term: "sanntidskalender booking", intent: "booking" },
  { term: "utleieobjekt kommune", intent: "booking" },

  // event
  { term: "arrangementsbooking kommune", intent: "event" },
  { term: "bryllupslokale leie", intent: "event" },
  { term: "konfirmasjonslokale", intent: "event" },

  // municipal
  { term: "Digdir designsystemet", intent: "municipal" },
  { term: "ID-porten booking", intent: "municipal" },
  { term: "saksbehandler godkjenne booking", intent: "municipal" },
  { term: "min side kommune booking", intent: "municipal" },
  { term: "universell utforming WCAG", intent: "municipal" },
  { term: "tilgjengelighetserklæring", intent: "municipal" },
  { term: "Norge.no booking", intent: "municipal" },

  // commercial
  { term: "offentlig bookingløsning leverandør", intent: "commercial" },
  { term: "SSA-L bookingsystem", intent: "commercial" },
  { term: "GDPR booking kommune", intent: "commercial" },
  { term: "datalokasjon Norge SaaS", intent: "commercial" },

  // informational
  { term: "hvordan booke kommunalt lokale", intent: "informational" },
  { term: "magic link innlogging kommune", intent: "informational" },
  { term: "BankID booking", intent: "informational" },
];
