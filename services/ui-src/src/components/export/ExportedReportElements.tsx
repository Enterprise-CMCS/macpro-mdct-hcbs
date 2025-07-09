import { Box, Heading } from "@chakra-ui/react";
import { MeasureDetailsExport } from "components/report/MeasureDetails";
import { ElementType } from "types";
import { ExportedReportTable } from "./ExportedReportTable";

export const useTable = (type: ElementType) => {
  return (
    type === ElementType.Textbox ||
    type === ElementType.Radio ||
    type === ElementType.TextAreaField
  );
};

export const renderElements = (
  section: any,
  element: any | Object,
  type: ElementType
) => {
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
    case ElementType.MeasureDetails:
      render = MeasureDetailsExport(section);
      break;
    default:
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

  return (
    <Box>
      {buildData.map(
        (data: {
          label: string;
          rows: { indicator: string; response: string; helperText?: string }[];
        }) => (
          <Box>
            <Heading as="h4">{data?.label ?? "Performance Rates"}</Heading>
            <ExportedReportTable rows={data?.rows} />
          </Box>
        )
      )}
    </Box>
  );
};
