import {
  DeleteCommand,
  PutCommand,
  paginateQuery,
  paginateScan,
} from "@aws-sdk/lib-dynamodb";
import { collectPageItems, createClient } from "./dynamo/dynamodb-lib";
import { NotificationAssignment } from "../types/notification";
import { ReportType } from "../types/reports";
import { StateAbbr } from "../utils/constants";

const TableName = process.env.NotificationAssignmentsTable;
const client = createClient();

// An email is stored as one row per report and state, e.g. "QMS#CO".
type NotificationRow = { email: string; reportState: string };

// Turns one assignment into its rows: reports [QMS, IMA] x states [CO, AL] = 4 rows.
const makeRows = (assignment: NotificationAssignment) => {
  const rows: NotificationRow[] = [];
  for (const report of assignment.reports) {
    for (const state of assignment.states) {
      rows.push({
        email: assignment.email,
        reportState: `${report}#${state}`,
      });
    }
  }
  return rows;
};

// Turns rows back into one assignment per email, which is what the API returns.
const groupRowsByEmail = (rows: NotificationRow[]) => {
  const assignments = new Map<string, NotificationAssignment>();
  for (const row of rows) {
    const [report, state] = row.reportState.split("#");

    if (!assignments.has(row.email)) {
      assignments.set(row.email, { email: row.email, states: [], reports: [] });
    }
    const assignment = assignments.get(row.email)!;

    if (!assignment.states.includes(state as StateAbbr)) {
      assignment.states.push(state as StateAbbr);
    }
    if (!assignment.reports.includes(report as ReportType)) {
      assignment.reports.push(report as ReportType);
    }
  }
  return [...assignments.values()];
};

const getRowsForEmail = async (email: string) => {
  const pages = paginateQuery(
    { client },
    {
      TableName,
      ConsistentRead: true,
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    }
  );
  return (await collectPageItems(pages)) as NotificationRow[];
};

/**
 * Puts each row into the DynamoDB table concurrently. Note that this is *NOT* an atomic operation and could result in partial failures. If issues
 * arise it may be worth writing a transactional operation to replace this method.
 *
 * @param rows
 * @returns
 */
const putRows = async (rows: NotificationRow[]) => {
  await Promise.all(
    rows.map((row) => client.send(new PutCommand({ TableName, Item: row })))
  );
};

/**
 * Deletes each row from the DynamoDB table concurrently. Note that this is *NOT* an atomic operation and could result in partial failures. If issues
 * arise it may be worth writing a transactional operation to replace this method.
 *
 * @param rows
 * @returns
 */
const deleteRows = async (rows: NotificationRow[]) => {
  await Promise.all(
    rows.map((row) => {
      const Key = { email: row.email, reportState: row.reportState };
      return client.send(new DeleteCommand({ TableName, Key }));
    })
  );
};

export const putNotificationAssignment = async (
  assignment: NotificationAssignment
) => {
  const existingRows = await getRowsForEmail(assignment.email);

  const newRows = makeRows(assignment);
  const newKeys = newRows.map((row) => row.reportState);
  const rowsToDelete = existingRows.filter(
    (row) => !newKeys.includes(row.reportState)
  );

  await putRows(newRows);
  await deleteRows(rowsToDelete);
};

export const scanNotificationAssignments = async () => {
  const pages = paginateScan({ client }, { TableName, ConsistentRead: true });
  const rows = (await collectPageItems(pages)) as NotificationRow[];
  return groupRowsByEmail(rows);
};

export const getEmailsForReportAndState = async (
  report: ReportType,
  state: string
) => {
  const pages = paginateQuery(
    { client },
    {
      TableName,
      IndexName: "byReportState",
      KeyConditionExpression: "reportState = :rs",
      ExpressionAttributeValues: { ":rs": `${report}#${state}` },
    }
  );
  const rows = (await collectPageItems(pages)) as NotificationRow[];
  return rows.map((row) => row.email);
};

export const deleteNotificationAssignment = async (email: string) => {
  const existingRows = await getRowsForEmail(email);
  await deleteRows(existingRows);
};
