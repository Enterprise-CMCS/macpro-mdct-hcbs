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
import { useStore, submitReport } from "utils";
import editIconPrimary from "assets/icons/edit/icon_edit_primary.svg";
import lookupIconPrimary from "assets/icons/search/icon_search_primary.svg";
import { PageStatus, ParentPageTemplate, ReportStatus } from "types/report";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { reportBasePath } from "utils/other/routing";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";

export const StatusTableElement = () => {
  const { pageMap, report, user } = useStore();
  const { reportType, state, reportId } = useParams();

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

  const navigate = useNavigate();

  const handleEditClick = (sectionId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${sectionId}`;
    navigate(path);
  };

  // Build Rows

  // TODO: figure our how optional plays on this table
  const rows = sections.map((sectionDetails, index) => {
    if (!sectionDetails) return;
    const { section, displayStatus: status } = sectionDetails;
    return (
      <Tr key={section.id || index} p={0}>
        <Td>
          <Text>{section.title}</Text>
        </Td>
        <Td>
          {/* TODO: Logic for when a page is incomplete to change status icon and text */}
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
            onClick={async () => submitReport(report)}
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
