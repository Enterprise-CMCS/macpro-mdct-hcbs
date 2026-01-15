import { Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType, MeasurePageTemplate, PageElement } from "types";
import { FieldsExport } from "components/rates/types/Fields";
import { NDRExport } from "components/rates/types/NDR";
import { notAnsweredText } from "../../constants";
import { NDREnhancedExport } from "components/rates/types/NDREnhanced";
import { NDRFieldExport } from "components/rates/types/NDRFields";
import { NDRBasicExport } from "components/rates/types/NDRBasic";
import { EligibilityTableElementExport } from "components/report/WwlComponents/EligibilityTable";

//for ignoring any elements within the page by their id
const ignoreIdList = ["quality-measures-subheader"];

//elements that are rendered as part of the table that does not need a unique renderer
const tableElementList = [
  ElementType.Textbox,
  ElementType.Radio,
  ElementType.TextAreaField,
];

const renderElementList = [
  ...tableElementList,
  ElementType.NdrEnhanced,
  ElementType.NdrFields,
  ElementType.Ndr,
  ElementType.LengthOfStayRate,
  ElementType.NdrBasic,
  ElementType.MeasureDetails,
  ElementType.SubHeader,
  ElementType.EligibilityTable,
];

export const shouldUseTable = (type: ElementType) => {
  return tableElementList.includes(type);
};

export const renderElements = (
  section: MeasurePageTemplate,
  element: PageElement
) => {
  const { type } = element;
  if (!renderElementList.includes(type) || ignoreIdList.includes(element.id))
    return;

  switch (type) {
    case ElementType.SubHeader:
      return (
        <Heading as="h4" variant="nestedHeading">
          {element.text}
        </Heading>
      );
    case ElementType.NdrEnhanced:
      return NDREnhancedExport(element);
    case ElementType.NdrFields:
      return NDRFieldExport(element);
    case ElementType.Ndr:
      return NDRExport(element);
    case ElementType.LengthOfStayRate:
      return FieldsExport(element);
    case ElementType.NdrBasic:
      return NDRBasicExport(element);
    case ElementType.MeasureDetails:
      return MeasureDetailsExport(section);
    case ElementType.EligibilityTable:
      return EligibilityTableElementExport(element);
  }

  if (!("answer" in element)) {
    return notAnsweredText;
  }

  return element.answer ?? notAnsweredText;
};
