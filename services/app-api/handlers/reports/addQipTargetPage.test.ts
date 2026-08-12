import assert from "node:assert";
import fs from "node:fs";
import { StatusCodes } from "../../libs/response-lib";
import {
  getReport as actualGetReport,
  putReport as actualPutReport,
} from "../../storage/reports";
import {
  ElementType,
  FormPageTemplate,
  MultiRateNdrTemplate,
  NumberFieldTemplate,
  ReportType,
} from "../../types/reports";
import { User } from "../../types/types";
import { addQipTargetPage } from "./addQipTargetPage";
import { buildReport } from "./buildReport";
import { getReportTemplate } from "../../forms/yearlyFormSelection";

// We want to test all years, so we need to find paths like
// `services/app-api/forms/2026/qip/qip.ts`. These tests should be executing
// from services/app-api as the root directory, so the next level is "forms"
const allFormYears = fs
  .readdirSync("./forms")
  .filter((name) => /^\d+$/.test(name))
  .map((name) => parseInt(name, 10));
assert.ok(allFormYears.includes(2026), "Couldn't find yearly form folders!");
const latestYear = allFormYears.at(-1)!;

jest.mock("../../storage/reports", () => ({
  getReport: jest.fn(),
  putReport: jest.fn(),
}));
const getReport = jest.mocked(actualGetReport);
const putReport = jest.mocked(actualPutReport);

/*
 * The code we're testing is very fragile.
 * It depends on specific element IDs, element order, and string contents,
 * across both the QIP and QMS reports.
 *
 * It's not realistic to make the code perfectly robust; we can't account
 * for all the ways the QIP and QMS report templates may change over time.
 * If they change in a way that causes this code to break,
 * its behavior at runtime may misbehave in ways that are hard to diagnose.
 *
 * That makes it very important for these unit tests to execute against
 * _real_ QIP and QMS reports, as created by the _actual_ buildReport() method.
 * This should move any breakages left: from runtime to merge time.
 */

const buildQip = async (year: number = latestYear) =>
  buildReport(ReportType.QIP, "CO", { name: "Mock QIP", year, options: {} }, {
    fullName: "Eric Garner",
    email: "mock@example.com",
  } as User);

const buildQms = async (year: number = latestYear) =>
  buildReport(
    ReportType.QMS,
    "CO",
    { name: "Mock QMS", year, options: { pom: true } },
    { fullName: "Breonna Taylor", email: "mock@example.com" } as User
  );

