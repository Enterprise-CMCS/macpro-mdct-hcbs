import {
  isReportOptions,
  validateReportPayload,
  validateReportEditPayload,
} from "../reportValidation";
import {
  validReport,
  missingStateReport,
  incorrectStatusReport,
  incorrectTypeReport,
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

describe("Test validateReportEditPayload function with valid report", () => {
  it("successfully strips out any non-editable fields", async () => {
    const validatedData = await validateReportEditPayload(validReport);
    expect(validatedData).toEqual({ name: validReport.name });
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

describe("isReportOptions", () => {
  const buildValidReportOptions = (): any => ({
    name: "mock name",
    year: 2026,
    options: {
      cahps: true,
      nciidd: false,
      nciad: true,
      pom: false,
    },
  });

  it("should accept a complete ReportOptions object", () => {
    const obj = buildValidReportOptions();
    expect(isReportOptions(obj)).toBe(true);
  });

  it("should accept an object with missing options", () => {
    const obj = buildValidReportOptions();
    obj.options = {};
    expect(isReportOptions(obj)).toBe(true);
  });

  function* generateInvalidReportOptions() {
    let obj = undefined;
    yield { obj, reason: "are undefined" };

    obj = buildValidReportOptions();
    delete obj.name;
    yield { obj, reason: "have no name" };

    obj = buildValidReportOptions();
    obj.name = 42;
    yield { obj, reason: "have a name of the wrong type" };

    obj = buildValidReportOptions();
    delete obj.year;
    yield { obj, reason: "have no year" };

    obj = buildValidReportOptions();
    obj.year = "2026";
    yield { obj, reason: "have a year of the wrong type" };

    obj = buildValidReportOptions();
    delete obj.options;
    yield { obj, reason: "have no options" };

    obj = buildValidReportOptions();
    obj.options = true;
    yield { obj, reason: "have options of the wrong type" };

    obj = buildValidReportOptions();
    obj.extraProp = "unexpected";
    yield { obj, reason: "have unexpected properties at the root level" };

    obj = buildValidReportOptions();
    obj.options.cahps = "true";
    yield { obj, reason: "have options.cahps of the wrong type" };

    obj = buildValidReportOptions();
    obj.options.nciidd = "false";
    yield { obj, reason: "have options.nciidd of the wrong type" };

    obj = buildValidReportOptions();
    obj.options.nciad = 17;
    yield { obj, reason: "have options.nciad of the wrong type" };

    obj = buildValidReportOptions();
    obj.options.pom = [];
    yield { obj, reason: "have options.pom of the wrong type" };

    obj = buildValidReportOptions();
    obj.options.extraProp = true;
    yield { obj, reason: "have unexpected properties in the options object" };
  }

  for (let { obj, reason } of generateInvalidReportOptions()) {
    it(`should reject report options which ${reason}`, () => {
      expect(isReportOptions(obj)).toBe(false);
    });
  }
});
