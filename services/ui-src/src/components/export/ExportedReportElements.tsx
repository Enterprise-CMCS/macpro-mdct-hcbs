import { Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType } from "types";
import { ExportedReportTable, ReportTableType } from "./ExportedReportTable";

const noReponseText = "No Response";
const autoPopulatedText = "Auto-populates from previous response";

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

export const useTable = (type: ElementType) => {
  return tableElementList.includes(type);
};

export const renderElements = (
  section: any,
  element: any | Object,
  type: ElementType
) => {
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
      return NDREnhancedReportElement(element);
    case ElementType.NdrFields:
      return <>[TO DO: ADD NDR FIELDS]</>;
    case ElementType.Ndr:
      return <>[TO DO: ADD NDR]</>;
    case ElementType.LengthOfStayRate:
      return <>[TO DO: ADD Field Of Stay]</>;
    case ElementType.NdrBasic:
      return <>[TO DO: ADD NDR Basic]</>;
    case ElementType.MeasureDetails:
      return MeasureDetailsExport(section);
  }

  return answer ?? noReponseText;
};

export const NDREnhancedReportElement = (element: any) => {
  const buildData = element.assessments?.map(
    (assess: { id: string; label: string }) => {
      const performanceRate = element.answer?.rates?.find(
        (rate: { id: string }) => rate.id === assess.id
      );
      const row = [
        {
          indicator: element.performanceTargetLabel,
          response: performanceRate?.performanceTarget,
        },
        {
          indicator: "Numerator",
          response: performanceRate?.numerator,
        },
        {
          indicator: "Denominator",
          response: element?.answer?.denominator ?? autoPopulatedText,
          helperText: "Auto-populates",
        },
        {
          indicator: "Rate",
          response: performanceRate?.rate ?? autoPopulatedText,
          helperText: "Auto-calculates",
        },
      ];

      return { label: assess.label, rows: row };
    }
  );

  const label = element.label ?? "Performance Rates";

  return (
    <>
      <Heading as="h4" fontWeight="bold">{`${label}`}</Heading>
      <ExportedReportTable
        rows={[
          {
            indicator: "Performance Rates Denominator",
            response: element?.answer?.denominator,
          },
        ]}
      />
      {buildData.map((data: { label: string; rows: ReportTableType[] }) => (
        <>
          <Heading
            as="h4"
            fontWeight="bold"
          >{`${label} : ${data?.label}`}</Heading>
          <ExportedReportTable rows={data?.rows} />
        </>
      ))}
    </>
  );
};
