import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient as createDynamoClient } from "./dynamo/dynamodb-lib";
import { reportTables, State } from "../utils/constants";
import { Report, ReportType } from "../types/reports";
import { logger } from "../libs/debug-lib";

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
  state: State,
  id: string
) => {
  const table = reportTables[reportType];
  logger.debug(table, reportType, state, id);
  const response = await dynamoClient.send(
    new GetCommand({
      TableName: table,
      Key: { state, id },
    })
  );
  return response.Item as Report | undefined;
};
