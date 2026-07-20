import { getAllPosts } from "@/lib/posts";
import { allFAQEntries } from "@/content/faq";

export type SearchKind = "section" | "route" | "blog" | "faq" | "action";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  /** href: route ("/blogg/...") or anchor ("#kontakt") */
  href: string;
  /** Used when href is an in-page anchor — only valid on homepage */
  isAnchor?: boolean;
  /** action callback for non-navigation results (e.g. open chatbot) */
  action?: "open-chatbot";
  keywords?: string[];
}

const SECTION_ITEMS: SearchItem[] = [
  { id: "sec-funksjonalitet", kind: "section", title: "Funksjonalitet", subtitle: "Slik fungerer Digilist: fire steg", href: "#funksjonalitet", isAnchor: true, keywords: ["howitworks", "steg", "flyt"] },
  { id: "sec-brukerhistorier", kind: "section", title: "Brukerhistorier", subtitle: "Kunder som bruker Digilist", href: "#brukerhistorier", isAnchor: true, keywords: ["kunder", "case", "stories"] },
  { id: "sec-integrasjoner", kind: "section", title: "Integrasjoner", subtitle: "Vipps, BankID, EHF, regnskap", href: "#integrasjoner", isAnchor: true, keywords: ["vipps", "bankid", "ehf", "visma", "stripe"] },
  { id: "sec-teknologi", kind: "section", title: "Teknologi", subtitle: "Hva vi bygger på, og hvorfor", href: "#teknologi", isAnchor: true, keywords: ["stack", "react", "postgres", "convex"] },
  { id: "sec-arkitektur", kind: "section", title: "Arkitektur", subtitle: "Systemdiagram", href: "#arkitektur", isAnchor: true, keywords: ["diagram", "system"] },
  { id: "sec-om-oss", kind: "section", title: "Om oss", subtitle: "Xala Technologies AS", href: "#om-oss", isAnchor: true, keywords: ["xala", "team"] },
  { id: "sec-kontakt", kind: "section", title: "Kontakt", subtitle: "Book demo / Snakk med oss", href: "#kontakt", isAnchor: true, keywords: ["demo", "kontakt"] },
];

const ROUTE_ITEMS: SearchItem[] = [
  { id: "r-blogg", kind: "route", title: "Blogg", subtitle: "Alle artikler", href: "/blogg" },
  { id: "r-faq", kind: "route", title: "FAQ", subtitle: "Ofte stilte spørsmål", href: "/faq" },
  { id: "r-book-demo", kind: "route", title: "Book demo", subtitle: "30–45 min, gratis", href: "/book-demo" },
  { id: "r-booking-lokaler", kind: "route", title: "Booking av lokaler og møterom", subtitle: "Landingsside", href: "/booking-av-lokaler-og-moterom" },
  { id: "r-bookingsystem-kommune", kind: "route", title: "Bookingsystem for kommuner", subtitle: "SSA-L 2026", href: "/bookingsystem-kommune" },
  { id: "r-personvern", kind: "route", title: "Personvern", subtitle: "GDPR + ISO 27001/27701", href: "/personvern" },
  { id: "r-salgsvilkar", kind: "route", title: "Salgsvilkår", subtitle: "Avtalevilkår", href: "/salgsvilkar" },
  { id: "r-cookies", kind: "route", title: "Cookies", subtitle: "Cookie-policy", href: "/cookies" },
];

