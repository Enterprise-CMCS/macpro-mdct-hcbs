import { validateReportPayload } from "../reportValidation";
import {
  validReport,
  missingStateReport,
  incorrectStatusReport,
  incorrectTypeReport,
  invalidMeasureTemplatesReport,
  invalidMeasureLookupReport,
  invalidFormPageReport,
  invalidMeasurePageReport,
  invalidParentPageReport,
  invalidRadioCheckedChildrenReport,
  invalidPageElementType,
} from "./mockReport";

describe("Test validateReportPayload function with valid report", () => {
  it("successfully validates a valid report object", async () => {
    const validatedData = await validateReportPayload(validReport);
    expect(validatedData).toEqual(validReport);
  });
});

describe("Test invalid reports", () => {
  it("throws an error when validating a report with missing state", () => {
    expect(async () => {
      await validateReportPayload(missingStateReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating a report with incorrect status", () => {
    expect(async () => {
      await validateReportPayload(incorrectStatusReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating a report with incorrect report type", () => {
    expect(async () => {
      await validateReportPayload(incorrectTypeReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid measure templates", () => {
    expect(async () => {
      await validateReportPayload(invalidMeasureTemplatesReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid measure lookup object", () => {
    expect(async () => {
      await validateReportPayload(invalidMeasureLookupReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid form page object", () => {
    expect(async () => {
      await validateReportPayload(invalidFormPageReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid measure page object", () => {
    expect(async () => {
      await validateReportPayload(invalidMeasurePageReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid parent page object", () => {
    expect(async () => {
      await validateReportPayload(invalidParentPageReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid radio element checked children object", () => {
    expect(async () => {
      await validateReportPayload(invalidRadioCheckedChildrenReport);
    }).rejects.toThrow();
  });
  it("throws an error when validating invalid page element type", () => {
    expect(async () => {
      await validateReportPayload(invalidPageElementType);
    }).rejects.toThrow();
  });
});
