import { validateUpdateReportPayload } from "../reportValidation";
import {
  validReport,
  missingStateReport,
  incorrectStatusReport,
  incorrectTypeReport,
  invalidMeasureTemplatesReport,
  invalidMeasureLookupReport,
  invalidFormPageReport,
  invalidParentPageReport,
  invalidRadioCheckedChildrenReport,
} from "./mockReport";

describe("Test validateUpdateReportPayload function with valid report", () => {
  it("successfully validates a valid report object", async () => {
    const validatedData = await validateUpdateReportPayload(validReport);
    expect(validatedData).toEqual(validReport);
  });
});

describe("Test invalid reports", () => {
  it("throws an error when validating a report with missing state", () => {
    expect(async () => {
      await validateUpdateReportPayload(missingStateReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating a report with incorrect status", () => {
    expect(async () => {
      await validateUpdateReportPayload(incorrectStatusReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating a report with incorrect report type", () => {
    expect(async () => {
      await validateUpdateReportPayload(incorrectTypeReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid measure templates", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidMeasureTemplatesReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid measure lookup object", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidMeasureLookupReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid form page object", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidFormPageReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid parent page object", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidParentPageReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid radio element checked children object", () => {
    expect(async () => {
      await validateUpdateReportPayload(invalidRadioCheckedChildrenReport);
    }).rejects.toThrow();
  });
});
