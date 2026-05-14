// Post-build: writes per-route static HTML with route-specific
// title/description/og/canonical + JSON-LD so social-media crawlers
// (Twitter, FB, LinkedIn, Slack) see the right meta without executing JS.
// Modern search bots (Google, GPT, Claude) execute JS and will use the
// SPA-rendered meta anyway — this fix is purely for the no-JS unfurl case.

import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
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
    });
  }
  return posts;
}

/** @type {Array<{route: string, title: string, description: string, ogType?: string, faq?: Array<{q: string, a: string}>, breadcrumbs?: Array<{name: string, url: string}>}>} */
const ROUTES = [
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
    title: "Salgsvilkår — Digilist",
    description: "Salgs- og leveransevilkår for Digilist bookingplattform.",
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
];

const baseLD = (description) => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Digilist",
    alternateName: "Digilist — Enkel booking",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    sameAs: ["https://xala.no"],
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
    "@type": "SoftwareApplication",
    name: "Digilist",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Booking & Reservation Platform",
    operatingSystem: "Web, iOS, Android",
    description,
    url: "https://app.digilist.no",
    softwareVersion: "2026.05",
    featureList: [
      "Sanntidskalender",
      "Privatbookinger og sesongleie",
      "Betaling med Vipps og kort",
      "BankID og ID-porten autentisering",
      "EHF / Peppol fakturering",
      "Regnskapsintegrasjoner",
      "Digital nøkkel (Salto KS)",
      "Universell utforming (WCAG 2.0 AA)",
      "ISO 27001 og 27701 sertifisert",
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "NOK",
      price: "0",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "Xala Technologies AS",
      url: "https://xala.no",
    },
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
  const ldHTML = ldBlocks
    .map(
      (b) =>
        `<script type="application/ld+json" data-prerendered="true">${JSON.stringify(b)}</script>`,
    )
    .join("\n    ");

  return template
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
  const indexPath = join(DIST, "index.html");
  const template = await fs.readFile(indexPath, "utf-8");

  // Patch the homepage in place — adds base JSON-LD so non-JS crawlers see it
  const homepageHTML = patchHTML(template, HOMEPAGE);
  await fs.writeFile(indexPath, homepageHTML, "utf-8");
  console.log(`  ✓ /index.html — base JSON-LD injected (${homepageHTML.length} bytes)`);

  // Pre-render per-route variants
  for (const route of ROUTES) {
    const html = patchHTML(template, route);
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
    title: "FAQ — Digilist | Vanlige spørsmål om kommunal booking, sesongleie og samsvar",
    description:
      "Svar på de vanligste spørsmålene om Digilist — bookingsystem for kommuner og utleiere. SSA-L 2026, GDPR, ISO 27001, Vipps, BankID, sesongleie og mer.",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "FAQ", url: `${BASE_URL}/faq` },
    ],
    faq: allFAQ,
  };
  const faqHTML = patchHTML(template, faqRoute);
  const faqDir = join(DIST, "faq");
  await fs.mkdir(faqDir, { recursive: true });
  await fs.writeFile(join(faqDir, "index.html"), faqHTML, "utf-8");
  console.log(`  ✓ /faq/index.html (${faqHTML.length} bytes, ${allFAQ.length} Q&A)`);

  // Blog index + each post — pre-rendered with Article schema
  const posts = await loadBlogPosts();
  const blogIndex = {
    route: "/blogg",
    title: "Blogg — Digilist | Innsikt om kommunal booking, sesongleie og samsvar",
    description: "Artikler om bookingsystem for kommuner, sesongleie, SSA-L 2026, GDPR og ISO 27001 — fra Digilists arbeid med norske kommuner og utleiere.",
    breadcrumbs: [
      { name: "Hjem", url: `${BASE_URL}/` },
      { name: "Blogg", url: `${BASE_URL}/blogg` },
    ],
  };
  const blogIndexHTML = patchHTML(template, blogIndex);
  const blogDir = join(DIST, "blogg");
  await fs.mkdir(blogDir, { recursive: true });
  await fs.writeFile(join(blogDir, "index.html"), blogIndexHTML, "utf-8");
  console.log(`  ✓ /blogg/index.html (${blogIndexHTML.length} bytes)`);

  for (const post of posts) {
    const postRoute = `/blogg/${post.slug}`;
    const articleLD = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Person", name: post.author },
      publisher: {
        "@type": "Organization",
        name: "Digilist",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${postRoute}` },
      articleSection: post.tag || "Blogg",
      inLanguage: "nb-NO",
    };
    let html = patchHTML(template, {
      route: postRoute,
      title: `${post.title} — Digilist Blogg`,
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
    // og:type article
    html = html.replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="article"`,
    );
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

  console.log(`\nPre-rendered ${ROUTES.length + 1 + 1 + posts.length} pages + sitemap.`);
}

main().catch((e) => {
  console.error("Pre-render failed:", e);
  process.exit(1);
});
