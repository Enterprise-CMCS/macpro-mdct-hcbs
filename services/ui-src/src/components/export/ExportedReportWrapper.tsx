import { Box, Flex } from "@chakra-ui/react";
import {
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
  ReviewSubmitTemplate,
} from "types";
import { renderElements, useTable } from "./ExportedReportElements";
import { chunkBy } from "utils/other/arrays";
import { ExportedReportTable, ReportTableType } from "./ExportedReportTable";

export const renderReportTable = (elements: ReportTableType[] | undefined) => {
  const filteredElements = elements?.filter((element) => element.indicator);
  if (filteredElements?.length == 0) return;

  return <ExportedReportTable rows={filteredElements!}></ExportedReportTable>;
};

export const renderReportDisplay = (
  elements: ReportTableType[] | undefined
) => {
  return elements?.map((element: ReportTableType) => element.response);
};

export const ExportedReportWrapper = ({ section }: Props) => {
  const elements =
    section.elements?.map(
      (element: {
        label?: string;
        helperText?: string;
        type: ElementType;
        id: string;
      }) => {
        return {
          indicator: element?.label ?? "",
          helperText: element.helperText ?? "",
          response: renderElements(section as MeasurePageTemplate, element),
          type: element.type ?? "",
        };
      }
    ) ?? [];

  // this chunkBy will split and keep the orders of the elements based on whether it's part of the default table or needs a unique renderer
  const chunkedElements = chunkBy(elements, (element) =>
    useTable(element.type)
  );

  return (
    <Flex flexDir="column" gap="1.5rem">
      {chunkedElements?.length! > 0 ? (
        <>
          {chunkedElements.map((elements) =>
            useTable(elements[0].type)
              ? renderReportTable(elements)
              : renderReportDisplay(elements)
          )}
        </>
      ) : (
        <Box>N/A</Box>
      )}
    </Flex>
  );
};

export interface Props {
  section:
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate;
}
