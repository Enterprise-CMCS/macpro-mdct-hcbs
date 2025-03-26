import React, { useEffect, useState } from "react";
import {
  FacilityLengthOfStayAnswer,
  FacilityLengthOfStayRateTemplate,
} from "types";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { PageElementProps } from "components/report/Elements";
import { useStore } from "utils";
import { FacilityLengthOfStayCalc } from "../calculations";

export const FacilityLengthOfStayRate = (props: PageElementProps) => {
  const { formkey, element } = props;
  const {
    helperText,
    answer,
    fields,
    type: elementType,
  } = element as FacilityLengthOfStayRateTemplate;
  const year = useStore().report?.year;

  const arr = fields.map((field) => {
    return { [field.id]: "" };
  });
  const initialValues = Object.assign({}, ...arr);
  const defaultValue = answer ?? {
    rates: [{ performanceTarget: "", ...initialValues }],
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
    const [index, type] = name.split(".");
    const newDisplayValue = displayValue.rates[Number(index)];
    newDisplayValue[type as keyof FacilityLengthOfStayAnswer] = value;

    const calculatedRate = FacilityLengthOfStayCalc(newDisplayValue);

    displayValue.rates[Number(index)] = calculatedRate;
    setDisplayValue({ ...displayValue });
    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, elementType);
  };
  const onBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    form.setValue(`${key}.rates.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, elementType);
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Text>{helperText}</Text>
      <Stack gap={4}>
        <CmsdsTextField
          label={`What is the ${year} state performance target for this assessment?`}
          name={`0.performanceTarget`}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.rates[0].performanceTarget}
        ></CmsdsTextField>
        {fields.map((field) => {
          return (
            <CmsdsTextField
              label={field.label}
              name={`0.${field.id}`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={displayValue.rates[0][field.id]}
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
