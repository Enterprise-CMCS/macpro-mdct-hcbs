import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import { MeasureReplacementModal } from "./MeasureReplacementModal";
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  MeasureTableTemplate,
} from "../../types/report";
import { PageElementProps } from "./Elements";
import { TableStatueIcon } from "components/tables/TableStatusIcon";

export const MeasureTableElement = (props: PageElementProps) => {
  const table = props.element as MeasureTableTemplate;
  const { report, setModalComponent, setModalOpen, setCurrentPageId } =
    useStore();
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const selectedMeasures = measures.filter(
    (page) =>
      (table.measureDisplay == "optional" && page.optional) ||
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

  // Build Rows
  const rows = selectedMeasures.map((measure) => {
    return (
      <Tr>
        <Td>
          <TableStatueIcon tableStatus=""></TableStatueIcon>
        </Td>
        <Td width="100%">
          <Text>{measure.title}</Text>
          <Text>CMIT# {measure.cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="link"
            onClick={() => buildModal(measure.cmit)} // TODO: modal per link
          >
            Substitute measure
          </Button>
        </Td>
        <Td>
          <Button
            variant="outline"
            onClick={() => setCurrentPageId(measure.id)}
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
            CMIT Number
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
