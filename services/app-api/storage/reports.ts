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
import { Report, ReportType, LiteReport } from "../types/reports";

const dynamoClient = createDynamoClient();

const projectionFields = [
  "id",
  "name",
  "state",
  "created",
  "status",
  "submissionCount",
  "archived",
  "lastEdited",
  "lastEditedBy",
  "type",
  "year",
  "lastEditedByEmail",
  "pages",
];

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

  const ExpressionAttributeNames = Object.fromEntries(
    projectionFields.map((field) => [`#${field}`, field])
  );

  const ProjectionExpression = projectionFields
    .map((field) => `#${field}`)
    .join(", ");

  const params: QueryCommandInput = {
    TableName: table,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": state,
    },
    ExpressionAttributeNames,
    ProjectionExpression,
  };
  const response = paginateQuery({ client: dynamoClient }, params);
  const reports = await collectPageItems(response);

  return reports as LiteReport[];
};
