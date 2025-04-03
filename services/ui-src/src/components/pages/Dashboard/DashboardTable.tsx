import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { useNavigate } from "react-router-dom";
import { Report } from "types";
import { formatMonthDayYear, reportBasePath, useStore } from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";

interface DashboardTableProps {
  reports: Report[];
  openAddEditReportModal: Function;
}

export const DashboardTable = ({
  reports,
  openAddEditReportModal,
}: DashboardTableProps) => {
  const navigate = useNavigate();
  const { userIsAdmin, userIsEndUser } = useStore().user ?? {};

  // Translate role to defined behaviors
  const showEditNameColumn = userIsEndUser;
  const showReportSubmissionsColumn = !userIsEndUser;
  const showAdminControlsColumn = userIsAdmin;
  const editButtonText = userIsEndUser ? "Edit" : "View";

  // Build header columns based on defined behaviors per role
  const headers = [];
  if (showEditNameColumn) headers.push("");
  headers.push(...["Submission name", "Last edited", "Edited by", "Status"]);
  if (showReportSubmissionsColumn) headers.push("#");
  headers.push("");

  const tableContent = {
    caption: "Quality Measure Reports",
    headRow: headers,
  };

  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          {showEditNameColumn && (
            <Td fontWeight={"bold"}>
              <button onClick={() => openAddEditReportModal(report)}>
                <Image src={editIcon} alt="Edit Report Name" />
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
          {showReportSubmissionsColumn && <Td>{report.submissionCount}</Td>}
          <Td>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
            >
              {editButtonText}
            </Button>
          </Td>
          {showAdminControlsColumn && (
            <>
              <td>
                <Button variant="link">Unlock</Button>
              </td>
              <td>
                <Button variant="link">
                  {report.archived ? "Unarchive" : "Archive"}
                </Button>
              </td>
            </>
          )}
        </Tr>
      ))}
    </Table>
  );
};
