import { describe, expect, it } from "vitest";
import {
  isReportOptions,
  validateReportPayload,
  validateReportEditPayload,
} from "../reportValidation";
import {
  incorrectStatusReport,
  incorrectTypeReport,
  invalidFormPageReport,
  invalidMeasurePageReport,
  invalidPageElementType,
  invalidParentPageReport,
  invalidRadioCheckedChildrenReport,
  missingStateReport,
  reportWithKeyActivityTable,
  reportWithListInputNoHelperText,
  validQipReport,
  validReport,
} from "./mockReport";

describe("reportValidation", () => {
  describe("valid report scenarios", () => {
    it("should accept a valid report object", async () => {
      const validatedData = await validateReportPayload(validReport);
      expect(validatedData).toEqual(validReport);
    });

    it("should accept a QIP with measureTargetMapping", async () => {
      const validatedData = await validateReportPayload(validQipReport);
      expect(validatedData).toEqual(validQipReport);
    });

    it("should accept a report with a ListInput element that has no helperText", async () => {
      const validatedData = await validateReportPayload(
        reportWithListInputNoHelperText
      );
      expect(validatedData).toBeDefined();
    });

    it("should accept a report with a KeyActivityTable element", async () => {
      const validatedData = await validateReportPayload(
        reportWithKeyActivityTable
      );
      expect(validatedData).toBeDefined();
    });

    it("should preserve answers for QIP measure table elements", async () => {
      const reportWithQipMeasureTableAnswer = structuredClone(validQipReport);
      const selectMeasuresPage = reportWithQipMeasureTableAnswer.pages.find(
        (page) => page.id === "select-measures" && "elements" in page
      );
      const selectMeasuresTable = selectMeasuresPage?.elements?.find(
        (element) => element.id === "select-measures-table"
      ) as { answer?: unknown[] } | undefined;

      selectMeasuresTable!.answer = [
        {
          pageId: "measure-targets-ltss-1-0",
          measureName: "LTSS-1",
          originalValues: { n: 5 },
        },
      ];

      const validatedData = await validateReportPayload(
        reportWithQipMeasureTableAnswer
      );

      const validatedSelectMeasuresPage = validatedData.pages.find(
        (page) => page.id === "select-measures"
      );
      const table = validatedSelectMeasuresPage?.elements?.find(
        (element) =>
          element.id === "select-measures-table" &&
          element.type === "qipMeasureTable"
      ) as { answer?: unknown[] } | undefined;

      expect(table?.answer).toEqual([
        {
          pageId: "measure-targets-ltss-1-0",
          measureName: "LTSS-1",
          originalValues: { n: 5 },
        },
      ]);
    });

    it("should strip out any non-editable fields", async () => {
      const validatedData = await validateReportEditPayload(validReport);
      expect(validatedData).toEqual({ name: validReport.name });
    });
  });

  describe("invalid report scenarios", () => {
    it("should reject a report with missing state", () => {
      expect(async () => {
        await validateReportPayload(missingStateReport);
      }).rejects.toThrow();
    });
    it("should reject a report with incorrect status", () => {
      expect(async () => {
        await validateReportPayload(incorrectStatusReport);
      }).rejects.toThrow();
    });
    it("should reject a report with incorrect report type", () => {
      expect(async () => {
        await validateReportPayload(incorrectTypeReport);
      }).rejects.toThrow();
    });
    it("should reject invalid form page object", () => {
      expect(async () => {
        await validateReportPayload(invalidFormPageReport);
      }).rejects.toThrow();
    });
    it("should reject invalid measure page object", () => {
      expect(async () => {
        await validateReportPayload(invalidMeasurePageReport);
      }).rejects.toThrow();
    });
    it("should reject invalid parent page object", () => {
      expect(async () => {
        await validateReportPayload(invalidParentPageReport);
      }).rejects.toThrow();
    });
    it("should reject invalid radio element checked children object", () => {
      expect(async () => {
        await validateReportPayload(invalidRadioCheckedChildrenReport);
      }).rejects.toThrow();
    });
    it("should reject invalid page element type", () => {
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
});
