import { booleanCombinations } from "../../testing/setupJest";
import {
  PageElement,
  ReportOptions,
  ReportType,
  ReportBase,
} from "../../types/reports";
import { User } from "../../types/types";
import { StateAbbr } from "../../utils/constants";
import { validateReportPayload } from "../../utils/reportValidation";
import { buildReport } from "./buildReport";

jest.mock("../../utils/reportValidation", () => ({
  validateReportPayload: jest.fn().mockImplementation(async (rpt) => rpt),
}));

describe("Build Report", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a report", async () => {
    const state = "PA" as StateAbbr;
    const user = {
      fullName: "James Holden",
      email: "james.holden@test.com",
    } as User;
    const reportOptions = {
      name: "report1",
      year: 2026,
      options: {
        pom: true,
      },
    } as ReportOptions;
    const report = await buildReport(
      ReportType.QMS,
      state,
      reportOptions,
      user
    );

    expect(report.state).toBe("PA");
    expect(report.type).toBe(ReportType.QMS);
    expect(report.lastEditedBy).toBe("James Holden");
    expect(report.lastEditedByEmail).toBe("james.holden@test.com");
  });

  it("should throw an error when validation fails", async () => {
    // Manually throw validation error
    (validateReportPayload as jest.Mock).mockImplementationOnce(() => {
      throw new Error("you be havin some validatin errors");
    });

    const state = "PA" as StateAbbr;
    const user = {
      fullName: "James Holden",
      email: "james.holden@test.com",
    } as User;
    const reportOptions = {
      name: "report1",
      year: 2026,
      options: {},
    } as ReportOptions;

    expect(async () => {
      await buildReport(ReportType.QMS, state, reportOptions, user);
    }).rejects.toThrow("Invalid request");
  });

  it("should always have unique element IDs within a page", async () => {
    const nonQmsReportTypes = Object.values(ReportType).filter(
      (rt) => rt !== ReportType.QMS
    );
    const qmsOptionCombinations = [...booleanCombinations(4)].map(
      ([a, b, c, d]) => ({ cahps: a, nciidd: b, nciad: c, pom: d })
    );

    const reportTypesAndOptions = [
      // Every non-QMS report takes no options, so always has the same pages.
      ...nonQmsReportTypes.map((type) => ({ type, opts: {} })),
      // QMS needs to be built with different options to get all possible pages.
      ...qmsOptionCombinations.map((opts) => ({ type: ReportType.QMS, opts })),
    ];

    for (const { type, opts } of reportTypesAndOptions) {
      const options = {
        name: "mock-report",
        year: 2026,
        options: opts,
      };
      const user = {
        fullName: "Mock User",
        email: "mock.user@test.com",
      } as User;
      const report = await buildReport(type, "CO", options, user);

      assertReportHasUniqueElementIds(report);
    }
  });
});

function assertReportHasUniqueElementIds(report: ReportBase) {
  for (const page of report.pages) {
    if (!page.elements) continue;
    const ids = [...iteratePageElements(page.elements)].map((el) => el.id);
    const duplicates = Object.entries(Object_groupBy(ids, (id) => id))
      .filter(([id, ids]) => ids.length > 1 && id !== "divider")
      .map(([id, _ids]) => id);
    if (duplicates.length > 0) {
      console.dir(page, { depth: 10 });
      throw new Error(
        `Page ${page.id} of report type ${report.type} has multiple elements with this/these id/s: ${duplicates}`
      );
    }
  }
}

/** Visit every element, recursing into checkedChildren as needed. */
function* iteratePageElements(elements: PageElement[]): Generator<PageElement> {
  for (const element of elements) {
    yield element;
    if ("choices" in element) {
      for (const choice of element.choices) {
        if (choice.checkedChildren) {
          yield* iteratePageElements(choice.checkedChildren);
        }
      }
    }
  }
}

/** Ponyfill for `Object.groupBy()`. Please delete me soon. */
function Object_groupBy<T>(arr: T[], selector: (el: T) => string) {
  const groups: Record<string, T[]> = {};
  for (const element of arr) {
    const key = selector(element);
    groups[key] ??= [];
    groups[key].push(element);
  }
  return groups;
}
