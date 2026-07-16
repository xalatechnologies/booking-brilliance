// Post-build: writes per-route static HTML with route-specific
// title/description/og/canonical + JSON-LD so social-media crawlers
// (Twitter, FB, LinkedIn, Slack) see the right meta without executing JS.
// Modern search bots (Google, GPT, Claude) execute JS and will use the
// SPA-rendered meta anyway — this fix is purely for the no-JS unfurl case.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const DIST_SERVER = join(__dirname, "..", "dist-server");

/**
 * Pull the content-agent's high-quality keyword catalogue from Convex
 * and merge it into the static metadata at build time.
 *
 * Sources we trust for SEO injection:
 *   - cluster centroid_term (human-edited, high-signal)
 *   - keyword.term where source is seed-expand / gtrends / serpapi
 *     AND score ≥ 65 (filters HN/Reddit noise like "I believe entire
 *     companies are under AI psychosis")
 *
 * Falls back to an empty list when Convex is unavailable — the build
 * still succeeds, just without the live-discovered terms.
 */
async function fetchDiscoveredKeywords() {
  const url = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
  const admin = process.env.ADMIN_BASIC_AUTH ?? "";
  if (!url || !admin) {
    console.log(
      "[prerender] CONVEX env not set — skipping discovered-keywords injection.",
    );
    return { centroids: [], terms: [] };
  }
  try {
    const { ConvexHttpClient } = await import("convex/browser");
    const c = new ConvexHttpClient(url);
    const token = Buffer.from(admin, "utf-8").toString("base64");
    const snap = await c.query("content/state:snapshot", { adminToken: token });

    const TRUSTED_SOURCES = new Set(["seed-expand", "gtrends", "serpapi"]);
    const centroids = (snap.clusters ?? [])
      .filter((c) => c.composite_score >= 60)
      .map((c) => c.centroid_term.trim())
      .filter(Boolean);
    const terms = ((snap.keywords ?? {}).recent ?? [])
      .filter((k) => TRUSTED_SOURCES.has(k.source) && k.score >= 65)
      .sort((a, b) => b.score - a.score)
      .map((k) => k.term.trim().toLowerCase())
      .filter(Boolean);

    // dedupe + cap
    const seen = new Set();
    const dedupedTerms = [];
    for (const t of terms) {
      const key = t.replace(/\s+/g, " ");
      if (seen.has(key)) continue;
      seen.add(key);
      dedupedTerms.push(t);
      if (dedupedTerms.length >= 40) break;
    }
    console.log(
      `[prerender] live keywords: ${centroids.length} cluster centroids + ${dedupedTerms.length} terms`,
    );
    return { centroids, terms: dedupedTerms };
  } catch (err) {
    console.warn(
      "[prerender] could not fetch discovered keywords from Convex:",
      err?.message ?? err,
    );
    return { centroids: [], terms: [] };
  }
}

/**
 * SSR renderer cache. The server bundle is loaded lazily on first use, so a
 * failure to build/load it falls back gracefully to shell-only prerender.
 */
let ssrRenderer = null;
let ssrLoadAttempted = false;
async function loadSsr() {
  if (ssrLoadAttempted) return ssrRenderer;
  ssrLoadAttempted = true;
  try {
    const entry = join(DIST_SERVER, "entry-server.js");
    await fs.access(entry);
    const url = pathToFileURL(entry).href;
    const mod = await import(url);
    if (typeof mod.render === "function") {
      ssrRenderer = mod.render;
      if (typeof mod.warm === "function") await mod.warm();
      console.log("  [ssr] entry loaded — bodies will be rendered to HTML");
    } else {
      console.warn("  [ssr] entry has no render() export — skipping");
    }
  } catch (err) {
    console.warn(
      "  [ssr] dist-server/entry-server.js not found — skipping body injection",
      err?.message ?? err,
    );
  }
  return ssrRenderer;
}

async function renderBody(route) {
  const render = await loadSsr();
  if (!render) return null;
  try {
    // render() is async — it renders in a loop so React.lazy route chunks
    // (e.g. BlogPost) resolve to real content instead of the Suspense shell.
    return await render(route);
  } catch (err) {
    console.warn(`  [ssr] render(${route}) failed:`, err?.message ?? err);
    return null;
  }
}

