import {
  Button,
  Hide,
  Image,
  Show,
  Td,
  Tr,
  VStack,
  Text,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { Table } from "components";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Report } from "types";
import {
  formatMonthDayYear,
  reportBasePath,
  updateArchivedStatus,
  useStore,
} from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";
import { useState } from "react";

interface DashboardTableProps {
  reports: Report[];
  openAddEditReportModal: Function;
}

export const HorizontalTable = (
  tableContent: { caption: string; headRow: string[] },
  reports: Report[],
  showEditNameColumn: boolean | undefined,
  showReportSubmissionsColumn: boolean,
  showAdminControlsColumn: boolean | undefined,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  toggleArchived: Function,
  editButtonText: string
) => {
  return (
    <Table content={tableContent}>
      {reports.map((report, idx) => (
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
          <Td>
            {!!report.lastEdited && formatMonthDayYear(report.lastEdited)}
          </Td>
          <Td>{report.lastEditedBy}</Td>
          <Td>{report.status}</Td>
          {showReportSubmissionsColumn && (
            <Td width="3rem">{report.submissionCount ?? 0}</Td>
          )}
          <Td>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
              disabled={report.archived}
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
                <Button
                  variant="link"
                  onClick={async () => await toggleArchived(idx)}
                >
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

export const VerticleTable = (
  reports: Report[],
  showEditNameColumn: boolean | undefined,
  showReportSubmissionsColumn: boolean,
  showAdminControlsColumn: boolean | undefined,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  toggleArchived: Function,
  editButtonText: string
) => {
  return (
    <VStack alignItems="start" gap={4}>
      {reports.map((report, idx) => (
        <>
          <div>
            <Text variant="grey">Submission name</Text>
            <HStack>
              {showEditNameColumn && (
                <button onClick={() => openAddEditReportModal(report)}>
                  <Image src={editIcon} alt="Edit Report Name" />
                </button>
              )}
              <Text fontWeight="bold">{report.name}</Text>
            </HStack>
          </div>
          <HStack gap="4rem">
            <div>
              <Text variant="grey">Last Edited</Text>
              <Text>{formatMonthDayYear(report.lastEdited!)}</Text>
            </div>
            <div>
              <Text variant="grey">Edited By</Text>
              <Text>{report.lastEditedBy}</Text>
            </div>
          </HStack>
          <div>
            <Text variant="grey">Status</Text>
            <Text>{report.status}</Text>
          </div>
          {showReportSubmissionsColumn && (
            <Text>{report.submissionCount ?? 0}</Text>
          )}
          <HStack gap={"6"}>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
              width="100px"
              height="30px"
              fontSize="sm"
              disabled={report.archived}
            >
              {editButtonText}
            </Button>
            {showAdminControlsColumn && (
              <>
                <td>
                  <Button variant="link">Unlock</Button>
                </td>
                <td>
                  <Button
                    variant="link"
                    onClick={async () => await toggleArchived(idx)}
                  >
                    {report.archived ? "Unarchive" : "Archive"}
                  </Button>
                </td>
              </>
            )}
          </HStack>
          <Divider></Divider>
        </>
      ))}
    </VStack>
  );
};

export const DashboardTable = ({
  reports,
  openAddEditReportModal,
}: DashboardTableProps) => {
  const navigate = useNavigate();
  const { userIsAdmin, userIsEndUser } = useStore().user ?? {};
  const [reportsInView, setReportsInView] = useState<Report[]>(reports);

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

  const toggleArchived = async (idx: number) => {
    const reports = [...reportsInView];
    const report = reports[idx];
    await updateArchivedStatus(report, !report.archived);
    report.archived = !report.archived;
    reports[idx] = report;
    setReportsInView(reports);
  };

  return (
    <>
      <Hide below="sm">
        {HorizontalTable(
          tableContent,
          reports,
          showEditNameColumn,
          showReportSubmissionsColumn,
          showAdminControlsColumn,
          openAddEditReportModal,
          navigate,
          toggleArchived,
          editButtonText
        )}
      </Hide>
      <Show below="sm">
        {VerticleTable(
          reports,
          showEditNameColumn,
          showReportSubmissionsColumn,
          showAdminControlsColumn,
          openAddEditReportModal,
          navigate,
          toggleArchived,
          editButtonText
        )}
      </Show>
    </>
  );
};
