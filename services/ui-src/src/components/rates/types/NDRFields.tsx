import React, { useEffect, useState } from "react";
import { Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate, RateSetData } from "types";

export const NDRFields = (
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
            id: assess.id,
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
    const { name, value } = event.target;
    const [setIndex, setKey, rateIndex, type] = name.split(".");
    const newValues = [...displayValue];
    type rateType = "numerator" | "denominator" | "rate" | "performanceTarget";

    if (setKey === "denominator") {
      newValues[Number(setIndex)].denominator = Number(value);
      newValues[Number(setIndex)].rates?.forEach((rate) => {
        rate.denominator = Number(value);
      });
    } else if (setKey === "rates" && newValues[Number(setIndex)].rates) {
      newValues[Number(setIndex)].rates![Number(rateIndex)][type as rateType] =
        Number(value);
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
    const { name, value } = event.target;
    let adjustedName = name === "denominator" ? "" : ".rates";
    // form.setValue(`${key}${adjustedName}.${name}`, value, {
    //   shouldValidate: true,
    // });
    // form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={4}>
      {assessments?.map((assess, assessIndex) => {
        const rateSet = displayValue?.find((value) => value.id === assess.id);

        return (
          <Stack key={assess.id}>
            <Heading variant="subHeader">
              {label ?? "Performance Rate"}
              {": "}
              {assess.label}
            </Heading>

            <CmsdsTextField
              label={`Denominator (${assess.label})`}
              name={`${assessIndex}.denominator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={rateSet?.denominator}
            ></CmsdsTextField>

            {fields?.map((field, fieldIndex) => {
              const value = rateSet?.rates?.find(
                (item) => item.id === assess.id
              );

              return (
                <Stack>
                  <CmsdsTextField
                    label={`What is the ${
                      props.year
                    } state performance target for this assessment for ${field.label.toLowerCase()} (${
                      assess.label
                    })?`}
                    name={`${assessIndex}.rates.${fieldIndex}.performanceTarget`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.performanceTarget}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Numerator: ${field.label} (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.numerator`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.numerator}
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`Denominator (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.denominator`}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={value?.denominator}
                    disabled
                  ></CmsdsTextField>
                  <CmsdsTextField
                    label={`${field.label} Rate (${assess.label})`}
                    name={`${assessIndex}.rates.${fieldIndex}.rate`}
                    hint="Auto-calculates"
                    value={value?.rate}
                    disabled
                  ></CmsdsTextField>
                </Stack>
              );
            })}
          </Stack>
        );
      })}
    </Stack>
  );
};
