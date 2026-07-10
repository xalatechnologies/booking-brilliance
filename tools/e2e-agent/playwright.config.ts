import { defineConfig, devices } from "@playwright/test";
import { ROLES, roleAuthConfig, storageStatePath } from "./auth/roles";

/**
 * E2E agent config.
 *  - "public" project: unauthenticated journeys on the marketing site (always runs).
 *  - "app:<role>" projects: authenticated journeys per role on the app, one per
 *    role enabled via E2E_<ROLE>_ENABLED. globalSetup logs each in and saves its
 *    session; the project loads that storageState. No enabled roles → app suite
 *    is simply skipped (public still runs), so it degrades to whatever auth exists.
 */
const marketingBaseUrl = process.env.E2E_BASE_URL ?? "https://digilist.no";
const appBaseUrl = process.env.E2E_APP_BASE_URL ?? "https://app.digilist.no";

const roleProjects = ROLES.filter((r) => roleAuthConfig(r).enabled).map((r) => ({
  name: `app:${r.key}`,
  testDir: "./tests/app",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: appBaseUrl,
    storageState: storageStatePath(r.key),
  },
  metadata: { role: r.key },
}));

export default defineConfig({
  timeout: 45_000,
  expect: { timeout: 10_000 },
  retries: 2,
  reporter: [["json", { outputFile: "report.json" }], ["line"]],
  globalSetup: roleProjects.length ? "./auth/global-setup.ts" : undefined,
  use: {
    headless: true,
    actionTimeout: 12_000,
    navigationTimeout: 25_000,
  },
  projects: [
    {
      name: "public",
      testDir: "./tests",
      testMatch: "public-surfaces.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: marketingBaseUrl },
    },
    ...roleProjects,
  ],
});
