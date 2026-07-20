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
    // render() only throws when a Suspense boundary never resolved (XAL-310):
    // swallowing this would ship a no-<h1> page with a green build, exactly
    // the bug this guard exists to catch. Let it fail the build instead.
    console.error(`  [ssr] render(${route}) failed:`, err?.message ?? err);
    throw err;
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
    route: "/leie",
    title: "Finn og book lokale — selskapslokale, møterom, kulturhus | Digilist",
    description:
      "Finn og book lokale til bryllup, selskap, møte eller arrangement. Grendehus, kulturhus og selskapslokaler samlet ett sted, med ekte priser, ledige datoer og betaling med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et lokale?",
        a: "Prisen varierer med type lokale, sted og varighet. Et grendehus kan koste fra noen hundre til noen tusen kroner for en helg, mens kulturhus og selskapslokaler ligger høyere. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
      },
      {
        q: "Kan jeg se ledige datoer og booke på nett?",
        a: "Ja. Du søker på sted og dato, ser hva som faktisk er ledig i sanntid, og booker direkte. Ingen uforpliktende forespørsel og ingen venting, du får bekreftelsen med en gang.",
      },
      {
        q: "Er det gratis å bruke Digilist?",
        a: "Ja, det er gratis å søke, sammenligne og booke som privatperson. Du betaler kun leieprisen til utleier, med Vipps eller kort.",
      },
    ],
    howTo: {
      name: "Slik finner og booker du lokale",
      description: "Finn, book og betal med Vipps på tre steg.",
      steps: [
        { name: "Finn", text: "Søk på sted og dato. Du ser lokaler i nærområdet med ekte priser og hva som faktisk er ledig." },
        { name: "Book", text: "Velg ledig tid og book direkte. Vilkår, depositum og kapasitet er synlig før du bekrefter." },
        { name: "Betal med Vipps", text: "Betal trygt med Vipps eller kort. Bekreftelse og kvittering kommer med en gang." },
      ],
    },
  },
  {
    route: "/leie/selskapslokale",
    title: "Leie selskapslokale: pris, kapasitet og booking | Digilist",
    description:
      "Leie selskapslokale til bryllup, jubileum eller fest: finn ledige datoer, se ekte pris og kapasitet, og book på nett med Vipps. Lokaler nær deg, samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Selskapslokale", url: `${BASE_URL}/leie/selskapslokale` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et selskapslokale?",
        a: "Prisen varierer med type lokale, sted, varighet og dag. Et grendehus kan koste fra noen hundre til noen tusen kroner for en helg, mens et større selskapslokale eller kulturhussal ligger høyere. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
      },
      {
        q: "Kan jeg booke på nett og se ledige datoer?",
        a: "Ja. Du søker på sted og dato, ser hva som er ledig i sanntid, og booker direkte uten uforpliktende forespørsel. Bekreftelsen kommer med en gang.",
      },
    ],
  },
  {
    route: "/leie/gaard",
    title: "Leie gård til bryllup og selskap: pris og booking | Digilist",
    description:
      "Leie gård eller låve til gårdsbryllup, selskap eller firmatur: finn ledige gårder nær deg, se ekte pris og hva som er inkludert, og book på nett med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Gård", url: `${BASE_URL}/leie/gaard` },
    ],
    faq: [
      {
        q: "Hva koster det å leie en gård til bryllup eller selskap?",
        a: "Prisen varierer med sted, sesong og hva som er inkludert. En enkel låve for en kveld kan koste noen tusen kroner, mens en hel bryllupshelg med overnatting gjerne ligger fra ti tusen og oppover. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
      },
      {
        q: "Kan jeg leie gård til bryllup?",
        a: "Ja. Mange gårder leies ut nettopp til gårdsbryllup, med låve til middag og fest, tun til vielse og fotografering, og ofte overnatting til de nærmeste gjestene.",
      },
    ],
  },
  {
    route: "/leie/bursdagslokale",
    title: "Leie bursdagslokale: pris, ledige datoer og booking | Digilist",
    description:
      "Leie bursdagslokale til barnebursdag eller voksenbursdag: finn ledig lokale til bursdag nær deg, se ekte pris og book med Vipps. Alt samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Bursdagslokale", url: `${BASE_URL}/leie/bursdagslokale` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et bursdagslokale?",
        a: "Prisen varierer med type lokale, sted og varighet. Et festrom eller grendehus til barnebursdag kan koste fra noen hundrelapper for noen timer, mens et større lokale med kjøkken til voksenbursdag gjerne ligger fra tusenlappen og oppover for en kveld. På Digilist ser du totalprisen for din dato før du booker.",
      },
      {
        q: "Hvor finner jeg lokale til barnebursdag?",
        a: "Søk på sted og dato på Digilist, så ser du festrom, grendehus, aktivitetslokaler og gymsaler i nærområdet som faktisk er ledige, med pris og hva som er inkludert synlig før du booker direkte.",
      },
    ],
  },
  {
    route: "/leie/kulturhus",
    title: "Leie kulturhus: pris, kapasitet og booking | Digilist",
    description:
      "Leie kulturhus, samfunnshus eller grendehus til konsert, forestilling eller storselskap: se pris, kapasitet og scene- og lydfasiliteter, finn ledig dato og book med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Kulturhus", url: `${BASE_URL}/leie/kulturhus` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et kulturhus eller samfunnshus?",
        a: "Prisen varierer mye med hus, sal, varighet og om du er privatperson eller forening. Et grendehus kan koste fra noen hundre til noen tusen kroner for en helg, mens en kulturhussal med scene og lydanlegg gjerne ligger høyere. På Digilist ser du totalprisen for din dato før du booker.",
      },
      {
        q: "Kan jeg leie kulturhus som privatperson?",
        a: "Ja, de fleste kulturhus, samfunnshus og grendehus leies ut til privatpersoner til selskap, markeringer og arrangementer. Noen hus har egne satser for lag og foreninger. Vilkårene står på lokalet før du booker.",
      },
    ],
  },
  {
    route: "/leie/moterom",
    title: "Leie møterom: pris per time og booking på nett | Digilist",
    description:
      "Leie møterom til møte, workshop, kurs eller intervju: se pris per time, ledige tider i sanntid, og book på nett med Vipps. Møterom nær deg, samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Møterom", url: `${BASE_URL}/leie/moterom` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et møterom?",
        a: "Prisen varierer med sted, størrelse og utstyr. Et enkelt rom for fire til seks personer kan koste fra et par hundre kroner per time, mens større rom med videomøteutstyr ligger høyere. Kommunale rom er ofte rimelige. På Digilist ser du totalen for dine timer før du booker.",
      },
      {
        q: "Kan jeg leie møterom for bare noen timer?",
        a: "Ja. De fleste rommene bookes per time, så du betaler for de timene du faktisk trenger, enten det er et møte på en time eller en workshop over en hel dag.",
      },
    ],
  },
  {
    route: "/leie/konferanselokale",
    title: "Leie konferanselokale: pris, kapasitet og booking | Digilist",
    description:
      "Leie konferanselokale eller konferansesal til seminar, kurs og konferanse: se pris, kapasitet og ledige datoer, og book på nett. Lokaler samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Konferanselokale", url: `${BASE_URL}/leie/konferanselokale` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et konferanselokale?",
        a: "Prisen varierer med sted, størrelse og varighet. Et mindre kurslokale kan koste fra et par tusen kroner for en halv dag, mens en konferansesal med plass til hundrevis ligger betydelig høyere. På Digilist står prisen for hel og halv dag på hvert lokale før du booker.",
      },
      {
        q: "Hvor mange deltakere er det plass til?",
        a: "Kapasiteten står oppgitt per oppsett på hvert lokale. Kinooppsett gir plass til flest, klasserom og øyer krever mer plass per deltaker. Du filtrerer på antall deltakere når du søker.",
      },
    ],
  },
  {
    route: "/leie/kontorlokaler",
    title: "Leie kontorlokaler: pris, vilkår og fleksibel leie | Digilist",
    description:
      "Leie kontorlokaler til din bedrift: finn ledige kontor nær deg, se pris med felleskostnader og vilkår, og reserver digitalt. Fleksibel leie uten lang binding.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Kontorlokaler", url: `${BASE_URL}/leie/kontorlokaler` },
    ],
    faq: [
      {
        q: "Hva koster det å leie kontorlokaler?",
        a: "Prisen avhenger av by, beliggenhet, størrelse og hva som er inkludert. Et enkelt cellekontor kan koste fra noen tusen kroner i måneden, mens større teamkontor i sentrale strøk ligger høyere. På Digilist ser du månedsleie og felleskostnader samlet på hvert lokale.",
      },
      {
        q: "Kan jeg leie kontor på korttid eller uten lang binding?",
        a: "Ja. Mange lokaler på Digilist tilbys med kort bindingstid, løpende leie eller ren korttidsleie. Det passer for prosjekter, satellittkontor eller bedrifter som vil teste et område før de binder seg.",
      },
    ],
  },
  {
    route: "/leie/coworking",
    title: "Leie coworking-plass: dagplass og kontorfellesskap | Digilist",
    description:
      "Leie kontorplass i coworking eller kontorfellesskap: finn ledig dagplass nær deg, se dagspris og hva som er inkludert, og book på nett med Vipps. Uten medlemskap.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Coworking", url: `${BASE_URL}/leie/coworking` },
    ],
    faq: [
      {
        q: "Hva koster en dagplass i coworking?",
        a: "Prisen varierer med by og sted. En dagplass ligger typisk mellom 150 og 500 kroner, klippekort gir lavere pris per dag, og månedspris passer deg som kommer ofte. På Digilist ser du prisen på hvert sted før du booker.",
      },
      {
        q: "Trenger jeg medlemskap for å bruke et kontorfellesskap?",
        a: "Nei, ikke på steder som tilbyr dagplass via Digilist. Du booker dagen du trenger og betaler for den, uten registrering, binding eller oppsigelsesfrist. Kommer du ofte, kan klippekort eller månedspris lønne seg.",
      },
    ],
  },
  {
    route: "/leie/idrettshall",
    title: "Leie idrettshall: ledige enkelttimer og booking | Digilist",
    description:
      "Leie idrettshall eller gymsal til trening, turnering eller bursdag: se ledige enkelttimer i sanntid, book direkte og betal med Vipps. Ingen søknad, ingen venting.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Idrettshall", url: `${BASE_URL}/leie/idrettshall` },
    ],
    faq: [
      {
        q: "Kan jeg leie idrettshall eller gymsal som privatperson?",
        a: "Ja. Ledige enkelttimer i kommunale haller kan bookes av privatpersoner og grupper, til trening, bursdag, turnering eller annen aktivitet. Du trenger ikke være klubb eller forening, og du trenger ikke søke.",
      },
      {
        q: "Hva koster det å leie en time i idrettshall?",
        a: "Prisen settes av kommunen eller utleier og varierer med hallstørrelse, om du leier hel eller halv flate, og tidspunkt. En gymsal koster gjerne mindre enn full flate i en stor hall. På Digilist står timeprisen på hallen.",
      },
    ],
  },
  {
    route: "/leie/padelbane",
    title: "Leie padelbane: book padel per time nær deg | Digilist",
    description:
      "Leie padelbane per time: finn ledige padelbaner nær deg, se pris og ledige tider i sanntid, og book padel med Vipps. Utstyrsleie og innendørs og utendørs baner.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Padelbane", url: `${BASE_URL}/leie/padelbane` },
    ],
    faq: [
      {
        q: "Hva koster det å leie en padelbane?",
        a: "Prisen varierer med sted, tidspunkt og om banen er innendørs eller utendørs. En time koster typisk fra rundt 200 til 500 kroner for hele banen, altså delt på fire spillere ved dobbel. På Digilist står prisen per time på hver bane før du booker.",
      },
      {
        q: "Hvordan booker jeg en padelbane?",
        a: "Søk på sted og tidspunkt, se hvilke baner som er ledige i sanntid, velg en time og betal med Vipps eller kort. Bekreftelsen kommer med en gang, og du trenger ikke lage konto hos hvert enkelt anlegg.",
      },
    ],
  },
  {
    route: "/leie/svommehall",
    title: "Leie svømmehall og basseng: se ledige tider og book | Digilist",
    description:
      "Leie svømmehall eller basseng til bursdag, svømmegruppe eller kurs: se ledige tider utenom klubbtidene, pris og regler, og book direkte på nett. Samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Leie", url: `${BASE_URL}/leie` },
      { name: "Svømmehall", url: `${BASE_URL}/leie/svommehall` },
    ],
    faq: [
      {
        q: "Kan jeg leie svømmehall privat?",
        a: "Ja. Mange kommunale svømmehaller leier ut enkelttimer til private utenom klubbtider og publikumsbading, både enkeltbaner og hele basseng. Reglene for badevakt og antall badende varierer per hall og står oppgitt før du booker.",
      },
      {
        q: "Hva koster det å leie svømmehall eller basseng?",
        a: "Prisen varierer med hall, tidspunkt og om du leier en bane eller hele bassenget. En enkeltbane koster gjerne noen hundre kroner per time, hele basseng mer. På Digilist ser du prisen for akkurat din time før du bekrefter.",
      },
    ],
  },
  {
    route: "/overnatting",
    title: "Overnatting: leie hytte, leilighet eller rom | Digilist",
    description:
      "Finn og book overnatting i Norge: leie hytte, leilighet eller rom. Se totalpris uten skjulte gebyrer og ledige netter, og book trygt med Vipps. Samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Overnatting", url: `${BASE_URL}/overnatting` },
    ],
    howTo: {
      name: "Slik finner og booker du overnatting",
      description: "Finn, book og betal med Vipps på tre steg.",
      steps: [
        { name: "Finn", text: "Søk på sted og datoer. Du ser hytter, leiligheter og rom i nærområdet med totalpris uten skjulte gebyrer." },
        { name: "Book", text: "Velg ledige netter og book direkte. Innsjekk, kapasitet og vilkår er synlig før du bekrefter." },
        { name: "Betal med Vipps", text: "Betal trygt med Vipps eller kort. Bekreftelse og innsjekkinfo kommer med en gang." },
      ],
    },
    faq: [
      {
        q: "Hva slags overnatting finner jeg?",
        a: "Hytter, korttidsleiligheter og private rom og gjesterom, samlet på ett sted. Du ser totalpris og ledige netter før du booker, uten å lete gjennom Finn, Airbnb og Facebook-grupper hver for seg.",
      },
      {
        q: "Er totalprisen synlig, eller kommer det gebyrer på slutten?",
        a: "Totalprisen, inkludert vask og eventuelle gebyrer, vises før du booker. Ingen tillegg som dukker opp i siste steg, slik at du vet nøyaktig hva oppholdet koster.",
      },
    ],
  },
  {
    route: "/overnatting/hytte",
    title: "Leie hytte: ledige netter, totalpris og booking | Digilist",
    description:
      "Leie hytte til helgetur, ferie eller påske: se ledige netter og totalpris uten skjulte gebyrer, og book trygt med Vipps. Hytter i hele Norge, samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Overnatting", url: `${BASE_URL}/overnatting` },
      { name: "Hytte", url: `${BASE_URL}/overnatting/hytte` },
    ],
    faq: [
      {
        q: "Hva koster det å leie hytte?",
        a: "Prisen varierer med sted, standard, sesong og antall netter. En enkel hytte kan koste fra rundt tusenlappen per natt, mens større hytter med badstue og høy standard ligger høyere, spesielt i vinterferie og påske. På Digilist ser du totalprisen for dine netter før du booker.",
      },
      {
        q: "Hva er inkludert i leien?",
        a: "Sengeplasser, ved, strøm, wifi, badstue, båt og vask vises tydelig på hver hytte før du booker, og totalprisen viser hva som er med og hva som eventuelt koster ekstra.",
      },
    ],
  },
  {
    route: "/overnatting/leilighet",
    title: "Leie leilighet: korttidsleie, totalpris og booking | Digilist",
    description:
      "Leie leilighet for korttid: byferie, jobbreise eller mellombolig. Se ledige netter, totalpris med rengjøring og gebyr, og book korttidsleie av leilighet med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Overnatting", url: `${BASE_URL}/overnatting` },
      { name: "Leilighet", url: `${BASE_URL}/overnatting/leilighet` },
    ],
    faq: [
      {
        q: "Hva koster det å leie leilighet for korttid?",
        a: "Prisen varierer med by, størrelse, standard og sesong. En liten leilighet utenfor sentrum kan koste noen hundrelapper per natt, mens en stor og sentral leilighet i høysesong ligger høyere. På Digilist ser du totalprisen for dine netter før du booker.",
      },
      {
        q: "Kan jeg leie leilighet som mellombolig i noen uker?",
        a: "Ja. Mange leiligheter kan bookes for alt fra én natt til flere uker, og passer som mellombolig ved flytting, oppussing eller ventetid mellom to boliger. Du ser totalprisen for hele oppholdet.",
      },
    ],
  },
  {
    route: "/overnatting/rom",
    title: "Leie rom og gjesterom: rimelig overnatting | Digilist",
    description:
      "Leie rom eller gjesterom for en natt eller flere: finn ledige rom nær deg, se pris per natt og hva som er inkludert, og book med Vipps. Rimelig alternativ til hotell.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Overnatting", url: `${BASE_URL}/overnatting` },
      { name: "Rom", url: `${BASE_URL}/overnatting/rom` },
    ],
    faq: [
      {
        q: "Hva koster det å leie rom?",
        a: "Prisen varierer med sted, standard og sesong. Et enkelt gjesterom ligger ofte fra noen hundre kroner per natt, godt under hotellpris. På Digilist ser du pris per natt og totalpris for dine netter før du booker.",
      },
      {
        q: "Er badet delt eller eget?",
        a: "Det varierer per rom, og det står tydelig på hvert rom før du booker. Mange gjesterom har delt bad, mens noen har eget bad. Du ser det i beskrivelsen før du velger.",
      },
    ],
  },
  {
    route: "/overnatting/feriehus",
    title: "Leie feriehus: ledige netter, totalpris og booking | Digilist",
    description:
      "Leie feriehus til familieferie, gjenforening eller storfamilie: se ledige netter og totalpris uten skjulte gebyrer, og book trygt med Vipps. Feriehus i hele Norge.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Overnatting", url: `${BASE_URL}/overnatting` },
      { name: "Feriehus", url: `${BASE_URL}/overnatting/feriehus` },
    ],
    faq: [
      {
        q: "Hva koster det å leie feriehus?",
        a: "Prisen varierer med sted, størrelse, standard og sesong. Et mindre feriehus kan koste noen tusenlapper for en helg, mens store hus ved sjøen med mange soverom ligger høyere. På Digilist ser du totalprisen for dine netter, inkludert vask og gebyrer, før du booker.",
      },
      {
        q: "Hvor mange er det plass til i et feriehus?",
        a: "Feriehus har typisk flere soverom og sengeplasser enn en hytte eller leilighet, ofte plass til åtte, tolv eller flere. Antall soverom, bad og sengeplasser står tydelig på hvert hus, og du kan filtrere på antall gjester når du søker.",
      },
    ],
  },
  {
    route: "/utstyr",
    title: "Leie utstyr: festutstyr, verktøy, maskiner, lyd og lys | Digilist",
    description:
      "Leie utstyr på ett sted: festutstyr og telt, verktøy og maskiner, lyd og lys. Se pris per dag, depositum og ledighet, og book med Vipps. Henting eller levering.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Utstyr", url: `${BASE_URL}/utstyr` },
    ],
    howTo: {
      name: "Slik finner og leier du utstyr",
      description: "Finn, book og betal med Vipps på tre steg.",
      steps: [
        { name: "Finn", text: "Søk på sted og dato. Du ser festutstyr, verktøy, maskiner, lyd og lys i nærområdet med pris per dag og depositum synlig." },
        { name: "Book leieperiode", text: "Velg leieperioden og book direkte. Vilkår, depositum og om du henter eller får levert er synlig før du bekrefter." },
        { name: "Hent eller få levert", text: "Betal med Vipps eller kort. Depositum håndteres digitalt og frigjøres etter retur." },
      ],
    },
    faq: [
      {
        q: "Hva slags utstyr kan jeg leie?",
        a: "Festutstyr som telt, bord, stoler og servise, verktøy og maskiner til oppussing og hage, og lyd- og lysutstyr til arrangementer. Alt samlet på ett sted, med pris og ledighet synlig før du booker.",
      },
      {
        q: "Kan jeg få utstyret levert, eller må jeg hente selv?",
        a: "Det varierer per utleier, og begge deler finnes. Hvert utstyr viser om levering tilbys og hva det koster, eller om du henter selv, slik at du vet det før du booker.",
      },
    ],
  },
  {
    route: "/utstyr/festutstyr",
    title: "Leie festutstyr: telt, bord, stoler og servise | Digilist",
    description:
      "Leie festutstyr til bryllup, selskap eller bursdag: leie telt, bord, stoler og servise nær deg. Se pris og ledige datoer, og book med Vipps. Henting eller levering.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Utstyr", url: `${BASE_URL}/utstyr` },
      { name: "Festutstyr", url: `${BASE_URL}/utstyr/festutstyr` },
    ],
    faq: [
      {
        q: "Hva koster det å leie festutstyr og telt?",
        a: "Bord og stoler leies ofte per stykk for noen titalls kroner per døgn, mens et partytelt gjerne koster fra rundt tusenlappen til flere tusen kroner for en helg. På Digilist ser du pris per dag og eventuelt depositum for din leieperiode før du booker.",
      },
      {
        q: "Må jeg betale depositum?",
        a: "Mange utleiere krever depositum på festutstyr, særlig telt og servise. Det håndteres digitalt i samme betaling som leien, og frigjøres automatisk etter at utstyret er levert tilbake i avtalt stand.",
      },
    ],
  },
  {
    route: "/utstyr/verktoy-maskiner",
    title: "Leie verktøy og maskiner: pris og booking | Digilist",
    description:
      "Leie verktøy og maskiner til oppussing, hage og bygg: minigraver, høytrykksspyler og stillas. Se pris per dag, ledighet og depositum, og book med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Utstyr", url: `${BASE_URL}/utstyr` },
      { name: "Verktøy og maskiner", url: `${BASE_URL}/utstyr/verktoy-maskiner` },
    ],
    faq: [
      {
        q: "Hva koster det å leie verktøy eller minigraver?",
        a: "En slagbormaskin eller høytrykksspyler kan koste fra et par hundre kroner per dag, mens en minigraver gjerne ligger fra rundt tusen kroner per dag og oppover. På Digilist ser du pris per dag eller helg og eventuelt depositum før du booker.",
      },
      {
        q: "Kan jeg få utstyret levert, eller må jeg hente selv?",
        a: "Det varierer per annonse. Mange utleiere tilbyr henting til avtalt tid, og noen leverer større maskiner mot et tillegg. Hva som gjelder står på utstyret før du booker.",
      },
    ],
  },
  {
    route: "/utstyr/lyd-og-lys",
    title: "Leie lyd og lys: lydanlegg, scenelys og booking | Digilist",
    description:
      "Leie lydanlegg, mikrofon, scenelys og projektor til fest, konsert eller konferanse: se pris per dag, sjekk ledige datoer og book lyd og lys med Vipps. Nær deg.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Utstyr", url: `${BASE_URL}/utstyr` },
      { name: "Lyd og lys", url: `${BASE_URL}/utstyr/lyd-og-lys` },
    ],
    faq: [
      {
        q: "Hva koster det å leie et lydanlegg?",
        a: "Et lite anlegg til tale og bakgrunnsmusikk kan koste fra noen hundrelapper per dag, mens et komplett PA-anlegg med mikser, mikrofoner og scenelys gjerne ligger fra tusen kroner og oppover. Prisen står på hvert utstyr før du booker.",
      },
      {
        q: "Kan jeg få med tekniker som rigger og styrer lyden?",
        a: "Ja, der utleier tilbyr det, legger du til tekniker som tilvalg i samme booking. Teknikeren rigger, lydsjekker og styrer anlegget under arrangementet.",
      },
    ],
  },
  {
    route: "/utstyr/sport-og-friluft",
    title: "Leie sportsutstyr: sykkel, ski og kajakk nær deg | Digilist",
    description:
      "Leie sportsutstyr og friluftsutstyr nær deg: leie sykkel, ski, kajakk, SUP og telt per dag eller helg. Se pris og depositum, og book med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Utstyr", url: `${BASE_URL}/utstyr` },
      { name: "Sport og friluft", url: `${BASE_URL}/utstyr/sport-og-friluft` },
    ],
    faq: [
      {
        q: "Hva koster det å leie sykkel, ski eller kajakk?",
        a: "En vanlig sykkel eller et par langrennsski leies gjerne for noen hundrelapper per dag, mens elsykkel, alpinutstyr og havkajakk ofte koster noe mer. På Digilist ser du dagspris og eventuelt depositum for din leieperiode før du booker.",
      },
      {
        q: "Kan jeg få utstyret levert, eller må jeg hente selv?",
        a: "Det varierer per utleier, og begge deler finnes. Hvert utstyr viser om levering tilbys og hva det koster, eller om du henter selv. Kajakker leies ofte ut rett ved vannet, mens sykler og ski som regel hentes hos utleier.",
      },
    ],
  },
  {
    route: "/tjenester",
    title: "Book tjenester: catering, DJ, musiker og dekor | Digilist",
    description:
      "Book tjenester til arrangementet: catering, DJ, musiker og dekor. Se pris, sjekk ledig dato og book leverandør nær deg med Vipps. Alt samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Tjenester", url: `${BASE_URL}/tjenester` },
    ],
    howTo: {
      name: "Slik finner og booker du tjenester",
      description: "Finn, sjekk ledig dato og betal med Vipps på tre steg.",
      steps: [
        { name: "Finn leverandør", text: "Søk på sted og dato. Du ser cateringleverandører, DJ-er, musikere og dekoratører i nærområdet med pris synlig." },
        { name: "Sjekk ledig dato", text: "Leverandørens kalender viser om datoen din er ledig. Du booker direkte, uten forespørsel og venting på tilbud." },
        { name: "Book og betal med Vipps", text: "Betal med Vipps eller kort. Bekreftelse og kvittering kommer med en gang." },
      ],
    },
    faq: [
      {
        q: "Hvilke tjenester kan jeg booke?",
        a: "Catering, DJ, musiker og dekor til bryllup, selskap og firmaarrangement, samlet på ett sted. Du ser pris og ledig dato på hver leverandør, og booker direkte i stedet for å sende forespørsler og vente på tilbud.",
      },
      {
        q: "Hvordan vet jeg om leverandøren er ledig?",
        a: "Hver leverandør har en kalender som viser om datoen din er ledig i sanntid. Du booker direkte og får bekreftelsen med en gang, uten forespørsel og venting på svar.",
      },
    ],
  },
  {
    route: "/tjenester/catering",
    title: "Bestille catering: meny, pris per kuvert og booking | Digilist",
    description:
      "Bestille catering til bryllup, konfirmasjon eller firmafest: se meny og pris per kuvert, sjekk ledige datoer, og book cateringleverandør nær deg med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Tjenester", url: `${BASE_URL}/tjenester` },
      { name: "Catering", url: `${BASE_URL}/tjenester/catering` },
    ],
    faq: [
      {
        q: "Hva koster catering per kuvert?",
        a: "Et enkelt koldtbord ligger ofte fra rundt 200 til 400 kroner per kuvert, tapas og buffet gjerne fra 300 til 500, og en flerretters middag fra 500 kroner og oppover. På Digilist ser du prisen per kuvert på hver leverandør før du bestiller.",
      },
      {
        q: "Kan leverandøren ta hensyn til allergier og spesialkost?",
        a: "Ja. Allergener er merket på menyene, og du noterer allergier og spesialkost direkte i bestillingen, så leverandøren får beskjeden sammen med bestillingen.",
      },
    ],
  },
  {
    route: "/tjenester/dj",
    title: "Leie DJ til bryllup og fest: pris og booking | Digilist",
    description:
      "Leie DJ til bryllup, fest eller firmafest: se sjanger, pris per kveld og utstyr, sjekk ledig dato og book med Vipps. Finn DJ-er nær deg, samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Tjenester", url: `${BASE_URL}/tjenester` },
      { name: "DJ", url: `${BASE_URL}/tjenester/dj` },
    ],
    faq: [
      {
        q: "Hva koster det å leie en DJ?",
        a: "En vanlig kveld ligger ofte mellom 5 000 og 15 000 kroner, mens bryllup med lang spilletid eller etterspurte DJ-er kan koste mer. På Digilist står prisen per kveld på hver DJ, så du ser hva det koster før du booker.",
      },
      {
        q: "Har DJ-en eget lydanlegg og lys?",
        a: "De fleste profesjonelle DJ-er tar med eget lydanlegg og lys, men det varierer. På Digilist står det tydelig på hver DJ hva som er inkludert.",
      },
    ],
  },
  {
    route: "/tjenester/musiker",
    title: "Leie musiker eller band til bryllup og fest | Digilist",
    description:
      "Leie musiker eller band til bryllup og selskap: se sjanger, besetning og pris, sjekk ledig dato og book med Vipps. Finn ledige musikere nær deg, samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Tjenester", url: `${BASE_URL}/tjenester` },
      { name: "Musiker", url: `${BASE_URL}/tjenester/musiker` },
    ],
    faq: [
      {
        q: "Hva koster det å leie musiker eller band?",
        a: "En solist til en vielse ligger ofte fra noen tusen kroner, mens et fullt band til en hel kveld gjerne koster fra ti tusen og oppover. På Digilist ser du prisen på hver profil før du booker.",
      },
      {
        q: "Kan jeg ønske meg bestemte sanger til vielsen?",
        a: "Ja, de fleste solister og musikere tar imot sangønsker. Repertoaret står på profilen, og du kan sende ønsker i bookingen.",
      },
    ],
  },
  {
    route: "/tjenester/dekor",
    title: "Leie dekor og pynt til fest: pakker, pris og booking | Digilist",
    description:
      "Leie dekor til bryllup og fest: blomsterdekor, bordpynt og ballongbuer i ferdige pakker. Se pris, sjekk ledig dato og book dekoratør nær deg med Vipps.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Tjenester", url: `${BASE_URL}/tjenester` },
      { name: "Dekor", url: `${BASE_URL}/tjenester/dekor` },
    ],
    faq: [
      {
        q: "Hva koster dekor til bryllup eller fest?",
        a: "En enkel bordpyntpakke kan koste noen hundre kroner per bord, en ballongbue fra rundt tusenlappen, mens helhetlig bryllupsdekor med blomster, bakvegg og rigging gjerne ligger fra noen tusen kroner og oppover. Prisen per pakke står synlig før du booker.",
      },
      {
        q: "Rigger dekoratøren selv, eller må jeg gjøre det?",
        a: "Mange pakker inkluderer at dekoratøren rigger i lokalet før festen og henter alt etterpå. Der rigging tilbys, står det på pakken.",
      },
    ],
  },
  {
    route: "/arrangementer",
    title: "Arrangementer: kjøp billetter til konsert, teater og festival | Digilist",
    description:
      "Finn arrangementer nær deg og kjøp billetter til konsert, teater og festival. Betal med Vipps, få QR-billett på mobilen, bruk rabattkode og gavekort. Samlet ett sted.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Arrangementer", url: `${BASE_URL}/arrangementer` },
    ],
    howTo: {
      name: "Slik kjøper du billetter til arrangementer",
      description: "Finn arrangement, velg billett og betal med Vipps på tre steg.",
      steps: [
        { name: "Finn arrangement", text: "Søk på sted og dato. Du ser konserter, forestillinger og festivaler nær deg med pris og hvilke billetter som er igjen." },
        { name: "Velg billett", text: "Velg billettype og antall. Rabattkoder og gavekort legges inn i kassen, og totalen vises før du bekrefter." },
        { name: "Betal med Vipps", text: "Betal med Vipps eller kort, og få QR-billetten rett på mobilen. Vis den ved inngangen, ferdig." },
      ],
    },
    faq: [
      {
        q: "Hva slags arrangementer finner jeg?",
        a: "Konserter, teater og forestillinger, standup, revy og festivaler, samlet på ett sted. Du søker på sted og dato, ser pris og hvilke billetter som er igjen, og kjøper direkte uten å lete gjennom hver arrangørs egen billettside.",
      },
      {
        q: "Får jeg billetten på mobilen?",
        a: "Ja. Billetten kommer som en QR-kode rett på mobilen etter kjøpet. Ved inngangen viser du QR-koden, den skannes, og du er inne. Ingen papirlapp, ingen e-post å lete etter.",
      },
    ],
  },
  {
    route: "/arrangementer/konsert",
    title: "Konsertbilletter: finn konserter og kjøp med Vipps | Digilist",
    description:
      "Konsertbilletter samlet ett sted: finn konserter nær deg, se pris og ledige billetter, og kjøp billetter til konsert med Vipps. QR-billett rett på mobilen.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Arrangementer", url: `${BASE_URL}/arrangementer` },
      { name: "Konsert", url: `${BASE_URL}/arrangementer/konsert` },
    ],
    faq: [
      {
        q: "Hva koster konsertbilletter?",
        a: "Prisen varierer med artist, scene og billettype. En klubbkonsert kan koste noen hundre kroner, mens større navn ligger høyere, og VIP koster mer enn ståplass. På Digilist ser du prisen per billett før du kjøper, uten gebyrer som dukker opp i siste steg.",
      },
      {
        q: "Får jeg billetten på mobilen?",
        a: "Ja. Billetten leveres som QR-kode på mobilen med en gang kjøpet er gjennomført, og ligger i oversikten din frem til konserten. Du viser bare QR-koden ved inngangen.",
      },
    ],
  },
  {
    route: "/arrangementer/teater-og-scene",
    title: "Teaterbilletter: finn forestilling og kjøp billett | Digilist",
    description:
      "Teaterbilletter og billetter til forestilling, standup og revy nær deg. Se pris og ledige seter, velg plass og kjøp med Vipps. QR-billett med sete på mobilen.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Arrangementer", url: `${BASE_URL}/arrangementer` },
      { name: "Teater og scene", url: `${BASE_URL}/arrangementer/teater-og-scene` },
    ],
    faq: [
      {
        q: "Kan jeg velge sete?",
        a: "Ja, der salen har nummererte plasser velger du sete direkte i salkartet og ser hvilke plasser som er ledige. Noen forestillinger har fri plassering, og da står det tydelig på arrangementet før du kjøper.",
      },
      {
        q: "Hvordan kjøper jeg billetter til en forestilling?",
        a: "Søk på sted og dato, velg forestilling, antall billetter og eventuelt seter, og betal med Vipps eller kort. Billettene kommer som QR-koder på mobilen med en gang, uten at du må opprette ny konto.",
      },
    ],
  },
  {
    route: "/arrangementer/festival",
    title: "Festivalbilletter og festivalpass: finn og kjøp | Digilist",
    description:
      "Finn festivalbilletter og festivalpass nær deg: musikk-, mat- og kulturfestivaler samlet ett sted. Kjøp dagspass eller helgepass med Vipps, QR-billett på mobilen.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Arrangementer", url: `${BASE_URL}/arrangementer` },
      { name: "Festival", url: `${BASE_URL}/arrangementer/festival` },
    ],
    faq: [
      {
        q: "Hva er forskjellen på dagspass og helgepass?",
        a: "Dagspass gjelder én bestemt dag av festivalen, helgepass gjelder alle dagene. Skal du bare se ett program, holder ofte dagspasset. Skal du ha med deg hele festivalen, er helgepasset som regel billigere enn flere dagspass.",
      },
      {
        q: "Hva koster et festivalpass?",
        a: "Et dagspass til en lokal festival kan koste fra noen hundrelapper, mens helgepass til større musikkfestivaler gjerne ligger fra rundt tusen kroner og oppover. På Digilist ser du prisen for hvert pass, inkludert gebyrer, før du kjøper.",
      },
    ],
  },
  {
    route: "/arrangementer/sport",
    title: "Sportsbilletter: billetter til kamp, kjøp med Vipps | Digilist",
    description:
      "Sportsbilletter samlet ett sted: finn kamper og idrettsarrangement nær deg, se pris og ledige seter, og kjøp billetter til kamp med Vipps. QR-billett på mobilen.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Arrangementer", url: `${BASE_URL}/arrangementer` },
      { name: "Sport", url: `${BASE_URL}/arrangementer/sport` },
    ],
    faq: [
      {
        q: "Kan jeg velge sete eller felt?",
        a: "Ja, der arrangøren har satt opp seter eller felt. Du ser hvilke plasser som er ledige og velger i kjøpet, og skal dere flere sammen, kan dere velge seter ved siden av hverandre. På mindre arrangementer er billettene ofte uplasserte.",
      },
      {
        q: "Finnes det sesongkort?",
        a: "Ja, der klubben tilbyr det. Sesongkortet kjøpes på samme måte som en enkeltbillett, gjerne med fast plass, og ligger på mobilen gjennom hele sesongen. Du viser samme QR-kode ved inngangen på hver hjemmekamp.",
      },
    ],
  },
  {
    route: "/billettsystem",
    title: "Billettsystem: selg billetter med rabatt, kupong og gavekort | Digilist",
    description:
      "Digilist billettsystem: selg billetter til arrangementet med rabattkoder, kuponger og gavekort. Vipps og kort, QR-billett, skanning ved inngang og oppgjør. Sanntid.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Billettsystem", url: `${BASE_URL}/billettsystem` },
    ],
    faq: [
      {
        q: "Hvordan fungerer rabattkoder og kuponger?",
        a: "Du lager rabattkoder med fast beløp eller prosent, med gyldighetsperiode og maks antall bruk. Kuponger kan knyttes til bestemte billettyper eller hele arrangementet. Kjøperen legger inn koden i kassen, og rabatten trekkes fra med en gang.",
      },
      {
        q: "Kan jeg selge og løse inn gavekort?",
        a: "Ja. Gavekort selges digitalt og kan brukes til å betale for billetter og booking. Saldo og gyldighet håndteres i systemet, og gjenstående beløp følger med til neste kjøp.",
      },
    ],
  },
  {
    route: "/teknologi",
    title: "Teknologi og sikkerhet: stack, arkitektur og samsvar | Digilist",
    description:
      "Teknologien bak Digilist: React 19, Convex reaktiv runtime, PostgreSQL 16 i Norge og EU, ISO 27001/27701, GDPR, WCAG 2.1 AA, ID-porten, EHF/Peppol og norske integrasjoner.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Teknologi", url: `${BASE_URL}/teknologi` },
    ],
    // Mirror of TEKNOLOGI_FAQ in src/pages/Teknologi.tsx — keep byte-for-byte
    // identical (this copy is what crawlers index; visible text must match).
    faq: [
      { q: "Hvilken teknologi er Digilist bygget på?", a: "Frontend: React 19, React Router 7, TypeScript strict, Tailwind CSS og Digdir Designsystemet. Backend: Convex (self-hosted) reaktiv runtime, Node.js 20 LTS, Zod. Database: PostgreSQL 16. Mobil: bare React Native (iOS, iPadOS, Android). Sikkerhet: TLS 1.3, AES-256-GCM, RBAC, ID-porten." },
      { q: "Hvilke integrasjoner støttes?", a: "Betaling: Vipps, Stripe Connect, EHF/Peppol. Autentisering: BankID (via Signicat), ID-porten, BRREG. Regnskap: Visma eAccounting, Tripletex, Fiken, PowerOffice, DNB Regnskap. Kalender: Microsoft 365, Outlook. Adgang: Salto KS. Migrasjon: RCO booking." },
      { q: "Hvor lagres dataene?", a: "All kundedata lagres i Norge og EU på PostgreSQL hostet av Convex i EU-regioner. Backup og redundans følger samme regel. Ingen data lagres utenfor EØS uten eksplisitte garantier." },
      { q: "Er Digilist ISO 27001 og 27701-sertifisert?", a: "Ja. Digilist er sertifisert mot både ISO 27001 (informasjonssikkerhetsstyringssystem) og ISO 27701 (personvernsutvidelse). Sertifikater er tilgjengelige på forespørsel." },
      { q: "Oppfyller Digilist WCAG 2.0 AA?", a: "Ja. Digilist tester mot WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy. Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal." },
      { q: "Hvor høy oppetid garanterer Digilist?", a: "Digilist har 99,9 % oppetid som SLA. Plattformen er bygget med transaksjonelle hendelseslogger (outbox-pattern) som garanterer konsistens selv ved feil. Statusside og insident-rapportering er tilgjengelig." },
    ],
  },
  {
    route: "/om-oss",
    title: "Om Digilist — norsk bookingplattform fra Xala Technologies | Digilist",
    description:
      "Digilist er utviklet av Xala Technologies AS, et norsk teknologiselskap på Nesbru. Vi bygger én plattform for utleie og kommunal booking, med samsvar og norsk datalagring.",
    ogType: "website",
    aboutPage: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Om oss", url: `${BASE_URL}/om-oss` },
    ],
  },
  {
    route: "/ai-agenter",
    title: "AI-agenter for booking og utleie — GDPR-sikker automatisering | Digilist",
    description:
      "Digilist bruker AI-agenter som godkjenner oppføringer mot GDPR, NSM, SOC 2 og universell utforming, svarer på henvendelser, forklarer sesongtildeling og gir daglig driftsoversikt. Bygget for norske kommuner.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "AI-agenter", url: `${BASE_URL}/ai-agenter` },
    ],
    faq: [
      {
        q: "Hvilke AI-agenter er inkludert?",
        a: "Fem kundevendte agenter: godkjenning og compliance av oppføringer, svar på henvendelser, gjennomgang og forklaring av sesongtildeling, daglig driftsoversikt, og markedsinnsikt. En agent for import av oppføringer bygges også.",
      },
      {
        q: "Er Digilist-agentene GDPR-sikre?",
        a: "Ja. Hver oppføring kontrolleres mot GDPR før publisering, og agentene følger også NSM grunnprinsipper for IKT-sikkerhet, SOC 2 og universell utforming (WCAG 2.1 AA).",
      },
      {
        q: "Tar agentene avgjørelser på egen hånd?",
        a: "Ikke for kundevendte handlinger. Svar skrives som utkast, sesongtildeling forklares men tildeles aldri av agenten, og tvilstilfeller eskaleres til et menneske.",
      },
    ],
  },
  {
    route: "/ai-agenter/sesongtildeling",
    title: "Sesongtildeling av idrettshaller | Digilist",
    description:
      "AI-agenten gjennomgår og forklarer sesongtildeling av idrettshall for kommuner. Den fordeler aldri halltid selv — et menneske godkjenner hver melding.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "AI-agenter", url: `${BASE_URL}/ai-agenter` },
      { name: "Sesongtildeling", url: `${BASE_URL}/ai-agenter/sesongtildeling` },
    ],
    faq: [
      {
        q: "Fordeler agenten halltiden i idrettshallen?",
        a: "Nei. Digilists deterministiske fordelingsmotor lager selve forslaget. Agenten gjennomgår og forklarer — et menneske avgjør.",
      },
      {
        q: "Hvilke lag flagger agenten?",
        a: "Lag som ba om tider men fikk null, lag som fikk 25 prosent eller mindre av det de ba om, uløste konflikter, avgjørelser ved loddtrekning, og manuelle overstyringer.",
      },
    ],
  },
  {
    route: "/ai-agenter/compliance-godkjenning",
    title: "Automatisk compliance-godkjenning av oppføringer | Digilist",
    description:
      "Listing Approver modererer hver oppføring automatisk mot GDPR, NSM, markedsføringsloven og universell utforming. Lovlighetsport for bookingsystem i kommune.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "AI-agenter", url: `${BASE_URL}/ai-agenter` },
      { name: "Compliance-godkjenning", url: `${BASE_URL}/ai-agenter/compliance-godkjenning` },
    ],
    faq: [
      {
        q: "Blokkerer agenten oppføringer med dårlig kvalitet?",
        a: "Nei. Den er en lovlighetsport, ikke en kvalitetsport. Bare et reelt juridisk, regulatorisk eller personvernmessig problem stopper en oppføring; kvalitet gis som råd.",
      },
      {
        q: "Hvilke regelverk bygger avgjørelsene på?",
        a: "GDPR, universell utforming (WCAG 2.1 AA), NSM grunnprinsipper for IKT-sikkerhet, SOC 2 og markedsføringsloven.",
      },
    ],
  },
  {
    route: "/ai-agenter/importer-oppforing",
    title: "Importér oppføring: fra Airbnb, Finn eller Word til utkast | Digilist",
    description:
      "Lim inn lenken til annonsen din på Airbnb, Finn.no eller Booking.com, eller last opp et dokument. Digilist lager et utkast du finpusser og publiserer selv.",
    ogType: "website",
    service: true,
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "AI-agenter", url: `${BASE_URL}/ai-agenter` },
      { name: "Importér oppføring", url: `${BASE_URL}/ai-agenter/importer-oppforing` },
    ],
    faq: [
      {
        q: "Hvilke kilder kan jeg importere fra?",
        a: "Lenke til en oppføring på Airbnb, Booking.com, Finn.no eller Eventum, et Word- eller PDF-dokument, eller ren tekst. Flere kilder kan brukes samtidig.",
      },
      {
        q: "Publiseres oppføringen automatisk?",
        a: "Nei. Det lages alltid et utkast du gjennomgår selv, og utkastet sendes gjennom compliance-godkjenning før publisering.",
      },
    ],
  },
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
  // Homepage FAQ — MIRROR of HOMEPAGE_FAQ in src/content/faq.ts. This copy is
  // what crawlers index in the static HTML; keep both byte-for-byte identical
  // (Google requires the visible accordion text to match this FAQPage markup).
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
    { loc: `${BASE_URL}/leie`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/leie/selskapslokale`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/gaard`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/bursdagslokale`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/kulturhus`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/moterom`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/konferanselokale`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/kontorlokaler`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/coworking`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/idrettshall`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/padelbane`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/leie/svommehall`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/overnatting`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/overnatting/hytte`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/overnatting/leilighet`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/overnatting/rom`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/overnatting/feriehus`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/utstyr`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/utstyr/festutstyr`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/utstyr/verktoy-maskiner`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/utstyr/lyd-og-lys`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/utstyr/sport-og-friluft`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/tjenester`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/tjenester/catering`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/tjenester/dj`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/tjenester/musiker`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/tjenester/dekor`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/bruksomrader/selskapslokaler`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/bruksomrader/moterom`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/bruksomrader/idrettshaller-gymsaler`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/bruksomrader/kulturhus-kantiner`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/arrangementer`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/arrangementer/konsert`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/arrangementer/teater-og-scene`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/arrangementer/festival`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/arrangementer/sport`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/billettsystem`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/teknologi`, priority: "0.7", changefreq: "monthly" },
    { loc: `${BASE_URL}/om-oss`, priority: "0.6", changefreq: "monthly" },
    { loc: `${BASE_URL}/ai-agenter`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/ai-agenter/sesongtildeling`, priority: "0.7", changefreq: "monthly" },
    { loc: `${BASE_URL}/ai-agenter/compliance-godkjenning`, priority: "0.7", changefreq: "monthly" },
    { loc: `${BASE_URL}/ai-agenter/importer-oppforing`, priority: "0.7", changefreq: "monthly" },
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
