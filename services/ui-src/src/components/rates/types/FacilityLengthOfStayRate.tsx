import React, { useEffect, useState } from "react";
import { FacilityLengthOfStayRateTemplate } from "types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { PageElementProps } from "components/report/Elements";
import { FacilityLengthOfStayCalc } from "../calculations";

export const FacilityLengthOfStayRate = (props: PageElementProps) => {
  const { formkey, element } = props;
  const { helperText, labels, answer } =
    element as FacilityLengthOfStayRateTemplate;

  const defaultValue = answer ?? {
    performanceTarget: undefined,
    actualTransitions: undefined,
    stayCount: undefined,
    expectedTransitions: undefined,
    populationRate: undefined,
    actualRate: undefined,
    expectedRate: undefined,
    riskAdjustedRate: undefined,
  };
  const [displayValue, setDisplayValue] =
    useState<NonNullable<typeof answer>>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const calculatedRate = FacilityLengthOfStayCalc({
      ...displayValue,
      [name]: value,
    });

    setDisplayValue(calculatedRate);
    form.setValue(`${key}`, displayValue, { shouldValidate: true });
  };

  const onBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    form.setValue(`${key}.${name}`, value, { shouldValidate: true });
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Text>{helperText}</Text>
      <Stack gap={4}>
        <CmsdsTextField
          label={labels.performanceTarget}
          name="performanceTarget"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.performanceTarget ?? ""}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualTransitions}
          name="actualTransitions"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.actualTransitions ?? ""}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.stayCount}
          name="stayCount"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.stayCount ?? ""}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedTransitions}
          name="expectedTransitions"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.expectedTransitions ?? ""}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.populationRate}
          name="populationRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.populationRate ?? ""}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualRate}
          name="actualRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.actualRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRate}
          name="expectedRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.expectedRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.riskAdjustedRate}
          name="riskAdjustedRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.riskAdjustedRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
      </Stack>
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
