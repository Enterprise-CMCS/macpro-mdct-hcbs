import { getReport, createReport, putReport } from "./report";
// utils
import { initAuthManager } from "utils/auth/authLifecycle";
import { Report, ReportType } from "types/report";

const report = {
  type: ReportType.QM,
  state: "NJ",
  title: "A Title",
  pages: [],
} as unknown as Report;
describe("utils/report", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });

  test("getReport()", () => {
    expect(getReport("QM", "NJ", "id")).toBeTruthy();
  });

  test("createReport()", () => {
    expect(createReport("QM", "NJ", {})).toBeTruthy();
  });

  test("putReport()", () => {
    expect(putReport(report)).toBeTruthy();
  });
});
