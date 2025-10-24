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
  reportButtonName: "Enter PCP Report online",
  startReportButtonName: "Start Person-Centered Planning Report",
  modalHeading: "Add new Person-Centered Planning Report",
  reportNameInputHeading: "Person-Centered Planning Report Name",
};

test("create a PCP report as a state user", async ({ page }) => {
  await navigateToReportHome(page, reportSpecificData.reportButtonName);
  await navigateToAddEditReportModal(
    page,
    reportSpecificData.startReportButtonName
  );
  await fillAddEditReportModal(page, reportSpecificData);
  await assertReportIsCreated(page, testModalData);
});
