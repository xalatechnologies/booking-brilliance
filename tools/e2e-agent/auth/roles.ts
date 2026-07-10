/**
 * Roles for authenticated E2E. BankID/ID-porten can't be automated, so headless
 * auth needs one of (in order of preference):
 *   1. A test-login endpoint (E2E_TEST_LOGIN_URL) the app exposes ONLY in a
 *      test/staging env or behind E2E_TEST_LOGIN_SECRET, that mints a session
 *      for {role, tenant}. global-setup.ts calls it per role and saves the
 *      Playwright storageState. This is the clean, autonomous path.
 *   2. Pre-captured storageState files at auth/.auth/<role>.json (drop in a
 *      session you logged in manually once; refresh when it expires).
 *
 * Config per role via env: E2E_<ROLE>_ENABLED plus, for test-login, the shared
 * E2E_TEST_LOGIN_URL/SECRET/TENANT. Roles with no usable auth are skipped, so
 * the suite degrades to whatever is configured.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const AUTH_DIR = path.join(__dirname, ".auth");

export interface Role {
  key: string; // stable id used for the storageState file + playwright project
  label: string; // Norwegian display name
  tenantRole: string; // maps to the app's requireTenantRole value
  description: string;
}

export const ROLES: Role[] = [
  { key: "innbygger", label: "Innbygger", tenantRole: "member", description: "Sluttbruker som søker og booker lokaler" },
  { key: "saksbehandler", label: "Saksbehandler", tenantRole: "case_worker", description: "Godkjenner/avviser bookinger og søknader, kommuniserer" },
  { key: "driftsleder", label: "Driftsleder", tenantRole: "operator", description: "Eier anlegg/ressurser, priser, tilleggstjenester, innsjekk" },
  { key: "it-leder", label: "IT-leder / tenant-admin", tenantRole: "tenant_admin", description: "Tenant-administrasjon, team/roller, integrasjoner, faktura" },
  { key: "plattform-admin", label: "Plattform-admin", tenantRole: "platform_staff", description: "Super-admin på tvers av tenants" },
];

export const storageStatePath = (roleKey: string) => path.join(AUTH_DIR, `${roleKey}.json`);

/** How this role authenticates, from env. */
export function roleAuthConfig(role: Role) {
  const up = role.key.toUpperCase().replace(/-/g, "_");
  return {
    enabled: (process.env[`E2E_${up}_ENABLED`] ?? "").toLowerCase() === "true",
    testLoginUrl: process.env.E2E_TEST_LOGIN_URL ?? "",
    testLoginSecret: process.env.E2E_TEST_LOGIN_SECRET ?? "",
    tenant: process.env.E2E_TEST_TENANT ?? process.env[`E2E_${up}_TENANT`] ?? "",
    appBaseUrl: process.env.E2E_APP_BASE_URL ?? "https://app.digilist.no",
  };
}
