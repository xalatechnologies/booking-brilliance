/**
 * Code map — the improvements agent's window into the actual codebase, via the
 * codebase-memory (GitNexus-style) CLI. A thin shell-out wrapper so the analyzer
 * can ground every item (idea, intelligence finding, compliance control) in real
 * code before it decides anything.
 *
 * Requires the `codebase-memory-mcp` binary on PATH (it exposes a `cli <tool>
 * <json>` mode that returns JSON on stdout). Repos are referenced by their
 * indexed project name, e.g. "Volumes-Development-SAAS-Applications-Digilist".
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

const CLI = process.env.CODEBASE_MEMORY_BIN ?? "codebase-memory-mcp";

/** Run one codebase-memory tool and parse its JSON stdout. */
async function cli<T = unknown>(tool: string, args: Record<string, unknown>): Promise<T> {
  const { stdout } = await exec(CLI, ["cli", tool, JSON.stringify(args)], {
    maxBuffer: 64 * 1024 * 1024,
    timeout: 10 * 60_000,
  });
  // The binary prints a `level=info msg=mem.init …` preamble before the JSON;
  // grab the first balanced JSON object/array in the output.
  const start = stdout.search(/[[{]/);
  if (start < 0) throw new Error(`code-map: ${tool} produced no JSON`);
  return JSON.parse(stdout.slice(start)) as T;
}

export interface Project {
  name: string;
  root_path: string;
  nodes: number;
  edges: number;
}

export async function listProjects(): Promise<Project[]> {
  const r = await cli<{ projects: Project[] }>("list_projects", {});
  return r.projects ?? [];
}

/** Resolve a repo path to its indexed project name (as list_projects reports). */
export async function projectForPath(repoPath: string): Promise<Project | null> {
  const norm = repoPath.replace(/\/+$/, "");
  const projects = await listProjects();
  return projects.find((p) => p.root_path.replace(/\/+$/, "") === norm) ?? null;
}

/** (Re)index a repo so the graph reflects current code. Returns the project. */
export async function indexRepo(
  repoPath: string,
  mode: "full" | "moderate" | "fast" = "moderate",
): Promise<Project | null> {
  await cli("index_repository", { repo_path: repoPath, mode });
  return projectForPath(repoPath);
}

export interface CodeHit {
  file: string;
  qualified_name?: string;
  signature?: string;
}

/** Graph-augmented code search. Returns containing functions/files for a pattern. */
export async function searchCode(
  project: string,
  pattern: string,
  opts: { mode?: "compact" | "files"; limit?: number; pathFilter?: string } = {},
): Promise<{ hits: CodeHit[]; totalMatches: number }> {
  const r = await cli<{
    results?: CodeHit[];
    files?: string[];
    total_grep_matches?: number;
    total_results?: number;
  }>("search_code", {
    project,
    pattern,
    mode: opts.mode ?? "compact",
    limit: opts.limit ?? 8,
    ...(opts.pathFilter ? { path_filter: opts.pathFilter } : {}),
  });
  const hits: CodeHit[] =
    r.results ?? (r.files ?? []).map((f) => ({ file: f }));
  return { hits, totalMatches: r.total_grep_matches ?? hits.length };
}

export interface GraphSymbol {
  name: string;
  qualified_name: string;
  label: string;
  file_path: string;
  is_exported?: boolean;
  is_test?: boolean;
}

const CODE_LABELS = new Set([
  "function",
  "method",
  "class",
  "interface",
  "type",
  "enum",
  "route",
  "channel",
  "component",
]);

/**
 * Primary existence probe: does a symbol/capability exist in the graph? Unlike
 * search_code (grep, which the Digilist index doesn't serve), search_graph
 * matches node names, so it finds real definitions. Filters out doc/markdown
 * and test nodes so a match means genuine implementation code.
 */
export async function searchGraph(
  project: string,
  namePattern: string,
  limit = 12,
): Promise<GraphSymbol[]> {
  const r = await cli<{ results?: GraphSymbol[] }>("search_graph", {
    project,
    name_pattern: namePattern,
  });
  return (r.results ?? [])
    .filter((n) => CODE_LABELS.has((n.label ?? "").toLowerCase()))
    .filter((n) => !n.is_test && !/\/(docs|archive|__tests__|node_modules)\//.test(n.file_path ?? ""))
    .slice(0, limit);
}

/** True if any real (non-doc, non-test) code symbol matches the pattern. */
export async function existsInCode(project: string, namePattern: string): Promise<GraphSymbol[]> {
  return searchGraph(project, namePattern);
}

/** High-level architecture (modules / clusters) for building the capability map. */
export async function architecture(project: string): Promise<unknown> {
  return cli("get_architecture", { project });
}

export interface RepoStatus {
  branch: string;
  sha: string;
  dirty: boolean;
  checked_at: string;
}

/** git branch / HEAD sha / dirty for a repo, for provenance in the Brain. */
export async function repoStatus(repoPath: string, nowIso: string): Promise<RepoStatus> {
  const git = async (a: string[]) =>
    (await exec("git", ["-C", repoPath, ...a], { timeout: 20_000 })).stdout.trim();
  const [branch, sha, dirty] = await Promise.all([
    git(["rev-parse", "--abbrev-ref", "HEAD"]).catch(() => "unknown"),
    git(["rev-parse", "HEAD"]).catch(() => "unknown"),
    git(["status", "--porcelain"]).then((s) => s.length > 0).catch(() => false),
  ]);
  return { branch, sha, dirty, checked_at: nowIso };
}