// The B2C marketplace (the "Finn" menu) — hubs + every category guide, so the
// intelligent search AND the chatbot (which feeds search hits to the LLM as
// "relevante sider") can surface the new pages and their content.
const MARKETPLACE_ITEMS: SearchItem[] = [
  // hubs
  { id: "m-leie", kind: "route", title: "Finn lokale", subtitle: "Selskapslokale, møterom, kulturhus, idrettshall", href: "/leie", keywords: ["leie lokale", "finn lokale", "festlokale", "book lokale"] },
  { id: "m-overnatting", kind: "route", title: "Overnatting", subtitle: "Hytte, leilighet, rom, feriehus", href: "/overnatting", keywords: ["overnatting", "leie overnatting", "book overnatting"] },
  { id: "m-arrangementer", kind: "route", title: "Arrangementer", subtitle: "Billetter til konsert, teater, festival, sport", href: "/arrangementer", keywords: ["billetter", "kjøp billett", "arrangement", "event"] },
  { id: "m-utstyr", kind: "route", title: "Leie utstyr", subtitle: "Festutstyr, verktøy, lyd og lys, sport", href: "/utstyr", keywords: ["leie utstyr", "utstyr til leie"] },
  { id: "m-tjenester", kind: "route", title: "Tjenester", subtitle: "Catering, DJ, musiker, dekor", href: "/tjenester", keywords: ["tjenester", "book tjeneste", "arrangement"] },
  { id: "m-billettsystem", kind: "route", title: "Billettsystem", subtitle: "Selg billetter med rabatt, kupong og gavekort", href: "/billettsystem", keywords: ["billettsystem", "selge billetter", "rabattkode", "kupong", "gavekort"] },
  // leie
  { id: "m-selskapslokale", kind: "route", title: "Leie selskapslokale", subtitle: "Bryllup, jubileum, konfirmasjon, fest", href: "/leie/selskapslokale", keywords: ["selskapslokale", "festlokale", "bryllupslokale", "leie lokale til fest"] },
  { id: "m-gaard", kind: "route", title: "Leie gård", subtitle: "Gårdsbryllup, låve, selskap", href: "/leie/gaard", keywords: ["leie gård", "gårdsbryllup", "leie låve", "bryllupsgård"] },
  { id: "m-bursdagslokale", kind: "route", title: "Leie bursdagslokale", subtitle: "Barnebursdag og voksenbursdag", href: "/leie/bursdagslokale", keywords: ["bursdagslokale", "lokale til bursdag", "barnebursdag lokale"] },
  { id: "m-kulturhus", kind: "route", title: "Leie kulturhus", subtitle: "Konsert, forestilling, samfunnshus, grendehus", href: "/leie/kulturhus", keywords: ["leie kulturhus", "samfunnshus", "grendehus", "leie sal"] },
  { id: "m-moterom", kind: "route", title: "Leie møterom", subtitle: "Møte, workshop, kurs per time", href: "/leie/moterom", keywords: ["leie møterom", "møterom til leie", "book møterom"] },
  { id: "m-konferanselokale", kind: "route", title: "Leie konferanselokale", subtitle: "Konferanse, seminar, kurs", href: "/leie/konferanselokale", keywords: ["konferanselokale", "konferansesal", "kurslokale"] },
  { id: "m-kontorlokaler", kind: "route", title: "Leie kontorlokaler", subtitle: "Privat kontor, fleksibel leie", href: "/leie/kontorlokaler", keywords: ["leie kontor", "kontorlokaler", "kontor til leie"] },
  { id: "m-coworking", kind: "route", title: "Coworking", subtitle: "Dagplass, kontorfellesskap", href: "/leie/coworking", keywords: ["coworking", "kontorfellesskap", "leie kontorplass", "dagplass"] },
  { id: "m-idrettshall", kind: "route", title: "Leie idrettshall", subtitle: "Enkelttimer, gymsal, trening", href: "/leie/idrettshall", keywords: ["leie idrettshall", "leie gymsal", "hall til leie"] },
  { id: "m-padelbane", kind: "route", title: "Leie padelbane", subtitle: "Book padel per time", href: "/leie/padelbane", keywords: ["leie padelbane", "book padel", "padel"] },
  { id: "m-svommehall", kind: "route", title: "Leie svømmehall", subtitle: "Basseng til bursdag og grupper", href: "/leie/svommehall", keywords: ["leie svømmehall", "leie basseng", "svømmehall"] },
  // overnatting
  { id: "m-hytte", kind: "route", title: "Leie hytte", subtitle: "Helgetur, ferie, familiesamling", href: "/overnatting/hytte", keywords: ["leie hytte", "hytte til leie", "hytteutleie"] },
  { id: "m-leilighet", kind: "route", title: "Leie leilighet", subtitle: "Korttidsleie, byferie, jobbreise", href: "/overnatting/leilighet", keywords: ["leie leilighet", "korttidsleie leilighet"] },
  { id: "m-rom", kind: "route", title: "Leie rom", subtitle: "Gjesterom, rimelig overnatting", href: "/overnatting/rom", keywords: ["leie rom", "gjesterom", "rimelig overnatting"] },
  { id: "m-feriehus", kind: "route", title: "Leie feriehus", subtitle: "Familieferie, gjenforening", href: "/overnatting/feriehus", keywords: ["leie feriehus", "feriehus til leie"] },
  // arrangementer
  { id: "m-konsert", kind: "route", title: "Konsertbilletter", subtitle: "Kjøp billett med Vipps", href: "/arrangementer/konsert", keywords: ["konsertbilletter", "billetter til konsert", "konsert"] },
  { id: "m-teater", kind: "route", title: "Teaterbilletter", subtitle: "Teater, standup, revy", href: "/arrangementer/teater-og-scene", keywords: ["teaterbilletter", "billetter til teater", "forestilling", "standup"] },
  { id: "m-festival", kind: "route", title: "Festivalbilletter", subtitle: "Dagspass, helgepass", href: "/arrangementer/festival", keywords: ["festivalbilletter", "festivalpass", "festival"] },
  { id: "m-sport", kind: "route", title: "Sportsbilletter", subtitle: "Billetter til kamp og idrettsarrangement", href: "/arrangementer/sport", keywords: ["sportsbilletter", "billetter til kamp", "fotballbilletter"] },
  // utstyr
  { id: "m-festutstyr", kind: "route", title: "Leie festutstyr", subtitle: "Telt, bord, stoler, servise", href: "/utstyr/festutstyr", keywords: ["leie festutstyr", "leie telt", "leie bord og stoler"] },
  { id: "m-verktoy", kind: "route", title: "Leie verktøy og maskiner", subtitle: "Minigraver, høytrykksspyler, stillas", href: "/utstyr/verktoy-maskiner", keywords: ["leie verktøy", "leie maskiner", "leie minigraver"] },
  { id: "m-lyd-lys", kind: "route", title: "Leie lyd og lys", subtitle: "Lydanlegg, scenelys, projektor", href: "/utstyr/lyd-og-lys", keywords: ["leie lydanlegg", "leie lyd og lys", "leie projektor"] },
  { id: "m-sport-friluft", kind: "route", title: "Leie sport- og friluftsutstyr", subtitle: "Sykkel, ski, kajakk, telt", href: "/utstyr/sport-og-friluft", keywords: ["leie sportsutstyr", "leie sykkel", "leie ski", "leie kajakk"] },
  // tjenester
  { id: "m-catering", kind: "route", title: "Bestille catering", subtitle: "Koldtbord, tapas, middag", href: "/tjenester/catering", keywords: ["bestille catering", "catering til bryllup", "catering"] },
  { id: "m-dj", kind: "route", title: "Leie DJ", subtitle: "DJ til bryllup, fest, firmafest", href: "/tjenester/dj", keywords: ["leie dj", "dj til bryllup", "dj til fest"] },
  { id: "m-musiker", kind: "route", title: "Leie musiker", subtitle: "Band, solist, livemusikk", href: "/tjenester/musiker", keywords: ["leie musiker", "leie band", "livemusikk bryllup"] },
  { id: "m-dekor", kind: "route", title: "Leie dekor og pynt", subtitle: "Blomster, bordpynt, ballongbue", href: "/tjenester/dekor", keywords: ["leie dekor", "bordpynt", "blomsterdekor", "ballongbue"] },
];

