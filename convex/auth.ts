/**
 * Admin auth helper used by every mutation/query in convex/.
 *
 * Convex's HTTP client only accepts JWT-format tokens via setAuth().
 * Rather than spin up a JWT issuer for a single-tenant admin dashboard,
 * we ship the admin token as an explicit `adminToken` argument on every
 * call. The browser pulls it from localStorage (the existing
 * `digilist-admin-basic-auth-v1` key); Node pipeline scripts pull it
 * from `ADMIN_BASIC_AUTH` env. Both base64-encode `user:pass` so the
 * server-side comparison is a single string equality check.
 *
 * Set the expected value once:
 *   npx convex env set ADMIN_BASIC_AUTH_B64 $(printf '%s' "user:pass" | base64)
 */

const ADMIN_TOKEN_ENV = "ADMIN_BASIC_AUTH_B64";

export function requireAdmin(token: string | undefined): void {
  const expected = process.env[ADMIN_TOKEN_ENV];
  if (!expected) {
    throw new Error(
      `${ADMIN_TOKEN_ENV} is not set on the Convex deployment. Run \`npx convex env set ${ADMIN_TOKEN_ENV} <base64 of user:pass>\`.`,
    );
  }
  if (!token || token !== expected) {
    throw new Error("Unauthorized — admin token mismatch.");
  }
}
