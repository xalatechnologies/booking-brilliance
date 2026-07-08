/**
 * Static surface catalog used by convex/audits/state.ts to enrich the
 * runtime audit data with metadata (type / environment / indexable /
 * requiresAuth / checks).
 *
 * Duplicates tools/site-intelligence/src/targets.ts. The orchestrator
 * (tsx scripts) is the source of truth for *which* targets to actually
 * scan; this Convex copy exists only so the reactive snapshot query
 * can join the static metadata in. Keep both files in sync when
 * adding/removing surfaces.
 */

export type AuditType =
  | "uptime"
  | "seo"
  | "a11y"
  | "security"
  | "links"
  | "performance"
  | "vulns";

export type SurfaceType =
  | "marketing"
  | "app"
  | "dashboard"
  | "docs"
  | "api"
  | "status";

export type Environment = "production" | "staging" | "preview";

export interface TargetMeta {
  name: string;
  label: string;
  origin: string;
  description: string;
  type: SurfaceType;
  environment: Environment;
  indexable: boolean;
  requiresAuth: boolean;
  checks: AuditType[];
  active: boolean;
}

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
// Staging / internal-dev surfaces: SLA/uptime only. The dashboard snapshot
// filters findings by each target's checks, so scoping dev to uptime hides
// its (real but low-value) security/perf findings — no more dev noise.
const STAGING_CHECKS: AuditType[] = ["uptime"];

export const TARGETS: TargetMeta[] = [
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
    name: "marketing-dev",
    label: "Pre-prod app — dev.digilist.no",
    origin: "https://dev.digilist.no",
    description:
      "Pre-prod booking-app (SPA). Auth-beskyttede ruter pluss offentlig innlogging/registrering.",
    type: "app",
    environment: "staging",
    indexable: false,
    requiresAuth: false,
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
    checks: SPA_CHECKS,
    active: true,
  },
  {
    name: "docs",
    label: "Docs — docs.digilist.no",
    origin: "https://docs.digilist.no",
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
    checks: SPA_CHECKS,
    active: true,
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
    checks: STAGING_CHECKS,
    active: true,
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
    checks: API_CHECKS,
    active: true,
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
    checks: SPA_CHECKS,
    active: true,
  },
];

export function findTarget(name: string): TargetMeta | undefined {
  return TARGETS.find((t) => t.name === name);
}
