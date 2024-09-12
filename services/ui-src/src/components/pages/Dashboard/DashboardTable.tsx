import { Table } from "components";
import { AnyObject, TableContentShape, ReportMetadataShape } from "types";

export const DashboardTable = ({ body }: DashboardTableProps) => (
  <Table content={tableBody(body.table, false)} sx={sx.table}></Table>
);

interface DashboardTableProps {
  reportsByState: ReportMetadataShape[] | undefined;
  body: { table: AnyObject };
}

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

const sx = {
  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray_medium",
      fontWeight: "bold",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    td: {
      minWidth: "6rem",
      padding: "0.5rem 0.75rem",
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
      "&:first-of-type": {
        minWidth: "2rem",
      },
    },
  },
  copyOverText: {
    fontSize: "xs",
    fontWeight: "300",
    color: "palette.gray_medium",
  },
  archivedText: {
    paddingLeft: 3,
  },
};
