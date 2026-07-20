import { FAQ_CATEGORIES, allFAQEntries } from "@/content/faq";
import type { SearchItem } from "@/lib/search/corpus";

export interface RagHit {
  q: string;
  a: string;
  category: string;
  score: number;
}

/** Norwegian + English stopwords trimmed from the query before scoring. */
const STOPWORDS = new Set([
  "og", "i", "på", "av", "for", "til", "en", "et", "som", "er", "med",
  "den", "det", "de", "et", "kan", "du", "vi", "jeg", "har", "hva", "om",
  "hvor", "når", "hvordan", "the", "and", "or", "of", "to", "in", "is",
  "are", "for", "with", "what", "how", "where", "when", "do", "does",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics for loose match
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/**
 * Tiny lexical retriever over FAQ_CATEGORIES.
 * Scores each FAQ entry by overlap of query tokens against (q + a + keywords).
 * Returns top-K above a minimum score threshold.
 *
 * Good enough for ~30 Q&A. When the user wires a real LLM endpoint we send
 * the top-3 hits as in-context evidence rather than the whole corpus.
 */
export function retrieve(query: string, k = 3): RagHit[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const hits: RagHit[] = [];
  for (const cat of FAQ_CATEGORIES) {
    for (const entry of cat.questions) {
      const haystack = [
        entry.q,
        entry.a,
        ...(entry.keywords ?? []),
      ]
        .join(" ");
      const hayTokens = tokenize(haystack);
      let score = 0;
      for (const t of qTokens) {
        if (hayTokens.includes(t)) score += 2;
        else if (hayTokens.some((h) => h.startsWith(t) || t.startsWith(h)))
          score += 1;
      }
      // Boost direct keyword hits
      for (const kw of entry.keywords ?? []) {
        if (qTokens.some((t) => kw.toLowerCase().includes(t))) score += 3;
      }
      if (score > 0) {
        hits.push({ q: entry.q, a: entry.a, category: cat.label, score });
      }
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

/** Default conversation starters when the user opens the chat. */
export const STARTER_SUGGESTIONS: string[] = [
  "Hva er Digilist?",
  "Pris for kommuner",
  "SSA-L 2026",
  "Pilot for kommune",
  "Sesongleie for lag",
  "Book demo",
];

/** Follow-up suggestions to keep the conversation moving. */
export function followUpSuggestions(lastHit?: RagHit): string[] {
  const generic = [
    "Hvilke kunder bruker Digilist?",
    "Datasuverenitet og GDPR",
    "Snakk med en rådgiver",
  ];
  if (!lastHit) return generic;
  // Suggest a sibling question from the same category
  const cat = FAQ_CATEGORIES.find((c) => c.label === lastHit.category);
  if (cat) {
    const siblings = cat.questions
      .filter((q) => q.q !== lastHit.q)
      .slice(0, 2)
      .map((q) => q.q);
    return [...siblings, "Snakk med en rådgiver"];
  }
  return generic;
}

/** Fallback when no FAQ entry matches. */
export const FALLBACK_NO_MATCH = [
  "Jeg fant ikke svar på det i kunnskapsbasen min. Vil du snakke med en rådgiver, eller skal jeg sende en forespørsel på dine vegne?",
  "Hmm, jeg er ikke sikker på det. Vil du at jeg setter deg i kontakt med en rådgiver?",
  "Det er utenfor det jeg vet. Skal jeg lage en kort forespørsel til teamet for deg?",
];

/** Build a compact answer from a hit — used by the local-only mode. */
export function answerFrom(hit: RagHit): string {
  return hit.a;
}

/** Build the system prompt + context for an external LLM call. */
export function buildLLMContext(
  query: string,
  hits: RagHit[],
  history: Array<{ role: string; text: string }>,
  pages: SearchItem[] = [],
): { system: string; messages: Array<{ role: string; content: string }> } {
  const corpus = hits
    .map(
      (h, i) =>
        `[${i + 1}] (${h.category})\nSpørsmål: ${h.q}\nSvar: ${h.a}`,
    )
    .join("\n\n");
  const sider = pages
    .slice(0, 6)
    .map((p) => `- ${p.title}${p.subtitle ? `: ${p.subtitle}` : ""} (${p.href})`)
    .join("\n");
  const system = `Du er Digilist-assistenten, en norsk AI-rådgiver for Digilist, en bookingplattform for norske utleiere og kommuner. Svar kort, presist og på norsk bokmål. Hold deg til informasjonen i KILDER nedenfor og henvis til /faq for utfyllende svar. Hvis du ikke vet svaret, foreslå at brukeren snakker med en rådgiver via skjemaet.

KILDER:
${corpus || "(ingen relevante treff i kunnskapsbasen)"}

RELEVANTE SIDER (fra søk på hele nettstedet):
${sider || "(ingen)"}

REGLER:
- Svar maks 3 setninger.
- Bruk norsk bokmål.
- Der en side under RELEVANTE SIDER passer svaret, nevn den kort.
- Hvis spørsmålet ikke kan besvares fra KILDER, si det ærlig og foreslå skjemaet.
- Ikke fabriker pris, dato, navn eller tall som ikke står i KILDER.`;

  return {
    system,
    messages: [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: query },
    ],
  };
}

/** Total Q&A count for opening-message stats. */
export const FAQ_COUNT = allFAQEntries().length;
