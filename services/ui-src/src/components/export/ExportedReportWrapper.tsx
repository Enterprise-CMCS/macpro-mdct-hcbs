import { Flex } from "@chakra-ui/react";
import {
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  PageElement,
  PageType,
  ParentPageTemplate,
  ReviewSubmitTemplate,
} from "types";
import { renderElements, shouldUseTable } from "./ExportedReportElements";
import { chunkBy } from "utils/other/arrays";
import { ExportedReportTable, ReportTableType } from "./ExportedReportTable";

export const renderReportTable = (elements: ReportTableType[] | undefined) => {
  const filteredElements = elements?.filter((element) => element.indicator);
  if (filteredElements?.length == 0) return;

  const caption = elements?.[0]?.caption;
  return (
    <ExportedReportTable
      rows={filteredElements!}
      caption={caption!}
    ></ExportedReportTable>
  );
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

  return stateReportIndex !== -1
    ? elements.splice(0, stateReportIndex + 1)
    : elements;
};

// Render helper text only if it exists and is not a warning.
const getHelperText = (element: PageElement) => {
  if (!("helperText" in element)) return "";
  if (!element.helperText) return "";
  if (element.helperText.includes("Warning:")) return "";
  return element.helperText;
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

  const expandCheckedChildren = (elements: PageElement[]): PageElement[] => {
    return elements.flatMap((element) => {
      if (element.type === ElementType.Radio) {
        const checkedChoice = element.choices.find(
          (choice) => choice.value === element.answer
        );

        // Note that from this point on, the answer is a label and not a key.
        element.answer = checkedChoice?.label;

        // A radio element is immediately followed by all of its child elements.
        return [
          element,
          ...expandCheckedChildren(checkedChoice?.checkedChildren ?? []),
        ];
      }

      if (element.type === ElementType.Checkbox) {
        // Collect all checkedChildren from all selected answers
        const allCheckedChildren = (element.answer ?? []).flatMap(
          (answerValue) =>
            element.choices.find((choice) => choice.value === answerValue)!
              .checkedChildren ?? []
        );
        // The list of top-level answers is followed by the children of the 1st
        // selected answer, then the children of the 2nd selected answer, etc.
        return [element, ...expandCheckedChildren(allCheckedChildren)];
      }

      return [element];
    });
  };

  const expandedElements = expandCheckedChildren(stateReportingFiltered);

  // Track SubHeader to use as caption for the pdf tables.
  let mostRecentSubheader: string | undefined = undefined;

  const determineCaption = (element: PageElement) => {
    if (!shouldUseTable(element.type)) {
      return undefined;
    } else if (mostRecentSubheader === undefined) {
      return section.navTitle;
    } else if (section.type === PageType.Measure) {
      return `${section.navTitle}: ${mostRecentSubheader}`;
    } else {
      return mostRecentSubheader;
    }
  };

  // Only the first element of a table group gets the caption
  const elements =
    expandedElements?.map((element) => {
      const caption = determineCaption(element);
      if (element.type === ElementType.SubHeader) {
        mostRecentSubheader = element.text;
      }

      return {
        indicator: "label" in element ? (element.label ?? "") : "",
        helperText: getHelperText(element),
        response: renderElements(section as MeasurePageTemplate, element),
        type: element.type ?? "",
        required: "required" in element ? element.required : false,
        caption,
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
