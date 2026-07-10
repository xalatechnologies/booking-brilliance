/**
 * Authenticated, role-gated app journeys — representative starters mapped to
 * SCENARIOS.md. Each role's Playwright project runs this whole file with that
 * role's saved session, so tests self-gate on the current role via
 * `onlyRole(...)`. These run only once the test-login endpoint is wired
 * (E2E_<ROLE>_ENABLED + E2E_TEST_LOGIN_URL); until then the role projects are
 * skipped and the public suite carries coverage.
 *
 * Grow this toward full coverage: one positive + the negative/permission case
 * per user story in SCENARIOS.md, reusing the app's seedTenantWithRole fixtures.
 */
import { test, expect, type TestInfo } from "@playwright/test";

const roleOf = (info: TestInfo) => (info.project.metadata as { role?: string })?.role ?? "";
const onlyRole = (info: TestInfo, ...roles: string[]) =>
  test.skip(!roles.includes(roleOf(info)), `not applicable to role "${roleOf(info)}"`);

test.describe("Booking", () => {
  test("[innbygger] can search, open a listing and reach checkout", async ({ page }, info) => {
    onlyRole(info, "innbygger", "arrangor");
    await page.goto("/");
    await expect(page.getByRole("heading").first()).toBeVisible();
    // search → open first listing → start booking → land on checkout/payment step
    // (fill in against the real storefront selectors once auth is available).
  });

  test("[saksbehandler] can approve a pending booking", async ({ page }, info) => {
    onlyRole(info, "saksbehandler", "tenant-admin");
    await page.goto("/bookings");
    // find a pending booking → approve → expect confirmed state.
  });

  test("[support] cannot modify a booking (read-only)", async ({ page }, info) => {
    onlyRole(info, "support");
    await page.goto("/bookings");
    // the approve/edit controls must be absent or disabled for support.
  });
});

test.describe("Faktura & regnskap", () => {
  test("[finance] can view invoices but not edit bookings", async ({ page }, info) => {
    onlyRole(info, "finance", "tenant-admin");
    await page.goto("/faktura");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});

test.describe("Administrasjon", () => {
  test("[tenant-admin] can open the listing wizard and see publish", async ({ page }, info) => {
    onlyRole(info, "tenant-admin");
    await page.goto("/listings/wizard/new");
    // wizard steps present; publish control visible for admin.
  });

  test("[saksbehandler] cannot publish a listing (draft only)", async ({ page }, info) => {
    onlyRole(info, "saksbehandler");
    await page.goto("/listings/wizard/new");
    // publish control absent/disabled — saksbehandler lacks listings:publish.
  });
});

test.describe("Plattform-admin", () => {
  test("[plattform-admin] can reach the platform area", async ({ page }, info) => {
    onlyRole(info, "plattform-admin");
    const resp = await page.goto("/platform");
    expect(resp?.status()).toBeLessThan(400);
  });

  test("[tenant-admin] is denied the platform area", async ({ page }, info) => {
    onlyRole(info, "tenant-admin");
    await page.goto("/platform");
    // expect redirect away or a 403 — tenant-admin lacks platform `admin`.
    await expect(page).not.toHaveURL(/\/platform(\/|$)/);
  });
});
