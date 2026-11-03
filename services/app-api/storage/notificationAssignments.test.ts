import { beforeEach, describe, expect, it } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  deleteNotificationAssignment,
  getEmailsForReportAndState,
  putNotificationAssignment,
  scanNotificationAssignments,
} from "./notificationAssignments";
import { NotificationAssignment } from "../types/notification";
import { ReportType } from "../types/reports";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const TableName = "local-notification-assignments";
const assignment: NotificationAssignment = {
  email: "po@example.com",
  states: ["AL", "CO"],
  reports: [ReportType.HA],
};
const rows = assignment.states.map((state) => ({
  email: assignment.email,
  reportState: `${ReportType.HA}#${state}`,
}));
const puts = () =>
  mockDynamo.commandCalls(PutCommand).map((call) => call.args[0].input);
const deletes = () =>
  mockDynamo.commandCalls(DeleteCommand).map((call) => call.args[0].input);

describe("Notification assignment storage", () => {
  beforeEach(() => mockDynamo.reset());

  it("puts one row per report and state for a new email", async () => {
    mockDynamo.on(QueryCommand).resolves({ Items: [] });
    mockDynamo.on(PutCommand).resolves({});
    await putNotificationAssignment(assignment);
    expect(puts()).toEqual(rows.map((Item) => ({ TableName, Item })));
    expect(deletes()).toEqual([]);
  });

  it("puts current rows and deletes removed ones for an existing email", async () => {
    mockDynamo.on(QueryCommand).resolves({
      Items: [rows[0], { email: assignment.email, reportState: "OLD#TX" }],
    });
    mockDynamo.on(PutCommand).resolves({});
    mockDynamo.on(DeleteCommand).resolves({});
    await putNotificationAssignment(assignment);
    expect(puts()).toEqual(rows.map((Item) => ({ TableName, Item })));
    expect(deletes()).toEqual([
      {
        TableName,
        Key: { email: assignment.email, reportState: "OLD#TX" },
      },
    ]);
  });

  it("deletes every row for an email", async () => {
    mockDynamo.on(QueryCommand).resolves({ Items: rows });
    mockDynamo.on(DeleteCommand).resolves({});
    await deleteNotificationAssignment(assignment.email);
    expect(deletes()).toEqual(
      rows.map(({ email, reportState }) => ({
        TableName,
        Key: { email, reportState },
      }))
    );
  });

  it("does nothing when deleting an email with no rows", async () => {
    mockDynamo.on(QueryCommand).resolves({ Items: [] });
    await deleteNotificationAssignment("none@x.com");
    expect(mockDynamo.commandCalls(DeleteCommand)).toHaveLength(0);
  });

  it("gets emails through the byReportState index, with no scan", async () => {
    mockDynamo.on(QueryCommand).resolves({ Items: [{ email: "a@x.com" }] });
    expect(await getEmailsForReportAndState(ReportType.HA, "AL")).toEqual([
      "a@x.com",
    ]);
    expect(
      mockDynamo.commandCalls(QueryCommand)[0].args[0].input
    ).toMatchObject({
      IndexName: "byReportState",
      KeyConditionExpression: "reportState = :rs",
      ExpressionAttributeValues: { ":rs": `${ReportType.HA}#AL` },
    });
    expect(mockDynamo.commandCalls(ScanCommand)).toHaveLength(0);
  });

  it("loads every page with consistent reads and regroups rows by email", async () => {
    mockDynamo
      .on(ScanCommand)
      .resolvesOnce({
        Items: [rows[0]],
        LastEvaluatedKey: rows[0],
      })
      .resolvesOnce({
        Items: [
          rows[1],
          { email: "second@example.com", reportState: rows[0].reportState },
        ],
      });
    expect(await scanNotificationAssignments()).toEqual([
      assignment,
      { email: "second@example.com", states: ["AL"], reports: [ReportType.HA] },
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
