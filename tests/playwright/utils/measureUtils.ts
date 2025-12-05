import { expect, Page } from "@playwright/test";

export const quickFillFields = async (page: Page, label: string) => {
  //find all textboxes that contains the label passed in
  const fields = await page.getByRole("textbox", { name: label }).all();

  //loops through them all and only fill the ones that are enabled
  for (var i = 0; i < fields.length; i++)
    if (await fields[i].isEditable()) await fields[i].fill((i + 1).toString());
};

export const completeAndReturn = async (page: Page) => {
  expect(page.getByRole("button", { name: "Complete section" })).toBeEnabled();
  await page.getByRole("button", { name: "Complete section" }).click();
  await page.getByRole("button", { name: "Return to" }).click();

  expect(page.getByRole("button", { name: "Complete measure" })).toBeEnabled();
  await page.getByRole("button", { name: "Complete measure" }).click();
  await page.getByRole("button", { name: "Return to" }).click();
};

export const completeLTSS1 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-1" }).getByRole("link").click();

  await page.getByLabel("National Committee for").check();
  await page
    .getByLabel(
      "Did you follow, with no variance, the most current technical specifications? Yes"
    )
    .check();
  await page
    .getByLabel("Were the reported measure results audited or validated? No")
    .check();

  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  await page.getByLabel("Which programs and waivers").fill("All of them");

  await page.getByLabel("Performance Rates Denominator").fill("4");
  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  await quickFillFields(page, "Numerator");

  await quickFillFields(page, "What is the 2028 state performance target");

  await completeAndReturn(page);
};

export const completeLTSS2 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-2" }).getByRole("link").click();

  await page.getByLabel("Centers for Medicare").check();
  await page
    .getByLabel(
      "Did you follow, with no variance, the most current technical specifications? Yes"
    )
    .check();
  await page
    .getByLabel("Were the reported measure results audited or validated? No")
    .check();

  await page.getByLabel("Managed Care (MLTSS)").check();
  await page.locator('button[name="Edit MLTSS"]').click();

  await page.getByLabel("Which programs and waivers").fill("All of them");

  await page.getByLabel("Performance Rates Denominator").fill("4");
  await page.getByLabel("Exclusion Rates Denominator").fill("4");

  await quickFillFields(page, "Numerator");

  await quickFillFields(page, "What is the 2028 state performance target");

  await completeAndReturn(page);
};

export const completeLTSS6 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-6" }).getByRole("link").click();
  await page.getByLabel("Yes, the state is reporting").check();
  await page
    .getByLabel(
      "Did you follow, with no variance, the most current technical specifications? Yes"
    )
    .check();
  await page
    .getByLabel("Were the reported measure results audited or validated? No")
    .check();
  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  await page.getByLabel("Which programs and waivers").fill("All of them");

  await quickFillFields(page, "Denominator");
  await quickFillFields(page, "Numerator");
  await quickFillFields(page, "What is the 2028 state performance target");

  await completeAndReturn(page);
};

export const completeLTSS7 = async (page: Page) => {
  await page.getByRole("row", { name: "LTSS-7" }).getByRole("link").click();
  await page.getByLabel("Yes, the state is reporting").check();

  await page
    .getByLabel(
      "Did you follow, with no variance, the most current technical specifications? Yes"
    )
    .check();
  await page
    .getByLabel("Were the reported measure results audited or validated? No")
    .check();

  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  await page.getByLabel("Which programs and waivers").fill("All of them");

  await page.getByLabel("What is the 2028 state").fill("1");
  await page
    .getByLabel("Count of Successful Discharges to the Community", {
      exact: true,
    })
    .fill("2");
  await page.getByLabel("Facility Admission Count").fill("3");
  await page.getByLabel("Expected Count of Successful").fill("4");
  await page.getByLabel("Multi-Plan Population Rate").fill("5");
  await page
    .getByLabel("Risk Adjusted Rate for Minimizing Length of Facility Stay")
    .fill("6");
  await completeAndReturn(page);
};

export const completeFASI1 = async (page: Page) => {
  await page.getByRole("row", { name: "FASI-1" }).getByRole("link").click();

  await page
    .getByLabel(
      "Did you follow, with no variance, the most current technical specifications? Yes"
    )
    .check();
  await page
    .getByLabel("Were the reported measure results audited or validated? No")
    .check();

  await page.getByLabel("Fee-For-Service (FFS LTSS)").check();
  await page.locator('button[name="Edit FFS"]').click();

  await page.getByLabel("Which programs and waivers").fill("All of them");

  await page.getByLabel("What is the 2028 state").fill("1");
  await page.getByLabel("Numerator").fill("2");
  await page.getByLabel("Denominator").fill("3");

  await completeAndReturn(page);
};
