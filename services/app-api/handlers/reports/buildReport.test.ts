import { ReportType } from "../../types/reports";
import { User } from "../../types/types";
import { buildReport } from "./buildReport";

const putMock = jest.fn();
jest.mock("../../storage/reports", () => ({
  putReport: () => putMock(),
}));

describe("Test create report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test Successful create", async () => {
    const state = "PA";
    const user = {
      fullName: "James Holden",
      email: "james.holden@test.com",
    } as User;
    const report = await buildReport(ReportType.QM, state, ["rulesOne"], user);

    expect(report.state).toBe("PA");
    expect(report.type).toBe(ReportType.QM);
    expect(report.lastEditedBy).toBe("James Holden");
    expect(report.lastEditedByEmail).toBe("james.holden@test.com");
    expect(putMock).toHaveBeenCalled();
  });
});
