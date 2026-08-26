import { test } from "@playwright/test";
import { stateUserAuthPath } from "../utils/consts";
import {
  navigateToReportHome,
  navigateToAddEditReportModal,
  fillAddEditReportModal,
  assertReportIsCreated,
  testModalData,
} from "../utils/reportUtils";

test.use({ storageState: stateUserAuthPath });

const reportSpecificData = {
  reportButtonName: "Enter TACM Report online",
  startReportButtonName: "Start Timely Access Compliance Measure Report",
  modalHeading: "Add new TACM Report",
  reportNameInputHeading: "TACM Report Name",
};

test.beforeEach(async ({ page }) => {
  // mock LD SDK response
  await page.route(/clientsdk\.launchdarkly\.us/, async (route) => {
    await route.fulfill({
      json: {
        isTacmReportActive: {
          version: 60,
          flagVersion: 8,
          value: true,
          variation: 1,
          trackEvents: false,
        },
      },
    });
  });

  // stream seems to be constantly resetting and grabbing the real values; abort so it stops trying to re-fetch
  await page.route(/clientstream\.launchdarkly\.us/, async (route) => {
    await route.abort();
  });
});

test("create a TACM report as a state user", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await navigateToAddEditReportModal(
    page,
    reportSpecificData.startReportButtonName
  );
  await fillAddEditReportModal(page, reportSpecificData);
  await assertReportIsCreated(page, testModalData);
});