describe("addQipTargetPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return badRequest if given a non-QIP report", async () => {
    const response = await addQipTargetPage(await buildQms(), {});
    expect(response.statusCode).toBe(StatusCodes.BadRequest);
    expect(response.body).toBe(`"Report type must be QIP"`);
  });

  it.each([
    { body: null, reason: "missing" },
    { body: {}, reason: "incomplete" },
    { body: { measureId: 123 }, reason: "measureId wrong type" },
    {
      body: { measureId: "PCP-2", qmsReportId: 123 },
      reason: "qmsReportId wrong type",
    },
    {
      body: { measureId: "PCP-2", deliveryMethods: [1, 2, 3] },
      reason: "deliveryMethods wrong type",
    },
    {
      body: {
        measureId: "PCP-2",
        deliveryMethods: ["FFS"],
        rateIds: [1, 2, 3],
      },
      reason: "rates wrong type",
    },
  ])(
    "should return badRequest if given an invalid body: $reason",
    async ({ body }) => {
      const response = await addQipTargetPage(await buildQip(), body);
      expect(response.statusCode).toBe(StatusCodes.BadRequest);
      expect(response.body).toBe(`"Invalid request body"`);
    }
  );

  it.each([
    {
      body: {
        measureId: "invalid",
        deliveryMethods: ["FFS"],
        rates: ["perf-rate"],
      },
      reason: "measureId",
    },
    {
      body: {
        measureId: "PCP-2",
        deliveryMethods: ["oh", "FFS"],
        rates: ["perf-rate"],
      },
      reason: "deliveryMethodId",
    },
    {
      body: {
        measureId: "PCP-2",
        deliveryMethods: ["FFS"],
        rates: ["perforate"],
      },
      reason: "rateId",
    },
  ])(
    "should return badRequest if given a bad ID: $reason",
    async ({ body }) => {
      const response = await addQipTargetPage(await buildQip(), body);
      expect(response.statusCode).toBe(StatusCodes.BadRequest);
      expect(response.body).toBe(`"Request body contains an incorrect ID"`);
    }
  );

  it("should add a new Target page for a non-QMS measure", async () => {
    const targetInfo = {
      measureId: "PCP-2",
      deliveryMethods: ["FFS"],
      rates: ["perf-rate"],
    };
    const qipReport = await buildQip();
    const originalPageCount = qipReport.pages.length;

    const response = await addQipTargetPage(qipReport, targetInfo);

    // The new report should already be stored in the database
    expect(putReport).toHaveBeenCalled();
    const newPageArray = putReport.mock.calls[0][0].pages;
    expect(newPageArray).toHaveLength(originalPageCount + 1);

    // The response should be successful, and contain the correct data
    expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
    const { report, pageId, originalValues } = JSON.parse(response.body!);
    expect(pageId).toBe("measure-targets-PCP-2-0");
    expect(originalValues).toEqual({});
    const selectMeasuresTable = report.pages
      .find((p: any) => p.id === "select-measures")
      ?.elements?.find((el: any) => el.id === "select-measures-table");
    expect(selectMeasuresTable?.answer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pageId: "measure-targets-PCP-2-0",
          measureName: expect.any(String),
        }),
      ])
    );
    const newPage = report.pages.find(
      (p: any) => p.id === pageId
    ) as FormPageTemplate;
    expect(newPage).toBeDefined();
  });

  it("should always give the new page a unique ID", async () => {
    const targetInfo = {
      measureId: "PCP-2",
      deliveryMethods: ["FFS"],
      rates: ["perf-rate"],
    };
    const qipReport = await buildQip();
    qipReport.pages.push({ id: "measure-targets-PCP-2-0" } as any);
    qipReport.pages.push({ id: "measure-targets-PCP-2-1" } as any);
    qipReport.pages.push({ id: "measure-targets-PCP-2-3" } as any);

    const response = await addQipTargetPage(qipReport, targetInfo);

    // Should fill in the page ID gap
    expect(JSON.parse(response.body!).pageId).toBe("measure-targets-PCP-2-2");
  });

  it("should return badRequest if given a QMS report ID for a non-QMS measure", async () => {
    const targetInfo = {
      measureId: "PCP-2",
      qmsReportId: "qms-123",
      deliveryMethods: ["FFS"],
      rates: ["perf-rate"],
    };
    const qipReport = await buildQip();

    const response = await addQipTargetPage(qipReport, targetInfo);

    expect(response.statusCode).toBe(StatusCodes.BadRequest);
    expect(response.body).toContain("PCP-2 is not a QMS measure");

    expect(getReport).not.toHaveBeenCalled();
  });

  it("should return notFound if given a nonexistent QMS report ID", async () => {
    const targetInfo = {
      measureId: "LTSS-1",
      qmsReportId: "qms-123",
      deliveryMethods: ["FFS"],
      rates: ["assess-of-core"],
    };
    const qipReport = await buildQip();

    getReport.mockResolvedValueOnce(undefined);

    const response = await addQipTargetPage(qipReport, targetInfo);

    expect(response.statusCode).toBe(StatusCodes.NotFound);
    expect(response.body).toContain("qms-123 does not exist");
  });

  it("should add a new Target page, copying baseline values from QMS", async () => {
    const targetInfo = {
      measureId: "LTSS-1",
      qmsReportId: "qms-123",
      deliveryMethods: ["FFS"],
      rates: ["assess-of-core"],
    };
    const qipReport = await buildQip();

    const qmsReport = await buildQms();
    const qmsRate = qmsReport.pages
      .find((p) => p.id === "FFS-1")!
      .elements!.find((e) => e.id === "measure-rates-assessment");
    (qmsRate as MultiRateNdrTemplate).answer = {
      denominator: 50,
      rates: [{ id: "assess-of-core", numerator: 21, rate: 0.42 }],
    };
    getReport.mockResolvedValueOnce(qmsReport);

    const response = await addQipTargetPage(qipReport, targetInfo);

    // The QIP report should have been pulled from the database
    expect(getReport).toHaveBeenCalledWith(ReportType.QMS, "CO", "qms-123");

    // The response should be successful, and contain the correct data
    expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
    const { report, pageId, originalValues } = JSON.parse(response.body!);
    expect(pageId).toBe("measure-targets-LTSS-1-0");
    expect(originalValues).toEqual({ "FFS-assess-of-core": 0.42 });
    const qipRate = report.pages
      .find((p: any) => p.id === pageId)
      .elements.find((e: any) => e.id === "baseline-FFS-assess-of-core");
    expect((qipRate as NumberFieldTemplate).answer).toBe(0.42);
  });

  it("should silently continue if told to copy a QMS value that does not exist", async () => {
    const targetInfo = {
      measureId: "LTSS-1",
      qmsReportId: "qms-123",
      // We ask for BOTH delivery methods
      deliveryMethods: ["FFS", "MLTSS"],
      rates: ["assess-of-core"],
    };
    const qipReport = await buildQip();

    // But the QMS report only has MLTSS data
    const qmsReport = await buildQms();
    const qmsRate = qmsReport.pages
      .find((p) => p.id === "MLTSS-1")!
      .elements!.find((e) => e.id === "measure-rates-assessment");
    (qmsRate as MultiRateNdrTemplate).answer = {
      denominator: 50,
      rates: [{ id: "assess-of-core", numerator: 21, rate: 0.42 }],
    };
    getReport.mockResolvedValueOnce(qmsReport);

    const response = await addQipTargetPage(qipReport, targetInfo);

    expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
    const { report, pageId, originalValues } = JSON.parse(response.body!);
    // Only the MLTSS value was copied
    expect(originalValues).toEqual({ "MLTSS-assess-of-core": 0.42 });
    // The FFS rate is blank
    const qipRate = report.pages
      .find((p: any) => p.id === pageId)
      .elements.find((e: any) => e.id === "baseline-FFS-assess-of-core");
    expect((qipRate as NumberFieldTemplate).answer).toBe(undefined);
  });

  it("should completely populate all template strings", async () => {
    const targetInfo = {
      measureId: "PCP-2",
      deliveryMethods: ["FFS"],
      rates: ["perf-rate"],
    };
    const qipReport = await buildQip();

    const response = await addQipTargetPage(qipReport, targetInfo);

    expect(response).toEqual(expect.objectContaining({ statusCode: 200 }));
    const { report, pageId, originalValues } = JSON.parse(response.body!);
    expect(originalValues).toEqual({});
    const newPage = report.pages.find(
      (p: any) => p.id === pageId
    ) as FormPageTemplate;

    // Recurse through the object, asserting all "{template}" strings are gone
    function expectNoBraces(obj: Exclude<object, null>, basePath = "page") {
      for (const [key, value] of Object.entries(obj)) {
        const path = `${basePath}.${key}`;
        if (typeof value === "string") {
          assert.ok(
            !value.includes("}") && !value.includes("}"),
            "Curly braces found at " + path
          );
        } else if (typeof value === "object" && value !== null) {
          expectNoBraces(value, path);
        }
      }
    }

    expectNoBraces(newPage);
  });

  describe.each(allFormYears)("QIP year %s", (year) => {
    const mappings = getReportTemplate(
      ReportType.QIP,
      year
    ).measureTargetMapping!;

    it.each(mappings.filter((m) => m.includedInQms))(
      "Copying measure $measureId",
      async (mapping) => {
        const qmsReport = await buildQms();
        getReport.mockResolvedValue(qmsReport);
        const targetInfo = {
          measureId: mapping.measureId,
          qmsReportId: "qms-123",
          deliveryMethods: Object.keys(mapping.deliveryMethods),
          rates: mapping.rates.map((r) => r.id),
        };

        // Populate all of the expected answers in the QMS report
        let value = 0;
        for (const { qmsPageId } of Object.values(mapping.deliveryMethods)) {
          const qmsPage = qmsReport.pages.find((p) => p.id === qmsPageId);
          assert.ok(!!qmsPage, `Cannot find QMS page ${qmsPageId}`);
          assert.ok(!!qmsPage.elements, `No elements on QMS page ${qmsPageId}`);
          for (const { id: rateId, qmsElementId } of mapping.rates) {
            const element = qmsPage.elements.find((e) => e.id === qmsElementId);
            assert.ok(!!element, `Cannot find ${qmsPageId}#${qmsElementId}`);

            // Each answer we populate will have a unique value
            value += 1;
            switch (element.type) {
              case ElementType.Ndr:
              case ElementType.PerformanceNdr:
                element.answer = { numerator: 1, denominator: 1, rate: value };
                break;
              case ElementType.MultiRateNdr:
                expect(element.assessments.map((a) => a.id)).toContain(rateId);
                if (element.answer && element.answer.rates) {
                  element.answer.rates.push({
                    id: rateId,
                    numerator: 1,
                    rate: value,
                  });
                } else {
                  element.answer = {
                    denominator: 1,
                    rates: [{ id: rateId, numerator: 1, rate: value }],
                  };
                }
                break;
              case ElementType.MultiCategoryNdr:
                expect(rateId).toContain(".");
                expect(element.assessments.map((a) => a.id)).toContain(
                  rateId.split(".")[0]
                );
                expect(element.categories.map((a) => a.id)).toContain(
                  rateId.split(".")[1]
                );
                if (element.answer) {
                  const category = element.answer.find((cat) =>
                    cat.rates.some(
                      (r) => r.id.split(".")[0] === rateId.split(".")[0]
                    )
                  );
                  if (category) {
                    category.rates.push({
                      id: rateId,
                      numerator: 1,
                      rate: value,
                    });
                  } else {
                    element.answer.push({
                      denominator: 1,
                      rates: [{ id: rateId, numerator: 1, rate: value }],
                    });
                  }
                } else {
                  element.answer = [
                    {
                      denominator: 1,
                      rates: [{ id: rateId, numerator: 1, rate: value }],
                    },
                  ];
                }
                break;
              case ElementType.LengthOfStayRate:
                expect(element.labels).toHaveProperty(rateId);
                element.answer = {
                  actualCount: 1,
                  denominator: 1,
                  expectedCount: 1,
                  populationRate: 1,
                  actualRate: element.answer?.actualRate ?? -1,
                  expectedRate: element.answer?.expectedRate ?? -1,
                  adjustedRate: element.answer?.adjustedRate ?? -1,
                  [rateId]: value,
                };
                break;
              default:
                throw new Error(`Unexpected QMS element type ${element.type}`);
            }
          }
        }

        const response = await addQipTargetPage(await buildQip(), targetInfo);

        expect(response.statusCode).toBe(StatusCodes.Ok);

        // Each unique value should have been found in the QMS report
        const { originalValues } = JSON.parse(response.body!);
        const valueCount =
          targetInfo.deliveryMethods.length * targetInfo.rates.length;
        for (let val = 1; val <= valueCount; val += 1) {
          expect(Object.values(originalValues)).toContain(val);
        }
      }
    );
  });
});
