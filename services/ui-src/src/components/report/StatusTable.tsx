import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { postSubmitReport, useStore } from "utils";
import editIconPrimary from "assets/icons/edit/icon_edit_primary.svg";
import lookupIconPrimary from "assets/icons/search/icon_search_primary.svg";
import { PageStatus, ParentPageTemplate, ReportStatus } from "types/report";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { reportBasePath } from "utils/other/routing";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { SubmitReportModal } from "./SubmitReportModal";

export const StatusTableElement = () => {
  const {
    pageMap,
    report,
    user,
    setModalComponent,
    setModalOpen,
    updateReport,
  } = useStore();
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  if (!pageMap || !report) {
    return null;
  }

  const childPages = (report.pages[pageMap.get("root")!] as ParentPageTemplate)
    .childPageIds;
  const sections = childPages.slice(0, -1).map((id) => {
    const pageIdx = pageMap.get(id);
    if (!pageIdx) return null;
    const section = report.pages[pageIdx] as ParentPageTemplate;
    let displayStatus = inferredReportStatus(report, section.id);
    let submittable = displayStatus === PageStatus.COMPLETE;

    if (section.id === "optional-measure-result") {
      submittable = displayStatus !== PageStatus.IN_PROGRESS;
      if (displayStatus === PageStatus.NOT_STARTED) displayStatus = undefined;
    }

    return {
      section: section,
      displayStatus: displayStatus,
      submittable: submittable,
    };
  });

  const submittable = () => {
    const allPagesSubmittable = sections.every(
      (sectionInfo) => !!sectionInfo?.submittable
    );
    return report.status !== ReportStatus.SUBMITTED && allPagesSubmittable;
  };

  const handleEditClick = (sectionId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${sectionId}`;
    navigate(path);
  };

  const onSubmit = async () => {
    const submittedReport = await postSubmitReport(report);
    updateReport(submittedReport);
    setModalOpen(false);
  };

  const modal = SubmitReportModal(() => setModalOpen(false), onSubmit);

  const displayModal = () => {
    setModalComponent(modal, "Are you sure you want to submit?");
  };
  // Build Rows

  const rows = sections.map((sectionDetails, index) => {
    if (!sectionDetails) return;
    const { section, displayStatus: status } = sectionDetails;
    return (
      <Tr key={section.id || index} p={0}>
        <Td>
          <Text>{section.title}</Text>
        </Td>
        <Td>
          <TableStatusIcon tableStatus={status} isPdf={true} />
        </Td>
        <Td>
          <Button
            variant="outline"
            leftIcon={<Image src={editIconPrimary} />}
            onClick={() => handleEditClick(section.id)}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  });
  return (
    <>
      <Table variant="status">
        <Thead>
          <Tr>
            <Th>Section</Th>
            <Th>Status</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
      <Stack
        direction="row"
        width="100%"
        display="flex"
        justifyContent="space-between"
        mt={5}
      >
        <Button
          as={RouterLink}
          to={reportBasePath(report) + "/export"}
          target="_blank"
          colorScheme="blue"
          variant="outline"
          leftIcon={<Image src={lookupIconPrimary} />}
        >
          Review PDF
        </Button>
        {user?.userIsEndUser && (
          <Button
            alignSelf="flex-end"
            onClick={async () => displayModal()}
            onBlur={(event) => {
              event.stopPropagation();
            }}
            disabled={!submittable()}
          >
            Submit QMS Report
          </Button>
        )}
      </Stack>
    </>
  );
};
