import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "TACM Report",
  yearSelect: "Select the TACM measurement year.",
  shortName: "TACM",
  sampleName: "HCBS TACM Report for 2026",
};

export const TacmOptions = (): AddEditReportModalOptions => ({
  verbiage: verbiage,
  reportOptions: {},
  optionsElements: null,
  parseFormDataOptions: () => ({}),
});
