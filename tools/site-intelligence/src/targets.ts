/**
 * Inventory of every Digilist-owned surface monitored by the ecosystem
 * intelligence center. Each surface declares its type, environment,
 * indexability, auth posture, and which checks should run.
 *
 * The orchestrator gates audit execution on `target.checks` so we never
 * run SEO on /api or expect a sitemap on /dashboard.
 */

import type { AuditType } from "./types";

export type SurfaceType =
  | "marketing"
  | "app"
  | "dashboard"
  | "docs"
  | "api"
  | "status";

export type Environment = "production" | "staging" | "preview";

export interface Target {
  /** Stable identifier, used as DB key + CLI flag value. */
  name: string;
  /** Display label shown in the dashboard. */
  label: string;
  /** Origin (no trailing slash). */
  origin: string;
  /** Free-text description for the dashboard. */
  description: string;
  /** Product category — drives default check set + dashboard grouping. */
  type: SurfaceType;
  /** production | staging | preview. */
  environment: Environment;
  /** Should crawlers see this surface (controls SEO expectations). */
  indexable: boolean;
  /** Auth wall on the main surface (true → skip SEO + content audits). */
  requiresAuth: boolean;
  /** Audit types enabled for this surface. */
  checks: AuditType[];
  /** Master toggle — false skips this target entirely. */
  active: boolean;
  /** Optional URLs to crawl in addition to sitemap-discovered ones. */
  seeds?: string[];
}

// Audit profiles per surface category. SEO/a11y/links can only be
// meaningfully run on indexable HTML surfaces — auth-gated SPAs (app,
// dashboard) have no sitemap and the login wall blocks the crawler, so
// running SEO there guarantees garbage scores that drown out the real
// signal. API surfaces likewise — no HTML, no human nav, no point.
//
// Tightened 2026-05-15 after the status page surfaced misleading
// "degraded" badges on app/dashboard/api driven by structurally-failed
// audits rather than actual incidents.
const FULL_CHECKS: AuditType[] = [
  "performance",
  "uptime",
  "seo",
  "a11y",
  "security",
  "links",
];
const SPA_CHECKS: AuditType[] = ["uptime", "security", "performance"];
const API_CHECKS: AuditType[] = ["uptime", "security"];
// Staging / internal-dev surfaces: SLA/uptime only. We deliberately skip the
// security-header and performance audits on them — dev envs aren't hardened or
// perf-tuned, so those checks just flood the production dashboard with
// low-value noise. Uptime still tells us if a dev environment is down.
const STAGING_CHECKS: AuditType[] = ["uptime"];

export const TARGETS: Target[] = [
  {
    name: "marketing",
    label: "Marketing — digilist.no",
    origin: "https://digilist.no",
    description: "Offentlig markedsføringsside, blogg, FAQ og landingssider.",
    type: "marketing",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: FULL_CHECKS,
    active: true,
  },
  {
    // Historical name kept for Convex audit_target key continuity —
    // existing audit_runs reference this name. Despite the legacy
    // "marketing" prefix, dev.digilist.no actually serves the booking
    // app SPA (verified 2026-05-15: index.html is the booking app
    // shell, not a marketing site mirror). Treat as `app` + staging.
    name: "marketing-dev",
    label: "Pre-prod app — dev.digilist.no",
    origin: "https://dev.digilist.no",
    description:
      "Pre-prod booking-app (SPA). Auth-beskyttede ruter pluss offentlig innlogging/registrering.",
    type: "app",
    environment: "staging",
    indexable: false,
    requiresAuth: false,
    // Staging → uptime/SLA only. Security-header + perf audits on an internal
    // dev env are noise on the production dashboard (see STAGING_CHECKS).
    checks: STAGING_CHECKS,
    active: true,
  },
  {
    name: "app",
    label: "App — app.digilist.no",
    origin: "https://app.digilist.no",
    description: "Produksjons-app — kun offentlige overflater (innlogging, registrering).",
    type: "app",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    // Auth-gated SPA — only uptime + security make sense. SEO needs a
    // sitemap; a11y/links need crawlable HTML behind the login wall.
    // Real WCAG scoring on the authenticated shell requires
    // Playwright + axe-core (tracked as INTEL-002).
    checks: SPA_CHECKS,
    active: true,
    seeds: ["https://app.digilist.no/login", "https://app.digilist.no/signup"],
  },
  {
    name: "docs",
    label: "Docs — docs.digilist.no",
    origin: "https://docs.digilist.no",
    // Astro Starlight docs site shipped 2026-05-15. Sections: Kom i gang,
    // Admin-runbooks, API-referanse, Compliance. Token-coherent with the
    // marketing site via shared digilist-tokens.css.
    description: "Offentlig dokumentasjonsside (Astro Starlight, apps/docs/).",
    type: "docs",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: FULL_CHECKS,
    active: true,
  },
  {
    name: "dashboard",
    label: "Dashboard — dashboard.digilist.no",
    origin: "https://dashboard.digilist.no",
    description: "Tenant-administrasjon — kun offentlige overflater.",
    type: "dashboard",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    // Same rationale as `app` — auth-gated SPA, only uptime + security.
    checks: SPA_CHECKS,
    active: true,
    seeds: ["https://dashboard.digilist.no/login"],
  },
  {
    name: "dashboard-dev",
    label: "Pre-prod dashboard — dashboard.dev.digilist.no",
    origin: "https://dashboard.dev.digilist.no",
    description:
      "Pre-prod tenant-administrasjon (SPA). Pre-prod-speil av dashboard.digilist.no.",
    type: "dashboard",
    environment: "staging",
    indexable: false,
    requiresAuth: true,
    // Staging → uptime/SLA only (see STAGING_CHECKS) — no dev security/perf noise.
    checks: STAGING_CHECKS,
    active: true,
    seeds: ["https://dashboard.dev.digilist.no/login"],
  },
  {
    name: "api",
    label: "API — api.digilist.no",
    origin: "https://api.digilist.no",
    description: "Offentlig API-overflate — helsesjekk og auth-endepunkter.",
    type: "api",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    // Pure API surface — no HTML, no sitemap. Only uptime + security
    // headers are meaningful here. SEO/a11y/links were producing
    // structural false-failures that dragged the public status to red.
    checks: API_CHECKS,
    active: true,
    seeds: ["https://api.digilist.no/health"],
  },
  {
    name: "status",
    label: "Status — status.digilist.no",
    origin: "https://status.digilist.no",
    description: "Offentlig driftsstatus-side.",
    type: "status",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    // Single-purpose utility surface — no sitemap, no editorial content,
    // no internal nav. Auditing SEO/a11y/links here surfaces structural
    // false-failures (the page is designed to be one route). Uptime +
    // security headers are the only meaningful signals.
    checks: SPA_CHECKS,
    active: true,
  },
];

export function activeTargets(): Target[] {
  return TARGETS.filter((t) => t.active);
}

export function findTarget(name: string): Target | undefined {
  return TARGETS.find((t) => t.name === name);
}
