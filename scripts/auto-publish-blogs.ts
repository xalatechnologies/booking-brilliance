/**
 * Auto-publish blog drafts — the "autopublish" half of the daily blog agent.
 *
 * The content-agent's generate phase creates blog drafts as status="pending".
 * This approves + publishes every pending (or approved) blog draft so the daily
 * pipeline can ship them without a human gate:
 *
 *   content:all (generate 3)  →  auto-publish-blogs  →  content:sync  →  commit → deploy
 *
 * Publishing = flip status to published + stamp the /blogg URL (Convex is the
 * source of truth; content:sync pulls the markdown into the repo). Idempotent:
 * already-published drafts are skipped.
 *
 * Volume cap: this used to drain the ENTIRE pending+approved backlog in one run,
 * so a single morning could ship 18+ posts (the 2026-07-23 flood) if drafts had
 * accumulated. It now publishes at most CONTENT_MAX_PUBLISH_PER_RUN blog drafts
 * (default 3, matching the daily generate cap) and leaves the rest queued for a
 * later run. Set the env to 0 to restore the old unlimited drain.
 *
 * Env: VITE_CONVEX_URL (or CONVEX_URL) + ADMIN_BASIC_AUTH.
 *   CONTENT_MAX_PUBLISH_PER_RUN — max blog drafts to publish per run (default 3, 0 = unlimited).
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = process.env.VITE_CONVEX_URL ?? process.env.CONVEX_URL ?? "";
const ADMIN = process.env.ADMIN_BASIC_AUTH ?? "";
if (!CONVEX_URL || !ADMIN) {
  console.error("[auto-publish] VITE_CONVEX_URL and ADMIN_BASIC_AUTH required.");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const token = Buffer.from(ADMIN, "utf-8").toString("base64");

/** Per-run publish cap. Unset/blank → 3; a non-negative integer sets it; 0 =
 *  unlimited (the old drain-everything behaviour); anything else → 3. */
function maxPerRun(raw = process.env.CONTENT_MAX_PUBLISH_PER_RUN): number {
  if (raw === undefined || raw.trim() === "") return 3;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : 3;
}

async function main() {
  const cap = maxPerRun();
  let published = 0;
  let held = 0;
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  // SEO guard: never publish a blog draft whose <title> already exists on a
  // published post (or was just published this run). Duplicate <title>s are a
  // real SEO defect the post-deploy live-verify catches AFTER deploy, which
  // fails the WHOLE deploy. Catch it here: a colliding draft is skipped (left
  // for a human to retitle) instead of shipping and breaking the deploy.
  const takenTitles = new Set(
    ((await client.query(api.content.drafts.listByStatus, {
      adminToken: token,
      status: "published",
    })) as Array<{ channel: string; title: string }>)
      .filter((r) => r.channel === "blog")
      .map((r) => norm(r.title)),
  );
  // Pending → approve first; approved → publish. Both statuses get published.
  for (const status of ["pending", "approved"]) {
    const rows = (await client.query(api.content.drafts.listByStatus, {
      adminToken: token,
      status,
    })) as Array<{ _id: string; channel: string; title: string }>;
    const blogs = rows.filter((r) => r.channel === "blog");
    for (const d of blogs) {
      // Per-run volume cap: once `cap` posts are published, hold the rest for a
      // later run instead of draining the whole backlog (the 2026-07-23 flood
      // shipped 18 in one run). cap === 0 disables the cap.
      if (cap !== 0 && published >= cap) {
        held++;
        continue;
      }
      try {
        if (takenTitles.has(norm(d.title))) {
          console.warn(`[auto-publish] ⊘ skipped "${d.title}" — duplicate title already published (SEO); left as ${status} for retitling`);
          continue;
        }
        if (status === "pending") {
          await client.mutation(api.content.drafts.approve, {
            adminToken: token,
            id: d._id as never,
            reviewer: "daily-agent",
          });
        }
        const r = (await client.action(api.content.publish.publish, {
          adminToken: token,
          id: d._id as never,
          reviewer: "daily-agent",
        })) as { ok: boolean; externalUrl?: string; error?: string };
        if (r.ok) {
          console.log(`[auto-publish] ✓ ${d.title} → ${r.externalUrl ?? "ok"}`);
          published++;
          takenTitles.add(norm(d.title));
        } else {
          console.warn(`[auto-publish] ✗ ${d.title}: ${r.error}`);
        }
      } catch (e) {
        console.warn(
          `[auto-publish] ✗ ${d.title}: ${e instanceof Error ? e.message : e}`,
        );
      }
    }
  }
  if (held > 0) {
    console.log(
      `[auto-publish] cap ${cap}/run reached — ${held} blog draft(s) held for a later run.`,
    );
  }
  console.log(`[auto-publish] published ${published} blog draft(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
