import { test, expect, Page } from "@playwright/test";
import { stateUserAuthPath } from "./utils/consts";

test.use({ storageState: stateUserAuthPath });

const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
  cahpsSurveyOption: "No",
  hciiddSurveyOption: "No",
  nciadSurveyOption: "No",
  pomSurveyOption: "No",
};
test("create a report as a state user", async ({ page }) => {
  await navigateToAddEditReportModal(page);
  await fillAddEditReportModal(page);
  await assertReportIsCreated(page, testModalData);
});

const navigateToAddEditReportModal = async (page: Page) => {
  await page.goto("/");
  const qmsReportButton = page.getByRole("button", {
    name: "Enter HCBS QMS online",
  });
  await qmsReportButton.click();
  const startQmsReportButton = page.getByRole("button", {
    name: "Start Quality Measure Set Report",
  });
  await startQmsReportButton.click();
};

const fillAddEditReportModal = async (page: Page) => {
  const addQMSReportHeading = page.getByRole("heading", {
    name: "Add new Quality Measure Set Report",
  });
  await expect(addQMSReportHeading).toBeVisible();
  const qmsSetReportNameInput = page.getByRole("textbox", {
    name: "QMS report name",
  });
  const cahpsRadioButton = page.getByRole("radiogroup", {
    name: "Does your state administer the HCBS CAHPS beneficiary survey?",
  });
  const hciiddRadioButton = page.getByRole("radiogroup", {
    name: "Does your state administer the HCI-IDD beneficiary survey?",
  });
  const nciadRadioButton = page.getByRole("radiogroup", {
    name: "Does your state administer the NCI-AD beneficiary survey?",
  });
  const pomRadioButton = page.getByRole("radiogroup", {
    name: "Does your state administer the POM beneficiary survey?",
  });
  await qmsSetReportNameInput.fill(
    testModalData.reportName + testModalData.datetime
  );
  await cahpsRadioButton.getByLabel(testModalData.cahpsSurveyOption).check();
  await hciiddRadioButton.getByLabel(testModalData.hciiddSurveyOption).check();
  await nciadRadioButton.getByLabel(testModalData.nciadSurveyOption).check();
  await pomRadioButton.getByLabel(testModalData.pomSurveyOption).check();
  const addEditReportButton = page.getByRole("button", {
    name: "Start new",
  });
  await addEditReportButton.click();
};

const assertReportIsCreated = async (
  page: Page,
  data: typeof testModalData
) => {
  const table = page.getByRole("table");
  await expect(table).toBeVisible({ timeout: 30000 });
  await expect(table.getByText(data.reportName + data.datetime)).toBeVisible();
};
