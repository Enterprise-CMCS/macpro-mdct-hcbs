import { ReportType } from "../types/reports";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms";
import { getReportTemplate } from "./yearlyFormSelection";

describe("Yearly Form Selection", () => {
  it("should throw an error if the requested year is not available", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.QMS, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists", () => {
    expect(getReportTemplate(ReportType.QMS, 2026)).toBe(qmsReportTemplate2026);
  });
});
