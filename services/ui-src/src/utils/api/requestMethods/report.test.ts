import { createReport, getReport } from "./report";
// types
import { AnyObject } from "types";

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    get: (path: string, options: AnyObject) => mockGet(path, options),
    post: (path: string, options: AnyObject) => mockPost(path, options),
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

  test("createReport", async () => {
    await createReport("reportType", "PA", mockReport);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
