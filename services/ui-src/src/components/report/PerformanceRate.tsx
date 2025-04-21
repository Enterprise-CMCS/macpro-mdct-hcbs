import { PageElementProps } from "components/report/Elements";
import { PerformanceRateTemplate, ReportStatus } from "types";
import * as PerformanceType from "./../rates/types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import * as Calculations from "./../rates/calculations";

export const PerformanceRateElement = (props: PageElementProps) => {
  const performanceRateProp = props.element as PerformanceRateTemplate;
  const { rateType, rateCalc, helperText, label } = performanceRateProp;
  const { report } = useStore();
  const { userIsEndUser } = useStore().user || {};

  if (!report?.year) return null;

  const PerformanceRate = PerformanceType[rateType];
  const Calculation = Calculations[rateCalc ?? "NDRCalc"];
  performanceRateProp.multiplier = performanceRateProp.multiplier ?? 1;

  const disabled = !userIsEndUser || report?.status === ReportStatus.SUBMITTED;

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">{label ?? "Performance Rates"}</Heading>
      <Text>{helperText}</Text>
      <PerformanceRate
        {...{
          formkey: props.formkey,
          year: report.year,
          ...performanceRateProp,
          calculation: Calculation,
          disabled: disabled,
        }}
      ></PerformanceRate>
    </Stack>
  );
};

const sx = {
  performance: {
    input: {
      width: "240px",
    },
  },
};
