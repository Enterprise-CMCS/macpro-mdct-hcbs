import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "CICM Report",
  yearSelect: "Select the CICM measurement year.",
  shortName: "CICM",
  sampleName: "HCBS CICM Measurement Year 2026",
};

export const CiOptions = (): AddEditReportModalOptions => ({
  verbiage: verbiage,
  reportOptions: {},
  optionsElements: null,
  parseFormDataOptions: () => ({}),
});
