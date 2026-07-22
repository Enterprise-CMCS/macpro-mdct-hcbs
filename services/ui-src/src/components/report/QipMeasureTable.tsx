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
  VisuallyHidden,
} from "@chakra-ui/react";
import { MeasureTargetInfo, QipMeasureTableTemplate } from "types";
import { QipMeasureSelectModal } from "./QipMeasureSelectModal";
import { addQipTargetPage, useStore } from "utils";
import { PageElementProps } from "./Elements";
import addIcon from "assets/icons/add/icon_add_blue.svg";

export const QipMeasureTableElement = ({
  element: { caption, answer },
  disabled: _disabled,
  updateElement,
}: PageElementProps<QipMeasureTableTemplate>) => {
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();
  const { report, updateReport, setModalComponent, setModalOpen } = useStore();
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

  const rows = (answer ?? []).map((answerRow, index) => {
    return (
      <Tr key={index}>
        <Td>{/* TODO: status icon */}</Td>
        <Td>
          {answerRow.measureName}
          {/* TODO: CMIT number? */}
          {/* TODO: status text */}
          {/* TODO: error message? */}
        </Td>
        <Td>
          <Flex gap="spacer2" sx={sx.flex}>
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
            <Th>Status</Th>
            <Th>Measure details</Th>
            <Th>Actions</Th>
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

const sx = {
  flex: {
    justifyContent: "flex-end",

    ".mobile &": {
      justifyContent: "flex-start",
    },
  },
};
