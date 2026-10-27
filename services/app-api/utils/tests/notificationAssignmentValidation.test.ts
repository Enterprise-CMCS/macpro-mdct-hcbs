import { describe, expect, it } from "vitest";
import {
  isValidNotificationAssignment,
  normalizeNotificationAssignment,
} from "../notificationAssignmentValidation";
import { ReportType } from "../../types/reports";
import { NotificationAssignment } from "../../types/notification";

const assignment = {
  email: "po@example.com",
  states: ["AL"],
  reports: [ReportType.HA],
};

describe("notification assignment validation", () => {
  it("trims email, lowercases only the domain, and deduplicates selections without mutating input", () => {
    const input: NotificationAssignment = {
      email: " PO@Example.com ",
      states: ["AL", "AK", "AL"],
      reports: [ReportType.HA, ReportType.QIP, ReportType.HA],
    };
    expect(normalizeNotificationAssignment(input)).toEqual({
      email: "PO@example.com",
      states: ["AL", "AK"],
      reports: [ReportType.HA, ReportType.QIP],
    });
    expect(input.email).toBe(" PO@Example.com ");
    expect(input.states).toEqual(["AL", "AK", "AL"]);
    expect(input.reports).toEqual([
      ReportType.HA,
      ReportType.QIP,
      ReportType.HA,
    ]);
  });
  it("accepts supported states and report types", () => {
    expect(isValidNotificationAssignment(assignment)).toBe(true);
  });

  it.each([
    null,
    undefined,
    true,
    "email@example.com",
    [],
    { ...assignment, email: null },
    { ...assignment, email: `${"a".repeat(255)}@example.com` },
    { ...assignment, states: null },
    { ...assignment, states: "AL" },
    { ...assignment, reports: null },
    { ...assignment, reports: "HA" },
    { ...assignment, reports: [null] },
  ])("rejects malformed assignments: %j", (value) => {
    expect(isValidNotificationAssignment(value)).toBe(false);
  });
});
