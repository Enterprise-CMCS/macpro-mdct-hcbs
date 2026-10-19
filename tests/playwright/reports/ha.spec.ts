import { expect, Page, test } from "@playwright/test";
import { stateUserAuthPath } from "../utils/consts";
import {
  navigateToReportHome,
  navigateToAddEditReportModal,
  fillAddEditReportModal,
  assertReportIsCreated,
  testModalData,
  enterReport,
  completeGeneralInfo,
} from "../utils/reportUtils";

test.use({ storageState: stateUserAuthPath });

const reportSpecificData = {
  reportButtonName: "Enter HA Report online",
  startReportButtonName: "Start HCBS Access Report",
  modalHeading: "Add new HCBS Access Report",
  reportNameInputHeading: "HCBS Access Report Name",
};

test.beforeEach(async ({ page }) => {
  // mock LD SDK response
  await page.route(/clientsdk\.launchdarkly\.us/, async (route) => {
    await route.fulfill({
      json: {
        isHaReportActive: {
          version: 60,
          flagVersion: 8,
          value: true,
          variation: 1,
          trackEvents: false,
        },
      },
    });
  });

  // stream seems to be constantly resetting and grabbing the real values; abort so it stops trying to re-fetch
  await page.route(/clientstream\.launchdarkly\.us/, async (route) => {
    await route.abort();
  });
});

test("create a HA report as a state user", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await navigateToAddEditReportModal(
    page,
    reportSpecificData.startReportButtonName
  );
  await fillAddEditReportModal(page, reportSpecificData);
  await assertReportIsCreated(page, testModalData);
});

const assertServiceTypeSections = async (page: Page) => {
  const serviceTypes = page.getByRole("group", {
    name: "Which service types are included in this measure?",
  });
  const numerators = page.getByRole("textbox", { name: "Numerator" });
  const samplingQuestions = page.getByRole("radiogroup", {
    name: "What sampling methodology was used?",
  });
  const additionalDetails = page.getByRole("heading", {
    name: "Additional Details",
  });
  const homemakerHeading = page.getByRole("heading", {
    name: "Homemaker",
    exact: true,
  });

  await expect(serviceTypes).toBeVisible();
  await expect(numerators).toHaveCount(0);
  await expect(samplingQuestions).toHaveCount(0);
  await expect(additionalDetails).toHaveCount(0);

  await serviceTypes.getByLabel("Homemaker", { exact: true }).check();
  await expect(homemakerHeading).toBeVisible();
  await expect(numerators).toHaveCount(1);
  await expect(samplingQuestions).toHaveCount(1);
  await expect(additionalDetails).toHaveCount(1);

  await serviceTypes.getByLabel("Personal Care", { exact: true }).check();
  await expect(
    page.getByRole("heading", { name: "Personal Care", exact: true })
  ).toBeVisible();
  await expect(numerators).toHaveCount(2);
  await expect(samplingQuestions).toHaveCount(2);
  await expect(additionalDetails).toHaveCount(1);

  await numerators.first().fill("10");
  const confirmation = page.getByRole("dialog", { name: "Are you sure?" });
  await serviceTypes.getByLabel("Homemaker", { exact: true }).click();
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "No", exact: true }).click();
  await expect(
    serviceTypes.getByLabel("Homemaker", { exact: true })
  ).toBeChecked();
  await expect(numerators.first()).toHaveValue("10");

  await serviceTypes.getByLabel("Homemaker", { exact: true }).click();
  await confirmation.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(homemakerHeading).toHaveCount(0);
  await expect(numerators).toHaveCount(1);
  await expect(samplingQuestions).toHaveCount(1);
  await expect(additionalDetails).toHaveCount(1);

  await serviceTypes.getByLabel("Homemaker", { exact: true }).check();
  await expect(numerators.first()).toHaveValue("");
  await serviceTypes.getByLabel("Homemaker", { exact: true }).click();
  await confirmation.getByRole("button", { name: "Yes", exact: true }).click();

  await serviceTypes.getByLabel("Personal Care", { exact: true }).click();
  await confirmation.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(numerators).toHaveCount(0);
  await expect(samplingQuestions).toHaveCount(0);
  await expect(additionalDetails).toHaveCount(0);
};

test("service type checkboxes control HAPCH sections", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await enterReport(page, testModalData);

  await completeGeneralInfo(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect
    .soft(page.getByRole("heading", { name: /HCBS HAPCH-1/ }))
    .toBeVisible();
  await assertServiceTypeSections(page);

  await page.getByRole("button", { name: "Continue" }).click();
  await expect
    .soft(page.getByRole("heading", { name: /HCBS HAPCH-2/ }))
    .toBeVisible();
  await assertServiceTypeSections(page);
});
