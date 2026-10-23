import { beforeEach, describe, expect, it } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { queryRecipientsByState } from "./notificationRecipients";
import { NotificationRecipientRecord } from "../types/notification";

const mockDynamo = mockClient(DynamoDBDocumentClient);
const recipient: NotificationRecipientRecord = {
  state: "NJ",
  id: "reviewer",
  email: "reviewer@example.com",
};

describe("Notification recipient storage", () => {
  beforeEach(() => {
    mockDynamo.reset();
  });

  it("should query by state and collect all pages", async () => {
    const key = { state: "NJ", id: "reviewer" };
    mockDynamo
      .on(QueryCommand)
      .resolvesOnce({ Items: [recipient], LastEvaluatedKey: key })
      .resolvesOnce({ Items: [{ ...recipient, id: "second" }] });
    expect(await queryRecipientsByState("NJ")).toHaveLength(2);
    const calls = mockDynamo.commandCalls(QueryCommand);
    expect(calls[0].args[0].input).toMatchObject({
      KeyConditionExpression: "#state = :state",
      ExpressionAttributeNames: { "#state": "state" },
      ExpressionAttributeValues: { ":state": "NJ" },
    });
    expect(calls[1].args[0].input.ExclusiveStartKey).toEqual(key);
  });

  it("should return no recipients for an unassigned state", async () => {
    mockDynamo.on(QueryCommand).resolves({});
    expect(await queryRecipientsByState("NJ")).toEqual([]);
  });

  it("should propagate database failures", async () => {
    mockDynamo.on(QueryCommand).rejects("Dynamo unavailable");
    await expect(queryRecipientsByState("NJ")).rejects.toThrow(
      "Dynamo unavailable"
    );
  });
});
