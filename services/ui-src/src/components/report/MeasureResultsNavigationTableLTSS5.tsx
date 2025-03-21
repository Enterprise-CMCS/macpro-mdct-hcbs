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
import { TableStatusIcon } from "components/tables/TableStatusIcon";

export const MeasureResultsNavigationTableElement_LTSS5 = () => {
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
      <Tbody>
        {
          <Tr key={0}>
            <Td>
              <TableStatusIcon tableStatus=""></TableStatusIcon>
            </Td>
            <Td width="100%">
              <Text fontWeight="bold">Delivery Method: </Text>
              <Text>CMIT#</Text>
            </Td>
            <Td>
              <Button variant="outline">Edit</Button>
            </Td>
          </Tr>
        }
      </Tbody>
    </Table>
  );
};
