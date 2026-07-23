#!/usr/bin/env node
// IndexNow submission — notify Bing/Yandex/Seznam of new or updated URLs so they
// crawl fast. Matters for AEO: ChatGPT Search and Microsoft Copilot read Bing's
// index. Google does NOT use IndexNow (submit the sitemap in Search Console for it).
//
// Usage:
//   node scripts/indexnow-submit.mjs                      # submit the default set
//   node scripts/indexnow-submit.mjs /leie/x /leie/y ...  # submit specific paths/URLs
//
// The key must be live at https://digilist.no/<key>.txt (see public/<key>.txt).

const HOST = "digilist.no";
const KEY = "dc2ea58a7799d809546d82cd7cb19f61";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// Default set: the private-market pages + key hubs (2026-07 launch).
const DEFAULT_PATHS = [
  "/",
  "/bookingsystem-utleie",
  "/bookingsystem-kommune",
  "/leie",
  "/leie/hall",
  "/lokaler-til-leie",
  "/lokaler-til-leie/oslo",
  "/lokaler-til-leie/bergen",
  "/lokaler-til-leie/trondheim",
  "/leie/konfirmasjonslokale",
  "/leie/firmafest",
  "/leie/minnestund",
  "/leie/daap",
  "/leie/jubileum",
  "/sikkerhet",
  "/booking-av-lokaler-og-moterom",
  "/blogg/leie-selskapslokale-bryllup-fest",
];

function toUrl(p) {
  if (p.startsWith("http")) return p;
  return `https://${HOST}${p.startsWith("/") ? p : `/${p}`}`;
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = (args.length ? args : DEFAULT_PATHS).map(toUrl);
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  console.log(`[indexnow] submitting ${urlList.length} URL(s) to ${ENDPOINT}`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  // IndexNow returns 200 or 202 on acceptance; 4xx explains a key/host problem.
  console.log(`[indexnow] HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error("[indexnow] submission NOT accepted — check the key file is live at " + KEY_LOCATION);
    process.exit(1);
  }
  console.log("[indexnow] accepted.");
}

main().catch((e) => {
  console.error("[indexnow] failed:", e?.message || e);
  process.exit(1);
});
