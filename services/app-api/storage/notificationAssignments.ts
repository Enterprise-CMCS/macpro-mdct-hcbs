import { paginateScan } from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { NotificationAssignment } from "../types/notification";

const tableName = process.env.NotificationAssignmentsTable;
const client = createClient();

export const scanNotificationAssignments = async () => {
  const pages = paginateScan(
    { client },
    { TableName: tableName, ConsistentRead: true }
  );
  return (await collectPageItems(pages)) as NotificationAssignment[];
};
