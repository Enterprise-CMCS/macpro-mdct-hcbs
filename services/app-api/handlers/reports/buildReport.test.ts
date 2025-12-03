import { ReportOptions, ReportType } from "../../types/reports";
import { User } from "../../types/types";
import { StateAbbr } from "../../utils/constants";
import { validateReportPayload } from "../../utils/reportValidation";
import { buildReport } from "./buildReport";

jest.mock("../../utils/reportValidation", () => ({
  validateReportPayload: jest.fn().mockImplementation(async (rpt) => rpt),
}));

describe("Test create report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Successful create", async () => {
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
      ReportType.XYZ,
      state,
      reportOptions,
      user
    );

    expect(report.state).toBe("PA");
    expect(report.type).toBe(ReportType.XYZ);
    expect(report.lastEditedBy).toBe("James Holden");
    expect(report.lastEditedByEmail).toBe("james.holden@test.com");
  });
});

describe("Test validation error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("that a validation failure throws invalid request error", async () => {
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
      await buildReport(ReportType.XYZ, state, reportOptions, user);
    }).rejects.toThrow("Invalid request");
  });
});
