import { PutCommand, paginateScan } from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { Notification } from "../types/notification";

const notificationTableName = process.env.NotificationsTable;
const client = createClient();

export const putNotifications = async (notification: Notification) => {
  await client.send(
    new PutCommand({
      TableName: notificationTableName,
      Item: notification,
    })
  );
};

export const scanAllNotifications = async () => {
  const pages = paginateScan({ client }, { TableName: notificationTableName });
  const items = await collectPageItems(pages);
  return items as Notification[];
};
