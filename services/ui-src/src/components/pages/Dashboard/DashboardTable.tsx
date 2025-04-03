import { Button, Image, Td, Tr, VStack } from "@chakra-ui/react";
import { Table } from "components";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Report, UserRoles } from "types";
import { formatMonthDayYear, reportBasePath, useStore } from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";

interface DashboardTableProps {
  reports: Report[];
  readOnlyUser?: boolean;
  openAddEditReportModal: Function;
}

/**
 * Return the dashboard table column headers. If user is admin, there will be
 * an extra empty row that is for the edit report name button column.
 */
const getHeadRow = (readOnlyUser?: boolean) =>
  readOnlyUser
    ? ["Submission name", "Last edited", "Edited by", "Status", ""]
    : ["", "Submission name", "Last edited", "Edited by", "Status", ""];

export const HorizontalTable = (
  tableContent: { caption: string; headRow: string[] },
  reports: Report[],
  readOnlyUser: boolean,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  editButtonText: string
) => {
  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          {!readOnlyUser && (
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

export const VerticleTable = (
  tableContent: { caption: string; headRow: string[] },
  reports: Report[],
  readOnlyUser: boolean,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  editButtonText: string
) => {
  return <VStack></VStack>;
};

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
    headRow: getHeadRow(readOnlyUser),
  };

  return (
    <Table content={tableContent}>
      {reports.map((report) => (
        <Tr key={report.id}>
          {!readOnlyUser && (
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
