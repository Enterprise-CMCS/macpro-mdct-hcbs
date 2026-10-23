import { beforeEach, describe, expect, it } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  createNotificationAssignment,
  deleteNotificationAssignment,
  scanNotificationAssignments,
  updateNotificationAssignment,
} from "./notificationAssignments";
import { NotificationAssignment } from "../types/notification";
import { ReportType } from "../types/reports";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const assignment: NotificationAssignment = {
  email: "po@example.com",
  states: ["AL"],
  reports: [ReportType.HA],
};

describe("Notification assignment storage", () => {
  beforeEach(() => mockDynamo.reset());

  it("updates only an existing email", async () => {
    mockDynamo.on(PutCommand).resolves({});
    await updateNotificationAssignment(assignment);
    expect(mockDynamo.commandCalls(PutCommand)[0].args[0].input).toEqual({
      TableName: "local-notification-assignments",
      Item: assignment,
      ConditionExpression: "attribute_exists(email)",
    });
  });

  it("creates an assignment with an atomic duplicate guard", async () => {
    mockDynamo.on(PutCommand).resolves({});
    await createNotificationAssignment(assignment);
    expect(mockDynamo.commandCalls(PutCommand)[0].args[0].input).toEqual({
      TableName: "local-notification-assignments",
      Item: assignment,
      ConditionExpression: "attribute_not_exists(email)",
    });
  });

  it("deletes only an existing email", async () => {
    mockDynamo.on(DeleteCommand).resolves({});
    await deleteNotificationAssignment(assignment.email);
    expect(mockDynamo.commandCalls(DeleteCommand)[0].args[0].input).toEqual({
      TableName: "local-notification-assignments",
      Key: { email: assignment.email },
      ConditionExpression: "attribute_exists(email)",
    });
  });

  it("propagates duplicate conflicts", async () => {
    const error = new ConditionalCheckFailedException({
      message: "Duplicate",
      $metadata: {},
    });
    mockDynamo.on(PutCommand).rejects(error);
    await expect(createNotificationAssignment(assignment)).rejects.toBe(error);
  });

  it("loads every page with consistent reads", async () => {
    mockDynamo
      .on(ScanCommand)
      .resolvesOnce({
        Items: [assignment],
        LastEvaluatedKey: { email: assignment.email },
      })
      .resolvesOnce({
        Items: [{ ...assignment, email: "second@example.com" }],
      });
    expect(await scanNotificationAssignments()).toEqual([
      assignment,
      { ...assignment, email: "second@example.com" },
    ]);
    expect(mockDynamo.commandCalls(ScanCommand)).toHaveLength(2);
    expect(mockDynamo.commandCalls(ScanCommand)[0].args[0].input).toMatchObject(
      {
        TableName: "local-notification-assignments",
        ConsistentRead: true,
      }
    );
  });
});
