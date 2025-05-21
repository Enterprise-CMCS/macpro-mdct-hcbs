import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { PerformanceData, PerformanceRateTemplate } from "types";
import { isNumber } from "../calculations";

export const NDR = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year: number;
    calculation: Function;
    disabled?: boolean;
  }
) => {
  const { label, assessments, answer, multiplier, calculation, disabled } =
    props;
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

  return (
    <Stack gap="2rem">
      {assessments?.map((assess, index) => {
        const value =
          displayValue.rates.find((item) => item.id === assess.id) ?? {};

        return (
          <Stack key={assess.id} gap="2rem">
            <Heading variant="subHeader">
              {label ?? "Performance Rate"}
              {": "}
              {assess.label}
            </Heading>
            <CmsdsTextField
              label={`What is the ${
                props.year + 2
              } state performance target for this assessment?`}
              name={`${index}.performanceTarget`}
              onChange={onChangeHandler}
              value={value.performanceTarget ?? ""}
              disabled={disabled}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Numerator"
              name={`${index}.numerator`}
              onChange={onChangeHandler}
              value={value.numerator ?? ""}
              disabled={disabled}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Denominator"
              name={`${index}.denominator`}
              onChange={onChangeHandler}
              value={value.denominator ?? ""}
              disabled={disabled}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Rate"
              name={`${index}.rate`}
              hint="Auto-calculates"
              value={value.rate ?? ""}
              disabled
            ></CmsdsTextField>
            <Divider></Divider>
          </Stack>
        );
      })}
    </Stack>
  );
};
