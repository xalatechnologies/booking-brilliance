/**
 * Publish action — replaces the `publish` CLI command for the
 * non-blog channels. Convex actions run server-side with `fetch`
 * available, so LinkedIn UGC + X tweets work directly.
 *
 * The `blog` channel still writes to the filesystem (src/content/
 * blog/<slug>.md) and that needs the repo on disk, so blog publish
 * stays on the tsx pipeline side — the dashboard's "Publish" button
 * for a blog draft is wired to `requestBlogPublish` which marks a
 * task that a CI runner picks up. (Or, equivalently, you SSH in and
 * run `pnpm tsx tools/content-agent/src/cli.ts publish --id N`.)
 */
import { v } from "convex/values";
import { action } from "../_generated/server";
import { api } from "../_generated/api";
import { requireAdmin } from "../auth";

interface PublishResult {
  ok: boolean;
  externalId?: string;
  externalUrl?: string;
  error?: string;
  errorCode?:
    | "missing-credentials"
    | "upstream-error"
    | "draft-rejected"
    | "unsupported-channel"
    | "filesystem-error";
}

export const publish = action({
  args: {
    adminToken: v.string(),
    id: v.id("drafts"),
    reviewer: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<PublishResult> => {
    requireAdmin(args.adminToken);
    const draft = await ctx.runQuery(api.content.drafts.get, {
      adminToken: args.adminToken,
      id: args.id,
    });
    if (!draft) return { ok: false, error: `Draft ${args.id} not found` };
    if (draft.status !== "approved") {
      return {
        ok: false,
        errorCode: "draft-rejected",
        error: `Draft ${args.id} is not approved (status=${draft.status})`,
      };
    }

    let result: PublishResult;
    if (draft.channel === "blog") {
      // Blog publish needs filesystem write — handled by the tsx CLI
      // path; from the dashboard we just flag intent.
      result = {
        ok: false,
        errorCode: "unsupported-channel",
        error:
          "Blog publish runs via `pnpm tsx tools/content-agent/src/cli.ts publish --id <N>` on the VPS. The markdown file is written there and shipped via rsync on next deploy.",
      };
    } else if (draft.channel === "linkedin") {
      result = await publishLinkedIn(draft);
    } else if (draft.channel === "x") {
      result = await publishX(draft);
    } else {
      result = {
        ok: false,
        errorCode: "unsupported-channel",
        error: `Unknown channel: ${draft.channel}`,
      };
    }

    if (result.ok) {
      await ctx.runMutation(api.content.drafts.markPublished, {
        adminToken: args.adminToken,
        id: args.id,
        externalId: result.externalId,
        externalUrl: result.externalUrl,
        reviewer: args.reviewer,
      });
    } else {
      await ctx.runMutation(api.content.drafts.markPublishFailed, {
        adminToken: args.adminToken,
        id: args.id,
        error: result.error ?? "unknown",
        errorCode: result.errorCode,
        reviewer: args.reviewer,
      });
    }
    return result;
  },
});

// ─────────────────────────────────────────────────────────────
// LinkedIn — UGC Posts API v2

async function publishLinkedIn(
  draft: { body: string; hashtags_json: string },
): Promise<PublishResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgUrn = process.env.LINKEDIN_ORG_URN;
  if (!token || !orgUrn) {
    return {
      ok: false,
      errorCode: "missing-credentials",
      error:
        "LinkedIn credentials missing. Run `npx convex env set LINKEDIN_ACCESS_TOKEN <token>` and `npx convex env set LINKEDIN_ORG_URN <urn>`.",
    };
  }
  const tags = safeJsonArray(draft.hashtags_json);
  const commentary =
    draft.body +
    (tags.length
      ? `\n\n${tags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`
      : "");
  try {
    const r = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: orgUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: commentary },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      return {
        ok: false,
        errorCode: "upstream-error",
        error: `LinkedIn ${r.status}: ${err.slice(0, 300)}`,
      };
    }
    const id = r.headers.get("x-restli-id") ?? "";
    return {
      ok: true,
      externalId: id,
      externalUrl: id
        ? `https://www.linkedin.com/feed/update/${id}/`
        : undefined,
    };
  } catch (e) {
    return {
      ok: false,
      errorCode: "upstream-error",
      error: String(e),
    };
  }
}

// ─────────────────────────────────────────────────────────────
// X (Twitter) — v2 tweets with thread chaining

async function publishX(
  draft: { body: string; hashtags_json: string },
): Promise<PublishResult> {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) {
    return {
      ok: false,
      errorCode: "missing-credentials",
      error:
        "X credentials missing. Run `npx convex env set X_BEARER_TOKEN <token>`.",
    };
  }
  const tweets = draft.body
    .split(/\n---\n/)
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = safeJsonArray(draft.hashtags_json);
  if (tags.length && tweets.length) {
    tweets[tweets.length - 1] +=
      `\n\n${tags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`;
  }
  let inReplyTo: string | null = null;
  let firstId: string | null = null;
  for (let i = 0; i < tweets.length; i++) {
    const tweet = tweets[i];
    const body: Record<string, unknown> = { text: tweet };
    if (inReplyTo) body.reply = { in_reply_to_tweet_id: inReplyTo };
    try {
      const r = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.text();
        return {
          ok: false,
          errorCode: "upstream-error",
          error: `X ${r.status}: ${err.slice(0, 300)} (tweet ${i + 1}/${tweets.length})`,
        };
      }
      const payload = (await r.json()) as { data?: { id?: string } };
      const id = payload.data?.id;
      if (!id) {
        return {
          ok: false,
          errorCode: "upstream-error",
          error: `X returned no tweet id for tweet ${i + 1}`,
        };
      }
      if (!firstId) firstId = id;
      inReplyTo = id;
    } catch (e) {
      return {
        ok: false,
        errorCode: "upstream-error",
        error: String(e),
      };
    }
  }
  return {
    ok: true,
    externalId: firstId ?? undefined,
    externalUrl: firstId ? `https://x.com/i/web/status/${firstId}` : undefined,
  };
}

function safeJsonArray(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
