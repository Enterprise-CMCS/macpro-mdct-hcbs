import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "Critical Incident Report",
  yearSelect: "Select the critical incident reporting year",
  shortName: "CICM",
  sampleName: "HCBS CICM Report for 2026",
};

export const CicmOptions = (): AddEditReportModalOptions => ({
  verbiage: verbiage,
  reportOptions: {},
  optionsElements: null,
  parseFormDataOptions: () => ({}),
});
