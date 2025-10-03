import { Flex } from "@chakra-ui/react";
import {
  FormPageTemplate,
  MeasurePageTemplate,
  PageElement,
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

  //if the element is a radio, replace the answer with a the label text and get the children elements
  const expandElements: PageElement[] = [];
  filteredElements.forEach((element) => {
    const child = [element];
    if (element.type === "radio") {
      //Note: answer is be modified from key value to label value from this point onward, if that becomes a problem in the future expand it
      element.answer = element.choices.find(
        (choice) => choice.value === element.answer
      )?.label;
      child.push(
        ...element.choices
          .flatMap((choice) => choice.checkedChildren)
          .filter((choice) => choice != undefined)
      );
    }
    expandElements.push(...child);
  });

  const elements =
    expandElements?.map((element) => {
      return {
        indicator: "label" in element ? element.label ?? "" : "",
        helperText:
          "helperText" in element && element.helperText
            ? isValidHelperText(element.helperText)
            : "",
        response: renderElements(section as MeasurePageTemplate, element),
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
