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
import {
  ExportedReportTable,
  ExportRateTable,
  ReportTableType,
} from "./ExportedReportTable";
import { FieldsExport } from "components/rates/types/Fields";
import { NDRExport } from "components/rates/types/NDR";
import { noReponseText } from "../../constants";
import { NDREnhancedExport } from "components/rates/types/NDREnhanced";

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
      return <></>;
    // return NDREnhancedExport(element as NdrEnhancedTemplate);
    case ElementType.NdrFields:
      return NDRFieldExport(element as NdrFieldsTemplate);
    case ElementType.Ndr:
      return <></>;
    // return NDRExport(element as NdrTemplate);
    case ElementType.LengthOfStayRate:
      return <></>;
    // return FieldsExport(element as LengthOfStayRateTemplate);
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

export const NDRFieldExport = (element: NdrFieldsTemplate) => {
  const buildData = element.assessments.map((assess) => {
    const data = element.answer?.find((item) =>
      item.rates[0].id.includes(assess.id)
    );
    const rates = data?.rates.map((rate) => {
      const performanceTargetLabel = "Performance Target";
      return {
        label: element.fields.find(
          (field) => field.id === rate.id.split(".")[1]
        )?.label,
        rate: [
          {
            indicator: performanceTargetLabel,
            response: rate.performanceTarget,
          },
          { indicator: "Numerator", response: rate.numerator },
          {
            indicator: "Denominator",
            response: data.denominator,
            helperText: "Auto-calculates",
          },
          {
            indicator: "Rate",
            response: rate.rate,
            helperText: "Auto-calculates",
          },
        ],
      };
    });
    return {
      label: assess.label,
      denominator: data?.denominator,
      rates,
    };
  });

  console.log(buildData);

  return (
    <>
      {buildData.map((build) => (
        <>
          <Heading as="h4" fontWeight="bold">
            {build.label}
          </Heading>
          {build.rates?.map((rate) =>
            ExportRateTable([{ label: rate.label, rows: rate.rate }])
          )}
        </>
      ))}
    </>
  );
};
