import { test, expect } from "@playwright/test";

import { adminPassword, adminUser, statePassword, stateUser } from "./consts";

const adminFile = "playwright/.auth/admin.json";

test("authenticate as admin", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(adminUser);
  await passwordInput.fill(adminPassword);
  await loginButton.click();
  const landingPageHeading = page.getByRole("heading", {
    name: "View State/Territory Reports",
  });
  await expect(landingPageHeading).toBeVisible();
  await page.waitForTimeout(1000);
  await page.context().storageState({ path: adminFile });
});

const userFile = "playwright/.auth/stateUser.json";

test("authenticate as user", async ({ page }) => {
  await page.goto("/");
  const emailInput = page.getByRole("textbox", { name: "email" });
  const passwordInput = page.getByRole("textbox", { name: "password" });
  const loginButton = page.getByRole("button", { name: "Log In with Cognito" });
  await emailInput.fill(stateUser);
  await passwordInput.fill(statePassword);
  await loginButton.click();
  const landingPageHeading = page.getByRole("heading", {
    name: "Home and Community Based Services (HCBS) Portal",
  });
  await expect(landingPageHeading).toBeVisible();
  await page.waitForTimeout(1000);
  await page.context().storageState({ path: userFile });
});
