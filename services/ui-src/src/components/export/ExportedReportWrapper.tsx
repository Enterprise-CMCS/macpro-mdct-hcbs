import { Box, Flex, Stack } from "@chakra-ui/react";
import {
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
    section.elements?.map((element: any) => {
      //determine the render of the component
      return {
        indicator: element?.label ?? "",
        helperText: element.helperText ?? "",
        response: renderElements(section, element, element.type),
        type: element.type ?? "",
      };
    }) ?? [];

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
