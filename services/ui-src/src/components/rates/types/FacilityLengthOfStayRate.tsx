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
  const { helperText, answer, fields } =
    element as FacilityLengthOfStayRateTemplate;
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
          name={`performanceTarget`}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.performanceTarget}
        ></CmsdsTextField>
        {fields.map((field) => {
          return (
            <CmsdsTextField
              label={field.label}
              name={field.id}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={displayValue[field.id]}
              disabled={field.autoCalc}
            ></CmsdsTextField>
          );
        })}
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
