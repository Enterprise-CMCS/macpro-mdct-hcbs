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
  Text,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import { MeasureTargetInfo, PageStatus, QipMeasureTableTemplate } from "types";
import { TableStatusIcon } from "components";
import { QipMeasureSelectModal } from "./QipMeasureSelectModal";
import { QipDeleteMeasureModal } from "./QipDeleteMeasureModal";
import { addQipTargetPage, useStore } from "utils";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { PageElementProps } from "./Elements";
import addIcon from "assets/icons/add/icon_add_blue.svg";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";

export const QipMeasureTableElement = ({
  element: { caption, answer },
  disabled = false,
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
    if (!disabled && status !== PageStatus.COMPLETE) {
      return (
        <Text variant="error">Select &quot;Edit&quot; to begin measure.</Text>
      );
    }
    return <></>;
  };

  const handleDeleteClick = (pageId: string, measureName: string) => {
    const onClose = () => setModalOpen(false);
    const onConfirm = () => {
      if (report) {
        const updatedReport = {
          ...report,
          pages: report.pages.filter((p) => p.id !== pageId),
        };
        updateReport(updatedReport);
      }
      updateElement({
        answer: (answer ?? []).filter((item) => item.pageId !== pageId),
      });
      setModalOpen(false);
    };
    setModalComponent(
      QipDeleteMeasureModal(measureName, onClose, onConfirm),
      "Are you sure you want to remove this measure?"
    );
  };

  const rows = (answer ?? []).map((answerRow) => {
    const status = getTableStatus(answerRow.pageId);
    return (
      <Tr key={answerRow.pageId}>
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
              aria-label={`${disabled ? "View" : "Edit"} ${answerRow.measureName}`}
              href={`/report/${reportType}/${state}/${reportId}/${answerRow.pageId}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/report/${reportType}/${state}/${reportId}/${answerRow.pageId}`
                );
              }}
            >
              {disabled ? "View" : "Edit"}
            </Button>
            {!disabled && (
              <Button
                variant="transparent"
                aria-label={`Delete ${answerRow.measureName}`}
                onClick={() =>
                  handleDeleteClick(answerRow.pageId, answerRow.measureName)
                }
              >
                <Image src={cancelIcon} alt="" />
              </Button>
            )}
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
        isDisabled={disabled}
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
