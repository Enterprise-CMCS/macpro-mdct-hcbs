import { ReportType } from "../types/reports";
import { qmsReportTemplate as qmsReportTemplate2026 } from "./2026/qms/qms";
import { tacmReportTemplate as tacmReportTemplate2026 } from "./2026/tacm/tacm";
import { ciReportTemplate as ciReportTemplate2026 } from "./2026/ci/ci";
import { pcpReportTemplate as pcpReportTemplate2026 } from "./2026/pcp/pcp";
import { wwlReportTemplate as wwlReportTemplate2026 } from "./2026/wwl/wwl";
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
    const getTemplateCall = () => getReportTemplate(ReportType.CI, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (CI report)", () => {
    expect(getReportTemplate(ReportType.CI, 2026)).toBe(ciReportTemplate2026);
  });

  it("should throw an error if the requested year is not available (PCP report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.PCP, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (PCP report)", () => {
    expect(getReportTemplate(ReportType.PCP, 2026)).toBe(pcpReportTemplate2026);
  });

  it("should throw an error if the requested year is not available (WWL report)", () => {
    const getTemplateCall = () => getReportTemplate(ReportType.WWL, 2025);
    expect(getTemplateCall).toThrow("not implemented");
  });

  it("should return the template for the exact requested year, if one exists (WWL report)", () => {
    expect(getReportTemplate(ReportType.WWL, 2026)).toBe(wwlReportTemplate2026);
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
