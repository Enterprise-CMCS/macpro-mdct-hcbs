import { Table } from "components";
import { AnyObject, TableContentShape, ReportMetadataShape } from "types";

export const DashboardTable = ({ body }: DashboardTableProps) => (
  <Table content={tableBody(body.table, false)}></Table>
);

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[] | undefined;
  body: { table: AnyObject };
}

export const getStatus = (
  status: string,
  archived?: boolean,
  submissionCount?: number
) => {
  if (archived) {
    return `Archived`;
  }
  if (
    submissionCount &&
    submissionCount >= 1 &&
    !status.includes("Submitted")
  ) {
    return `In revision`;
  }
  return status;
};

const tableBody = (body: TableContentShape, isAdmin: boolean) => {
  var tableContent = body;
  if (!isAdmin) {
    tableContent.headRow = tableContent.headRow!.filter((e) => e !== "#");
    return tableContent;
  } else {
    tableContent.headRow = tableContent.headRow!.filter(
      (e) => e !== "Due date" && e !== "Target populations"
    );
  }
  return body;
};
