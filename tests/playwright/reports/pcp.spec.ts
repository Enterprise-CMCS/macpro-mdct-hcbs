import { Page, test } from "@playwright/test";
import { stateUserAuthPath } from "../utils/consts";
import {
  navigateToReportHome,
  navigateToAddEditReportModal,
  fillAddEditReportModal,
  assertReportIsCreated,
  testModalData,
  completeGeneralInfo,
  submitReport,
} from "./../utils/reportUtils";

test.use({ storageState: stateUserAuthPath });

const reportSpecificData = {
  reportButtonName: "Enter PCP Report online",
  startReportButtonName: "Start Person-Centered Planning Report",
  modalHeading: "Add new Person-Centered Planning Report",
  reportNameInputHeading: "Person-Centered Planning Report Name",
};

const fillPCPForm = async (page: Page) => {
  await page.getByRole("textbox", { name: "Numerator" }).fill("1");
  await page.getByRole("textbox", { name: "Denominator" }).fill("1");
  await page
    .getByRole("radiogroup", { name: "What sampling methodology was used?" })
    .getByLabel("Entire population")
    .check();
  await page
    .getByRole("radiogroup", {
      name: "Did you follow, with no variance, the most current technical specifications?",
    })
    .getByLabel("Yes")
    .check();
};

test.beforeEach(async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
});

test.describe("create and complete a QMS report as a state user", () => {
  test("create a PCP report as a state user", async ({ page }) => {
    await navigateToAddEditReportModal(
      page,
      reportSpecificData.startReportButtonName
    );
    await fillAddEditReportModal(page, reportSpecificData);
    await assertReportIsCreated(page, testModalData);
  });
  test("complete a PCP report as a state user", async ({ page }) => {
    //get the last element in the table
    const reportBtn = page.getByRole("cell", { name: "test" }).last();
    await reportBtn.click();

    await completeGeneralInfo(page);
    await page
      .getByRole("radiogroup", {
        name: "Does this report cover all the programs that are required under the relevant authorities?",
      })
      .getByLabel("Yes")
      .check();
    await page.getByRole("button", { name: "Continue" }).click();
    await fillPCPForm(page);
    await page.getByRole("button", { name: "Continue" }).click();
    await fillPCPForm(page);
    await page.getByRole("button", { name: "Continue" }).click();
    await submitReport("PCP", page);
  });
});
