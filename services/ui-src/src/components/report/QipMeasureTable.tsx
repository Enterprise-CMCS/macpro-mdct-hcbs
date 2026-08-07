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
import { useDeleteConfirmModal } from "./useDeleteConfirmModal";
import { addQipTargetPage, useStore } from "utils";
import { inferredReportStatus } from "utils/state/reportLogic/completeness";
import { PageElementProps } from "./Elements";
import addIcon from "assets/icons/add/icon_add_blue.svg";
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
      onConfirm: (remaining, deletedPageId) => {
        if (report) {
          updateReport({
            ...report,
            pages: report.pages.filter((p) => p.id !== deletedPageId),
          });
        }
        updateElement({ answer: remaining });
      },
    });

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
        ...(measureTargets ?? []),
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
