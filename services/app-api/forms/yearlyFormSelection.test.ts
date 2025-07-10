import { ReportType } from "../types/reports";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms/qms";
import { tacmReportTemplate as tacmReportTemplate2026 } from "./2026/tacm/tacm";
import { cicmReportTemplate as cicmReportTemplate2026 } from "./2026/cicm/cicm";
import { getReportTemplate } from "./yearlyFormSelection";

describe("Yearly Form Selection", () => {
  it("should throw an error if the requested year is not available (QMS report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.QMS, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (QMS report)", () => {
    expect(getReportTemplate(ReportType.QMS, 2026)).toBe(qmsReportTemplate2026);
  });

  it("should throw an error if the requested year is not available (TACM report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.TACM, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (TACM report)", () => {
    expect(getReportTemplate(ReportType.TACM, 2026)).toBe(
      tacmReportTemplate2026
    );
  });

  it("should throw an error if the requested year is not available (CI report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.CICM, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (CI report)", () => {
    expect(getReportTemplate(ReportType.CICM, 2026)).toBe(
      cicmReportTemplate2026
    );
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
