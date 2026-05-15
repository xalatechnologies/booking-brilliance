/**
 * Publishing module. Strict V1 policy:
 *
 *   - Drafts NEVER auto-publish. The Approval Queue is the only path.
 *   - When a human approves a draft AND clicks Publish, this module
 *     fires the API call to LinkedIn / X / writes the blog markdown.
 *   - If credentials are missing (the default), publish() returns a
 *     structured error explaining what env var the operator needs to
 *     configure — the draft stays approved-but-not-published.
 *
 * No OAuth flow lives in this file — refresh tokens are managed
 * out-of-band (set via /etc/digilist-api.env on the VPS). The harness
 * just consumes ready-to-use access tokens.
 *
 * See tools/content-agent/PLAN.md for the credential setup runbook.
 */

import fs from "node:fs";
import path from "node:path";
import type { Draft } from "./types";
import type { ContentAgentConfig } from "./config";

export interface PublishResult {
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

// ─────────────────────────────────────────────────────────────
// Blog — commit the markdown to src/content/blog/<slug>.md
//
// We don't perform the git commit/push from here; that's an operator
// step. We write the file and let the build pick it up. The deploy.sh
// rsync stage ships the new file on next deploy.

export async function publishBlog(
  cfg: ContentAgentConfig,
  draft: Draft,
): Promise<PublishResult> {
  if (draft.channel !== "blog") {
    return { ok: false, error: "publishBlog called with non-blog draft", errorCode: "unsupported-channel" };
  }
  const fm = safeJson<Record<string, string>>(draft.frontmatter_json) ?? {};
  const slug = fm.slug ?? slugify(draft.title);
  const target = path.join(cfg.blogDir, `${slug}.md`);
  try {
    fs.mkdirSync(cfg.blogDir, { recursive: true });
    if (fs.existsSync(target)) {
      return {
        ok: false,
        error: `Blog file already exists: ${target}`,
        errorCode: "filesystem-error",
      };
    }
    fs.writeFileSync(target, draft.body, "utf-8");
    return {
      ok: true,
      externalUrl: `${cfg.siteOrigin}/blogg/${slug}`,
      externalId: slug,
    };
  } catch (e) {
    return { ok: false, error: String(e), errorCode: "filesystem-error" };
  }
}

// ─────────────────────────────────────────────────────────────
// LinkedIn — UGC Posts API v2
//
// Requires: LINKEDIN_ACCESS_TOKEN (3-legged OAuth, w_member_social or
// w_organization_social), LINKEDIN_ORG_URN (urn:li:organization:NNN or
// urn:li:person:XXX). See PLAN.md for the credential setup runbook.

export async function publishLinkedIn(
  cfg: ContentAgentConfig,
  draft: Draft,
): Promise<PublishResult> {
  if (!cfg.linkedinAccessToken || !cfg.linkedinOrgUrn) {
    return {
      ok: false,
      error:
        "LinkedIn credentials missing. Set LINKEDIN_ACCESS_TOKEN + LINKEDIN_ORG_URN in /etc/digilist-api.env.",
      errorCode: "missing-credentials",
    };
  }
  const hashtags = safeJson<string[]>(draft.hashtags_json) ?? [];
  const commentary =
    draft.body +
    (hashtags.length ? `\n\n${hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}` : "");
  try {
    const r = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.linkedinAccessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: cfg.linkedinOrgUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: commentary },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      return {
        ok: false,
        error: `LinkedIn ${r.status}: ${err.slice(0, 300)}`,
        errorCode: "upstream-error",
      };
    }
    const id = r.headers.get("x-restli-id") ?? "";
    return {
      ok: true,
      externalId: id,
      externalUrl: id ? `https://www.linkedin.com/feed/update/${id}/` : undefined,
    };
  } catch (e) {
    return { ok: false, error: String(e), errorCode: "upstream-error" };
  }
}

// ─────────────────────────────────────────────────────────────
// X (Twitter) — v2 tweets API with thread chaining
//
// Requires: X_BEARER_TOKEN (OAuth 2.0 user-context token, *not* the
// app-only Bearer — posting needs the user-context flow). The Basic
// tier ($200/mo as of 2025) is the minimum that allows POST /tweets.

export async function publishX(
  cfg: ContentAgentConfig,
  draft: Draft,
): Promise<PublishResult> {
  if (!cfg.xBearerToken) {
    return {
      ok: false,
      error: "X credentials missing. Set X_BEARER_TOKEN in /etc/digilist-api.env.",
      errorCode: "missing-credentials",
    };
  }
  // Thread bodies are stored newline-separated by "---" delimiters.
  const tweets = draft.body.split(/\n---\n/).map((t) => t.trim()).filter(Boolean);
  const hashtags = safeJson<string[]>(draft.hashtags_json) ?? [];
  if (hashtags.length && tweets.length) {
    tweets[tweets.length - 1] += `\n\n${hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`;
  }
  let inReplyTo: string | null = null;
  let firstId: string | null = null;
  for (const tweet of tweets) {
    try {
      const body: Record<string, unknown> = { text: tweet };
      if (inReplyTo) body.reply = { in_reply_to_tweet_id: inReplyTo };
      const r = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.xBearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.text();
        return {
          ok: false,
          error: `X ${r.status}: ${err.slice(0, 300)} (tweet ${tweets.indexOf(tweet) + 1}/${tweets.length})`,
          errorCode: "upstream-error",
          externalId: firstId ?? undefined,
        };
      }
      const json = (await r.json()) as { data?: { id?: string } };
      const id = json.data?.id;
      if (!id) {
        return { ok: false, error: "X: no tweet id returned", errorCode: "upstream-error" };
      }
      if (!firstId) firstId = id;
      inReplyTo = id;
    } catch (e) {
      return { ok: false, error: String(e), errorCode: "upstream-error" };
    }
  }
  return {
    ok: true,
    externalId: firstId ?? "",
    externalUrl: firstId ? `https://x.com/i/web/status/${firstId}` : undefined,
  };
}

export async function publishDraft(
  cfg: ContentAgentConfig,
  draft: Draft,
): Promise<PublishResult> {
  if (draft.status === "rejected") {
    return { ok: false, error: "Draft is rejected", errorCode: "draft-rejected" };
  }
  switch (draft.channel) {
    case "blog":
      return publishBlog(cfg, draft);
    case "linkedin":
      return publishLinkedIn(cfg, draft);
    case "x":
      return publishX(cfg, draft);
    default:
      return {
        ok: false,
        error: `Unknown channel: ${draft.channel}`,
        errorCode: "unsupported-channel",
      };
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
