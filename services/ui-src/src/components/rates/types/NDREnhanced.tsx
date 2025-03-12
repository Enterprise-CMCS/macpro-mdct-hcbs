import { Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useEffect, useState } from "react";
import { PerformanceData, PerformanceRateTemplate } from "types";

export const NDREnhanced = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year?: number;
    calculation: Function;
  }
) => {
  const { assessments, answer, multiplier, calculation } = props;
  const initialValues =
    assessments?.map((assess) => {
      return {
        numerator: "",
        denominator: "",
        rate: "",
        performanceTarget: "",
        id: assess.id,
      };
    }) ?? [];

  const defaultValue = answer ?? { rates: initialValues };

  const [displayValue, setDisplayValue] =
    useState<PerformanceData>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props?.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const [index, type] = name.split(".");

    // //set the denominator for all the ndr sets
    if (name === "denominator") {
      const newValues = {
        denominator: Number(value),
        rates: displayValue?.rates?.map((values) => {
          return { ...values, denominator: value };
        }),
      };

      setDisplayValue(newValues);
      form.setValue(`${key}`, newValues, { shouldValidate: true });
    } else {
      const newDisplayValue = displayValue.rates[Number(index)];
      newDisplayValue[type] = value;
      newDisplayValue.rate = calculation(newDisplayValue, multiplier);
      displayValue.rates[Number(index)] = newDisplayValue;
      setDisplayValue(displayValue);
      form.setValue(`${key}`, displayValue, { shouldValidate: true });
      form.setValue(`${key}.type`, props.type);
    }
  };
  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let adjustedName = name === "denominator" ? "" : ".rates";
    form.setValue(`${key}${adjustedName}.${name}`, value, {
      shouldValidate: true,
    });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={4}>
      <CmsdsTextField
        label="Performance Rates Denominator"
        name="denominator"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={answer?.denominator}
      ></CmsdsTextField>
      {assessments?.map((assess, index) => {
        const value =
          displayValue?.rates?.find((item) => item.id === assess.id) ?? {};

        return (
          <div key={assess.id}>
            <Heading variant="subHeader">
              Performance Rate: {assess.label}
            </Heading>
            <CmsdsTextField
              label={`What is the ${props.year} state performance target for this assessment`}
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
              hint="Auto-calculates"
              disabled
            ></CmsdsTextField>
            <CmsdsTextField
              label="Rate"
              name={`${index}.rate`}
              hint="Auto-calculates"
              value={value.rate}
              disabled
            ></CmsdsTextField>
          </div>
        );
      })}
    </Stack>
  );
};
