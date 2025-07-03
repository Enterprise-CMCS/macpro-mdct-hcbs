import { test } from "@playwright/test";
import { stateUserAuthPath } from "./../utils/consts";
import {
  assertReportIsCreated,
  completeGeneralInfo,
  enterReport,
  fillAddEditReportModal,
  navigateToAddEditReportModal,
  notReporting,
  submitReport,
  testModalData,
} from "./../utils/reportUtils";
import {
  completeFASI1,
  completeLTSS1,
  completeLTSS2,
  completeLTSS6,
  completeLTSS7,
} from "./../utils/measureUtils";

test.use({ storageState: stateUserAuthPath });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const qmsReportButton = page.getByRole("link", {
    name: "Enter QMS Report online",
  });
  await qmsReportButton.click();
});

test.describe("create and complete a report as a state user", () => {
  test("create a report as a state user", async ({ page }) => {
    await navigateToAddEditReportModal("Quality Measure Set", page);
    await fillAddEditReportModal(page);
    await assertReportIsCreated(page, testModalData);
  });
  test("complete a report as a state user", async ({ page }) => {
    await enterReport(page, testModalData);
    await completeGeneralInfo(page);

    await page.getByRole("button", { name: "Continue" }).click();

    await completeLTSS1(page);
    await completeLTSS2(page);
    await completeLTSS6(page);
    await completeLTSS7(page);
    await notReporting("LTSS-8", page);

    await page.getByRole("button", { name: "Continue" }).click();

    await completeFASI1(page);

    await page.getByRole("button", { name: "Continue" }).click();
    await submitReport("QMS", page);
  });
});
