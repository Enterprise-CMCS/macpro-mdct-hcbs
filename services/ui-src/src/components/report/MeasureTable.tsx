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
  MeasureStatus,
  MeasureTableTemplate,
  PageType,
} from "types";
import { useStore } from "utils";
import { PageElementProps } from "./Elements";

export const MeasureTableElement = (props: PageElementProps) => {
  const table = props.element as MeasureTableTemplate;
  const { report, setModalComponent, setModalOpen, setSubstitute, saveReport } =
    useStore();
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

  const onSubstitute = async (selectMeasure: MeasurePageTemplate) => {
    if (report) {
      setSubstitute(report, selectMeasure);
      saveReport();
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
    const path = `/report/${reportType}/${state}/${reportId}/${measureId}`;
    navigate(path);
  };

  const getTableStatus = (measure: MeasurePageTemplate) => {
    //optional measures should return nothing if they aren't started
    if (!measure.required) {
      if (measure.status === MeasureStatus.NOT_STARTED || !measure.status) {
        return undefined;
      }
    }

    return measure.status ?? MeasureStatus.NOT_STARTED;
  };

  const errorMessage = (measure: MeasurePageTemplate) => {
    if (measure.status !== MeasureStatus.COMPLETE) {
      if (measure.status === MeasureStatus.IN_PROGRESS || measure.required)
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
          <Text>CMIT# {measure.cmit}</Text>
          <Text>Status: {measure.status ?? "Not started"}</Text>
          {errorMessage(measure)}
        </Td>
        <Td>
          {measure.substitutable && measure.required ? (
            <Link onClick={() => buildModal(measure)}>Substitute measure</Link>
          ) : null}
        </Td>

        <Td>
          {/* TO-DO: Fix format of measure id */}
          <Button variant="outline" onClick={() => handleEditClick(measure.id)}>
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
