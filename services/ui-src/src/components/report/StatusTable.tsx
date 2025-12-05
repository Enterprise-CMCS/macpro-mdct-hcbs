import { useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { postSubmitReport, useStore } from "utils";
import editIconPrimary from "assets/icons/edit/icon_edit_primary.svg";
import lookupIconPrimary from "assets/icons/search/icon_search_primary.svg";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { reportBasePath } from "utils/other/routing";
import { SubmitReportModal } from "./SubmitReportModal";
import { submittableMetricsSelector } from "utils/state/selectors";
import { useFlags } from "launchdarkly-react-client-sdk";

export const StatusTableElement = () => {
  const { report, user, setModalComponent, setModalOpen, updateReport } =
    useStore();
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const submittableMetrics = useStore(submittableMetricsSelector);
  const isPdfActive = useFlags()?.viewPdf;
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!report) {
    return null;
  }

  const handleEditClick = (sectionId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${sectionId}`;
    navigate(path);
  };

  const onSubmit = async () => {
    setModalOpen(false);
    setSubmitting(true);
    const submittedReport = await postSubmitReport(report);
    updateReport(submittedReport);
    setSubmitting(false);
  };

  const modal = SubmitReportModal(
    () => setModalOpen(false),
    onSubmit,
    reportType!
  );

  const displayModal = () => {
    setModalComponent(modal, "Are you sure you want to submit?");
  };

  // Build Rows
  const rows = submittableMetrics?.sections.map((sectionDetails, index) => {
    if (!sectionDetails) return;
    const { section, displayStatus: status } = sectionDetails;
    return (
      <Tr key={section.id || index} p={0}>
        <Td>
          <Text>{section.title}</Text>
        </Td>
        <Td>
          <TableStatusIcon tableStatus={status} showLabel={true} />
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
        {isPdfActive && (
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
        )}
        {user?.userIsEndUser && (
          <Button
            alignSelf="flex-end"
            onClick={async () => displayModal()}
            disabled={!submittableMetrics?.submittable || submitting}
          >
            {submitting && <Spinner size="sm" marginRight="spacer2" />}
            {`Submit ${reportType} Report`}
          </Button>
        )}
      </Stack>
    </>
  );
};
