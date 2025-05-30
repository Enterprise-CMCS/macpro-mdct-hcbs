import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate, RateSetData } from "types";
import { isNumber } from "../calculations";

export const NDRFields = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year: number;
    calculation: Function;
    disabled?: boolean;
  }
) => {
  const {
    label,
    assessments,
    answer,
    multiplier,
    calculation,
    fields,
    disabled,
  } = props;

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

  return (
    <Stack gap="2rem">
      {assessments?.map((assess, assessIndex) => {
        const rateSet = displayValue?.find((value) => value.id === assess.id);

        return (
          <Stack key={assess.id} gap="2rem">
            <Heading variant="subHeader">
              {label ?? "Performance Rates"}
              {": "}
              {assess.label}
            </Heading>

            <CmsdsTextField
              label={`Denominator (${assess.label})`}
              name={`${assessIndex}.denominator`}
              onChange={onChangeHandler}
              value={rateSet?.denominator ?? ""}
              disabled={disabled}
            ></CmsdsTextField>

            {fields?.map((field, fieldIndex) => {
              const value = rateSet?.rates?.find(
                (item) => item.id === `${assess.id}.${field.id}`
              );

              return (
                <Stack key={`${assess.id}.${field.id}`} gap="2rem">
                  <Heading variant="nestedHeading">{field.label}</Heading>
                  <CmsdsTextField
                    label={`What is the ${
                      props.year + 2
                    } state performance target for this assessment for ${field.label.toLowerCase()} (${
                      assess.label
                    })?`}
                    name={`${assessIndex}.rates.${fieldIndex}.performanceTarget`}
                    onChange={onChangeHandler}
                    value={value?.performanceTarget ?? ""}
                    disabled={disabled}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Numerator: ${field.label} (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.numerator`}
                    onChange={onChangeHandler}
                    value={value?.numerator ?? ""}
                    disabled={disabled}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Denominator (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.denominator`}
                    onChange={onChangeHandler}
                    value={value?.denominator ?? ""}
                    disabled
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`${field.label} Rate (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.rate`}
                    hint="Auto-calculates"
                    value={value?.rate ?? ""}
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
