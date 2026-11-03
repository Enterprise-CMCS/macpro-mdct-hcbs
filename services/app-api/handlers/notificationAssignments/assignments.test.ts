import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { ReportType } from "../../types/reports";
import { NotificationAssignment } from "../../types/notification";
import { authenticatedUser } from "../../utils/authentication";
import {
  deleteNotificationAssignment as deleteStoredAssignment,
  putNotificationAssignment as putStoredAssignment,
  scanNotificationAssignments,
} from "../../storage/notificationAssignments";
import { deleteNotificationAssignment } from "./delete";
import { fetchNotificationAssignments } from "./fetch";
import { putNotificationAssignment } from "./put";

vi.mock("../../utils/authentication", () => ({ authenticatedUser: vi.fn() }));
vi.mock("../../storage/notificationAssignments", () => ({
  deleteNotificationAssignment: vi.fn(),
  putNotificationAssignment: vi.fn(),
  scanNotificationAssignments: vi.fn(),
}));

const user = { role: UserRoles.ADMIN, fullName: "Admin" } as User;
const assignment: NotificationAssignment = {
  email: "po@example.com",
  states: ["AL"],
  reports: [ReportType.HA],
};
const event = (body: unknown = assignment) =>
  ({ body: JSON.stringify(body) }) as APIGatewayProxyEvent;
const deleteEvent = (email: string | undefined = "po@example.com") =>
  ({
    pathParameters: email ? { email } : undefined,
  }) as unknown as APIGatewayProxyEvent;

describe("Notification assignment handlers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authenticatedUser).mockReturnValue(user);
    vi.mocked(scanNotificationAssignments).mockResolvedValue([assignment]);
  });

  it("puts normalized assignments and returns the saved data", async () => {
    const normalized = { ...assignment, email: "PO@example.com" };
    const result = await putNotificationAssignment(
      event({
        email: " PO@Example.com ",
        states: ["AL", "AL"],
        reports: [ReportType.HA, ReportType.HA],
      })
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual(normalized);
    expect(putStoredAssignment).toHaveBeenCalledWith(normalized);
  });

  it("lists saved assignments", async () => {
    const result = await fetchNotificationAssignments(event());
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual([assignment]);
  });

  it.each(Object.values(UserRoles).filter((role) => role !== UserRoles.ADMIN))(
    "denies reads and writes for %s",
    async (role) => {
      vi.mocked(authenticatedUser).mockReturnValue({ ...user, role });
      expect((await putNotificationAssignment(event())).statusCode).toBe(403);
      expect((await fetchNotificationAssignments(event())).statusCode).toBe(
        403
      );
      expect(putStoredAssignment).not.toHaveBeenCalled();
      expect(scanNotificationAssignments).not.toHaveBeenCalled();
      expect(
        (await deleteNotificationAssignment(deleteEvent())).statusCode
      ).toBe(403);
      expect(deleteStoredAssignment).not.toHaveBeenCalled();
    }
  );

  it("denies unauthenticated requests", async () => {
    vi.mocked(authenticatedUser).mockReturnValue(undefined);
    expect((await putNotificationAssignment(event())).statusCode).toBe(401);
    expect((await fetchNotificationAssignments(event())).statusCode).toBe(401);
    expect((await deleteNotificationAssignment(deleteEvent())).statusCode).toBe(
      401
    );
  });

  it.each([
    undefined,
    [],
    {},
    { ...assignment, email: "" },
    { ...assignment, email: "invalid" },
    { ...assignment, email: 42 },
    { ...assignment, states: [] },
    { ...assignment, states: ["XX"] },
    { ...assignment, states: [null] },
    { ...assignment, reports: [] },
    { ...assignment, reports: ["invalid"] },
    { ...assignment, extra: true },
  ])("rejects invalid data: %j", async (body) => {
    const result = await putNotificationAssignment({
      body: JSON.stringify(body),
    } as APIGatewayProxyEvent);
    expect(result.statusCode).toBe(400);
    expect(putStoredAssignment).not.toHaveBeenCalled();
  });

  it("surfaces storage failures on put and load", async () => {
    vi.mocked(putStoredAssignment).mockRejectedValue(
      new Error("Database unavailable")
    );
    vi.mocked(scanNotificationAssignments).mockRejectedValue(
      new Error("Database unavailable")
    );
    expect((await putNotificationAssignment(event())).statusCode).toBe(500);
    expect((await fetchNotificationAssignments(event())).statusCode).toBe(500);
  });

  it("deletes an assignment by decoded email with only the domain lowercased", async () => {
    const result = await deleteNotificationAssignment(
      deleteEvent("PO%40Example.com")
    );
    expect(result.statusCode).toBe(200);
    expect(deleteStoredAssignment).toHaveBeenCalledWith("PO@example.com");
  });

  it("rejects deletes without a valid email in the path", async () => {
    expect(
      (await deleteNotificationAssignment(deleteEvent(""))).statusCode
    ).toBe(400);
    expect(
      (await deleteNotificationAssignment(deleteEvent("%E0%A4%A"))).statusCode
    ).toBe(400);
    expect(deleteStoredAssignment).not.toHaveBeenCalled();
  });

  it("surfaces delete failures", async () => {
    vi.mocked(deleteStoredAssignment).mockRejectedValueOnce(
      new Error("Unavailable")
    );
    expect((await deleteNotificationAssignment(deleteEvent())).statusCode).toBe(
      500
    );
  });
});
