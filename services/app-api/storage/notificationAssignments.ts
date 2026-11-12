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

/**
 * One row in the table: a single email subscribed to a single report in a single state.
 *
 * @example
 * { email: "jane@example.com", reportState: "QMS#CO" }
 */
type NotificationRow = { email: string; reportState: string };

/**
 * Turns one assignment into its table rows: every report in every state. Used for UI to API transformation.
 *
 * @example
 * makeRows({
 *   email: "jane@example.com",
 *   states: ["CO", "AL"],
 *   reports: ["QMS", "HA"],
 * });
 * // [
 * //   { email: "jane@example.com", reportState: "QMS#CO" },
 * //   { email: "jane@example.com", reportState: "QMS#AL" },
 * //   { email: "jane@example.com", reportState: "HA#CO" },
 * //   { email: "jane@example.com", reportState: "HA#AL" },
 * // ]
 */
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

/**
 * Turns table rows back into one assignment per email, the shape the API returns.
 * This is the reverse of `makeRows`.
 *
 * @example
 * groupRowsByEmail([
 *   { email: "jane@example.com", reportState: "QMS#CO" },
 *   { email: "jane@example.com", reportState: "QMS#AL" },
 *   { email: "sam@example.com", reportState: "HA#CO" },
 * ]);
 * // [
 * //   { email: "jane@example.com", states: ["CO", "AL"], reports: ["QMS"] },
 * //   { email: "sam@example.com", states: ["CO"], reports: ["HA"] },
 * // ]
 */
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

/**
 * Gets every row stored for one email.
 *
 * @example
 * await getRowsForEmail("jane@example.com");
 * // [
 * //   { email: "jane@example.com", reportState: "QMS#CO" },
 * //   { email: "jane@example.com", reportState: "QMS#AL" },
 * // ]
 */
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

/**
 * Saves an assignment. It replaces whatever was stored for that email, so it
 * works for both creating a new assignment and editing an existing one.
 * Rows that are no longer selected are removed after the new rows are written.
 *
 * @example
 * // Stored before: jane@example.com has QMS#CO and QMS#AL
 * await putNotificationAssignment({
 *   email: "jane@example.com",
 *   states: ["CO"],
 *   reports: ["QMS", "HA"],
 * });
 * // Stored after: jane@example.com has QMS#CO and HA#CO (QMS#AL is deleted)
 */
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

/**
 * Lists every assignment, one object per email. This performs a full table scan, so use it for the admin list and not for per-report lookups.
 *
 * @example
 * await scanNotificationAssignments();
 * // [
 * //   { email: "jane@example.com", states: ["CO", "AL"], reports: ["QMS"] },
 * //   { email: "sam@example.com", states: ["CO"], reports: ["HA"] },
 * // ]
 */
export const scanNotificationAssignments = async () => {
  const pages = paginateScan({ client }, { TableName, ConsistentRead: true });
  const rows = (await collectPageItems(pages)) as NotificationRow[];
  return groupRowsByEmail(rows);
};

/**
 * Finds the emails assigned to one report in one state. This queries the
 * `byReportState` index, so it only reads the matching rows and doesn't scan
 * the table. Index reads can lag very slightly behind a just-saved assignment due to GSI eventual consistency.
 *
 * @example
 * await getEmailsForReportAndState("QMS", "CO");
 * // ["jane@example.com", "sam@example.com"]
 */
export const getEmailsForReportAndState = async (
  report: ReportType,
  state: string
) => {
  const pages = paginateQuery(
    { client },
    {
      TableName,
      IndexName: "byReportState",
      KeyConditionExpression: "reportState = :reportState",
      ExpressionAttributeValues: { ":reportState": `${report}#${state}` },
    }
  );
  const rows = (await collectPageItems(pages)) as NotificationRow[];
  return rows.map((row) => row.email);
};

/**
 * Deletes every row for an email. If the email isn't stored, nothing happens
 * and no error is thrown.
 *
 * @example
 * await deleteNotificationAssignment("jane@example.com");
 * // all of jane's rows (QMS#CO, QMS#AL, ...) are removed
 */
export const deleteNotificationAssignment = async (email: string) => {
  const existingRows = await getRowsForEmail(email);
  await deleteRows(existingRows);
};
