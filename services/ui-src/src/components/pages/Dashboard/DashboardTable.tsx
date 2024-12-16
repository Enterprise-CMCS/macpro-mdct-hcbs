import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { useNavigate } from "react-router-dom";
import { Report, UserRoles } from "types";
import { formatMonthDayYear, reportBasePath, useStore } from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";

interface DashboardTableProps {
  reports: Report[];
  readOnlyUser?: boolean;
  openAddEditReportModal: Function;
}

export const DashboardTable = ({
  reports,
  readOnlyUser,
  openAddEditReportModal,
}: DashboardTableProps) => {
  const navigate = useNavigate();
  const store = useStore();
  const user = store.user;
  const isStateUser = user?.userRole === UserRoles.STATE_USER;
  const editButtonText = isStateUser ? "Edit" : "View";

  const tableContent = {
    caption: "Quality Measure Reports",
    headRow: ["", "Submission name", "Last edited", "Edited by", "Status", ""],
  };

  // pop off the edit button heading if the user is read only
  if (readOnlyUser) {
    tableContent.headRow.shift();
  }

  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          {!readOnlyUser && (
            <Td fontWeight={"bold"}>
              <button onClick={() => openAddEditReportModal(report)}>
                <Image src={editIcon} alt="Edit Report" />
              </button>
            </Td>
          )}
          <Td fontWeight={"bold"}>
            {report.name ? report.name : "{Name of form}"}
          </Td>
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
