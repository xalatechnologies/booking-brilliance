/**
 * Digilist Growth Intelligence Agent Harness — agent registry.
 *
 * Source of truth for every autonomous agent that operates on the
 * Digilist ecosystem. The harness reads this catalog at startup and
 * upserts each agent into the `agents` table so the dashboard can
 * render the org chart, budgets, allowed-tools and risk posture.
 *
 * Tiers:
 *   v1        — ships in the first version (5 agents)
 *   v1plus    — registered now, runner deferred (3 agents)
 *   deferred  — placeholder only, not built yet
 *
 * Source:
 *   site-intelligence — already implemented in tools/site-intelligence/
 *   content-agent     — implemented in tools/content-agent/
 *   external          — wraps a third-party signal (GSC, Plausible, GitHub)
 *
 * Risk-default tells the harness which actions auto-execute vs require
 * human approval. Anything publishing externally must be 'high'.
 */

import type { AgentRecord } from "./types";

export type AgentDefinition = Omit<
  AgentRecord,
  "id" | "created_at" | "updated_at"
>;

export const AGENT_REGISTRY: AgentDefinition[] = [
  // ─── V1 — ships now ───────────────────────────────────────────
  {
    slug: "monitoring",
    name: "Monitoring Agent",
    role: "SRE — uptime, errors, regressions",
    description:
      "Checks uptime, HTTP errors, broken links, console errors, API health, SSL expiry across all Digilist surfaces.",
    status: "active",
    tier: "v1",
    owner: "Digilist Platform",
    allowed_tools: [
      "fetch:head",
      "fetch:get",
      "tls:probe",
      "audits:run:uptime",
      "audits:run:links",
    ],
    reports_to: "",
    budget_usd_month: 0,
    risk_default: "low",
    source: "site-intelligence",
  },
  {
    slug: "seo",
    name: "SEO Agent",
    role: "Search visibility — metadata, schema, indexability",
    description:
      "Analyzes metadata, structured data, sitemap, robots.txt, SERP appearance, indexability and keyword alignment per page.",
    status: "active",
    tier: "v1",
    owner: "Digilist Marketing",
    allowed_tools: [
      "audits:run:seo",
      "crawler:read",
      "anthropic:messages",
    ],
    reports_to: "",
    budget_usd_month: 10,
    risk_default: "low",
    source: "site-intelligence",
  },
  {
    slug: "keyword",
    name: "Keyword Intelligence Agent",
    role: "Trend discovery + opportunity scoring",
    description:
      "Discovers trending search terms around kommunale lokaler, idrettshall, møterom, sesongleie, kulturhus, utleieobjekter, Digdir designsystem, universell utforming, saksbehandling. Clusters by intent and scores against existing Digilist coverage.",
    status: "active",
    tier: "v1",
    owner: "Digilist Marketing",
    allowed_tools: [
      "gtrends:rising",
      "reddit:list",
      "hackernews:list",
      "rss:fetch",
      "serpapi:search",
      "anthropic:messages",
    ],
    reports_to: "",
    budget_usd_month: 15,
    risk_default: "low",
    source: "content-agent",
  },
  {
    slug: "content-draft",
    name: "Content Draft Agent",
    role: "Draft writer — blog, LinkedIn, X",
    description:
      "Turns keyword opportunities into blog drafts, LinkedIn posts, X threads, FAQ entries and landing-page copy. Always produces drafts; never publishes.",
    status: "active",
    tier: "v1",
    owner: "Digilist Marketing",
    allowed_tools: [
      "anthropic:messages",
      "blog:read",
      "site:read-pages",
    ],
    reports_to: "keyword",
    budget_usd_month: 40,
    risk_default: "med",
    source: "content-agent",
  },
  {
    slug: "approval-queue",
    name: "Approval Queue",
    role: "Human review gateway",
    description:
      "Holds every generated draft until a human reviewer approves, edits, rejects, or schedules it. Nothing leaves the harness without passing here.",
    status: "active",
    tier: "v1",
    owner: "Digilist Marketing",
    allowed_tools: ["drafts:list", "drafts:update", "drafts:publish"],
    reports_to: "",
    budget_usd_month: 0,
    risk_default: "high",
    source: "content-agent",
  },

  // ─── V1+1 — registry-only for now ─────────────────────────────
  {
    slug: "wcag",
    name: "Compliance Agent",
    role: "WCAG / UU / GDPR wording",
    description:
      "Runs axe-core baseline, checks alt text, heading order, landmarks, color contrast. Reviews privacy/cookie pages for GDPR language and public-sector terminology.",
    status: "active",
    tier: "v1plus",
    owner: "Digilist Compliance",
    allowed_tools: [
      "audits:run:a11y",
      "axe:run",
      "anthropic:messages",
    ],
    reports_to: "",
    budget_usd_month: 10,
    risk_default: "low",
    source: "site-intelligence",
  },
  {
    slug: "security",
    name: "Security Agent",
    role: "Headers, exposed files, vulns",
    description:
      "Checks security headers (Mozilla Observatory scoring), exposed source maps, sensitive paths, SSL config, Dependabot/Snyk imports, OWASP ZAP baseline.",
    status: "active",
    tier: "v1plus",
    owner: "Digilist Security",
    allowed_tools: [
      "audits:run:security",
      "anthropic:messages",
    ],
    reports_to: "",
    budget_usd_month: 10,
    risk_default: "low",
    source: "site-intelligence",
  },
  {
    slug: "competitor",
    name: "Competitor Agent",
    role: "Visibility benchmarking",
    description:
      "Tracks Bookup, Aktiv Kommune, Let's Reg, Eventbrite and kommunale bookingportaler. Compares page titles, content topics, ranking pages and messaging. Identifies ethical content gaps.",
    status: "deferred",
    tier: "v1plus",
    owner: "Digilist Marketing",
    allowed_tools: [
      "fetch:get",
      "serpapi:search",
      "anthropic:messages",
    ],
    reports_to: "keyword",
    budget_usd_month: 20,
    risk_default: "low",
    source: "content-agent",
  },

  // ─── Deferred — placeholder only ──────────────────────────────
  {
    slug: "feedback",
    name: "Feedback Agent",
    role: "Post-publish analytics",
    description:
      "After a draft is published, monitors impressions, clicks, CTR, ranking position and conversions via GSC + Plausible + Clarity. Compares before/after and suggests content updates.",
    status: "deferred",
    tier: "deferred",
    owner: "Digilist Marketing",
    allowed_tools: [
      "gsc:search-analytics",
      "plausible:stats",
      "clarity:sessions",
      "anthropic:messages",
    ],
    reports_to: "content-draft",
    budget_usd_month: 10,
    risk_default: "low",
    source: "external",
  },
  {
    slug: "task-generator",
    name: "Task Agent",
    role: "Issue → developer task converter",
    description:
      "Clusters findings from other agents into actionable developer/content/security/wcag/seo tasks with acceptance criteria and test scenarios. Optionally syncs to GitHub Issues.",
    status: "deferred",
    tier: "deferred",
    owner: "Digilist Platform",
    allowed_tools: [
      "tasks:create",
      "github:issues:create",
      "anthropic:messages",
    ],
    reports_to: "",
    budget_usd_month: 5,
    risk_default: "med",
    source: "content-agent",
  },
];

export function agentsByTier(tier: AgentDefinition["tier"]): AgentDefinition[] {
  return AGENT_REGISTRY.filter((a) => a.tier === tier);
}

export function findAgent(slug: string): AgentDefinition | undefined {
  return AGENT_REGISTRY.find((a) => a.slug === slug);
}
