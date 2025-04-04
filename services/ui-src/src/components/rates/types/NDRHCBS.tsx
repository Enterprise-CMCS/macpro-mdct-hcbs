import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate, RateSetData } from "types";
import { isNumber } from "../calculations";

export const NDRHCBS = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year?: number;
    calculation: Function;
  }
) => {
  const { label, assessments, answer, multiplier, calculation, fields } = props;

  const defaultRates: RateSetData[] =
    assessments?.map((assess) => {
      return {
        label: assess.label,
        denominator: undefined,
        id: assess.id,
        rates: fields?.map((field) => {
          return {
            label: field.label,
            numerator: undefined,
            denominator: undefined,
            rate: undefined,
            performanceTarget: undefined,
            id: `${assess.id}.${field.id}`,
          };
        }),
      };
    }) ?? [];

  const defaultValue: RateSetData[] = (answer as RateSetData[]) ?? defaultRates;
  const [displayValue, setDisplayValue] = useState<RateSetData[]>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props?.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(event.target.value)) return;

    const { name, value } = event.target;
    const [setIndex, setKey, rateIndex, type] = name.split(".");
    const newValues = [...displayValue];
    type rateType = "numerator" | "denominator" | "rate" | "performanceTarget";

    if (setKey === "denominator") {
      newValues[Number(setIndex)].denominator = value
        ? Number(value)
        : undefined;
      newValues[Number(setIndex)].rates?.forEach((rate) => {
        rate.denominator = value ? Number(value) : undefined;
      });
    } else if (setKey === "rates" && newValues[Number(setIndex)].rates) {
      newValues[Number(setIndex)].rates![Number(rateIndex)][type as rateType] =
        value ? Number(value) : undefined;
    }

    //run rate calculations if denominator or numerator was changed
    if (setKey === "denominator" || type === "numerator") {
      newValues[Number(setIndex)].rates?.forEach((rate) => {
        rate.rate = calculation(rate, multiplier);
      });
    }

    setDisplayValue([...newValues]);
    form.setValue(`${key}`, newValues, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };
  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumber(event.target.value)) return;

    const { name, value } = event.target;
    form.setValue(`${key}.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={6}>
      {assessments?.map((assess, assessIndex) => {
        const rateSet = displayValue?.find((value) => value.id === assess.id);

        return (
          <Stack key={assess.id} gap={6}>
            <Heading variant="subHeader">
              {label ?? "Performance Rate"}
              {": "}
              {assess.label}
            </Heading>

            <CmsdsTextField
              label={`${assess.label} Denominator`}
              name={`${assessIndex}.denominator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={rateSet?.denominator}
            ></CmsdsTextField>

            {fields?.map((field, fieldIndex) => {
              const value = rateSet?.rates?.find(
                (item) => item.id === `${assess.id}.${field.id}`
              );

              return (
                <Stack key={`${field.id}.${assess.id}`} gap={6}>
                  <Heading variant="nestedHeading">
                    {assess.label}
                    {field.id !== "self-label" ? ` (${field.label})` : ""}
                  </Heading>
                  <CmsdsTextField
                    label={`What is the ${
                      props.year
                    } state performance target for ${assess.label}${
                      field.id !== "self-label" ? ` (${field.label})` : ""
                    }?`}
                    name={`${fieldIndex}.performanceTarget.${assessIndex}.rates`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.performanceTarget}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Numerator: ${assess.label}${
                      field.id !== "self-label" ? ` (${field.label})` : ""
                    }`}
                    name={`${fieldIndex}.numerator.${assessIndex}.rates`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.numerator}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Denominator`}
                    name={`${fieldIndex}.denominator.${assessIndex}.rates`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.denominator}
                    disabled
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`${assess.label}${
                      field.id !== "self-label" ? ` (${field.label})` : ""
                    } Rate`}
                    name={`${fieldIndex}.rate.${assessIndex}.rates`}
                    hint="Auto-calculates"
                    value={value?.rate}
                    disabled
                  ></CmsdsTextField>
                </Stack>
              );
            })}
            <Divider></Divider>
          </Stack>
        );
      })}
    </Stack>
  );
};
