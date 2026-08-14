import { expect, Page } from "@playwright/test";

export const testModalData = {
  reportName: "test report name",
  datetime: Date.now(),
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

  testModalData.datetime = Date.now();

  await setReportNameInput.fill(
    testModalData.reportName + testModalData.datetime
  );

  const addEditReportButton = page.getByRole("button", {
    name: "Start new",
  });
  await addEditReportButton.click();

  const modal = page.locator(".chakra-modal__content-container");
  const modalClosed = await modal
    .waitFor({ state: "hidden", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!modalClosed) {
    const closeButton = modal.getByRole("button", { name: /close/i });
    if ((await closeButton.count()) > 0) {
      await closeButton.first().click();
    } else {
      await page.keyboard.press("Escape");
    }
  }

  await expect(modal).toHaveCount(0);
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
  await expect(table.getByText(data.reportName + data.datetime)).toBeVisible();
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
  await page
    .getByRole("button", { name: "Submit " + reportType + " Report" })
    .click();

  await expect(page.getByText("Are you sure you want to")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Submit " + reportType + " Report",
      exact: true,
    })
    .click();

  await expect(page.getByText("Successfully Submitted")).toBeVisible();
};

//only works with measures that allows cms reporting
export const notReporting = async (measure: string, page: Page) => {
  await page.getByRole("row", { name: measure }).getByRole("link").click();
  await page.getByLabel("No, CMS is reporting").check();

  expect(
    await page.getByRole("button", { name: "Complete measure" })
  ).toBeEnabled();

  await page.getByRole("button", { name: "Complete measure" }).click();
};
