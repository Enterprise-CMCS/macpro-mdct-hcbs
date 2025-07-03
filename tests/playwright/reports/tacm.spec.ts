import { test } from "@playwright/test";
import { stateUserAuthPath } from "../utils/consts";
import {
  navigateToReportHome,
  navigateToAddEditReportModal,
  fillAddEditReportModal,
  assertReportIsCreated,
  testModalData,
} from "./../utils/reportUtils";

test.use({ storageState: stateUserAuthPath });

const reportSpecificData = {
  reportButtonName: "Enter TACM Report online",
  startReportButtonName: "Start Timely Access Compliance Measure Report",
  modalHeading: "Add new TACM Report",
  reportNameInputHeading: "TACM Report Name",
};

test("create a TACM report as a state user", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await navigateToAddEditReportModal(
    page,
    reportSpecificData.startReportButtonName
  );
  await fillAddEditReportModal(page, reportSpecificData);
  await assertReportIsCreated(page, testModalData);
});
