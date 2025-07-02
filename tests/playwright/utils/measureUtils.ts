import { expect, Page } from "@playwright/test";

export const completeAndReturn = async (page: Page) => {
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

export const completeLTSS1 = async (page: Page) => {
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

export const completeLTSS2 = async (page: Page) => {
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
