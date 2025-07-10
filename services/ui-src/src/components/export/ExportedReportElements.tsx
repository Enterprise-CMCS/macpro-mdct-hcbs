import { Box, Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType } from "types";
import { ExportedReportTable, ReportTableType } from "./ExportedReportTable";

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
  if (!renderElementList.includes(type)) return;
  const { answer } = element;

  switch (type) {
    case ElementType.SubHeader:
      return (
        <Heading as="h4" fontWeight="bold">
          {element.text}
        </Heading>
      );
    case ElementType.NdrEnhanced:
      return PerformanceMeasureReportElement(element);
    case ElementType.NdrFields:
      return <>NDR FIELDS</>;
    case ElementType.Ndr:
      return <>NDR</>;
    case ElementType.LengthOfStayRate:
      return <>Field Of Stay</>;
    case ElementType.NdrBasic:
      return <>NDR Basic</>;
    case ElementType.MeasureDetails:
      return MeasureDetailsExport(section);
  }

  return answer ?? "No Response";
};

export const PerformanceMeasureReportElement = (element: any) => {
  const notAnswered = "Not answered";
  const noResponse = "Auto-populates from previous response";

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
          response: performanceRate?.numerator ?? notAnswered,
        },
        {
          indicator: "Denominator",
          response: element?.answer?.denominator ?? noResponse,
          helperText: "Auto-populates",
        },
        {
          indicator: "Rate",
          response: performanceRate?.rate ?? noResponse,
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
            response: element?.answer?.denominator ?? notAnswered,
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
