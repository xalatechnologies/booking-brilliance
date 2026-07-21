import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * QueryClientProvider was removed as dead weight (nothing calls useQuery /
 * useMutation from @tanstack/react-query). That's only safe as long as it
 * stays true — a reintroduced call without the provider throws and
 * white-screens whatever lazy route uses it, invisible from a `/`-only
 * smoke test. Guard the invariant directly instead of relying on a
 * point-in-time grep.
 */
const SRC_DIR = join(process.cwd(), "src");
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (CODE_EXTENSIONS.has(extname(full)) && !entry.includes(".test.")) {
      files.push(full);
    }
  }
  return files;
}

describe("@tanstack/react-query stays removed", () => {
  it("no file under src/ imports @tanstack/react-query or calls its hooks", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      const contents = readFileSync(file, "utf-8");
      if (
        contents.includes("@tanstack/react-query") ||
        /\bQueryClientProvider\b/.test(contents)
      ) {
        offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});
