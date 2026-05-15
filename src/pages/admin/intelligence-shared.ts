/**
 * Shared types + auth helper for the /admin/intelligence dashboard family.
 *
 * Keeps the multi-page shell, the per-module pages, and the agent chat
 * speaking a single vocabulary. Snapshot fetching lives in the parent
 * shell and propagates via outlet context.
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

export interface Target {
  id: number;
  name: string;
  label: string;
  origin: string;
  description: string;
  is_active: number;
  type: SurfaceType | null;
  environment: Environment | null;
  indexable: boolean;
  requiresAuth: boolean;
  checks: AuditType[];
}

export interface LatestRun {
  id: number;
  target_id: number;
  target_name: string;
  target_label: string;
  target_origin: string;
  audit_type: AuditType;
  started_at: string;
  finished_at: string | null;
  pages_scanned: number;
  findings_total: number;
  avg_score: number;
  trigger: string;
  status: string;
}

export interface RecentRun {
  id: number;
  target_name: string;
  target_label: string;
  audit_type: AuditType;
  started_at: string;
  finished_at: string | null;
  pages_scanned: number;
  findings_total: number;
  avg_score: number;
  status: string;
  trigger: string;
}

export interface TopFinding {
  audit_type: AuditType;
  rule: string;
  severity: "error" | "warn" | "info";
  count: number;
}

export interface IssueFeedItem {
  surface: string;
  surfaceLabel: string;
  surfaceType: SurfaceType | null;
  auditType: AuditType;
  rule: string;
  severity: "error" | "warn" | "info";
  message: string;
  url: string;
  lastSeen: string;
  affected: number;
}

export interface EcosystemSummary {
  surfacesTotal: number;
  surfacesHealthy: number;
  surfacesWithErrors: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  avgScore: number;
}

export interface Snapshot {
  generatedAt: string;
  targets: Target[];
  latest: LatestRun[];
  recent: RecentRun[];
  topFindings: TopFinding[];
  issues?: IssueFeedItem[];
  ecosystemSummary?: EcosystemSummary;
}

export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  tier?: "expert" | "standard";
}

export const AUTH_KEY = "digilist-admin-basic-auth-v1";

/**
 * Read the admin token used by Convex mutations/queries. Returns "" when
 * not logged in (Convex will reject the call). Components pass this as
 * the `adminToken` arg on every call — see convex/auth.ts.
 */
export function adminToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(AUTH_KEY) ?? "";
}

export const AUDIT_LABEL: Record<AuditType, string> = {
  uptime: "Oppetid",
  seo: "SEO",
  a11y: "Tilgjengelighet",
  security: "Sikkerhet",
  links: "Lenker",
  performance: "Ytelse",
  vulns: "Sårbarheter",
};

export const SURFACE_LABEL: Record<SurfaceType, string> = {
  marketing: "Markedsføring",
  app: "App",
  dashboard: "Dashbord",
  docs: "Dokumentasjon",
  api: "API",
  status: "Status",
};

export function getAuth(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEY);
}

export function scoreClass(s: number | null): string {
  if (s === null) return "text-ink-faint";
  if (s >= 85) return "text-green-700 dark:text-green-400";
  if (s >= 60) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

export interface IntelligenceCtx {
  snap: Snapshot | null;
  loading: boolean;
  refresh: () => Promise<void>;
  running: string | null;
  runScan: (target?: string) => Promise<void>;
}
