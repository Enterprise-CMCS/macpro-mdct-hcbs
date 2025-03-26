import { PageElementProps } from "components/report/Elements";
import { PerformanceRateTemplate } from "types";
import * as PerformanceType from "./../rates/types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import * as Calculations from "./../rates/calculations";

export const PerformanceRateElement = (props: PageElementProps) => {
  const performanceRateProp = props.element as PerformanceRateTemplate;
  const { rateType, helperText, label } = performanceRateProp;
  const { report } = useStore();

  const PerformanceRate = PerformanceType[rateType];
  const Calculation = Calculations.NDRCalc;
  performanceRateProp.multiplier = performanceRateProp.multiplier ?? 1;

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">{label ?? "Performance Rates"}</Heading>
      <Text>{helperText}</Text>
      <PerformanceRate
        {...{
          formkey: props.formkey,
          year: report?.year,
          ...performanceRateProp,
          calculation: Calculation,
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
