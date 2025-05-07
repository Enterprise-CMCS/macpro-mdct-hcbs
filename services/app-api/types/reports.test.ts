import { isReportOptions, isReportType } from "./reports";

describe("Report type utilities", () => {
  describe("isReportType", () => {
    it("should accept valid report types", () => {
      expect(isReportType("QMS")).toBe(true);
    });

    it("should reject unknown report types", () => {
      expect(isReportType("Colorado")).toBe(false);
    });
  });

  describe("isReportOptions", () => {
    const buildValidReportOptions = (): any => ({
      name: "mock name",
      year: 2026,
      options: {
        cahps: true,
        hciidd: false,
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
      obj.options.hciidd = "false";
      yield { obj, reason: "have options.hciidd of the wrong type" };

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
});
