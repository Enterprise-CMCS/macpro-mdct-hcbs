import { test, expect, Page } from "@playwright/test";
import { stateUserAuthPath } from "./utils/consts";

test.use({ storageState: stateUserAuthPath });

const testModalData = {
  reportName: "test report name",
  datetime: new Date().getTime(),
  cahpsSurveyOption: "No",
  nciiddSurveyOption: "No",
  nciadSurveyOption: "No",
  pomSurveyOption: "No",
};
test("create a report as a state user", async ({ page }) => {
  await navigateToAddEditReportModal(page);
  await fillAddEditReportModal(page);
  await assertReportIsCreated(page, testModalData);
  await fillOutReport(page, testModalData);
});

const navigateToAddEditReportModal = async (page: Page) => {
  await page.goto("/");
  const qmsReportButton = page.getByRole("link", {
    name: "Enter QMS Report online",
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

const fillOutReport = async (page: Page, data: typeof testModalData) => {
  const editReportButton = page.getByLabel(
    "Edit " + data.reportName + data.datetime + " report",
    { exact: true }
  );
  await editReportButton.click();

  const contactTextbox = page.getByRole("textbox", { name: "Contact name" });
  await contactTextbox.fill("test name");

  const emailTextbox = page.getByRole("textbox", {
    name: "Contact email address",
  });
  await emailTextbox.fill("mail@mail.com");

  const continueButton = page.getByRole("button", { name: "Continue" });
  await continueButton.click();

  const measureButtons = await page.getByRole("link", { name: "Edit" }).all();

  // for (var i = 0; i < measureButtons.length; i++) {
  //   console.log(await measureButtons[i].innerText);
  //   await measureButtons[i].click();
  //   await page.getByRole("button", { name: "Return to Required" }).click();
  // }

  await fillLTSS1(page);
  await fillLTSS2(page);
  await fillLTSS6(page);
  await fillLTSS7(page);
  await fillLTSS8(page);

  await continueButton.click();
  await continueButton.click();
  await page.getByRole("button", { name: "Submit QMS Report" }).click();
  await page
    .getByRole("button", { name: "Submit QMS Report", exact: true })
    .click();
};

const fillLTSS1 = async (page: Page) => {
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
  await page.getByLabel("Performance Rates Denominator").fill("4");

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state performance target for this assessment?/i,
    })
    .nth(0)
    .fill("1");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(0)
    .fill("1");

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state performance target for this assessment?/i,
    })
    .nth(1)
    .fill("2");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(1)
    .fill("2");

  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(2)
    .fill("3", { force: true });

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state exclusion rate target for this assessment?/i,
    })
    .nth(0)
    .fill("3");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(3)
    .fill("4", { force: true });

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state exclusion rate target for this assessment?/i,
    })
    .nth(1)
    .fill("4");

  if (
    !(await page.getByRole("button", { name: "Complete section" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete section" }).click();
  await page.getByRole("button", { name: "Return to Measure" }).click();

  if (
    !(await page.getByRole("button", { name: "Complete measure" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};

const fillLTSS2 = async (page: Page) => {
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
  await page.getByLabel("Performance Rates Denominator").fill("4");

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state performance target for this assessment?/i,
    })
    .nth(0)
    .fill("1");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(0)
    .fill("1");

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state performance target for this assessment?/i,
    })
    .nth(1)
    .fill("2");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(1)
    .fill("2");

  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(2)
    .fill("3", { force: true });

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state exclusion rate target for this assessment?/i,
    })
    .nth(0)
    .fill("3");

  await page
    .getByRole("textbox", { name: /Numerator/i })
    .nth(3)
    .fill("4", { force: true });

  await page
    .getByRole("textbox", {
      name: /What is the 2028 state exclusion rate target for this assessment?/i,
    })
    .nth(1)
    .fill("4");

  if (
    !(await page.getByRole("button", { name: "Complete section" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete section" }).click();
  await page.getByRole("button", { name: "Return to Measure" }).click();

  if (
    !(await page.getByRole("button", { name: "Complete measure" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};

const fillLTSS6 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-6" }).getByRole("link").click();
  await page.getByLabel("No, CMS is reporting").check();

  if (
    !(await page.getByRole("button", { name: "Complete measure" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};
const fillLTSS7 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-7" }).getByRole("link").click();
  await page.getByLabel("No, CMS is reporting").check();

  if (
    !(await page.getByRole("button", { name: "Complete measure" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};
const fillLTSS8 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-8" }).getByRole("link").click();
  await page.getByLabel("No, CMS is reporting").check();

  if (
    !(await page.getByRole("button", { name: "Complete measure" }).isDisabled())
  )
    await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to Required" }).click();
};
