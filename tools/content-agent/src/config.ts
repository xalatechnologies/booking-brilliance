/**
 * Environment + tunables for the content agent.
 *
 * Mirrors site-intelligence's lightweight config approach — no
 * config file, just env vars with sane defaults. Production wires
 * these via /etc/digilist-api.env on the VPS.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ContentAgentConfig {
  // LLM
  anthropicApiKey: string;
  anthropicDraftModel: string;       // sonnet for drafts
  anthropicCheapModel: string;       // haiku for clustering/expansion

  // External signal sources (gated — missing key = source skipped)
  serpApiKey: string;
  redditUserAgent: string;
  rssFeeds: string[];
  redditSubs: string[];
  hnTags: string[];                  // Algolia HN tags (story, ask_hn, ...)

  // Site context the analyzer reads
  blogDir: string;
  pagesDir: string;
  siteOrigin: string;

  // Pipeline tunables
  maxKeywordsPerSource: number;
  maxClusters: number;
  draftsPerRun: number;
  region: string;                    // "NO"
  language: string;                  // "no"

  // Publishing (not used in V1 — drafts only — but reserved)
  linkedinAccessToken: string;
  linkedinOrgUrn: string;
  xBearerToken: string;
  autoPublish: boolean;              // V1: always false; only flipped after OAuth setup
}

function envBool(key: string, fallback: boolean): boolean {
  const v = process.env[key];
  if (!v) return fallback;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function envInt(key: string, fallback: number): number {
  const v = Number(process.env[key]);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function envList(key: string, fallback: string[]): string[] {
  const raw = process.env[key];
  if (!raw) return fallback;
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function loadConfig(): ContentAgentConfig {
  return {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
    anthropicDraftModel:
      process.env.CONTENT_AGENT_DRAFT_MODEL ?? "claude-sonnet-4-6",
    anthropicCheapModel:
      process.env.CONTENT_AGENT_CHEAP_MODEL ?? "claude-haiku-4-5-20251001",

    serpApiKey: process.env.SERPAPI_KEY ?? "",
    redditUserAgent:
      process.env.CONTENT_AGENT_UA ??
      "DigilistGrowthAgent/1.0 (+https://digilist.no/admin/intelligence)",
    rssFeeds: envList("CONTENT_AGENT_RSS_FEEDS", [
      "https://www.digi.no/?service=rss",
      "https://kommunal-rapport.no/rss",
      "https://www.regjeringen.no/no/aktuelt/rss/id86981/",
    ]),
    redditSubs: envList("CONTENT_AGENT_REDDIT_SUBS", [
      "Norge",
      "norge",
      "Oslo",
      "Bergen",
      "Trondheim",
    ]),
    hnTags: envList("CONTENT_AGENT_HN_TAGS", ["story", "front_page"]),

    blogDir:
      process.env.CONTENT_AGENT_BLOG_DIR ??
      path.resolve(__dirname, "..", "..", "..", "src", "content", "blog"),
    pagesDir:
      process.env.CONTENT_AGENT_PAGES_DIR ??
      path.resolve(__dirname, "..", "..", "..", "src", "pages"),
    siteOrigin: process.env.CONTENT_AGENT_SITE_ORIGIN ?? "https://digilist.no",

    maxKeywordsPerSource: envInt("CONTENT_AGENT_MAX_KW_PER_SOURCE", 40),
    maxClusters: envInt("CONTENT_AGENT_MAX_CLUSTERS", 20),
    draftsPerRun: envInt("CONTENT_AGENT_DRAFTS_PER_RUN", 5),
    region: process.env.CONTENT_AGENT_REGION ?? "NO",
    language: process.env.CONTENT_AGENT_LANGUAGE ?? "no",

    linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN ?? "",
    linkedinOrgUrn: process.env.LINKEDIN_ORG_URN ?? "",
    xBearerToken: process.env.X_BEARER_TOKEN ?? "",
    autoPublish: envBool("CONTENT_AGENT_AUTO_PUBLISH", false),
  };
}

export function projectRoot(): string {
  return path.resolve(__dirname, "..", "..", "..");
}

export function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}