const ACTION_ITEMS: SearchItem[] = [
  { id: "a-chatbot", kind: "action", title: "Snakk med oss", subtitle: "Åpne chat: svar på under et minutt", href: "#chat", action: "open-chatbot", keywords: ["chat", "spørsmål", "kontakt"] },
];

let cached: SearchItem[] | null = null;

export function getSearchCorpus(): SearchItem[] {
  if (cached) return cached;

  const blogItems: SearchItem[] = getAllPosts().map((p) => ({
    id: `b-${p.slug}`,
    kind: "blog",
    title: p.title,
    subtitle: p.description,
    href: `/blogg/${p.slug}`,
    keywords: [p.tag, ...(p.keywords ?? [])].filter(Boolean) as string[],
  }));

  const faqItems: SearchItem[] = allFAQEntries().map((e, i) => ({
    id: `f-${i}`,
    kind: "faq",
    title: e.q,
    subtitle: stripFirstSentence(e.a),
    href: `/faq#q-${i}`,
    keywords: [e.category],
  }));

  cached = [
    ...SECTION_ITEMS,
    ...ROUTE_ITEMS,
    ...MARKETPLACE_ITEMS,
    ...blogItems,
    ...faqItems,
    ...ACTION_ITEMS,
  ];
  return cached;
}

function stripFirstSentence(text: string): string {
  const s = text.trim();
  const cut = s.search(/[.!?]\s/);
  if (cut === -1) return s.slice(0, 140);
  return s.slice(0, cut + 1);
}

/** Lightweight scored search — substring + token coverage. */
export function searchCorpus(query: string, corpus: SearchItem[]): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored = corpus
    .map((item) => {
      const haystackParts = [
        item.title,
        item.subtitle ?? "",
        ...(item.keywords ?? []),
      ];
      const hay = haystackParts.join(" ").toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (!hay.includes(tok)) {
          score = -1;
          break;
        }
        // Title hits weight more
        if (item.title.toLowerCase().includes(tok)) score += 5;
        // Whole-word boundary slight bonus
        const wordHit = new RegExp(`\\b${escapeRegExp(tok)}`, "i").test(hay);
        if (wordHit) score += 2;
        score += 1;
      }
      // Section + route slight ranking boost (they're the "spine" of the site)
      if (item.kind === "section") score += 1;
      if (item.kind === "route") score += 0.5;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return scored.map((r) => r.item);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const KIND_LABEL: Record<SearchKind, string> = {
  section: "SEKSJON",
  route: "SIDE",
  blog: "BLOGG",
  faq: "FAQ",
  action: "HANDLING",
};
