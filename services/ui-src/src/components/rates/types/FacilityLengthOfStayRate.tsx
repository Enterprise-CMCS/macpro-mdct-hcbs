import React, { useEffect, useState } from "react";
import { FacilityLengthOfStayRateTemplate } from "types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { PageElementProps } from "components/report/Elements";
import { useStore } from "utils";
import { FacilityLengthOfStayCalc } from "../calculations";

export const FacilityLengthOfStayRate = (props: PageElementProps) => {
  const { formkey, element } = props;
  const { helperText, answer } = element as FacilityLengthOfStayRateTemplate;
  const year = useStore().report?.year;

  const defaultValue = answer ?? {
    performanceTarget: undefined,
    actualDischarges: undefined,
    admissionCount: undefined,
    expectedDischarges: undefined,
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
          label={`What is the ${year} state performance target for this assessment?`}
          name="performanceTarget"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.performanceTarget}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Count of Successful Discharges to the Community"
          name="actualDischarges"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.actualDischarges}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Facility Admission Count"
          name="admissionCount"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.admissionCount}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Expected Count of Successful Discharges to the Community"
          name="expectedDischarges"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.expectedDischarges}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Multi-Plan Population Rate"
          name="populationRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.populationRate}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Observed Performance Rate for the Minimizing Length of Facility Stay"
          name="actualRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.actualRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Expected Performance Rate for the Minimizing Length of Facility Stay"
          name="expectedRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.expectedRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Risk Adjusted Rate for the Minimizing Length of Facility Stay"
          name="riskAdjustedRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.riskAdjustedRate}
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