function injectBody(html, body) {
  if (!body) return html;
  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${body}</div>`,
  );
}
const CONTENT_DIR = join(__dirname, "..", "src", "content", "blog");
const FAQ_FILE = join(__dirname, "..", "src", "content", "faq.ts");
const BASE_URL = "https://digilist.no";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

// Parse FAQ_CATEGORIES from src/content/faq.ts so the prerender + sitemap +
// llms-full.txt stay in sync with the TypeScript source of truth.
async function loadFAQCategories() {
  let raw;
  try {
    raw = await fs.readFile(FAQ_FILE, "utf-8");
  } catch {
    return [];
  }
  // Step 1: locate every category header — `id: "..."` followed by `label: "..."`
  // followed by `description: "..."`. Use the start of the *next* id (or EOF)
  // as the block boundary so nested keywords[] arrays don't confuse parsing.
  const headerRe = /id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*description:\s*"((?:[^"\\]|\\.)*)"/g;
  const heads = [];
  let hm;
  while ((hm = headerRe.exec(raw)) !== null) {
    heads.push({ index: hm.index, id: hm[1], label: hm[2], description: hm[3] });
  }
  const categories = [];
  for (let i = 0; i < heads.length; i++) {
    const start = heads[i].index;
    const end = i + 1 < heads.length ? heads[i + 1].index : raw.length;
    const block = raw.slice(start, end);
    const qRe = /q:\s*"((?:[^"\\]|\\.)*)"\s*,\s*a:\s*"((?:[^"\\]|\\.)*)"/g;
    const questions = [];
    let qm;
    while ((qm = qRe.exec(block)) !== null) {
      questions.push({
        q: qm[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"),
        a: qm[2].replace(/\\"/g, '"').replace(/\\n/g, "\n"),
      });
    }
    categories.push({
      id: heads[i].id,
      label: heads[i].label,
      description: heads[i].description,
      questions,
    });
  }
  return categories;
}

// Load blog posts at build time so they get pre-rendered + added to sitemap
import { promises as fsp } from "node:fs";
async function loadBlogPosts() {
  let files;
  try {
    files = await fsp.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts = [];
  for (const f of files) {
    if (!f.endsWith(".md")) continue;
    const raw = await fsp.readFile(join(CONTENT_DIR, f), "utf-8");
    // Minimal frontmatter parse — gray-matter isn't bundled here
    const m = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = {};
    m[1].split("\n").forEach((line) => {
      const kv = line.match(/^(\w+):\s*"?([^"]+)"?$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, "");
    });
    posts.push({
      slug: fm.slug || f.replace(/\.md$/, ""),
      title: fm.title,
      description: fm.description,
      date: fm.date,
      author: fm.author,
      tag: fm.tag,
      // `cover` drives the per-post og:image/twitter:image below. Without it
      // every post fell back to the generic /og-image.png, so social/Slack/
      // LinkedIn unfurls all showed the SAME image regardless of topic.
      cover: fm.cover,
    });
  }
  return posts;
}

/** @type {Array<{route: string, title: string, description: string, ogType?: string, faq?: Array<{q: string, a: string}>, breadcrumbs?: Array<{name: string, url: string}>}>} */
const ROUTES = [
  {
    route: "/booking-av-lokaler-og-moterom",
    title:
      "Booking av lokaler og møterom — Digilist",
    description:
      "Booking av lokaler og møterom — sanntidskalender, Vipps, BankID, EHF og sesongleie. Bygget for kommuner og utleiere. SSA-L 2026-klar.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      {
        name: "Booking av lokaler og møterom",
        url: `${BASE_URL}/booking-av-lokaler-og-moterom`,
      },
    ],
    howTo: {
      name: "Slik booker du lokale eller møterom",
      description:
        "Fra søk til bekreftet booking på fire steg via Digilist.",
      steps: [
        {
          name: "Søk og velg ledig tid",
          text: "Søk etter lokale eller møterom i kalenderen. Filtrer på dato, kapasitet og fasiliteter. Ledige tider vises i sanntid.",
        },
        {
          name: "Fyll inn formål og deltakere",
          text: "Angi anledning, antall deltakere og eventuelle tilleggstjenester (AV-utstyr, servering, ekstra rengjøring).",
        },
        {
          name: "Logg inn og signer leieavtalen",
          text: "Logg inn med BankID eller ID-porten. Leieavtalen signeres digitalt med juridisk bindende eID-signatur.",
        },
        {
          name: "Betal og motta bekreftelse",
          text: "Betal med Vipps, kort eller faktura (EHF for organisasjoner). Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk.",
        },
      ],
    },
    faq: [
      {
        q: "Hva er booking av lokaler og møterom?",
        a: "Booking av lokaler og møterom er den digitale prosessen der innbyggere, bedrifter, lag eller foreninger reserverer fysiske rom — selskapslokaler, møterom, idrettshaller, kantiner, kulturhus — for et bestemt tidsrom. En moderne plattform håndterer sanntidstilgjengelighet, betaling, kontrakt, varsling av driftsroller og fakturering i én sammenhengende flyt.",
      },
      {
        q: "Hvordan booker man et lokale eller møterom på Digilist?",
        a: "Søk etter sted og dato i sanntidskalenderen. Velg ledig tid, fyll inn formål og antall deltakere, signer leieavtalen digitalt og betal med Vipps, kort eller faktura. Bekreftelse, kalenderinvitasjon og digital nøkkel sendes automatisk. Hele flyten tar typisk under 90 sekunder.",
      },
      {
        q: "Hvilke typer lokaler og møterom kan jeg booke?",
        a: "Digilist støtter selskapslokaler, møterom, kantiner, idrettshaller, gymsaler, kulturhus, samfunnshus, undervisningsrom og spesialressurser som AV-utstyr eller kjøretøy.",
      },
      {
        q: "Hvilke betalingsmetoder støttes for booking av lokaler?",
        a: "Vipps, kortbetaling via Stripe Connect, depositum med automatisk frigjøring, og EHF/Peppol-fakturering for organisasjoner. Refusjonsregler kan tilpasses per anlegg.",
      },
      {
        q: "Er Digilist trygt og GDPR-kompatibelt?",
        a: "Ja. Data lagres i Norge og EU på PostgreSQL. ISO 27001 og ISO 27701 sertifisert. ID-porten og BankID autentisering. Audit-spor på hver mutasjon.",
      },
    ],
  },
  {
    route: "/bookingsystem-kommune",
    title: "Bookingsystem for kommuner — Digilist | SSA-L 2026 klar",
    description:
      "Digital bookingplattform for norske kommuner. Sanntidskalender, sesongleie, ID-porten, EHF, ISO 27001. Bygget for SSA-L 2026-krav.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bookingsystem for kommuner", url: `${BASE_URL}/bookingsystem-kommune` },
    ],
    faq: [
      {
        q: "Hva er et kommunalt bookingsystem?",
        a: "Et kommunalt bookingsystem er en digital plattform som lar innbyggere, lag og foreninger søke om og booke kommunale lokaler — idrettshaller, svømmehaller, møterom, kantiner og kulturhus — i sanntid.",
      },
      {
        q: "Oppfyller Digilist SSA-L 2026-kravene?",
        a: "Ja. Digilist oppfyller SSA-L 2026-krav om sanntid, sesongleie, ID-porten, BRREG, digital nøkkel, EHF-fakturagrunnlag, WCAG 2.0 AA og ISO 27001/27701.",
      },
      {
        q: "Kan kommunen importere bookinger fra eksisterende system?",
        a: "Ja. Digilist støtter migrasjon fra RCO booking og andre eksisterende bookingsystemer i etableringsfasen.",
      },
    ],
  },
  {
    route: "/book-demo",
    title: "Book demo av Digilist — Norsk bookingplattform",
    description:
      "Be om en gratis 30–45 minutters demo av Digilist. Vi viser hvordan plattformen håndterer ditt bruksområde — privat lokale, kommune eller kulturhus.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Book demo", url: `${BASE_URL}/book-demo` },
    ],
  },
  {
    route: "/personvern",
    title: "Personvernerklæring — Digilist",
    description:
      "Slik behandler Digilist personopplysninger. GDPR-kompatibel, ISO 27701-sertifisert, data lagret i Norge og EU.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Personvern", url: `${BASE_URL}/personvern` },
    ],
  },
  {
    route: "/salgsvilkar",
    title: "Salgsvilkår og leveransevilkår — Digilist",
    description: "Salgs- og leveransevilkår for Digilist bookingplattform — gjeldende avtale mellom Digilist og kunder.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Salgsvilkår", url: `${BASE_URL}/salgsvilkar` },
    ],
  },
  {
    route: "/cookies",
    title: "Cookies og informasjonskapsler — Digilist",
    description: "Slik bruker Digilist informasjonskapsler. Privacy-first analytics uten cookies.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Cookies", url: `${BASE_URL}/cookies` },
    ],
  },
  {
    route: "/transparens",
    title: "Transparens — live kvalitetsrapport — Digilist",
    description:
      "Live kvalitetsrapport: SEO, tilgjengelighet, sikkerhet, oppetid og lenker — automatisk skannet på tvers av Digilist-økosystemet.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Transparens", url: `${BASE_URL}/transparens` },
    ],
  },
  {
    route: "/status",
    title: "Driftsstatus — Digilist",
    description:
      "Sanntid for Digilist-økosystemet: oppetid, SLA og hendelseslogg på tvers av digilist.no, app, dashboard, dokumentasjon og API.",
    ogType: "website",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Status", url: `${BASE_URL}/status` },
    ],
  },
  {
    route: "/bruksomrader/selskapslokaler",
    title: "Selskapslokaler: bookingsystem for bryllup og selskap — Digilist",
    description:
      "Bookingplattform for selskapslokaler: sanntidskalender, depositum via Vipps, BankID-signert leieavtale, digital nøkkel og automatisk faktura.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bruksområder", url: `${BASE_URL}/booking-av-lokaler-og-moterom` },
      { name: "Selskapslokaler", url: `${BASE_URL}/bruksomrader/selskapslokaler` },
    ],
  },
  {
    route: "/bruksomrader/moterom",
    title: "Møterom: bookingsystem for kommuner og næringsbygg — Digilist",
    description:
      "Bookingsystem for kommunale møterom, næringsbygg og foreningslokaler. Sanntidskalender, sambruk, prising per brukergruppe og Outlook-integrasjon.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bruksområder", url: `${BASE_URL}/booking-av-lokaler-og-moterom` },
      { name: "Møterom", url: `${BASE_URL}/bruksomrader/moterom` },
    ],
  },
  {
    route: "/bruksomrader/idrettshaller-gymsaler",
    title: "Idrettshall booking: bookingsystem for kommuner og foreninger — Digilist",
    description:
      "Bookingsystem for idrettshaller og gymsaler. Sesongleie til lag og foreninger, halvhalls-bookinger, sambruk, kommunal innbyggerinnlogging via ID-porten.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bruksområder", url: `${BASE_URL}/booking-av-lokaler-og-moterom` },
      { name: "Idrettshaller og gymsaler", url: `${BASE_URL}/bruksomrader/idrettshaller-gymsaler` },
    ],
  },
  {
    route: "/bruksomrader/kulturhus-kantiner",
    title: "Kulturhus og kantiner: bookingsystem for kommunale arenaer — Digilist",
    description:
      "Bookingsystem for kulturhus, kantiner og kommunale arenaer. Forestillinger, konserter, åpne dager. Adgangskontroll, driftsrolle-varsling, EHF-fakturering.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Bruksområder", url: `${BASE_URL}/booking-av-lokaler-og-moterom` },
      { name: "Kulturhus og kantiner", url: `${BASE_URL}/bruksomrader/kulturhus-kantiner` },
    ],
  },
];

const BRAND_KNOWS_ABOUT = [
  "Bookingsystem",
  "Kommunal utleie",
  "Sesongleie",
  "ID-porten",
  "BankID",
  "Vipps",
  "EHF / Peppol-fakturering",
  "ISO 27001",
  "ISO 27701",
  "GDPR",
  "WCAG 2.1",
  "SSA-L 2026",
  "Digdir Designsystemet",
  "Convex reaktiv runtime",
  "PostgreSQL",
];

/**
 * Filled by main() from Convex content_state.snapshot. Merged into the
 * <meta name="keywords"> tag of every prerendered route. Empty by
 * default so a no-Convex build still works.
 */
let DISCOVERED_KEYWORDS = [];

const BRAND_MENTIONS = [
  { "@type": "Service", name: "Vipps", url: "https://vipps.no" },
  { "@type": "Service", name: "BankID", url: "https://bankid.no" },
  { "@type": "Service", name: "ID-porten", url: "https://www.idporten.no" },
  { "@type": "Service", name: "EHF / Peppol", url: "https://peppol.eu" },
  { "@type": "Organization", name: "Digdir", url: "https://www.digdir.no" },
  {
    "@type": "Organization",
    name: "Brønnøysundregistrene",
    url: "https://www.brreg.no",
  },
];

const baseLD = (description) => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Digilist",
    alternateName: "Digilist — Enkel booking",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    image: `${BASE_URL}/og-image.png`,
    sameAs: ["https://xala.no"],
    foundingDate: "2024",
    knowsAbout: BRAND_KNOWS_ABOUT,
    mentions: BRAND_MENTIONS,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nesbruveien 75",
      postalCode: "1394",
      addressLocality: "Nesbru",
      addressCountry: "NO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+47-96-66-50-01",
      contactType: "Customer Service",
      email: "kontakt@digilist.no",
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Xala Technologies AS",
      url: "https://xala.no",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Digilist",
    description,
    inLanguage: "nb-NO",
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/faq?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#software`,
    name: "Digilist",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Booking & Reservation Platform",
    operatingSystem: "Web, iOS, iPadOS, Android",
    description,
    url: "https://app.digilist.no",
    softwareVersion: "2026.05",
    featureList: [
      "Sanntidskalender",
      "Privatbookinger og sesongleie",
      "Betaling med Vipps og kort",
      "BankID og ID-porten autentisering",
      "EHF / Peppol fakturering",
      "Regnskapsintegrasjoner (Visma, Tripletex, Fiken, PowerOffice, DNB)",
      "Driftsroller og varsler",
      "Digital nøkkel (Salto KS)",
      "Universell utforming (WCAG 2.1 AA)",
      "ISO 27001 og 27701 sertifisert",
      "RCO booking-migrasjon",
      "Audit-spor og RBAC",
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: "0",
      availability: "https://schema.org/InStock",
    },
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Norway" },
    inLanguage: "nb-NO",
  },
];

