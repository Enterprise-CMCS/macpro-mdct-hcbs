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
import { renderElements } from "./ExportedReportElements";
import { chunkBy } from "utils/other/arrays";

const skipElements = [
  ElementType.ButtonLink,
  ElementType.Accordion,
  ElementType.MeasureTable,
  ElementType.MeasureResultsNavigationTable,
  ElementType.Header,
  ElementType.MeasureFooter,
];

type ExportedReportType = {
  label?: string;
  helperText?: string;
  value?: string;
  render?: { useTable: boolean; display: JSX.Element };
  type?: ElementType;
};

export const renderReportTable = (
  displayHidden: boolean | undefined,
  elements: ExportedReportType[] | undefined
) => {
  const filteredElements = elements?.filter((element) => element.label);

  if (filteredElements?.length == 0) return;

  return (
    <Table variant="export">
      <Thead>
        <Tr>
          <Th>Indicator</Th>
          <Th>Response</Th>
          {displayHidden && <Th>Type</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {filteredElements?.map((element: ExportedReportType, idx: number) => (
          <Tr key={`${element.label}.${idx}`}>
            <Td>
              <Text>{element?.label}</Text>
              {element?.helperText && <Text>{element?.helperText}</Text>}
              {element?.type === ElementType.Date && <Text>MM/DD/YYYY</Text>}
            </Td>
            {element?.render?.display}
            {displayHidden && <Td>{element?.type}</Td>}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const renderReportDisplay = (
  elements: ExportedReportType[] | undefined
) => {
  return elements?.map(
    (element: ExportedReportType) => element.render?.display
  );
};

export const ExportedReportWrapper = ({ section, displayHidden }: Props) => {
  const filtered = !displayHidden
    ? section.elements?.filter(
        (element) => !skipElements.includes(element?.type)
      )
    : section.elements;

  const elements =
    filtered?.map((element: any) => {
      //determine the render of the component
      return {
        label: element?.label ?? "",
        helperText: element.helperText ?? "",
        value: element.value ?? "",
        render: renderElements(section, element, element.type),
        type: element.type ?? "",
      };
    }) ?? [];

  const chunkedElements = chunkBy(
    elements,
    (element) => element.render?.useTable
  );

  return (
    <Stack>
      {chunkedElements?.length! > 0 ? (
        <>
          {chunkedElements.map((elements) =>
            elements[0].render.useTable
              ? renderReportTable(displayHidden, elements)
              : renderReportDisplay(elements)
          )}
        </>
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
