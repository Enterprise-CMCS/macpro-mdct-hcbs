import {
  createReport,
  getReport,
  getReportsForState,
  putReport,
  releaseReport,
  postSubmitReport,
  updateArchivedStatus,
} from "./report";
// types
import {
  MeasurePageTemplate,
  Report,
  ReportOptions,
  ReportType,
} from "types/report";

const report = {
  type: ReportType.QMS,
  state: "NJ",
  name: "A Title",
  pages: [] as MeasurePageTemplate[],
} as Report;

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    get: (path: string, opts: Record<string, any>) => mockGet(path, opts),
    post: (path: string, opts: Record<string, any>) => mockPost(path, opts),
    put: (path: string, opts: Record<string, any>) => mockPut(path, opts),
  },
}));

const mockReport: ReportOptions = {
  name: "report name",
  year: 2026,
  options: {} as ReportOptions["options"],
};

describe("utils/report", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("getReport", async () => {
    await getReport("reportType", "PA", "mock-id");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("getReportsForState", async () => {
    await getReportsForState("reportType", "PA");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("createReport", async () => {
    await createReport("reportType", "PA", mockReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("putReport", async () => {
    await putReport(report);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("submitReport", async () => {
    await postSubmitReport(report);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("updateArchivedStatus", async () => {
    await updateArchivedStatus(report, true);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });

  test("releaseReport", async () => {
    await releaseReport(report);
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
});
