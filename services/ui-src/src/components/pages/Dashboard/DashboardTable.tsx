import { Button, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { useNavigate } from "react-router-dom";
import { Report, UserRoles } from "types";
import { formatMonthDayYear, reportBasePath, useStore } from "utils";

interface DashboardTableProps {
  reports: Report[];
}

export const DashboardTable = ({ reports }: DashboardTableProps) => {
  const navigate = useNavigate();
  const store = useStore();
  const user = store.user;
  const isStateUser = user?.userRole === UserRoles.STATE_USER;
  const editButtonText = isStateUser ? "Edit" : "View";

  const tableContent = {
    caption: "Quality Measure Reports",
    headRow: ["Submission name", "Last edited", "Edited by", "Status", ""],
  };

  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          <Td fontWeight={"bold"}>{"{Name of form}"}</Td>
          <Td minWidth={"25rem"}>
            {!!report.lastEdited && formatMonthDayYear(report.lastEdited)}
          </Td>
          <Td>{report.lastEditedBy}</Td>
          <Td>{report.status}</Td>
          <Td>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
            >
              {editButtonText}
            </Button>
          </Td>
        </Tr>
      ))}
    </Table>
  );
};
