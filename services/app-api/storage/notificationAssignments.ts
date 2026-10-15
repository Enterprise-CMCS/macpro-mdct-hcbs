import { PutCommand, paginateScan } from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { NotificationAssignment } from "../types/notification";

const tableName = process.env.NotificationAssignmentsTable;
const client = createClient();

export const createNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: assignment,
      ConditionExpression: "attribute_not_exists(email)",
    })
  );
};

export const scanNotificationAssignments = async () => {
  const pages = paginateScan(
    { client },
    { TableName: tableName, ConsistentRead: true }
  );
  return (await collectPageItems(pages)) as NotificationAssignment[];
};

export const updateNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  await client.send(
    new PutCommand({
      TableName: tableName,
      Item: assignment,
      ConditionExpression: "attribute_exists(email)",
    })
  );
};
