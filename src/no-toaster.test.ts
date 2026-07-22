import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * <Toaster>/<Sonner> were removed from the app shell as dead weight — no
 * file under src/ called toast() or useToast(). That's only safe as long
 * as it stays true: a reintroduced call (e.g. a form's submit handler)
 * would silently render nothing with no mounted toaster, invisible from a
 * `/`-only smoke test. Guard the invariant directly instead of relying on
 * a point-in-time grep, same as no-react-query.test.ts.
 */
const SRC_DIR = join(process.cwd(), "src");
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

// The toast primitives themselves are allowed to reference toast()/useToast —
// they're the (currently unmounted) dead code being guarded, not a caller.
const TOAST_DEFINITION_FILES = new Set(
  [
    "hooks/use-toast.ts",
    "components/ui/use-toast.ts",
    "components/ui/toaster.tsx",
    "components/ui/toast.tsx",
    "components/ui/sonner.tsx",
  ].map((p) => join(SRC_DIR, p)),
);

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

describe("Toaster/Sonner stay unmounted (and uncalled)", () => {
  it("no file under src/ mounts <Toaster>/<Sonner> or calls toast()/useToast()", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC_DIR)) {
      if (TOAST_DEFINITION_FILES.has(file)) continue;
      const contents = readFileSync(file, "utf-8");
      if (
        /\buseToast\b/.test(contents) ||
        /\btoast\(/.test(contents) ||
        /<Toaster\b/.test(contents) ||
        /\bSonner\b/.test(contents)
      ) {
        offenders.push(relative(SRC_DIR, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
