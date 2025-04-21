import React, { useEffect, useState } from "react";
import { PerformanceData, PerformanceRateTemplate } from "types";
import { Divider, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { isNumber } from "../calculations";

export const Fields = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year: number;
    calculation: Function;
    disabled: boolean;
  }
) => {
  const { answer, fields, calculation, multiplier, disabled } = props;
  const arr =
    fields?.map((field) => {
      return { [field.id]: "" };
    }) ?? [];
  const initialValues = Object.assign({}, ...arr);
  const defaultValue: PerformanceData = (answer as PerformanceData) ?? {
    rates: [{ performanceTarget: "", ...initialValues }],
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

    const calculatedRate = calculation(newDisplayValue, multiplier);

    displayValue.rates[Number(index)] = calculatedRate;
    setDisplayValue({ ...displayValue });
    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };
  const onBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(event.target.value)) return;

    const { name, value } = event.target;
    form.setValue(`${key}.rates.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={6}>
      <CmsdsTextField
        label={`What is the ${
          props.year + 2
        } state performance target for this assessment?`}
        name={`0.performanceTarget`}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue.rates[0].performanceTarget ?? ""}
      ></CmsdsTextField>
      {fields?.map((field) => {
        return (
          <CmsdsTextField
            label={field.label}
            name={`0.${field.id}`}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.rates[0][field.id] ?? ""}
            disabled={field.autoCalc || disabled}
          ></CmsdsTextField>
        );
      })}
      <Divider></Divider>
    </Stack>
  );
};
