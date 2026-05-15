/**
 * Shared ConvexHttpClient bootstrap for the tsx pipeline scripts
 * (orchestrator.ts, sources.ts, generate.ts, publish.ts).
 *
 * Required env:
 *   CONVEX_URL or VITE_CONVEX_URL   — deployment URL
 *   ADMIN_BASIC_AUTH                — same "user:pass" used by dashboard auth
 *
 * Throws on missing config so the pipeline fails loudly at startup
 * rather than silently writing nowhere.
 */
import { ConvexHttpClient } from "convex/browser";

let cached: ConvexHttpClient | null = null;

export function getConvex(): ConvexHttpClient {
  if (cached) return cached;
  const url =
    process.env.CONVEX_URL ?? process.env.VITE_CONVEX_URL ?? "";
  if (!url) {
    throw new Error(
      "CONVEX_URL not set. Run `npx convex dev` and copy the URL into /etc/digilist-api.env.",
    );
  }
  cached = new ConvexHttpClient(url);
  return cached;
}

/**
 * base64(user:pass) — the shared admin token passed as `adminToken`
 * arg on every mutation/query. Cached after first call. Throws when
 * ADMIN_BASIC_AUTH isn't set so pipeline failures are loud.
 */
let cachedAdminToken: string | null = null;
export function adminToken(): string {
  if (cachedAdminToken !== null) return cachedAdminToken;
  const admin = process.env.ADMIN_BASIC_AUTH ?? "";
  if (!admin) {
    throw new Error(
      "ADMIN_BASIC_AUTH not set. Pipeline writes are admin-authenticated.",
    );
  }
  cachedAdminToken = Buffer.from(admin, "utf-8").toString("base64");
  return cachedAdminToken;
}
