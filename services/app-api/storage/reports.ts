import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient as createDynamoClient } from "./dynamo/dynamodb-lib";
import { StateAbbr } from "../utils/constants";
import { Report, ReportType } from "../types/reports";

const dynamoClient = createDynamoClient();
const reportTables: { [key in ReportType]: string } = {
  QM: process.env.QM_REPORT_TABLE_NAME!,
};

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
