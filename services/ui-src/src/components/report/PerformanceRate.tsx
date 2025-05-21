import { PageElementProps } from "components/report/Elements";
import { PerformanceRateTemplate } from "types";
import * as PerformanceType from "./../rates/types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { NDRCalc } from "components/rates/calculations";

export const PerformanceRateElement = (
  props: PageElementProps<PerformanceRateTemplate>
) => {
  const performanceRateProp = props.element;
  const { rateType, helperText, label } = performanceRateProp;
  const { report } = useStore();

  if (!report?.year) return null;

  const PerformanceRate = PerformanceType[rateType];
  performanceRateProp.multiplier = performanceRateProp.multiplier ?? 1;

  const disabled = props.disabled;

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">{label ?? "Performance Rates"}</Heading>
      <Text>{helperText}</Text>
      <PerformanceRate
        {...{
          formkey: props.formkey,
          year: report.year,
          ...performanceRateProp,
          calculation: NDRCalc,
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
