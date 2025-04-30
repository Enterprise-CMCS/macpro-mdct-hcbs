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
  ReviewSubmitTemplate,
} from "types";

const skipElements = [
  ElementType.ButtonLink,
  ElementType.Accordion,
  ElementType.MeasureTable,
  ElementType.MeasureResultsNavigationTable,
  ElementType.Header,
  ElementType.MeasureFooter,
];

export const ExportedReportWrapper = ({ section, displayHidden }: Props) => {
  const filtered = !displayHidden
    ? section.elements?.filter(
        (element) => !skipElements.includes(element?.type)
      )
    : section.elements;

  const elements = filtered?.map((element: any) => {
    if (displayHidden && skipElements.includes(element.type)) {
      return {
        label: "DEBUG",
        helperText: element.type ?? "",
        value: element.value ?? "",
        answer: element.answer ?? "",
        type: element.type ?? "",
      };
    }
    if (element.type)
      return {
        label: element?.label ?? "",
        helperText: element.helperText ?? "",
        value: element.value ?? "",
        answer: element.answer ?? "No Response",
        type: element.type ?? "",
      };
    return { label: "How" };
  });

  return (
    <Stack>
      {elements?.length! > 0 ? (
        <Table variant="export">
          <Thead>
            <Tr>
              <Th>Indicator</Th>
              <Th>Response</Th>
              {displayHidden && <Th>Type</Th>}
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
                    {displayHidden && <Td>{element?.type}</Td>}
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
  section:
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate;
  displayHidden?: boolean;
}
