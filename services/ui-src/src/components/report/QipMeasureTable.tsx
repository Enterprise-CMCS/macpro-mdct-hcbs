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
import addIcon from "assets/icons/add/icon_add_blue.svg";
import { QipMeasureSelectModal } from "./QipMeasureSelectModal";
import { useDeleteConfirmModal } from "./useDeleteConfirmModal";
import { addQipTargetPage, useStore } from "utils";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { PageElementProps } from "./Elements";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";

export const QipMeasureTableElement = ({
  element: { caption, answer: measureTargets },
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
    saveReport,
  } = useStore();
  const measureTargetMapping = report?.measureTargetMapping;
  const { addButtonRef, getDeleteButtonRef, openDeleteModal } =
    useDeleteConfirmModal({
      items: measureTargets ?? [],
      getId: (item) => item.pageId,
      getBody: (item) =>
        `This action cannot be undone. It will remove the measure ${item.measureName} from this QI Plan.`,
      confirmLabel: "Remove measure",
      header: "Are you sure you want to remove this measure?",
      onConfirm: async (remaining, deletedPageId) => {
        if (report) {
          updateReport({
            ...report,
            pages: report.pages.filter((p) => p.id !== deletedPageId),
          });
        }
        updateElement({ answer: remaining });
        await saveReport();
      },
    });

  if (!measureTargetMapping) {
    throw new Error("Can't render QIP Measure Table outside of QIP");
  }

  const addMeasureTargetPage = async (
    params: MeasureTargetInfo & { measureName: string }
  ) => {
    const { report: patchedReport } = await addQipTargetPage(report!, params);
    const selectMeasuresPage = patchedReport.pages.find(
      (page) => page.id === "select-measures" && "elements" in page
    ) as { elements?: QipMeasureTableTemplate[] } | undefined;
    const updatedMeasures = selectMeasuresPage?.elements?.find(
      (element) => element.id === "select-measures-table"
    )?.answer;

    updateReport(patchedReport);

    if (reportId) setCurrentPageId("select-measures");

    updateElement({
      answer: updatedMeasures as QipMeasureTableTemplate["answer"],
    });
    setModalOpen(false);
    await saveReport();
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
    if (!disabled && status === PageStatus.NOT_STARTED) {
      return (
        <Text variant="error" fontSize="body_sm">
          Select "Edit" to begin measure.
        </Text>
      );
    }
    return <></>;
  };

  const handleDeleteClick = (pageId: string) => openDeleteModal(pageId);

  const rows = (measureTargets ?? []).map((measureTarget) => {
    const status = getTableStatus(measureTarget.pageId);
    return (
      <Tr key={measureTarget.pageId}>
        <Td textAlign="center">
          <Flex justifyContent="center">
            <TableStatusIcon tableStatus={status} />
          </Flex>
        </Td>
        <Td>
          <Text fontWeight="bold">{measureTarget.measureName}</Text>
          <Text fontSize="body_sm">Status: {status}</Text>
          {errorMessage(status)}
        </Td>
        <Td textAlign="center">
          <Flex justifyContent="center">
            {/* TODO: We don't need this href, right? If not, remove from QMS Measure Table too. */}
            <Button
              as={Link}
              variant={"outline"}
              aria-label={`${disabled ? "View" : "Edit"} ${measureTarget.measureName}`}
              href={`/report/${reportType}/${state}/${reportId}/${measureTarget.pageId}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(
                  `/report/${reportType}/${state}/${reportId}/${measureTarget.pageId}`
                );
              }}
            >
              {disabled ? "View" : "Edit"}
            </Button>
            {!disabled && (
              <Button
                ref={getDeleteButtonRef(measureTarget.pageId)}
                variant="transparent"
                aria-label={`Delete ${measureTarget.measureName}`}
                onClick={() => handleDeleteClick(measureTarget.pageId)}
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
        ref={addButtonRef}
        variant="outline"
        leftIcon={<Image src={addIcon} alt="" />}
        onClick={() => setModalComponent(modal, "Add Measure")}
        isDisabled={disabled}
      >
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
      {rows.length === 0 ? (
        <Text textAlign="center">
          No measures found in this Quality Improvement Plan. Once you add a
          measure you can access it here.
        </Text>
      ) : null}
    </>
  );
};
