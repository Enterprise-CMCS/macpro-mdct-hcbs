import { ReportType } from "../types/reports";
import { xyzReportTemplate as xyzReportTemplate2026 } from "./2026/xyz/xyz";
import { getReportTemplate } from "./yearlyFormSelection";

describe("Yearly Form Selection", () => {
  it("should throw an error if the requested year is not available (XYZ report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.XYZ, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (XYZ report)", () => {
    expect(getReportTemplate(ReportType.XYZ, 2026)).toBe(xyzReportTemplate2026);
  });
});

describe("get error message for unsupported report type", () => {
  it("should throw an error for unsupported report type", () => {
    const unsupportedReportType = "UnsupportedReportType" as ReportType;
    const getTemplateCall = () =>
      getReportTemplate(unsupportedReportType, 2026);
    expect(getTemplateCall).toThrow(
      `Not implemented - getReportTemplate for ReportType ${unsupportedReportType}`
    );
  });
});
