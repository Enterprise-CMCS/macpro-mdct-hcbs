import { PageElementProps } from "components/report/Elements";
import { PerformanceRateTemplate } from "types";
import * as PerformanceType from "./../rates/types";
import { Heading, Stack, Text } from "@chakra-ui/react";

export const PerformanceRateElement = (props: PageElementProps) => {
  const performanceRateProp = props.element as PerformanceRateTemplate;
  const { rateType, helperText } = performanceRateProp;

  const PerformanceRate = PerformanceType[rateType];

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Text>
        {helperText}
        The performance rate is based on a review of this measures participant
        case management records, slected via a systematic sample drawn from the
        eligible population.
      </Text>
      <PerformanceRate
        {...{ formkey: props.formkey, ...performanceRateProp }}
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
