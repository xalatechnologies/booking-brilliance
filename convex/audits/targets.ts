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
  "uptime",
  "seo",
  "a11y",
  "security",
  "links",
];
const SPA_CHECKS: AuditType[] = ["uptime", "security"];
const API_CHECKS: AuditType[] = ["uptime", "security"];

export const TARGETS: TargetMeta[] = [
  {
    name: "marketing",
    label: "Marketing — digilist.no",
    origin: "https://digilist.no",
    description: "Public marketing site, blog, FAQ, landing pages.",
    type: "marketing",
    environment: "production",
    indexable: true,
    requiresAuth: false,
    checks: FULL_CHECKS,
    active: true,
  },
  {
    name: "marketing-dev",
    label: "Staging app — dev.digilist.no",
    origin: "https://dev.digilist.no",
    description:
      "Pre-production booking app (SPA). Auth-gated routes plus public login/signup.",
    type: "app",
    environment: "staging",
    indexable: false,
    requiresAuth: false,
    checks: SPA_CHECKS,
    active: true,
  },
  {
    name: "app",
    label: "App — app.digilist.no",
    origin: "https://app.digilist.no",
    description: "Production app — public surfaces only (login, signup).",
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
    description: "Public documentation site (Astro Starlight, apps/docs/).",
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
    description: "Tenant admin — public surfaces only.",
    type: "dashboard",
    environment: "production",
    indexable: false,
    requiresAuth: true,
    checks: SPA_CHECKS,
    active: true,
  },
  {
    name: "api",
    label: "API — api.digilist.no",
    origin: "https://api.digilist.no",
    description: "Public API surface — health, auth endpoints.",
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
    description: "Public status page.",
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
