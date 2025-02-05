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
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import { CMIT_LIST } from "cmit";
import { useFormContext } from "react-hook-form";

export const QualityMeasureTableElement = () => {
  const { cmit } = useStore();
  const cmitInfo = CMIT_LIST.find((item) => item.cmit === cmit);
  const form = useFormContext();

  // Build Rows
  const rows = cmitInfo?.deliverySystem.map((system, index) => {
    const selections = form.getValues("delivery-method-radio")?.answer ?? "";
    const deliverySystemIsSelected = selections.split(",").includes(system);

    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">Delivery Method: {system}</Text>
          <Text>CMIT# {cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            disabled={!deliverySystemIsSelected}
            onClick={() => {}}
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
