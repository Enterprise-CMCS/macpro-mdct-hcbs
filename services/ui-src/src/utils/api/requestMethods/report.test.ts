import {
  createReport,
  getReport,
  getReportsForState,
  putReport,
} from "./report";
// types
import { Report, ReportType } from "types/report";
import { AnyObject } from "types";

const report = {
  type: ReportType.QM,
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
  "mock-report-field": "value",
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
});
