import { Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import {
  ElementType,
  LengthOfStayRateTemplate,
  MeasurePageTemplate,
  NdrBasicTemplate,
  NdrEnhancedTemplate,
  NdrFieldsTemplate,
  NdrTemplate,
  RateSetData,
} from "types";
import { FieldsExport } from "components/rates/types/Fields";
import { NDRExport } from "components/rates/types/NDR";
import { noReponseText } from "../../constants";
import { NDREnhancedExport } from "components/rates/types/NDREnhanced";
import { NDRFieldExport } from "components/rates/types/NDRFields";

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
];

export const shouldUseTable = (type: ElementType) => {
  return tableElementList.includes(type);
};

export const renderElements = (
  section: MeasurePageTemplate,
  element: {
    id: string;
    type: ElementType;
    answer?: string | number | RateSetData[] | RateSetData | undefined;
    text?: string;
  }
) => {
  const { type } = element;
  if (!renderElementList.includes(type) || ignoreIdList.includes(element.id))
    return;
  const { answer } = element;

  switch (type) {
    case ElementType.SubHeader:
      return (
        <Heading as="h4" fontWeight="bold">
          {element.text}
        </Heading>
      );
    case ElementType.NdrEnhanced:
      return NDREnhancedExport(element as NdrEnhancedTemplate);
    case ElementType.NdrFields:
      return NDRFieldExport(element as NdrFieldsTemplate);
    case ElementType.Ndr:
      return NDRExport(element as NdrTemplate);
    case ElementType.LengthOfStayRate:
      return FieldsExport(element as LengthOfStayRateTemplate);
    case ElementType.NdrBasic:
      return <>[TO DO: ADD NDR Basic]</>;
    case ElementType.MeasureDetails:
      return MeasureDetailsExport(section);
  }

  return (answer as string) ?? noReponseText;
};

export const NDRBasicExport = (element: NdrBasicTemplate) => {
  return <>[TO DO: ADD NDR Basic]</>;
};
