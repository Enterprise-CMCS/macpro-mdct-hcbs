import { ReportType } from "../types/reports";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms";
import { getReportTemplate } from "./yearlyFormSelection";

describe("Yearly Form Selection", () => {
  it("should return the first available template for any year prior to go-live", () => {
    expect(getReportTemplate(ReportType.QMS, 2025)).toBe(qmsReportTemplate2026);
  });

  it("should return the template for the exact requested year, if one exists", () => {
    expect(getReportTemplate(ReportType.QMS, 2026)).toBe(qmsReportTemplate2026);
  });

  it("should return the most recent template for any other requested year", () => {
    expect(getReportTemplate(ReportType.QMS, 2027)).toBe(qmsReportTemplate2026);
  });
});
