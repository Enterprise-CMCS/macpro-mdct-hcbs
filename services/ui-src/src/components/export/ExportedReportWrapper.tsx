import {
  Box,
  Stack,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Text,
} from "@chakra-ui/react";
import {
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
} from "types";

export const ExportedReportWrapper = ({ section }: Props) => {
  const elements = section.elements
    ?.filter(
      (element) =>
        element.type !== ElementType.ButtonLink &&
        element.type !== ElementType.Accordion &&
        element.type !== ElementType.Header &&
        element.type !== ElementType.MeasureTable
    )
    .map((element: any) => {
      return {
        label: element?.label ?? "",
        helperText: element.helperText ?? "",
        value: element.value ?? "",
        answer: element.answer ?? "No Response",
        type: element.type ?? "",
      };
    });

  return (
    <Stack>
      {elements?.length! > 0 ? (
        <Table variant="export">
          <Thead>
            <Tr>
              <Th>Indicator</Th>
              <Th>Response</Th>
            </Tr>
          </Thead>
          <Tbody>
            {elements?.map(
              (element, idx) =>
                element?.label && (
                  <Tr key={`${element.label}.${idx}`}>
                    <Td>
                      <Text>{element?.label}</Text>
                      {element?.helperText && (
                        <Text>{element?.helperText}</Text>
                      )}
                      {element?.type === ElementType.Date && (
                        <Text>MM/DD/YYYY</Text>
                      )}
                    </Td>
                    <Td>{element?.answer}</Td>
                  </Tr>
                )
            )}
          </Tbody>
        </Table>
      ) : (
        <Box>N/A</Box>
      )}
    </Stack>
  );
};

export interface Props {
  section: ParentPageTemplate | FormPageTemplate | MeasurePageTemplate;
}
