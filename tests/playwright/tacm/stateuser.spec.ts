import { test, expect, Page } from "@playwright/test";
import { stateUserAuthPath } from "../utils/consts";

test.use({ storageState: stateUserAuthPath });

const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
};

const reportSpecificData = {
  reportButtonName: "Enter TACM Report online",
  startReportButtonName: "Start Timely Access Compliance Measure Report",
  modalHeading: "Add new TACM Report",
  reportNameInputHeading: "TACM Report Name",
};

test("create a TACM report as a state user", async ({ page }) => {
  await navigateToAddEditReportModal(page);
  await fillAddEditReportModal(page);
  await assertReportIsCreated(page, testModalData);
});

const navigateToAddEditReportModal = async (page: Page) => {
  await page.goto("/");
  const reportButton = page.getByRole("link", {
    name: reportSpecificData.reportButtonName,
  });
  await reportButton.click();
  const startReportButton = page.getByRole("button", {
    name: reportSpecificData.startReportButtonName,
  });
  await startReportButton.click();
};

const fillAddEditReportModal = async (page: Page) => {
  const addReportHeading = page.getByRole("heading", {
    name: reportSpecificData.modalHeading,
  });
  await expect(addReportHeading).toBeVisible();
  const setReportNameInput = page.getByRole("textbox", {
    name: reportSpecificData.reportNameInputHeading,
  });

  await setReportNameInput.fill(
    testModalData.reportName + testModalData.datetime
  );

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
