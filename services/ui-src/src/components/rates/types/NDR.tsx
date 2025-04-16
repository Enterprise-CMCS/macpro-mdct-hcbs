import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { PerformanceData, PerformanceRateTemplate } from "types";
import { isNumber } from "../calculations";

export const NDR = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year?: number;
    calculation: Function;
  }
) => {
  const { label, assessments, answer, multiplier, calculation } = props;
  const initialValues =
    assessments?.map((assess) => {
      return {
        numerator: "",
        denominator: "",
        rate: undefined,
        performanceTarget: "",
        id: assess.id,
      };
    }) ?? [];

  const defaultValue: PerformanceData = (answer as PerformanceData) ?? {
    rates: initialValues,
  };
  const [displayValue, setDisplayValue] =
    useState<PerformanceData>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(event.target.value)) return;

    const { name, value } = event.target;
    const [index, type] = name.split(".");

    const newDisplayValue = displayValue.rates[Number(index)];
    newDisplayValue[type] = value ?? undefined;
    newDisplayValue.rate = calculation(newDisplayValue, multiplier);
    displayValue.rates[Number(index)] = newDisplayValue;

    setDisplayValue({ ...displayValue });
    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };
  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(event.target.value)) return;

    const { name, value } = event.target;
    form.setValue(`${key}.rates.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={6}>
      {assessments?.map((assess, index) => {
        const value =
          displayValue.rates.find((item) => item.id === assess.id) ?? {};

        return (
          <Stack key={assess.id} gap={6}>
            <Heading variant="subHeader">
              {label ?? "Performance Rate"}
              {": "}
              {assess.label}
            </Heading>
            <CmsdsTextField
              label={`What is the ${props.year} state performance target for this assessment?`}
              name={`${index}.performanceTarget`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.performanceTarget}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Numerator"
              name={`${index}.numerator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.numerator}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Denominator"
              name={`${index}.denominator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.denominator}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Rate"
              name={`${index}.rate`}
              hint="Auto-calculates"
              value={value.rate}
              disabled
            ></CmsdsTextField>
            <Divider></Divider>
          </Stack>
        );
      })}
    </Stack>
  );
};