function patchHTML(template, meta) {
  const canonical = `${BASE_URL}${meta.route}`;
  const ldBlocks = [...baseLD(meta.description)];
  if (meta.faq && meta.faq.length > 0) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: { "@type": "Answer", text: q.a },
      })),
    });
  }
  if (meta.breadcrumbs) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: meta.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }
  if (meta.howTo) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: meta.howTo.name,
      description: meta.howTo.description,
      inLanguage: "nb-NO",
      step: meta.howTo.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }
  if (meta.aboutPage) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: canonical,
      name: meta.title,
      description: meta.description,
      mainEntity: { "@id": `${BASE_URL}/#organization` },
      inLanguage: "nb-NO",
    });
  }
  if (meta.service) {
    ldBlocks.push({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Booking Platform",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Norway" },
      availableLanguage: ["Norwegian", "English"],
      offers: {
        "@type": "Offer",
        priceCurrency: "NOK",
        availability: "https://schema.org/InStock",
      },
      category: "Software / SaaS",
      description: meta.description,
      url: canonical,
    });
  }
  const ldHTML = ldBlocks
    .map(
      (b) =>
        `<script type="application/ld+json" data-prerendered="true">${JSON.stringify(b)}</script>`,
    )
    .join("\n    ");

  // The homepage hero preload (festsal-1, fetchpriority=high) only helps "/".
  // On every other route it high-priority-fetches an image the page never
  // renders, competing with the real LCP element on slow connections — so
  // strip it from non-home routes (status, blogg, use-cases, …).
  const base =
    meta.route === "/"
      ? template
      : template.replace(
          /\n\s*<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/,
          "",
        );

  return base
    // Title
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(
      /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/,
      `<meta name="title" content="${meta.title}" />`,
    )
    // Description
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${meta.description}" />`,
    )
    // Keywords — merge the hardcoded baseline with live-discovered terms
    // from the content-agent (cluster centroids + high-signal seed-expand
    // / gtrends / serpapi keywords). Capped + deduped above; here we just
    // join into the comma-separated meta-content format.
    .replace(
      /<meta\s+name="keywords"\s+content="([^"]*)"\s*\/?>/,
      (_, existing) => {
        const baseline = existing
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const merged = [...baseline];
        const seen = new Set(merged.map((s) => s.toLowerCase()));
        for (const t of DISCOVERED_KEYWORDS) {
          if (!seen.has(t)) {
            merged.push(t);
            seen.add(t);
          }
        }
        const escaped = merged
          .join(", ")
          .replace(/"/g, "&quot;")
          .slice(0, 1800); // browsers ignore much beyond this; keep tag size sane
        return `<meta name="keywords" content="${escaped}" />`;
      },
    )
    // OG
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${meta.title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${meta.description}" />`,
    )
    // Twitter
    .replace(
      /<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:url" content="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:title" content="${meta.title}" />`,
    )
    .replace(
      /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="twitter:description" content="${meta.description}" />`,
    )
    // Canonical
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    // Inject JSON-LD before </head>
    .replace("</head>", `    ${ldHTML}\n  </head>`);
}

const HOMEPAGE = {
  route: "/",
  title: "Digilist — Én plattform for alt som leies ut",
  description:
    "Digital bookingplattform for selskapslokaler, idrettshaller, møterom og kulturhus. Sanntidskalender, Vipps, BankID, EHF, sesongleie. ISO 27001-sertifisert.",
  breadcrumbs: [{ name: "Hjem", url: `${BASE_URL}/` }],
  aboutPage: true,
  service: true,
  howTo: {
    name: "Slik booker du med Digilist",
    description:
      "Fra forespørsel til oppgjør på fire steg — gjennom Digilist-plattformen.",
    steps: [
      {
        name: "Søknad",
        text: "Innbygger, lag, forening eller bedrift sender forespørsel via Digilist. Tilgjengelighet vises i sanntid; forespørsler innenfor regler bookes umiddelbart.",
      },
      {
        name: "Godkjenning",
        text: "Forespørsler utenfor regelverket går til administrator. Godkjenning kan delegeres til driftsroller, og automatregler dekker repeterende mønstre som sesongleie.",
      },
      {
        name: "Bekreftelse",
        text: "Automatisk bekreftelse med detaljer og betaling via Vipps eller kort. Driftsroller — vaktmester, renhold, vekter — varsles automatisk.",
      },
      {
        name: "Oppfølging",
        text: "Faktura og bilag til Visma, Tripletex, Fiken, PowerOffice, DNB Regnskap eller EHF/Peppol. Rapportering, KPI-er og økonomisk avstemming i én plattform.",
      },
    ],
  },
  faq: [
    {
      q: "Hva er Digilist?",
      a: "Digilist er en norsk digital plattform for utleie av selskapslokaler, idrettshaller, møterom, kantiner og kulturhus. Plattformen håndterer booking, betaling, kalender, sesongleie og fakturering i én løsning.",
    },
    {
      q: "Hvilke kommuner og utleiere bruker Digilist?",
      a: "Digilist brukes av norske kommuner og private utleiere — blant andre Nordre Follo kommune, Rønningen Selskapslokale, Lier Bygdetun og RightSize Group.",
    },
    {
      q: "Hvilke betalingsmetoder støttes?",
      a: "Vipps, BankID, Stripe Connect for kort, samt EHF/Peppol-fakturering. Integrasjoner med Visma, Tripletex, Fiken, PowerOffice og DNB Regnskap er aktive.",
    },
    {
      q: "Er Digilist GDPR- og ISO-sertifisert?",
      a: "Ja. Digilist oppfyller GDPR, er ISO 27001 og ISO 27701 sertifisert og følger WCAG 2.0 AA. Data lagres i Norge og EU.",
    },
    {
      q: "Hvordan håndteres sesongleie til lag og foreninger?",
      a: "Digilist har en egen sesongleie-modul med søknadsbehandling, regelstyrt fordeling og rapportering.",
    },
    {
      q: "Støtter Digilist sanntidstilgjengelighet?",
      a: "Ja. Kalenderen viser ledig, opptatt og blokkert tid i sanntid og oppdateres umiddelbart.",
    },
  ],
};

async function main() {
  // Pull live-discovered keywords from Convex and merge into the
  // static SEO surface. Falls back to empty when env vars missing.
  const discovered = await fetchDiscoveredKeywords();
  // Mutate the module-level lists so downstream baseLD()/patchHTML()
  // see the enriched values without threading args through.
  for (const c of discovered.centroids) {
    if (!BRAND_KNOWS_ABOUT.includes(c)) BRAND_KNOWS_ABOUT.push(c);
  }
  DISCOVERED_KEYWORDS = discovered.terms;

  const indexPath = join(DIST, "index.html");
  const template = await fs.readFile(indexPath, "utf-8");

  // Patch the homepage in place — adds base JSON-LD + SSR'd body
  let homepageHTML = patchHTML(template, HOMEPAGE);
  homepageHTML = injectBody(homepageHTML, await renderBody("/"));
  await fs.writeFile(indexPath, homepageHTML, "utf-8");
  console.log(`  ✓ /index.html — base JSON-LD injected (${homepageHTML.length} bytes)`);

  // Pre-render per-route variants
  for (const route of ROUTES) {
    let html = patchHTML(template, route);
    html = injectBody(html, await renderBody(route.route));
    const outDir = join(DIST, route.route.replace(/^\//, ""));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(join(outDir, "index.html"), html, "utf-8");
    console.log(`  ✓ ${route.route}/index.html (${html.length} bytes)`);
  }

  // /faq — pre-rendered with full FAQPage schema from FAQ_CATEGORIES
  const faqCategories = await loadFAQCategories();
  const allFAQ = faqCategories.flatMap((c) => c.questions);
  const faqRoute = {
    route: "/faq",
    title: "FAQ — Vanlige spørsmål om Digilist",
    description:
      "Svar på de vanligste spørsmålene om Digilist — bookingsystem for kommuner og utleiere. SSA-L 2026, GDPR, ISO 27001, Vipps, BankID, sesongleie og mer.",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "FAQ", url: `${BASE_URL}/faq` },
    ],
    faq: allFAQ,
  };
  let faqHTML = patchHTML(template, faqRoute);
  faqHTML = injectBody(faqHTML, await renderBody("/faq"));
  const faqDir = join(DIST, "faq");
  await fs.mkdir(faqDir, { recursive: true });
  await fs.writeFile(join(faqDir, "index.html"), faqHTML, "utf-8");
  console.log(`  ✓ /faq/index.html (${faqHTML.length} bytes, ${allFAQ.length} Q&A)`);

  // Blog index + each post — pre-rendered with Article schema
  const posts = await loadBlogPosts();
  const blogIndex = {
    route: "/blogg",
    title: "Blogg — Innsikt om norsk booking · Digilist",
    description: "Artikler om bookingsystem for kommuner, sesongleie, SSA-L 2026, GDPR og ISO 27001 — fra Digilists arbeid med norske kommuner og utleiere.",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Blogg", url: `${BASE_URL}/blogg` },
    ],
  };
  let blogIndexHTML = patchHTML(template, blogIndex);
  blogIndexHTML = injectBody(blogIndexHTML, await renderBody("/blogg"));
  const blogDir = join(DIST, "blogg");
  await fs.mkdir(blogDir, { recursive: true });
  await fs.writeFile(join(blogDir, "index.html"), blogIndexHTML, "utf-8");
  console.log(`  ✓ /blogg/index.html (${blogIndexHTML.length} bytes)`);

  for (const post of posts) {
    const postRoute = `/blogg/${post.slug}`;
    const coverUrl = post.cover
      ? post.cover.startsWith("http")
        ? post.cover
        : `${BASE_URL}${post.cover}`
      : `${BASE_URL}/og-image.png`;
    const articleLD = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Person", name: post.author },
      publisher: { "@id": `${BASE_URL}/#organization` },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}${postRoute}`,
      },
      image: coverUrl,
      articleSection: post.tag || "Blogg",
      inLanguage: "nb-NO",
    };
    // Only append " — Digilist" if it still fits inside ~65 chars total.
    const postTitle =
      post.title.length > 50 ? post.title : `${post.title} — Digilist`;
    let html = patchHTML(template, {
      route: postRoute,
      title: postTitle,
      description: post.description,
      breadcrumbs: [
        { name: "Hjem", url: `${BASE_URL}/` },
        { name: "Blogg", url: `${BASE_URL}/blogg` },
        { name: post.title, url: `${BASE_URL}${postRoute}` },
      ],
    });
    // Inject Article schema before </head>
    const articleScript = `<script type="application/ld+json" data-prerendered="true">${JSON.stringify(articleLD)}</script>`;
    html = html.replace("</head>", `    ${articleScript}\n  </head>`);
    // og:type article + og:image override with the cover
    html = html.replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="article"`,
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*"/,
      `<meta property="og:image" content="${coverUrl}"`,
    );
    html = html.replace(
      /<meta property="twitter:image" content="[^"]*"/,
      `<meta property="twitter:image" content="${coverUrl}"`,
    );
    html = injectBody(html, await renderBody(postRoute));
    const dir = join(DIST, "blogg", post.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(join(dir, "index.html"), html, "utf-8");
    console.log(`  ✓ /blogg/${post.slug}/index.html (${html.length} bytes)`);
  }

  const today = new Date().toISOString().slice(0, 10);

  // Append FAQ-corpus chapter to dist/llms-full.txt so the published file
  // stays auto-synced with FAQ_CATEGORIES (single source of truth).
  if (faqCategories.length > 0) {
    const llmsFullPath = join(DIST, "llms-full.txt");
    let llmsFull;
    try {
      llmsFull = await fs.readFile(llmsFullPath, "utf-8");
    } catch {
      llmsFull = "";
    }
    const corpusLines = ["", "---", "", "## 11. FAQ-korpus (auto-generert)", ""];
    corpusLines.push(
      `Denne seksjonen er auto-generert fra src/content/faq.ts og brukes som RAG-korpus for Digilist-chatboten. ${allFAQ.length} spørsmål og svar er publisert på https://digilist.no/faq.`,
      "",
    );
    for (const cat of faqCategories) {
      corpusLines.push(`### ${cat.label}`, "", cat.description, "");
      for (const q of cat.questions) {
        corpusLines.push(`**Spørsmål:** ${q.q}`, "", `**Svar:** ${q.a}`, "");
      }
    }
    corpusLines.push("---", "", `Sist oppdatert: ${today}.`);
    // Strip any previous auto-generated chapter, then append the fresh one
    const stripped = llmsFull.split(/\n## 11\. FAQ-korpus/)[0].replace(/\s+$/, "");
    const merged = `${stripped}\n${corpusLines.join("\n")}\n`;
    await fs.writeFile(llmsFullPath, merged, "utf-8");
    console.log(`  ✓ /llms-full.txt — FAQ-korpus appended (${allFAQ.length} Q&A)`);
  }

  // Refresh sitemap with the latest set of routes including blog
  const sitemapEntries = [
    { loc: `${BASE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${BASE_URL}/bookingsystem-kommune`, priority: "0.95", changefreq: "monthly" },
    { loc: `${BASE_URL}/booking-av-lokaler-og-moterom`, priority: "0.95", changefreq: "monthly" },
    { loc: `${BASE_URL}/faq`, priority: "0.9", changefreq: "monthly" },
    { loc: `${BASE_URL}/blogg`, priority: "0.9", changefreq: "weekly" },
    ...posts.map((p) => ({
      loc: `${BASE_URL}/blogg/${p.slug}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: p.date,
    })),
    { loc: `${BASE_URL}/book-demo`, priority: "0.9", changefreq: "monthly" },
    { loc: `${BASE_URL}/personvern`, priority: "0.3", changefreq: "yearly" },
    { loc: `${BASE_URL}/salgsvilkar`, priority: "0.3", changefreq: "yearly" },
    { loc: `${BASE_URL}/cookies`, priority: "0.3", changefreq: "yearly" },
    { loc: `${BASE_URL}/transparens`, priority: "0.7", changefreq: "daily" },
  ];
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
  await fs.writeFile(join(DIST, "sitemap.xml"), sitemapXML, "utf-8");
  console.log(`  ✓ /sitemap.xml regenerated (${sitemapEntries.length} URLs)`);

  // Inline critical CSS on every prerendered page and load the full 107KB
  // stylesheet asynchronously. Without this, first paint waits on the
  // render-blocking <link rel="stylesheet">, which on slow 4G is starved
  // behind ~1MB of high-priority modulepreloaded JS — the dominant FCP/LCP
  // factor on marketing (5.3s) and status (9.6s). The full sheet is kept
  // (pruneSource:false) and swapped in on load, so anything the critical
  // pass misses still styles correctly a moment later. Wrapped in try/catch
  // so a failure here can never break the build or the deploy pipeline.
  try {
    const { default: Beasties } = await import("beasties");
    const beasties = new Beasties({
      path: DIST,
      publicPath: "/",
      pruneSource: false,
      preload: "swap",
      logLevel: "silent",
    });
    const htmlFiles = [];
    const walk = async (dir) => {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) await walk(p);
        else if (entry.name.endsWith(".html")) htmlFiles.push(p);
      }
    };
    await walk(DIST);
    let inlined = 0;
    for (const file of htmlFiles) {
      try {
        const html = await fs.readFile(file, "utf-8");
        const out = await beasties.process(html);
        await fs.writeFile(file, out, "utf-8");
        inlined++;
      } catch {
        /* keep the original file on a per-page failure */
      }
    }
    console.log(`  ✓ Critical CSS inlined on ${inlined}/${htmlFiles.length} pages`);
  } catch (e) {
    console.warn(`  ⚠ Critical CSS step skipped: ${e?.message ?? e}`);
  }

  console.log(`\nPre-rendered ${ROUTES.length + 1 + 1 + posts.length} pages + sitemap.`);
}

main().catch((e) => {
  console.error("Pre-render failed:", e);
  process.exit(1);
});
