import { Flex } from "@chakra-ui/react";
import {
  FormPageTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
  ReviewSubmitTemplate,
} from "types";
import { renderElements, shouldUseTable } from "./ExportedReportElements";
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

const isValidHelperText = (helperText: string) => {
  return !helperText.includes("Warning:") ? helperText : "";
};

export const ExportedReportWrapper = ({ section }: Props) => {
  const filteredElements = section.elements?.filter((element) => {
    const hasAnswer =
      "answer" in element &&
      element.answer !== undefined &&
      element.answer !== "";
    const isRequired = !("required" in element) || element.required !== false;
    return hasAnswer || isRequired;
  });

  if (filteredElements == undefined) return null;

  const elements =
    filteredElements?.map((element) => {
      //if the element is a radio, replace the answer with a the label text
      const modifiedElement = { ...element };
      if (modifiedElement.type === "radio") {
        modifiedElement.answer = modifiedElement.choices.find(
          (choice) => choice.value === modifiedElement.answer
        )?.label;
      }

      return {
        indicator: "label" in element ? element.label ?? "" : "",
        helperText:
          "helperText" in element && element.helperText
            ? isValidHelperText(element.helperText)
            : "",
        response: renderElements(
          section as MeasurePageTemplate,
          modifiedElement
        ),
        type: element.type ?? "",
        required: "required" in element ? element.required : false,
      };
    }) ?? [];

  /*
   * Split the elements array into subarrays.
   * Within each subarray, either all elements belong in a table, or none do.
   * Order is preserved: flattening the chunked array would give the original.
   */
  const chunkedElements = chunkBy(elements, (el) => shouldUseTable(el.type));

  return (
    <Flex flexDir="column" gap="1.5rem">
      {chunkedElements.length > 0 && (
        <>
          {chunkedElements.map((elements) =>
            shouldUseTable(elements[0].type)
              ? renderReportTable(elements)
              : renderReportDisplay(elements)
          )}
        </>
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
