/**
 * Playwright globalSetup — authenticates each ENABLED role once and saves its
 * session (storageState) so the role's tests run pre-authenticated. Roles that
 * aren't configured (or whose test-login isn't reachable) are skipped, so the
 * authenticated suite covers whatever credentials exist and the public suite
 * always runs.
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";
import { AUTH_DIR, ROLES, roleAuthConfig, storageStatePath } from "./roles";

export default async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  for (const role of ROLES) {
    const cfg = roleAuthConfig(role);
    if (!cfg.enabled) continue;

    // A pre-captured session file is honoured as-is (drop-in manual login).
    if (fs.existsSync(storageStatePath(role.key)) && !cfg.testLoginUrl) {
      console.log(`[e2e-auth] ${role.key}: using pre-captured session`);
      continue;
    }
    if (!cfg.testLoginUrl) {
      console.warn(`[e2e-auth] ${role.key}: enabled but no E2E_TEST_LOGIN_URL — skipping`);
      continue;
    }

    try {
      const browser = await chromium.launch();
      const context = await browser.newContext({ baseURL: cfg.appBaseUrl });
      const page = await context.newPage();
      // The app's test-login endpoint establishes a session for {role, tenant}
      // when given the shared secret. It MUST be gated to test/staging or behind
      // the secret — never a general prod capability.
      const url = new URL(cfg.testLoginUrl);
      url.searchParams.set("role", role.tenantRole);
      if (cfg.tenant) url.searchParams.set("tenant", cfg.tenant);
      if (cfg.testLoginSecret) url.searchParams.set("secret", cfg.testLoginSecret);
      await page.goto(url.toString(), { waitUntil: "networkidle" });
      await context.storageState({ path: storageStatePath(role.key) });
      await browser.close();
      console.log(`[e2e-auth] ${role.key}: authenticated → ${role.key}.json`);
    } catch (e) {
      console.warn(`[e2e-auth] ${role.key}: login failed — ${String(e).slice(0, 120)}`);
    }
  }
}
