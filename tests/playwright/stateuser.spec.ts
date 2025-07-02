import { test, expect, Page } from "@playwright/test";
import { stateUserAuthPath } from "./utils/consts";
import {
  completeGeneralInfo,
  enterReport,
  notReporting,
  submitReport,
  testModalData,
} from "./utils/reportUtils";

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
    await navigateToAddEditReportModal(page);
    await fillAddEditReportModal(page);
    await assertReportIsCreated(page, testModalData);
  });
  test("complete a report as a state user", async ({ page }) => {
    await completeReport(page, testModalData);
  });
});

const navigateToAddEditReportModal = async (page: Page) => {
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

const assertReportIsCreated = async (
  page: Page,
  data: typeof testModalData
) => {
  const table = page.getByRole("table");
  await expect(table).toBeVisible({ timeout: 30000 });
  await expect(table.getByText(data.reportName + data.datetime)).toBeVisible();
};

const completeReport = async (page: Page, data: typeof testModalData) => {
  await enterReport(page, data);
  await completeGeneralInfo(page);

  await page.getByRole("button", { name: "Continue" }).click();

  await completeLTSS1(page);
  await completeLTSS2(page);

  await notReporting("LTSS-6", page);
  await notReporting("LTSS-7", page);
  await notReporting("LTSS-8", page);

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await submitReport(page);
};

const completeLTSS1 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-1" }).getByRole("link").click();

  await page.getByLabel("National Committee for").check();
  await page
    .getByRole("radiogroup", { name: "Did you follow, with no" })
    .getByLabel("Yes")
    .check();
  await page
    .getByRole("radiogroup", { name: "Were the reported measure" })
    .getByLabel("No")
    .check();

  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  //fill FFS LTSS page
  await page.getByLabel("Which programs and waivers").fill("optional");

  //fill global denominator
  await page.getByLabel("Performance Rates Denominator").fill("4");
  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  //fill numerator
  for (var i = 0; i < 4; i++) {
    await page
      .getByRole("textbox", { name: /Numerator/i })
      .nth(i)
      .fill((i + 1).toString());
  }

  //fill performance target
  for (var i = 0; i < 2; i++) {
    await page
      .getByRole("textbox", {
        name: /What is the 2028 state performance target for this assessment?/i,
      })
      .nth(i)
      .fill((i + 1).toString());

    await page
      .getByRole("textbox", {
        name: /What is the 2028 state exclusion rate target for this assessment?/i,
      })
      .nth(i)
      .fill((i + 1).toString());
  }

  await completeAndReturn(page);
};

const completeLTSS2 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-2" }).getByRole("link").click();

  await page.getByLabel("National Committee for").check();
  await page
    .getByRole("radiogroup", { name: "Did you follow, with no" })
    .getByLabel("Yes")
    .check();
  await page
    .getByRole("radiogroup", { name: "Were the reported measure" })
    .getByLabel("No")
    .check();

  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  //fill FFS LTSS page
  await page.getByLabel("Which programs and waivers").fill("optional");

  //fill global denominator
  await page.getByLabel("Performance Rates Denominator").fill("4");
  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  //fill numerator
  for (var i = 0; i < 4; i++) {
    await page
      .getByRole("textbox", { name: /Numerator/i })
      .nth(i)
      .fill((i + 1).toString());
  }

  //fill performance target
  for (var i = 0; i < 2; i++) {
    await page
      .getByRole("textbox", {
        name: /What is the 2028 state performance target for this assessment?/i,
      })
      .nth(i)
      .fill((i + 1).toString());

    await page
      .getByRole("textbox", {
        name: /What is the 2028 state exclusion rate target for this assessment?/i,
      })
      .nth(i)
      .fill((i + 1).toString());
  }

  await completeAndReturn(page);
};

const completeAndReturn = async (page: Page) => {
  expect(
    await page.getByRole("button", { name: "Complete section" })
  ).toBeEnabled();
  await page.getByRole("button", { name: "Complete section" }).click();
  await page.getByRole("button", { name: "Return to Measure" }).click();

  expect(
    await page.getByRole("button", { name: "Complete measure" })
  ).toBeEnabled();
  await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};
