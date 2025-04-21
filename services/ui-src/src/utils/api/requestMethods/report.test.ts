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
import { Report, ReportOptions, ReportType } from "types/report";
import { AnyObject } from "types";

const report = {
  type: ReportType.QMS,
  state: "NJ",
  title: "A Title",
  pages: [],
} as unknown as Report;

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    get: (path: string, options: AnyObject) => mockGet(path, options),
    post: (path: string, options: AnyObject) => mockPost(path, options),
    put: (path: string, options: AnyObject) => mockPut(path, options),
  },
}));

const mockReport = {
  name: "report name",
} as ReportOptions;

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
