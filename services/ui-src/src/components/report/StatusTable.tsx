import {
  Button,
  Flex,
  Image,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import iconStatusCheck from "assets/icons/status/icon_status_check.svg";

export const StatusTableElement = () => {
  const sectionTitles = [
    "General Information",
    "Required Measure Results",
    "Optional Measure Results",
  ];
  // Build Rows
  const rows = sectionTitles.map((section) => {
    return (
      <Tr>
        <Td>
          <Stack flex="1">
            <Text>{section}</Text>
          </Stack>
        </Td>
        <Td>
          <Flex align="right">
            <Image src={iconStatusCheck} alt="icon description" />
            <Text ml={1}>Complete</Text>
          </Flex>
        </Td>
        <Td>
          <Button onClick={() => {}}>Edit</Button>
        </Td>
      </Tr>
    );
  });

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Section</Th>
          <Th>Status</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
