import { test, expect, Page, Locator } from "@playwright/test";
import { adminAuthPath } from "./utils/consts";
import { tomorrow, yesterday } from "./utils/time";

// All tests in this file will be executed as an admin user
test.use({ storageState: adminAuthPath });

const testBannerData = {
  title: "Important announcement",
  description: "Please view this announcement",
  link: "https://example.com",
  startDate: yesterday(),
  endDate: tomorrow(),
};

test.describe("Banner functionality", () => {
  test("The banner form should have an instant preview", async ({ page }) => {
    await navigateToBannerEditor(page);
    await fillBannerForm(page, testBannerData);

    /*
     * We are specifically looking for the alert preview AFTER the form.
     * Note that `~` is the CSS "subsequent sibling" combinator.
     */
    const alertPreview = page.locator("form ~ [role='alert']");
    await assertBannerIsPopulated(alertPreview, testBannerData);
  });

  test.skip("The banner should be visible from other pages", async ({
    page,
  }) => {
    await navigateToBannerEditor(page);
    await fillBannerForm(page, testBannerData);
    await saveBanner(page);

    await page.goto("/");

    // The new alert should be visible on the home page
    const alertElement = page.getByRole("alert");
    await assertBannerIsPopulated(alertElement, testBannerData);
  });

  test("The banner should be deletable", async ({ page }) => {
    await navigateToBannerEditor(page);
    await fillBannerForm(page, testBannerData);
    await saveBanner(page);

    // We have 2 alerts: the "Current Banner" preview, and the form preview.
    let alertElements = await page.getByRole("alert").all();
    expect(alertElements).toHaveLength(2);

    const deleteButton = page.getByRole("button", {
      name: "Delete Current Banner",
    });
    await deleteButton.click();

    // Wait for the new data to be posted to the API
    await waitForBannerRequest(page, "DELETE");

    // Wait for the new data to come back from the API
    await waitForBannerRequest(page, "GET");

    // We should be back down to just 1 alert.
    alertElements = await page.getByRole("alert").all();
    expect(alertElements).toHaveLength(1);
  });
});

// Go to the home page, and click through to the banner editor page.
const navigateToBannerEditor = async (page: Page) => {
  await page.goto("/");
  await page.getByLabel("My Account").click();
  const accountMenuItem = page.getByRole("menuitem", {
    name: "Manage Account",
    exact: false,
  });
  await accountMenuItem.click();
  await page.getByRole("button", { name: "Banner Editor" }).click();
  const heading = page.getByRole("heading", { name: "Banner Admin" });
  await expect(heading).toBeVisible();
};

// Complete the banner form fields. Expects to be on the banner editor page.
const fillBannerForm = async (page: Page, data: typeof testBannerData) => {
  await page.getByLabel("Title text").fill(data.title);
  await page.getByLabel("Description Text").fill(data.description);
  await page.getByLabel("Link").fill(data.link);
  await page.getByLabel("Start date").fill(data.startDate);
  await page.getByLabel("End date").fill(data.endDate);
};

// Confirm that this element contains all of the appropriate text.
const assertBannerIsPopulated = async (
  banner: Locator,
  data: typeof testBannerData
) => {
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(data.title);
  await expect(banner).toContainText(data.description);
  await expect(banner).toContainText(data.link);
};

// Click the banner save button. Expects to be on the banner editor page.
const saveBanner = async (page: Page) => {
  const saveButton = page.getByRole("button", {
    name: "Replace Current Banner",
  });
  await saveButton.click();

  // Wait for the new data to be posted to the API
  await waitForBannerRequest(page, "POST");

  // Wait for the new data to come back from the API
  await waitForBannerRequest(page, "GET");
};

const waitForBannerRequest = async (
  page: Page,
  method: "GET" | "POST" | "DELETE"
) => {
  await page.waitForResponse(
    (response) =>
      response.url().includes(`/local/banners/`) &&
      response.request().method() === method &&
      response.ok()
  );
};
