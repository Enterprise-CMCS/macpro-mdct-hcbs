import { expect, Page } from "@playwright/test";

export const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
  cahpsSurveyOption: "No",
  nciiddSurveyOption: "No",
  nciadSurveyOption: "No",
  pomSurveyOption: "No",
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
  await page
    .getByRole("button", { name: "Submit QMS Report", exact: true })
    .click({ timeout: 30000 });

  await page.getByRole("link", { name: "Leave form" }).click();
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
