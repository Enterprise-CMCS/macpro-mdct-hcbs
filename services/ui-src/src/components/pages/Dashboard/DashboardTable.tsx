import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { Table } from "components";
import { useNavigate } from "react-router-dom";
import { Report, UserRoles } from "types";
import { formatMonthDayYear, reportBasePath, useStore } from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";

interface DashboardTableProps {
  reports: Report[];
  openAddEditReportModal: Function;
}

/**
 * Return the dashboard table column headers. If user is admin, there will be
 * an extra empty row that is for the edit report name button column.
 */
const getHeadRow = (role: string | undefined) =>
  role === UserRoles.ADMIN
    ? ["Submission name", "Last edited", "Edited by", "Status", "#", ""]
    : ["", "Submission name", "Last edited", "Edited by", "Status", ""];

export const DashboardTable = ({
  reports,
  openAddEditReportModal,
}: DashboardTableProps) => {
  const navigate = useNavigate();
  const { user } = useStore();
  const role = user?.userRole;

  const editButtonText = role === UserRoles.STATE_USER ? "Edit" : "View";

  const tableContent = {
    caption: "Quality Measure Reports",
    headRow: getHeadRow(role),
  };

  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          {role === UserRoles.STATE_USER && (
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
          {role === UserRoles.ADMIN && <Td>{report.submissionCount}</Td>}
          <Td>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
            >
              {editButtonText}
            </Button>
          </Td>
          {role === UserRoles.ADMIN && (
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
