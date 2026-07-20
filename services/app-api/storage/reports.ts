import {
  paginateQuery,
  QueryCommandInput,
  UpdateCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  collectPageItems,
  createClient as createDynamoClient,
} from "./dynamo/dynamodb-lib";
import { reportTables, StateAbbr } from "../utils/constants";
import { Report, ReportType, LiteReport } from "../types/reports";

const dynamoClient = createDynamoClient();

export const putReport = async (report: Report) => {
  const tableName = reportTables[report.type];
  const items = [
    {
      ...report,
      pages: report.pages.map((page) => [report.id, page.id].join("#")),
      sortKey: report.id,
    },
    ...report.pages.map((page) => ({
      ...page,
      state: report.state,
      sortKey: [report.id, page.id].join("#"),
    })),
  ];

  /** DynamoDB only allows this many items in a single BatchWriteCommand */
  const MAX_BATCH_SIZE = 25;
  for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
    const batch = items.slice(i, i + MAX_BATCH_SIZE);
    const command = new BatchWriteCommand({
      RequestItems: {
        [reportTables[report.type]]: batch.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    });
    const response = await dynamoClient.send(command);
    if (response.UnprocessedItems?.[tableName]?.length) {
      const unprocessedIds = response.UnprocessedItems[tableName]
        .map((req) => req.PutRequest!.Item!.sortKey)
        .join(", ");
      throw new Error(`Failed to insert item(s): [${unprocessedIds}]`);
    }
  }
};

export const updateFields = async (
  updateFields: Partial<LiteReport>,
  reportType: ReportType,
  state: StateAbbr,
  id: string
) => {
  const UpdateExpression =
    "SET " +
    Object.keys(updateFields)
      .map((name) => `#${name} = :${name}`)
      .join(", ");

  const ExpressionAttributeNames = Object.fromEntries(
    Object.keys(updateFields).map((name) => [`#${name}`, name])
  );

  const ExpressionAttributeValues = Object.fromEntries(
    Object.entries(updateFields).map(([name, value]) => [`:${name}`, value])
  );

  await dynamoClient.send(
    new UpdateCommand({
      TableName: reportTables[reportType],
      Key: { state, sortKey: id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
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
    new QueryCommand({
      TableName: table,
      KeyConditionExpression: "#state = :state AND begins_with(sortKey, :id)",
      ExpressionAttributeNames: { "#state": "state" },
      ExpressionAttributeValues: { ":state": state, ":id": id },
    })
  );
  const items = response.Items ?? [];
  const liteReport = items.find((i) => i.sortKey === id);
  if (!liteReport) return undefined;

  liteReport.pages = liteReport.pages.map((pageSortKey: string) =>
    items.find((i) => i.sortKey === pageSortKey)
  );
  if (liteReport.pages.some((page: object) => !page)) {
    throw new Error(`Could not find all pages for report ${id}`);
  }
  delete liteReport.sortKey;
  for (let page of liteReport.pages) {
    delete page.sortKey;
    delete page.state;
  }
  return liteReport as Report;
};

export const queryReportsForState = async (
  reportType: ReportType,
  state: StateAbbr
) => {
  const table = reportTables[reportType];
  const liteReportProperties = [
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
    "sortKey",
  ];

  const ExpressionAttributeNames = Object.fromEntries(
    liteReportProperties.map((field) => [`#${field}`, field])
  );

  const ProjectionExpression = liteReportProperties
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
  let reports = await collectPageItems(response);

  // The query also returns pages, which we don't want. But a page sortKey
  // is `reportId#pageId`, whereas a report sortKey is just the report id.
  reports = reports.filter((item) => item.id === item.sortKey) as LiteReport[];
  for (let report of reports) {
    delete report.sortKey;
  }
  return reports;
};
