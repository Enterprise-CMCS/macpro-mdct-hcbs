import { beforeEach, describe, expect, it } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { scanNotificationAssignments } from "./notificationAssignments";
import { NotificationAssignment } from "../types/notification";
import { ReportType } from "../types/reports";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const assignment: NotificationAssignment = {
  email: "reviewer@example.com",
  states: ["NJ"],
  reports: [ReportType.QMS],
};

describe("scanNotificationAssignments", () => {
  beforeEach(() => mockDynamo.reset());

  it("should collect every page with consistent reads", async () => {
    const key = { email: assignment.email };
    const second = { ...assignment, email: "second@example.com" };
    mockDynamo
      .on(ScanCommand)
      .resolvesOnce({ Items: [assignment], LastEvaluatedKey: key })
      .resolvesOnce({ Items: [second] });

    expect(await scanNotificationAssignments()).toEqual([assignment, second]);
    const calls = mockDynamo.commandCalls(ScanCommand);
    expect(calls).toHaveLength(2);
    expect(calls[0].args[0].input.ConsistentRead).toBe(true);
    expect(calls[1].args[0].input.ExclusiveStartKey).toEqual(key);
  });

  it("should return an empty list when there are no assignments", async () => {
    mockDynamo.on(ScanCommand).resolves({});
    expect(await scanNotificationAssignments()).toEqual([]);
  });

  it("should propagate database failures", async () => {
    mockDynamo.on(ScanCommand).rejects("Dynamo unavailable");
    await expect(scanNotificationAssignments()).rejects.toThrow(
      "Dynamo unavailable"
    );
  });
});
