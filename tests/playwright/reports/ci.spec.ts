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
  reportButtonName: "Enter CI Report online",
  startReportButtonName: "Start Critical Incident Report",
  modalHeading: "Add new Critical Incident Report",
  reportNameInputHeading: "Critical Incident Report Name",
};

test.beforeEach(async ({ page }) => {
  // mock LD SDK response
  await page.route(/clientsdk\.launchdarkly\.us/, async (route) => {
    await route.fulfill({
      json: {
        isCiReportActive: {
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

test("create a CI report as a state user", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await navigateToAddEditReportModal(
    page,
    reportSpecificData.startReportButtonName
  );
  await fillAddEditReportModal(page, reportSpecificData);
  await assertReportIsCreated(page, testModalData);
});
