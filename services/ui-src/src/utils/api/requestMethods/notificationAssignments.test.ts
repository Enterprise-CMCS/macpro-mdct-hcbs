import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiLib } from "../apiLib";
import { updateTimeout } from "../../auth/authLifecycle";
import { getRequestHeaders } from "./getRequestHeaders";
import {
  deleteNotificationAssignment,
  getEmailsForReportAndState,
  getNotificationAssignments,
  putNotificationAssignment,
} from "./notificationAssignments";
import { NotificationAssignment } from "types/notification";
import { ReportType } from "types/report";

vi.mock("../apiLib", () => ({
  apiLib: { get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn() },
}));
vi.mock("../../auth/authLifecycle", () => ({ updateTimeout: vi.fn() }));
vi.mock("./getRequestHeaders", () => ({ getRequestHeaders: vi.fn() }));

const assignment: NotificationAssignment = {
  email: "po@example.com",
  states: ["AL"],
  reports: [ReportType.HA],
};

describe("Notification assignment requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRequestHeaders).mockResolvedValue({ "x-api-key": "test" });
  });

  it("loads assignments with authenticated headers", async () => {
    vi.mocked(apiLib.get).mockResolvedValue([assignment]);
    expect(await getNotificationAssignments()).toEqual([assignment]);
    expect(apiLib.get).toHaveBeenCalledWith("/notification-assignments", {
      headers: { "x-api-key": "test" },
    });
    expect(updateTimeout).toHaveBeenCalled();
  });

  it("loads the emails for a report and state", async () => {
    vi.mocked(apiLib.get).mockResolvedValue(["a@example.com"]);
    expect(await getEmailsForReportAndState(ReportType.HA, "AL")).toEqual([
      "a@example.com",
    ]);
    expect(apiLib.get).toHaveBeenCalledWith(
      `/notification-assignments/emails/${ReportType.HA}/AL`,
      { headers: { "x-api-key": "test" } }
    );
    expect(updateTimeout).toHaveBeenCalled();
    vi.mocked(apiLib.get).mockRejectedValue(new Error("Unavailable"));
    await expect(
      getEmailsForReportAndState(ReportType.HA, "AL")
    ).rejects.toThrow("Unavailable");
  });

  it("saves an assignment using PUT and returns the saved data", async () => {
    vi.mocked(apiLib.put).mockResolvedValue(assignment);
    expect(await putNotificationAssignment(assignment)).toEqual(assignment);
    expect(apiLib.put).toHaveBeenCalledWith("/notification-assignments", {
      headers: { "x-api-key": "test" },
      body: assignment,
    });
  });

  it("propagates save and load errors", async () => {
    vi.mocked(apiLib.put).mockRejectedValue(new Error("Unavailable"));
    vi.mocked(apiLib.get).mockRejectedValue(new Error("Unavailable"));
    await expect(putNotificationAssignment(assignment)).rejects.toThrow(
      "Unavailable"
    );
    await expect(getNotificationAssignments()).rejects.toThrow("Unavailable");
  });

  it("deletes an assignment using DELETE with the encoded email", async () => {
    vi.mocked(apiLib.del).mockResolvedValue(undefined);
    await deleteNotificationAssignment("po+tag@example.com");
    expect(apiLib.del).toHaveBeenCalledWith(
      "/notification-assignments/po%2Btag%40example.com",
      { headers: { "x-api-key": "test" } }
    );
    expect(updateTimeout).toHaveBeenCalled();
    vi.mocked(apiLib.del).mockRejectedValue(new Error("Not found"));
    await expect(
      deleteNotificationAssignment(assignment.email)
    ).rejects.toThrow("Not found");
  });
});
