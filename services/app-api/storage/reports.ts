import {
  GetCommand,
  PutCommand,
  paginateQuery,
  QueryCommandInput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  collectPageItems,
  createClient as createDynamoClient,
} from "./dynamo/dynamodb-lib";
import { reportTables, StateAbbr } from "../utils/constants";
import { Report, ReportType, LiteReport } from "../types/reports";

const dynamoClient = createDynamoClient();

const queryProjectionFields = [
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
  "options",
];

export const putReport = async (report: Report) => {
  await dynamoClient.send(
    new PutCommand({
      TableName: reportTables[report.type],
      Item: report,
    })
  );
};

export const updateField = async (
  updateField: string,
  updateValue: string,
  reportType: ReportType,
  state: StateAbbr,
  id: string
) => {
  await dynamoClient.send(
    new UpdateCommand({
      TableName: reportTables[reportType],
      Key: { state, id },
      UpdateExpression: `set #updateField = :updateValue`,
      ExpressionAttributeNames: {
        "#updateField": updateField,
      },
      ExpressionAttributeValues: {
        ":updateValue": updateValue,
      },
    })
  );
};

export const updateFields = async (
  updateFields: Partial<LiteReport>,
  reportType: ReportType,
  state: StateAbbr,
  id: string
) => {
  for (const [key, value] of Object.entries(updateFields)) {
    await updateField(key, value as string, reportType, state, id);
  }
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
    queryProjectionFields.map((field) => [`#${field}`, field])
  );

  const ProjectionExpression = queryProjectionFields
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
