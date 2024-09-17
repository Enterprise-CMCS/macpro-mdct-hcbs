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
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  MeasureTableTemplate,
  NavigationFunction,
  PageType,
} from "./types";

export const MeasureTableElement = (
  element: MeasureTableTemplate,
  modalOpenHandler: NavigationFunction
) => {
  const { report } = useStore();
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  const selectedMeasures = measures.filter(
    (page) =>
      (element.measureDisplay == "optional" && page.optional) ||
      (element.measureDisplay == "required" && page.required) ||
      (element.measureDisplay == "stratified" && page.stratified)
  );

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
            onClick={() => modalOpenHandler(element.modalId, PageType.Modal)}
          >
            Edit measure
          </Button>
        </Td>
        <Td>
          <Button onClick={() => modalOpenHandler(element.to)}>Edit</Button>
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
