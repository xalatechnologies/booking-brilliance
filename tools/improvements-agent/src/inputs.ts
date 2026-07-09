/**
 * Input loaders — normalize every actionable signal into a common `Item` and
 * route it to the repo that would fix it (marketing surfaces → this
 * booking-brilliance repo; app/product surfaces → Digilist).
 *
 * Sources:
 *   A. GitHub `content-idea` issues (the proven idea agent's output)
 *   B. Convex intelligence findings (audits.state.snapshot.issues — every
 *      category: seo, ytelse/performance, security, a11y, uptime, links, …)
 *
 * (Compliance-control auditing is a planned third source, added once the
 * controls query is wired.)
 */
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { itemKey, type ItemKind } from "./brain";

const exec = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** The two repos the agent can analyze + prepare branches in. */
export const REPOS = {
  digilist: {
    key: "digilist",
    path: process.env.DIGILIST_REPO_PATH ?? "/Volumes/Development/SAAS Applications/Digilist",
    project: "Volumes-Development-SAAS-Applications-Digilist",
  },
  marketing: {
    key: "booking-brilliance",
    path: path.resolve(__dirname, "..", "..", ".."),
    project: "", // resolved by indexing at run time
  },
} as const;

export type RepoKey = keyof typeof REPOS;

/** Which repo would fix a finding, based on the surface it was found on. */
export function routeRepo(surfaceType?: string): RepoKey {
  return ["app", "dashboard", "api"].includes(surfaceType ?? "") ? "digilist" : "marketing";
}

export interface Item {
  key: string;
  kind: ItemKind;
  source_ref: string;
  title: string;
  category: string; // auditType, or "feature"
  severity: string; // error | warn | idea
  target_repo: RepoKey;
  detail: string; // full context for the analyzer
  url?: string;
  probe_hints: string[]; // seed terms for the code existence probe
}

const WORD = /[a-zæøå0-9]{4,}/gi;
function probeHints(text: string): string[] {
  const stop = new Set(["side", "page", "digilist", "kommune", "http", "https", "blogg", "med", "for", "som"]);
  return [...new Set((text.toLowerCase().match(WORD) ?? []).filter((w) => !stop.has(w)))].slice(0, 8);
}

// ── A. GitHub content-idea issues ───────────────────────────────────────────

interface GhIssue {
  number: number;
  title: string;
  body: string;
  labels: { name: string }[];
}

export async function githubIdeas(repo: string, label = "content-idea"): Promise<Item[]> {
  // Uses the locally-authenticated gh CLI (no token handling here).
  const { stdout } = await exec("gh", [
    "issue", "list", "--repo", repo, "--label", label, "--state", "open",
    "--limit", "50", "--json", "number,title,body,labels",
  ], { env: { ...process.env, GITHUB_TOKEN: "" }, maxBuffer: 8 * 1024 * 1024 });
  const issues = JSON.parse(stdout) as GhIssue[];
  return issues.map((i) => ({
    key: itemKey("idea", `gh-${i.number}`),
    kind: "idea" as const,
    source_ref: `${repo}#${i.number}`,
    title: i.title,
    category: "feature",
    severity: "idea",
    target_repo: "digilist" as RepoKey, // product-feature ideas target the app
    detail: i.body ?? "",
    probe_hints: probeHints(`${i.title} ${i.body ?? ""}`),
  }));
}

// ── B. Intelligence findings (all audit categories) ─────────────────────────

interface Finding {
  auditType: string;
  severity: string;
  rule: string;
  message: string;
  surface: string;
  surfaceType: string;
  surfaceLabel: string;
  url?: string;
  affected?: number;
}

export async function intelligenceFindings(
  convexUrl: string,
  adminToken: string,
  minSeverity: "error" | "warn" = "warn",
): Promise<Item[]> {
  const client = new ConvexHttpClient(convexUrl);
  const token = Buffer.from(adminToken, "utf-8").toString("base64");
  const snap = (await client.query(api.audits.state.snapshot, { adminToken: token } as never)) as {
    issues?: Finding[];
  };
  const rank = { error: 2, warn: 1, info: 0 } as Record<string, number>;
  const floor = rank[minSeverity] ?? 1;
  return (snap.issues ?? [])
    .filter((f) => (rank[f.severity] ?? 0) >= floor)
    .map((f) => ({
      key: itemKey("finding", `${f.auditType}:${f.rule}:${f.surface}`),
      kind: "finding" as const,
      source_ref: `${f.auditType}/${f.rule}@${f.surface}`,
      title: `${f.message} (${f.rule})`,
      category: f.auditType,
      severity: f.severity,
      target_repo: routeRepo(f.surfaceType),
      detail: `${f.message}\nRegel: ${f.rule}\nOverflate: ${f.surfaceLabel}${f.affected ? `\nAffiserte sider: ${f.affected}` : ""}${f.url ? `\nEksempel-URL: ${f.url}` : ""}`,
      url: f.url,
      probe_hints: probeHints(`${f.message} ${f.rule}`),
    }));
}
