import { expect, Page } from "@playwright/test";

export const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
  cahpsSurveyOption: "No",
  nciiddSurveyOption: "No",
  nciadSurveyOption: "No",
  pomSurveyOption: "No",
};

export const navigateToAddEditReportModal = async (page: Page) => {
  const startQmsReportButton = page.getByRole("button", {
    name: "Start Quality Measure Set Report",
  });
  await startQmsReportButton.click();
};

export const fillAddEditReportModal = async (page: Page) => {
  const addQMSReportHeading = page.getByRole("heading", {
    name: "Add new Quality Measure Set Report",
  });
  await expect(addQMSReportHeading).toBeVisible();
  const qmsSetReportNameInput = page.getByRole("textbox", {
    name: "Quality Measure Set Report Name",
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

export const submitReport = async (page: Page) => {
  await page.getByRole("button", { name: "Submit QMS Report" }).click();

  //wait until the modal is visible by checking for it's header before proceeding
  await expect(page.getByText("Are you sure you want to")).toBeVisible();
  await page
    .getByRole("button", { name: "Submit QMS Report", exact: true })
    .click();

  //checks that the successfully submitted page is showing
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
  await page.getByRole("button", { name: "Return to Required" }).click();
};
