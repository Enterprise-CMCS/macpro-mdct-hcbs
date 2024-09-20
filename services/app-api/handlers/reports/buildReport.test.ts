import { ReportType } from "../../types/reports";
import { buildReport } from "./buildReport";

const putMock = jest.fn();
jest.mock("../../storage/reports", () => ({
  putReport: () => putMock(),
}));

describe("Test create report handler", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("Test Successful create", async () => {
    const state = "PA";
    const user = "James Holden";
    const report = await buildReport(ReportType.QM, state, ["rulesOne"], user);

    expect(report.state).toBe("PA");
    expect(report.type).toBe(ReportType.QM);
    expect(report.lastEditedBy).toBe(user);
    expect(putMock).toHaveBeenCalled();
  });
});
