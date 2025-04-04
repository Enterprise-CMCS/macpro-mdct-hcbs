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
import { Report, ReportStatus } from "types";
import {
  formatMonthDayYear,
  releaseReport,
  reportBasePath,
  useStore,
} from "utils";
import editIcon from "assets/icons/edit/icon_edit_square_gray.svg";

interface DashboardTableProps {
  reports: Report[];
  openAddEditReportModal: Function;
}

export const getStatus = (report: Report) => {
  if (
    report.status === ReportStatus.IN_PROGRESS &&
    report.submissionCount > 1
  ) {
    return "In Revision";
  }
  return report.status;
};

export const HorizontalTable = (
  tableContent: { caption: string; headRow: string[] },
  reports: Report[],
  showEditNameColumn: boolean | undefined,
  showReportSubmissionsColumn: boolean,
  showAdminControlsColumn: boolean | undefined,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  userIsEndUser: boolean | undefined,
  toggleRelease: Function
) => {
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
          <Td>
            {!!report.lastEdited && formatMonthDayYear(report.lastEdited)}
          </Td>
          <Td>{report.lastEditedBy}</Td>
          <Td>{getStatus(report)}</Td>
          {showReportSubmissionsColumn && (
            <Td width="3rem">{report.submissionCount ?? 0}</Td>
          )}
          <Td>
            <Button
              onClick={() => navigate(reportBasePath(report))}
              variant="outline"
            >
              {userIsEndUser && !report.locked ? "Edit" : "View"}
            </Button>
          </Td>
          {showAdminControlsColumn && (
            <>
              <td>
                <Button
                  variant="link"
                  onClick={() => toggleRelease(report)}
                  disabled={report.status !== ReportStatus.SUBMITTED}
                >
                  Unlock
                </Button>
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

export const VerticleTable = (
  reports: Report[],
  showEditNameColumn: boolean | undefined,
  showReportSubmissionsColumn: boolean,
  showAdminControlsColumn: boolean | undefined,
  openAddEditReportModal: Function,
  navigate: NavigateFunction,
  userIsEndUser: boolean | undefined,
  toggleRelease: Function
) => {
  return (
    <VStack alignItems="start" gap={4}>
      {reports.map((report) => (
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
            <Text>{getStatus(report)}</Text>
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
            >
              {userIsEndUser && !report.locked ? "Edit" : "View"}
            </Button>
            {showAdminControlsColumn && (
              <>
                <td>
                  <Button
                    variant="link"
                    onClick={() => toggleRelease(report)}
                    disabled={report.status !== ReportStatus.SUBMITTED}
                  >
                    Unlock
                  </Button>
                </td>
                <td>
                  <Button variant="link">
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

  // Translate role to defined behaviors
  const showEditNameColumn = userIsEndUser;
  const showReportSubmissionsColumn = !userIsEndUser;
  const showAdminControlsColumn = userIsAdmin;
  // const editButtonText = userIsEndUser ? "Edit" : "View";

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

  const toggleReport = async (report: Report) => {
    if (userIsAdmin) {
      await releaseReport(report);
    }
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
          userIsEndUser,
          toggleReport
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
          userIsEndUser,
          toggleReport
        )}
      </Show>
    </>
  );
};
