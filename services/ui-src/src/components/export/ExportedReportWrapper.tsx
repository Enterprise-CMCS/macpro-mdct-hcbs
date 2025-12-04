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

const isStateReporting = (elements: PageElement[]) => {
  const stateReportIndex = elements.findIndex((item) => {
    return (
      item.type === "radio" &&
      item.clickAction === "qmReportingChange" &&
      item.answer === "no"
    );
  });

  return stateReportIndex > -1
    ? elements.splice(0, stateReportIndex + 1)
    : elements;
};

//not all hint text should be render so this function is used as a filter
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

  //removes follow up content for "is the state reporting on this measure?" question if the user selects no
  const stateReportingFiltered = isStateReporting(filteredElements);

  //if the element is a radio, replace the answer with a the label text and get the children elements
  const expandElements: PageElement[] = [];
  stateReportingFiltered.forEach((element) => {
    const modifiedElemet = { ...element };

    const child = [modifiedElemet];
    if (modifiedElemet.type === "radio") {
      child.push(
        ...modifiedElemet.choices
          .filter((choice) => choice.value == modifiedElemet.answer)
          .flatMap((choice) => choice?.checkedChildren ?? [])
      );
      //Note: answer is be modified from key value to label value from this point onward
      modifiedElemet.answer = modifiedElemet.choices.find(
        (choice) => choice.value === modifiedElemet.answer
      )?.label;
    }

    expandElements.push(...child);
  });

  const elements =
    expandElements?.map((element) => {
      return {
        indicator: "label" in element ? (element.label ?? "") : "",
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
