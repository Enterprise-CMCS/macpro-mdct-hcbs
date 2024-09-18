import {
  Button,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { WarningIcon } from "@cmsgov/design-system";
import { useStore } from "utils";
import { MeasureReplacementModal } from "./MeasureReplacementModal";
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  MeasureTableTemplate,
  NavigationFunction,
} from "../../types/report";

export const MeasureTableElement = (
  element: MeasureTableTemplate,
  modalOpenHandler: NavigationFunction
) => {
  const { report, setModalComponent, setModalOpen } = useStore();
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const selectedMeasures = measures.filter(
    (page) =>
      (element.measureDisplay == "optional" && page.optional) ||
      (element.measureDisplay == "required" && page.required) ||
      (element.measureDisplay == "stratified" && page.stratified)
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
          <WarningIcon />
        </Td>
        <Td>
          <Stack flex="1">
            <Text>{measure.title}</Text>
            <Text>{measure.cmit}</Text>
          </Stack>
        </Td>
        <Td>
          <Button
            variant="link"
            onClick={() => buildModal(measure.cmit)} // TODO: modal per link
          >
            Edit measure
          </Button>
        </Td>
        <Td>
          <Button onClick={() => modalOpenHandler(measure.id)}>Edit</Button>
        </Td>
      </Tr>
    );
  });
  return (
    <Table>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Measure Name</Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
