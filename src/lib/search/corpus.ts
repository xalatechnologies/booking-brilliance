import { getAllPostsMeta } from "@/lib/postsMeta";
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

const ACTION_ITEMS: SearchItem[] = [
  { id: "a-chatbot", kind: "action", title: "Snakk med oss", subtitle: "Åpne chat: svar på under et minutt", href: "#chat", action: "open-chatbot", keywords: ["chat", "spørsmål", "kontakt"] },
];

let cached: SearchItem[] | null = null;

export function getSearchCorpus(): SearchItem[] {
  if (cached) return cached;

  const blogItems: SearchItem[] = getAllPostsMeta().map((p) => ({
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
