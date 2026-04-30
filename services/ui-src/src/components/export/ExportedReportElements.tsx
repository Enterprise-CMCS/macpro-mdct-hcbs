import { Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType, MeasurePageTemplate, PageElement } from "types";
import { FieldsExport } from "components/rates/types/Fields";
import { ReadmissionRateExport } from "components/rates/types/ReadmissionRate";
import { NDRExport } from "components/rates/types/NDR";
import { notAnsweredText } from "../../constants";
import { MultiRateNdrExport } from "components/rates/types/MultiRateNdr";
import { NDRFieldExport } from "components/rates/types/NDRFields";
import { PerformanceNdrExport } from "components/rates/types/PerformanceNdr";
import { EligibilityTableElementExport } from "components/report/WwlComponents/EligibilityTable";
import { CheckboxExport } from "components/fields/CheckboxField";
import { ListInputExport } from "components/fields/ListInput";

//for ignoring any elements within the page by their id
const ignoreIdList = ["quality-measures-subheader"];

//elements that are rendered as part of the table that does not need a unique renderer
const tableElementList = [
  ElementType.Textbox,
  ElementType.Radio,
  ElementType.TextAreaField,
  ElementType.Checkbox,
  ElementType.ListInput,
];

const renderElementList = [
  ...tableElementList,
  ElementType.MultiRateNdr,
  ElementType.NdrFields,
  ElementType.Ndr,
  ElementType.LengthOfStayRate,
  ElementType.ReadmissionRate,
  ElementType.PerformanceNdr,
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
    case ElementType.MultiRateNdr:
      return MultiRateNdrExport(element);
    case ElementType.NdrFields:
      return NDRFieldExport(element);
    case ElementType.Ndr:
      return NDRExport(element);
    case ElementType.LengthOfStayRate:
      return FieldsExport(element);
    case ElementType.ReadmissionRate:
      return ReadmissionRateExport(element);
    case ElementType.PerformanceNdr:
      return PerformanceNdrExport(element, section.navTitle);
    case ElementType.MeasureDetails:
      return MeasureDetailsExport(section);
    case ElementType.EligibilityTable:
      return EligibilityTableElementExport(element, section.navTitle);
    case ElementType.Checkbox:
      return CheckboxExport(element);
    case ElementType.ListInput:
      return ListInputExport(element);
  }

  if (!("answer" in element)) {
    return notAnsweredText;
  }

  return element.answer ?? notAnsweredText;
};
