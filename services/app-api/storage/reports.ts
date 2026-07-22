/*
 * Reports are stored with a heterogenous, single-table schema.
 *
 * Single table: All report types (QMS, PCP, etc) are stored in the same table.
 * The partition key (`pKey`) includes both the report type and the state.
 * This gives us performance roughly equivalent to table-per-type,
 * without the operational complexity of creating and managing many tables.
 * We never query for multiple states at once, or multiple types at once.
 *
 * Heterogenous: This table contains Report items and Page items.
 * The rest of the app treats a 5-page report as one object,
 * but we store it as six separate objects: the report plus its five pages.
 * A report's `sortKey` is just its ID, but a page's `sortKey`
 * contains its report's ID as well as its own (page) ID.
 * Breaking things up this way keeps us under the DynamoDB item size limit,
 * while still allowing for very fast queries.
 *
 * The `pKey` and `sortKey` properties are created on-the-fly when we send
 * the report to DynamoDB, and stripped out when we query the report back;
 * the rest of the application has no idea these two properties exist.
 * For an example of how the report pages are disassembled and reassembled,
 * see this code's unit tests.
 */

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
import { StateAbbr } from "../utils/constants";
import { Report, ReportType, LiteReport } from "../types/reports";

const TableName = process.env.ReportsTable!;
const dynamoClient = createDynamoClient();

export const putReport = async (report: Report) => {
  const items = [
    {
      ...report,
      pKey: `${report.type}#${report.state}`,
      sortKey: report.id,
      pages: report.pages.map((page) => `${report.id}#${page.id}`),
    },
    ...report.pages.map((page) => ({
      ...page,
      pKey: `${report.type}#${report.state}`,
      sortKey: `${report.id}#${page.id}`,
    })),
  ];

  /** DynamoDB only allows this many items in a single BatchWriteCommand */
  const MAX_BATCH_SIZE = 25;
  for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
    const batch = items.slice(i, i + MAX_BATCH_SIZE);
    const command = new BatchWriteCommand({
      RequestItems: {
        [TableName]: batch.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    });
    const response = await dynamoClient.send(command);
    if (response.UnprocessedItems?.[TableName]?.length) {
      const unprocessedIds = response.UnprocessedItems[TableName]
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
  await dynamoClient.send(
    new UpdateCommand({
      TableName,
      Key: { pKey: `${reportType}#${state}`, sortKey: id },
      UpdateExpression:
        "SET " +
        Object.keys(updateFields)
          .map((name) => `#${name} = :${name}`)
          .join(", "),
      ExpressionAttributeNames: Object.fromEntries(
        Object.keys(updateFields).map((name) => [`#${name}`, name])
      ),
      ExpressionAttributeValues: Object.fromEntries(
        Object.entries(updateFields).map(([name, value]) => [`:${name}`, value])
      ),
    })
  );
};

export const getReport = async (
  reportType: ReportType,
  state: StateAbbr,
  id: string
) => {
  const response = await dynamoClient.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: "pKey = :pKey AND begins_with(sortKey, :id)",
      ExpressionAttributeValues: {
        ":pKey": `${reportType}#${state}`,
        ":id": id,
      },
    })
  );
  const items = response.Items ?? [];
  const liteReport = items.find((item) => item.sortKey === id);
  if (!liteReport) return undefined;

  liteReport.pages = liteReport.pages.map((pageSortKey: string) =>
    items.find((i) => i.sortKey === pageSortKey)
  );
  if (liteReport.pages.some((page: object) => !page)) {
    throw new Error(`Could not find all pages for report ${id}`);
  }
  delete liteReport.pKey;
  delete liteReport.sortKey;
  for (let page of liteReport.pages) {
    delete page.pKey;
    delete page.sortKey;
  }
  return liteReport as Report;
};

export const queryReportsForState = async (
  reportType: ReportType,
  state: StateAbbr
) => {
  const params: QueryCommandInput = {
    TableName,
    KeyConditionExpression: "pKey = :pKey",
    ExpressionAttributeValues: { ":pKey": `${reportType}#${state}` },
  };
  const response = paginateQuery({ client: dynamoClient }, params);
  const items = await collectPageItems(response);
  return (items as ReportTableItem[]).filter(isStoredReport).map(toLiteReport);
};

/** Is this item a StoredReport or StoredPage? */
function isStoredReport(item: ReportTableItem): item is StoredReport {
  return item.id === item.sortKey;
}

/** Strip out storage fields and the array of page sortKeys. */
function toLiteReport(report: Partial<StoredReport>): LiteReport {
  delete report.pKey;
  delete report.sortKey;
  delete report.pages;
  return report as LiteReport;
}

type ReportTableItem = StoredReport | StoredPage;

type ReportPage = Report["pages"][number];

type StoredReport = Omit<Report, "pages"> & {
  pKey: `${ReportType}#${StateAbbr}`;
  sortKey: Report["id"];
  pages: StoredPage["sortKey"][];
};

type StoredPage = ReportPage & {
  pKey: StoredReport["pKey"];
  sortKey: `${Report["id"]}#${ReportPage["id"]}`;
};
