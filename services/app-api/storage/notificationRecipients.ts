import { paginateQuery } from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { NotificationRecipientRecord } from "../types/notification";
import { StateAbbr } from "../utils/constants";

const TableName = process.env.NotificationRecipientsTable!;
const client = createClient();

export const queryRecipientsByState = async (
  state: StateAbbr
): Promise<NotificationRecipientRecord[]> => {
  const pages = paginateQuery(
    { client },
    {
      TableName,
      KeyConditionExpression: "#state = :state",
      ExpressionAttributeNames: { "#state": "state" },
      ExpressionAttributeValues: { ":state": state },
    }
  );
  return (await collectPageItems(pages)) as NotificationRecipientRecord[];
};
