import { DeleteCommand, PutCommand, paginateScan } from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { NotificationAssignment } from "../types/notification";

const TableName = process.env.NotificationAssignmentsTable;
const client = createClient();

export const createNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  await client.send(
    new PutCommand({
      TableName,
      Item: assignment,
      ConditionExpression: "attribute_not_exists(email)",
    })
  );
};

export const scanNotificationAssignments = async () => {
  const pages = paginateScan({ client }, { TableName, ConsistentRead: true });
  return (await collectPageItems(pages)) as NotificationAssignment[];
};

export const updateNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  await client.send(
    new PutCommand({
      TableName,
      Item: assignment,
      ConditionExpression: "attribute_exists(email)",
    })
  );
};

export const deleteNotificationAssignment = async (email: string) => {
  await client.send(
    new DeleteCommand({
      TableName,
      Key: { email },
      ConditionExpression: "attribute_exists(email)",
    })
  );
};
