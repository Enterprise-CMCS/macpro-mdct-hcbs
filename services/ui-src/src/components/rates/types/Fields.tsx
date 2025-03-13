import { useEffect, useState } from "react";
import { PerformanceData, PerformanceRateTemplate } from "types";
import { Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";

export const Fields = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year?: number;
    calculation: Function;
  }
) => {
  const { answer, fields, calculation, multiplier } = props;
  const arr =
    fields?.map((field) => {
      return { [field.id]: "" };
    }) ?? [];
  const initialValues = Object.assign({}, ...arr);
  const defaultValue = answer ?? {
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
    const { name, value } = event.target;
    const [index, type] = name.split(".");
    const newDisplayValue = displayValue.rates[Number(index)];
    newDisplayValue[type] = value;

    const calculatedRate = calculation(newDisplayValue, multiplier);

    displayValue.rates[Number(index)] = calculatedRate;
    setDisplayValue(displayValue);
    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };
  const onBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    form.setValue(`${key}.rates.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={4}>
      <CmsdsTextField
        label={`What is the ${props.year} state performance target for this assessment`}
        name={`0.performanceTarget`}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue.rates[0].performanceTarget}
      ></CmsdsTextField>
      {fields?.map((field) => {
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
  );
};
