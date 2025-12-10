import { test, expect, Page } from "@playwright/test";
import { stateUserAuthPath } from "./../utils/consts";
import {
  assertReportIsCreated,
  completeGeneralInfo,
  navigateToAddEditReportModal,
  notReporting,
  submitReport,
  testModalData,
  navigateToReportHome,
} from "./../utils/reportUtils";
import {
  completeFASI1,
  completeLTSS1,
  completeLTSS2,
  completeLTSS6,
  completeLTSS7,
} from "./../utils/measureUtils";

const reportSpecificData = {
  reportButtonName: "Enter QMS Report online",
  startReportButtonName: "Start Quality Measure Set Report",
  modalHeading: "Add new Quality Measure Set Report",
  reportNameInputHeading: "Quality Measure Set Report Name",
};

test.use({ storageState: stateUserAuthPath });

export const fillAddEditReportModal = async (page: Page) => {
  const addQMSReportHeading = page.getByRole("heading", {
    name: reportSpecificData.modalHeading,
  });
  await expect(addQMSReportHeading).toBeVisible();
  const qmsSetReportNameInput = page.getByRole("textbox", {
    name: reportSpecificData.reportNameInputHeading,
  });
  const cahpsRadioButton = page.getByRole("radiogroup", {
    name: "Is your state reporting on the HCBS CAHPS Survey?",
  });
  const nciiddRadioButton = page.getByRole("radiogroup", {
    name: "Is your state reporting on the NCI-IDD Survey?",
  });
  const nciadRadioButton = page.getByRole("radiogroup", {
    name: "Is your state reporting on the NCI-AD Survey?",
  });
  const pomRadioButton = page.getByRole("radiogroup", {
    name: "Is your state reporting on the POM Survey?",
  });
  await qmsSetReportNameInput.fill(
    testModalData.reportName + testModalData.datetime
  );
  await cahpsRadioButton.getByLabel(testModalData.cahpsSurveyOption).check();
  await nciiddRadioButton.getByLabel(testModalData.nciiddSurveyOption).check();
  await nciadRadioButton.getByLabel(testModalData.nciadSurveyOption).check();
  await pomRadioButton.getByLabel(testModalData.pomSurveyOption).check();
  const addEditReportButton = page.getByRole("button", {
    name: "Start new",
  });
  await addEditReportButton.click();
};

test.beforeEach(async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
});

test.describe("create and complete a QMS report as a state user", () => {
  test("create a QMS report as a state user", async ({ page }) => {
    await navigateToAddEditReportModal(
      page,
      reportSpecificData.startReportButtonName
    );
    await fillAddEditReportModal(page);
    await assertReportIsCreated(page, testModalData);
  });

  test("complete a QMS report as a state user", async ({ page }) => {
    const reportBtn = page.getByRole("cell", { name: "test" }).last();
    await reportBtn.click();
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
