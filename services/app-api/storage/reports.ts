import {
  GetCommand,
  PutCommand,
  paginateQuery,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import {
  collectPageItems,
  createClient as createDynamoClient,
} from "./dynamo/dynamodb-lib";
import { reportTables, StateAbbr } from "../utils/constants";
import { Report, ReportType } from "../types/reports";

const dynamoClient = createDynamoClient();

export const putReport = async (report: Report) => {
  await dynamoClient.send(
    new PutCommand({
      TableName: reportTables[report.type],
      Item: report,
    })
  );
};

export const getReport = async (
  reportType: ReportType,
  state: StateAbbr,
  id: string
) => {
  const table = reportTables[reportType];
  const response = await dynamoClient.send(
    new GetCommand({
      TableName: table,
      Key: { state, id },
    })
  );
  return response.Item as Report | undefined;
};

export const queryReportsForState = async (
  reportType: ReportType,
  state: StateAbbr
) => {
  const table = reportTables[reportType];
  const params: QueryCommandInput = {
    TableName: table,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": state,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };
  const response = paginateQuery({ client: dynamoClient }, params);
  const reports = await collectPageItems(response);

  return reports as Report[];
};
