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
import { useStore } from "utils";
import { MeasureReplacementModal } from "./MeasureReplacementModal";
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  MeasureTableTemplate,
} from "../../types/report";
import { PageElementProps } from "./Elements";
import { TableStatusIcon } from "components/tables/TableStatusIcon";

export const MeasureTableElement = (props: PageElementProps) => {
  const table = props.element as MeasureTableTemplate;
  const {
    report,
    setMeasure,
    setModalComponent,
    setModalOpen,
    setCurrentPageId,
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

  const onEdit = (measure: MeasurePageTemplate) => {
    setCurrentPageId(measure.id);
    setMeasure(measure.cmit!);
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
          <Button variant="outline" onClick={() => onEdit(measure)}>
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
