# Notification assignments table

With `notificationsSystem` enabled, the Notifications Settings page loads saved
assignments and persists Add Email submissions through the admin-only page.

Developers can interact with the DynamoDB table through the primary three call patterns:
`GET /notification-assignments`, `PUT /notification-assignments`, and `DELETE /notification-assignments/{email}`
endpoints.

Assignments are stored in the `${stage}-notification-assignments` DynamoDB table,
separately from the report-category notification settings. Email addresses are
trimmed and otherwise stored as entered.

Get returns every assignment and runs a whole table scan.

Put overwrites always, but has a guard clause on the UI side (not API) that checks for existence of the email in the table before overwrite.

Delete removes the assignment from the `${stage}-notification-assignments` DynamoDB table.

The table also has a secondary call pattern used for the hot path of fetching emails by Report#State at the
`GET /notification-assignments/emails/{reportType}/{state}` endpoint.

The information is stored in this format:
| email | reportState |
| ---------------- | ----------- |
| jane@example.com | QMS#CO |
| jane@example.com | QMS#AL |
| jane@example.com | HA#CO |
| jane@example.com | HA#AL |

It queries the byReportState GSI which is keyed on reportState (ex. `QMS#CO`), but since the table is stored as one row per email, report, and state, the query will only fetch matching rows
(thereby not needing a full table scan).
