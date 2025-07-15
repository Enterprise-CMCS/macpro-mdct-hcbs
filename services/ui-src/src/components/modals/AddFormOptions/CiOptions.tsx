import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "Critical Incident Report",
  yearSelect: "Select the critical incident reporting year",
  shortName: "CI",
  sampleName: "HCBS CI Report for 2026",
};

export const CiOptions = (): AddEditReportModalOptions => ({
  verbiage: verbiage,
  reportOptions: {},
  optionsElements: null,
  parseFormDataOptions: () => ({}),
});
