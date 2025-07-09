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
  let render = answer ? answer.toString() : "No Response";

  switch (type) {
    case ElementType.NdrEnhanced:
      render = PerformanceMeasureReportElement(element);
      break;
    case ElementType.NdrFields:
      render = <>NDR FIELDS</>;
      break;
    case ElementType.Ndr:
      render = <>NDR</>;
      break;
    case ElementType.LengthOfStayRate:
      render = <>Field Of Stay</>;
      break;
    case ElementType.NdrBasic:
      render = <>NDR Basic</>;
      break;
    case ElementType.MeasureDetails:
      render = MeasureDetailsExport(section);
      break;
  }

  return render;
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
    <Box my="1.5rem">
      <Heading as="h4" mb="1rem" fontWeight="bold">{`${label}`}</Heading>
      <ExportedReportTable
        rows={[
          {
            indicator: "Performance Rates Denominator",
            response: element?.answer?.denominator ?? noResponse,
          },
        ]}
      />
      {buildData.map((data: { label: string; rows: ReportTableType[] }) => (
        <Box mb="1.5rem">
          <Heading
            as="h4"
            mb="1rem"
            fontWeight="bold"
          >{`${label} : ${data?.label}`}</Heading>
          <ExportedReportTable rows={data?.rows} />
        </Box>
      ))}
    </Box>
  );
};
