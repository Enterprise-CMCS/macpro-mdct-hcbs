import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { ReportType } from "../../types/reports";
import { NotificationAssignment } from "../../types/notification";
import { authenticatedUser } from "../../utils/authentication";
import {
  createNotificationAssignment as storeAssignment,
  scanNotificationAssignments,
  updateNotificationAssignment as updateStoredAssignment,
} from "../../storage/notificationAssignments";
import { createNotificationAssignment } from "./create";
import { fetchNotificationAssignments } from "./fetch";
import { updateNotificationAssignment } from "./update";

vi.mock("../../utils/authentication", () => ({ authenticatedUser: vi.fn() }));
vi.mock("../../storage/notificationAssignments", () => ({
  createNotificationAssignment: vi.fn(),
  scanNotificationAssignments: vi.fn(),
  updateNotificationAssignment: vi.fn(),
}));

const user = { role: UserRoles.ADMIN, fullName: "Admin" } as User;
const assignment: NotificationAssignment = {
  email: "po@example.com",
  states: ["AL"],
  reports: [ReportType.HA],
};
const event = (body: unknown = assignment) =>
  ({ body: JSON.stringify(body) }) as APIGatewayProxyEvent;

describe("Notification assignment handlers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(authenticatedUser).mockReturnValue(user);
    vi.mocked(scanNotificationAssignments).mockResolvedValue([assignment]);
  });

  it("creates normalized assignments and returns the saved data", async () => {
    const result = await createNotificationAssignment(
      event({
        email: " PO@Example.com ",
        states: ["AL", "AL"],
        reports: [ReportType.HA, ReportType.HA],
      })
    );
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body!)).toEqual(assignment);
    expect(storeAssignment).toHaveBeenCalledWith(assignment);
  });

  it("lists saved assignments", async () => {
    const result = await fetchNotificationAssignments(event());
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual([assignment]);
  });

  it.each(Object.values(UserRoles).filter((role) => role !== UserRoles.ADMIN))(
    "denies reads and creates for %s",
    async (role) => {
      vi.mocked(authenticatedUser).mockReturnValue({ ...user, role });
      expect((await createNotificationAssignment(event())).statusCode).toBe(
        403
      );
      expect((await fetchNotificationAssignments(event())).statusCode).toBe(
        403
      );
      expect(storeAssignment).not.toHaveBeenCalled();
      expect((await updateNotificationAssignment(event())).statusCode).toBe(
        403
      );
      expect(updateStoredAssignment).not.toHaveBeenCalled();
      expect(scanNotificationAssignments).not.toHaveBeenCalled();
    }
  );

  it("denies unauthenticated requests", async () => {
    vi.mocked(authenticatedUser).mockReturnValue(undefined);
    expect((await createNotificationAssignment(event())).statusCode).toBe(401);
    expect((await fetchNotificationAssignments(event())).statusCode).toBe(401);
    expect((await updateNotificationAssignment(event())).statusCode).toBe(401);
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
    const result = await createNotificationAssignment({
      body: JSON.stringify(body),
    } as APIGatewayProxyEvent);
    expect(result.statusCode).toBe(400);
    expect(storeAssignment).not.toHaveBeenCalled();
    expect(
      (
        await updateNotificationAssignment({
          body: JSON.stringify(body),
        } as APIGatewayProxyEvent)
      ).statusCode
    ).toBe(400);
    expect(updateStoredAssignment).not.toHaveBeenCalled();
  });

  it("updates an existing assignment and returns its normalized data", async () => {
    const result = await updateNotificationAssignment(
      event({
        ...assignment,
        email: " PO@EXAMPLE.COM ",
        states: ["AL", "AL"],
      })
    );
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual(assignment);
    expect(updateStoredAssignment).toHaveBeenCalledWith(assignment);
  });

  it("rejects updates to missing assignments and surfaces other failures", async () => {
    vi.mocked(updateStoredAssignment).mockRejectedValueOnce(
      new ConditionalCheckFailedException({ message: "Missing", $metadata: {} })
    );
    expect((await updateNotificationAssignment(event())).statusCode).toBe(404);
    vi.mocked(updateStoredAssignment).mockRejectedValueOnce(
      new Error("Unavailable")
    );
    expect((await updateNotificationAssignment(event())).statusCode).toBe(500);
  });

  it("returns an actionable conflict without overwriting duplicates", async () => {
    vi.mocked(storeAssignment).mockRejectedValue(
      new ConditionalCheckFailedException({
        message: "Duplicate",
        $metadata: {},
      })
    );
    const result = await createNotificationAssignment(event());
    expect(result.statusCode).toBe(409);
    expect(JSON.parse(result.body!)).toContain("Use Edit to update it.");
  });

  it("surfaces storage failures on create and load", async () => {
    vi.mocked(storeAssignment).mockRejectedValue(
      new Error("Database unavailable")
    );
    vi.mocked(scanNotificationAssignments).mockRejectedValue(
      new Error("Database unavailable")
    );
    expect((await createNotificationAssignment(event())).statusCode).toBe(500);
    expect((await fetchNotificationAssignments(event())).statusCode).toBe(500);
  });
});
