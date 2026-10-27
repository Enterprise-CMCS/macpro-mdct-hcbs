import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiLib } from "../apiLib";
import { updateTimeout } from "../../auth/authLifecycle";
import { getRequestHeaders } from "./getRequestHeaders";
import {
  createNotificationAssignment,
  deleteNotificationAssignment,
  getNotificationAssignments,
  updateNotificationAssignment,
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

  it("creates an assignment and returns the saved data", async () => {
    vi.mocked(apiLib.post).mockResolvedValue(assignment);
    expect(await createNotificationAssignment(assignment)).toEqual(assignment);
    expect(apiLib.post).toHaveBeenCalledWith("/notification-assignments", {
      headers: { "x-api-key": "test" },
      body: assignment,
    });
  });

  it("propagates save and load errors", async () => {
    vi.mocked(apiLib.post).mockRejectedValue(new Error("Conflict"));
    vi.mocked(apiLib.get).mockRejectedValue(new Error("Unavailable"));
    await expect(createNotificationAssignment(assignment)).rejects.toThrow(
      "Conflict"
    );
    await expect(getNotificationAssignments()).rejects.toThrow("Unavailable");
  });

  it("updates an existing assignment using PUT", async () => {
    vi.mocked(apiLib.put).mockResolvedValue(assignment);
    expect(await updateNotificationAssignment(assignment)).toEqual(assignment);
    expect(apiLib.put).toHaveBeenCalledWith("/notification-assignments", {
      headers: { "x-api-key": "test" },
      body: assignment,
    });
    vi.mocked(apiLib.put).mockRejectedValue(new Error("Not found"));
    await expect(updateNotificationAssignment(assignment)).rejects.toThrow(
      "Not found"
    );
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
