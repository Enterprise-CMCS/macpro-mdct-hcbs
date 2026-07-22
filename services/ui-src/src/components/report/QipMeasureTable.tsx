import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Flex,
  Image,
  Link,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { MeasureTargetInfo, PageStatus, QipMeasureTableTemplate } from "types";
import { TableStatusIcon } from "components";
import { QipMeasureSelectModal } from "./QipMeasureSelectModal";
import { addQipTargetPage, useStore } from "utils";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { PageElementProps } from "./Elements";
import addIcon from "assets/icons/add/icon_add_blue.svg";

export const QipMeasureTableElement = ({
  element: { caption, answer },
  disabled: _disabled,
  updateElement,
}: PageElementProps<QipMeasureTableTemplate>) => {
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const {
    report,
    updateReport,
    setCurrentPageId,
    setModalComponent,
    setModalOpen,
  } = useStore();
  const measureTargetMapping = report?.measureTargetMapping;

  if (!measureTargetMapping) {
    throw new Error("Can't render QIP Measure Table outside of QIP");
  }

  const addMeasureTargetPage = async (
    params: MeasureTargetInfo & { measureName: string }
  ) => {
    const {
      report: patchedReport,
      pageId,
      originalValues,
    } = await addQipTargetPage(report!, params);
    updateReport(patchedReport);

    if (reportId) setCurrentPageId("select-measures");

    updateElement({
      answer: [
        ...(answer ?? []),
        {
          pageId: pageId,
          measureName: params.measureName,
          originalValues,
        },
      ],
    });
    setModalOpen(false);
  };

  const modal = (
    <QipMeasureSelectModal
      measureTargetMapping={measureTargetMapping}
      onClose={() => setModalOpen(false)}
      onSubmit={addMeasureTargetPage}
    />
  );

  const getTableStatus = (pageId: string) => {
    if (!report) return PageStatus.NOT_STARTED;
    return inferredReportStatus(report, pageId) ?? PageStatus.NOT_STARTED;
  };

  const errorMessage = (status: PageStatus) => {
    if (status !== PageStatus.COMPLETE) {
      return <Text variant="error">Select "Edit" to begin measure.</Text>;
    }
    return <></>;
  };

  const rows = (answer ?? []).map((answerRow, index) => {
    const status = getTableStatus(answerRow.pageId);
    return (
      <Tr key={index}>
        <Td textAlign="center">
          <Flex justifyContent="center">
            <TableStatusIcon tableStatus={status} />
          </Flex>
        </Td>
        <Td>
          <Text fontWeight="bold">{answerRow.measureName}</Text>
          {/* TODO: CMIT number? */}
          <Text>Status: {status}</Text>
          {errorMessage(status)}
        </Td>
        <Td textAlign="center">
          <Flex justifyContent="center">
            {/* TODO: We don't need this href, right? If not, remove from QMS Measure Table too. */}
            <Button
              as={Link}
              variant={"outline"}
              aria-label={`Edit ${answerRow.measureName}`}
              href={`/report/${reportType}/${state}/${reportId}/${answerRow.pageId}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/report/${reportType}/${state}/${reportId}/${answerRow.pageId}`
                );
              }}
            >
              Edit
            </Button>
            {/* TODO delete button */}
          </Flex>
        </Td>
      </Tr>
    );
  });

  return (
    <>
      <Button
        onClick={() => setModalComponent(modal, "Add Measure")}
        variant={"outline"}
      >
        <Image src={addIcon} alt="" sx={{ padding: "3px" }} />
        Add measure
      </Button>
      <Table variant="measure">
        <TableCaption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </TableCaption>
        <Thead>
          <Tr>
            <Th textAlign="center">Status</Th>
            <Th paddingLeft="spacer6">Measure details</Th>
            <Th textAlign="center" paddingLeft="spacer6">
              Actions
            </Th>
          </Tr>
        </Thead>
        {rows.length > 0 ? <Tbody>{rows}</Tbody> : null}
      </Table>
      {rows.length === 0
        ? "Keep track of your measures, once you add a report you can access it here."
        : null}
    </>
  );
};
