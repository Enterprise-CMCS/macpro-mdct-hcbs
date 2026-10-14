import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createReport,
  getReport,
  getReportsForState,
  putReport,
  releaseReport,
  postSubmitReport,
  updateArchivedStatus,
  updateReport,
  addQipTargetPage,
} from "./report";
import {
  MeasurePageTemplate,
  MeasureTargetInfo,
  Report,
  ReportOptions,
  ReportType,
} from "types/report";
import { apiLib } from "utils";

vi.mock("../apiLib", () => ({
  apiLib: {
    del: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));
const mockGet = vi.mocked(apiLib.get);
const mockPatch = vi.mocked(apiLib.patch);
const mockPost = vi.mocked(apiLib.post);
const mockPut = vi.mocked(apiLib.put);

const report = {
  id: "mock-id",
  type: ReportType.QMS,
  state: "NJ",
  name: "A Title",
  pages: [] as MeasurePageTemplate[],
} as Report;

describe("utils/report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call the correct endpoint for createReport", async () => {
    const reportCreatePayload: ReportOptions = {
      name: "report name",
      year: 2026,
      options: {},
    };
    await createReport("WWL", "PA", reportCreatePayload);
    expect(mockPost).toHaveBeenCalledWith(
      "/reports/WWL/PA",
      expect.objectContaining({ body: reportCreatePayload })
    );
  });

  it("should call the correct endpoint for getReport", async () => {
    await getReport("WWL", "PA", "mock-id");
    expect(mockGet).toHaveBeenCalledWith(
      "/reports/WWL/PA/mock-id",
      expect.any(Object)
    );
  });

  it("should call the correct endpoint for getReportsForState", async () => {
    await getReportsForState("WWL", "PA");
    expect(mockGet).toHaveBeenCalledWith("/reports/WWL/PA", expect.any(Object));
  });

  it("should call the correct endpoint for addQipTargetPage", async () => {
    const targetInfo = { measureId: "LTSS-1" } as MeasureTargetInfo;
    await addQipTargetPage({ ...report, type: ReportType.QIP }, targetInfo);

    expect(mockPatch).toHaveBeenCalledWith(
      "/reports/QIP/NJ/mock-id",
      expect.objectContaining({
        body: {
          patchType: "addQipTargetPage",
          measureId: "LTSS-1",
        },
      })
    );
  });

  it("should call the correct endpoint for putReport", async () => {
    await putReport(report);
    expect(mockPut).toHaveBeenCalledWith(
      "/reports/QMS/NJ/mock-id",
      expect.objectContaining({ body: report })
    );
  });

  it("should call the correct endpoint for updateReport", async () => {
    await updateReport(report);
    expect(mockPut).toHaveBeenCalledWith(
      "/reports/update/QMS/NJ/mock-id",
      expect.objectContaining({ body: report })
    );
  });

  it("should call the correct endpoint for submitReport", async () => {
    await postSubmitReport(report);
    expect(mockPost).toHaveBeenCalledWith(
      "/reports/submit/QMS/NJ/mock-id",
      expect.objectContaining({ body: report })
    );
  });

  it("should call the correct endpoint for updateArchivedStatus", async () => {
    await updateArchivedStatus(report, true);
    expect(mockPut).toHaveBeenCalledWith(
      "/reports/QMS/NJ/mock-id/archive",
      expect.objectContaining({ body: { archived: true } })
    );
  });

  it("should call the correct endpoint for releaseReport", async () => {
    await releaseReport(report);
    expect(mockPut).toHaveBeenCalledWith(
      "/reports/release/QMS/NJ/mock-id",
      expect.objectContaining({ body: report })
    );
  });
});
