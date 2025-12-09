import { expect, Page } from "@playwright/test";

export const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
  cahpsSurveyOption: "No",
  nciiddSurveyOption: "No",
  nciadSurveyOption: "No",
  pomSurveyOption: "No",
};

export const fillAddEditReportModal = async (page: Page, reportData: any) => {
  const addReportHeading = page.getByRole("heading", {
    name: reportData.modalHeading,
  });
  await expect(addReportHeading).toBeVisible();
  const setReportNameInput = page.getByRole("textbox", {
    name: reportData.reportNameInputHeading,
  });

  await setReportNameInput.fill(
    testModalData.reportName + testModalData.datetime
  );

  const addEditReportButton = page.getByRole("button", {
    name: "Start new",
  });
  await addEditReportButton.click();
};

export const navigateToReportHome = async (page: Page, name: string) => {
  await page.goto("/");
  const reportButton = page.getByRole("link", {
    name,
  });
  await reportButton.click();
};

export const navigateToAddEditReportModal = async (
  page: Page,
  name: string
) => {
  const startReportButton = page.getByRole("button", {
    name,
  });
  await startReportButton.click();
};

export const assertReportIsCreated = async (
  page: Page,
  data: typeof testModalData
) => {
  const table = page.getByRole("table");
  await expect(table).toBeVisible({ timeout: 30000 });
  await expect(table.getByText(data.reportName + data.datetime)).toBeVisible({
    timeout: 10000,
  });
};

export const enterReport = async (page: Page, data: typeof testModalData) => {
  const editReportButton = page.getByLabel(
    "Edit " + data.reportName + data.datetime + " report",
    { exact: true }
  );
  await editReportButton.click();
};

export const completeGeneralInfo = async (page: Page) => {
  await page.getByRole("textbox", { name: "Contact name" }).fill("test name");

  await page
    .getByRole("textbox", {
      name: "Contact email address",
    })
    .fill("mail@mail.com");
};

export const submitReport = async (reportType: string, page: Page) => {
  const submitButton = page.getByRole("button", {
    name: "Submit " + reportType + " Report",
  });
  await submitButton.waitFor({ state: "visible", timeout: 15000 });
  await submitButton.click();

  // Wait for confirmation modal
  await expect(page.getByText("Are you sure you want to")).toBeVisible({
    timeout: 10000,
  });

  const confirmButton = page.getByRole("button", {
    name: "Submit " + reportType + " Report",
    exact: true,
  });
  await confirmButton.click();

  // Increased timeout for submission processing
  await expect(page.getByText("Successfully Submitted")).toBeVisible({
    timeout: 30000,
  });
};

//only works with measures that allows cms reporting
export const notReporting = async (measure: string, page: Page) => {
  await page.getByRole("row", { name: measure }).getByRole("link").click();

  // Wait for the radio button to be visible
  const cmsReportingRadio = page.getByLabel("No, CMS is reporting");
  await cmsReportingRadio.waitFor({ state: "visible", timeout: 10000 });
  await cmsReportingRadio.check();

  // Wait for form to process the selection
  await page.waitForTimeout(1500);

  const completeButton = page.getByRole("button", { name: "Complete measure" });
  await expect(completeButton).toBeEnabled({ timeout: 15000 });
  await completeButton.click();

  const returnButton = page.getByRole("button", { name: "Return to Required" });
  await returnButton.waitFor({ state: "visible", timeout: 10000 });
  await returnButton.click();
};
