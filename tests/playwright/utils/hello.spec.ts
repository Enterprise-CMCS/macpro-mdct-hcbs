import { test, expect } from "@playwright/test";

test.describe("Basic tests", () => {
  test("Admins should see the admin view", async ({ browser }) => {
    const adminContext = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const page = await adminContext.newPage();
    await page.goto("/");

    const stateSelection = page.getByLabel("Select state or territory:");
    await expect(stateSelection).toBeVisible();

    await adminContext.close();
  });

  test("State users should see the state view", async ({ browser }) => {
    const stateContext = await browser.newContext({
      storageState: "playwright/.auth/stateUser.json",
    });
    const page = await stateContext.newPage();
    await page.goto("/");

    const landingPageHeading = page.getByRole("heading", {
      name: "Home and Community Based Services (HCBS) Portal",
    });
    await expect(landingPageHeading).toBeVisible();

    await stateContext.close();
  });
});
