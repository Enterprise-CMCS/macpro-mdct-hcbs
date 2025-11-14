import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Link,
} from "@chakra-ui/react";
import { MeasureReplacementModal, TableStatusIcon } from "components";
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  PageStatus,
  MeasureTableTemplate,
  PageType,
  ReportStatus,
} from "types";
import { useStore } from "utils";
import { PageElementProps } from "./Elements";
import { useContext } from "react";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";

export const MeasureTableElement = (
  props: PageElementProps<MeasureTableTemplate>
) => {
  const table = props.element;
  const { report, setModalComponent, setModalOpen, setSubstitute } = useStore();
  const { autosave } = useContext(ReportAutosaveContext);

  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const selectedMeasures = measures.filter(
    (page) =>
      ((table.measureDisplay == "optional" && !page.required) ||
        (table.measureDisplay == "required" && page.required) ||
        (table.measureDisplay == "stratified" && page.stratified)) &&
      page.type === PageType.Measure
  );

  const onSubstitute = async (
    selectMeasure: MeasurePageTemplate | undefined
  ) => {
    if (report) {
      setSubstitute(report, selectMeasure);
      autosave();
    }
    setModalOpen(false);
  };

  const buildModal = (measure: MeasurePageTemplate) => {
    const modal = MeasureReplacementModal(
      measure,
      () => setModalOpen(false), // Close Action
      onSubstitute // Submit
    ); // This will need the whole measure eventually
    setModalComponent(modal, "Substitute Measure");
  };

  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = (measureId: string) => {
    navigate(`/report/${reportType}/${state}/${reportId}/${measureId}`);
  };

  const getTableStatus = (measure: MeasurePageTemplate) => {
    //TO DO: clean up when report check code is ready
    if (
      !measure.required &&
      (measure.status === PageStatus.NOT_STARTED || !measure.status)
    ) {
      //optional measures should return nothing if they aren't started
      return undefined;
    }

    return measure.status ?? PageStatus.NOT_STARTED;
  };

  const errorMessage = (measure: MeasurePageTemplate) => {
    //TO DO: clean up when report check code is ready
    if (
      measure.status === PageStatus.IN_PROGRESS ||
      (measure.required && measure.status != PageStatus.COMPLETE)
    ) {
      return <Text variant="error">Select "Edit" to begin measure.</Text>;
    }
    return <></>;
  };

  // Build Rows
  const rows = selectedMeasures.map((measure, index) => {
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon
            tableStatus={getTableStatus(measure)}
          ></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">{measure.title}</Text>
          <Text>CMIT number: #{measure.cmit}</Text>
          <Text>Status: {measure.status ?? "Not started"}</Text>
          {errorMessage(measure)}
        </Td>
        <Td>
          {measure.substitutable &&
          measure.required &&
          report?.status !== ReportStatus.SUBMITTED ? (
            <Button
              variant="link"
              sx={{ fontSize: "body_sm" }}
              onClick={() => {
                buildModal(measure);
              }}
            >
              Substitute measure
            </Button>
          ) : null}
        </Td>
        <Td>
          {/* TO-DO: Fix format of measure id */}
          <Button
            as={Link}
            variant={"outline"}
            href={`/report/${reportType}/${state}/${reportId}/${measure.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleEditClick(measure.id);
            }}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  });
  return (
    <Table variant="measure">
      <Thead>
        <Tr>
          <Th></Th>
          <Th>
            Measure Name <br />
            CMIT Number <br />
            Status
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
