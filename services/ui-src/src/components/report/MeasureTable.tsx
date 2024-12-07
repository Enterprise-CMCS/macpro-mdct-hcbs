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
  MeasureTableTemplate,
} from "types";
import { useStore } from "utils";
import { PageElementProps } from "./Elements";

export const MeasureTableElement = (props: PageElementProps) => {
  const table = props.element as MeasureTableTemplate;
  const {
    report,
    // setMeasure,
    setModalComponent,
    setModalOpen,
  } = useStore();
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const selectedMeasures = measures.filter(
    (page) =>
      (table.measureDisplay == "optional" && !page.required) ||
      (table.measureDisplay == "required" && page.required) ||
      (table.measureDisplay == "stratified" && page.stratified)
  );

  const buildModal = (cmit: number | undefined) => {
    const modal = MeasureReplacementModal(
      cmit,
      () => setModalOpen(false), // Close Action
      () => setModalOpen(false) // Submit
    ); // This will need the whole measure eventually
    setModalComponent(modal);
  };

  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  // TO-DO: Where does cmit need to be set? Does it happen onEdit click?
  const handleEditClick = (measureId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${measureId}`;
    navigate(path);
    // setMeasure(measure.cmit!);
  };

  // Build Rows
  const rows = selectedMeasures.map((measure, index) => {
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">{measure.title}</Text>
          <Text>CMIT# {measure.cmit}</Text>
        </Td>
        <Td>
          {measure.substitutable ? (
            <Link onClick={() => buildModal(measure.cmit)}>
              Substitute measure
            </Link>
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
            CMIT Number
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
