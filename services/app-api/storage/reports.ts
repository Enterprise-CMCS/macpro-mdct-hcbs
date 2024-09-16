import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient as createDynamoClient } from "../libs/dynamo/dynamodb-lib";
import { reportTables, ReportType, State } from "../utils/constants";
import { Report } from "../types/reports";
import { logger } from "../libs/debug-lib";

const dynamoClient = createDynamoClient();

export const putReport = async (report: Report) => {
  await dynamoClient.send(
    new PutCommand({
      TableName: reportTables[report.reportType],
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
