import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { ElementType, NdrEnhancedTemplate } from "types";
import { parseNumber, roundTo } from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const NDREnhanced = (props: PageElementProps<NdrEnhancedTemplate>) => {
  const { formkey, disabled } = props;
  const { assessments, answer, helperText, performanceTargetLabel, label } =
    props.element;

  const initialValue = {
    id: props.element.id,
    denominator: undefined,
    rates: assessments.map((assess) => ({
      id: assess.id,
      performanceTarget: undefined,
      numerator: undefined,
      rate: undefined,
    })),
  };

  const [displayValue, setDisplayValue] = useState(answer ?? initialValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, initialValue);
  }, []);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldType: "performanceTarget" | "denominator" | "numerator",
    assessIndex?: number
  ) => {
    const newValue = parseNumber(event.target.value);
    if (newValue === undefined) return;

    const answer = structuredClone(displayValue);

    switch (fieldType) {
      case "performanceTarget":
        answer.rates[assessIndex!].performanceTarget = newValue;
        break;
      case "denominator":
        answer.denominator = newValue;

        for (let rateObject of answer.rates) {
          const numerator = rateObject.numerator;
          if (numerator !== undefined && newValue !== 0) {
            rateObject.rate = roundTo(numerator / newValue, 1);
          }
        }
        break;
      case "numerator":
        {
          const denominator = answer.denominator;
          const rateObject = answer.rates[assessIndex!];
          rateObject.numerator = newValue;

          if (denominator !== undefined && denominator !== 0) {
            rateObject.rate = roundTo(newValue / denominator, 1);
          }
        }
        break;
    }

    setDisplayValue(answer);
    form.setValue(`${key}`, answer, { shouldValidate: true });
    form.setValue(`${key}.type`, ElementType.NdrEnhanced);
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">{label ?? "Performance Rates"}</Heading>
      <Text>{helperText}</Text>
      <Stack gap="2rem">
        <CmsdsTextField
          label={`${label ?? "Performance Rates"} Denominator`}
          name="denominator"
          onChange={(evt) => onChangeHandler(evt, "denominator")}
          value={displayValue?.denominator ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        {assessments.map((assess, index) => {
          const value = displayValue.rates[index];

          return (
            <Stack key={assess.id} gap="2rem">
              <Heading variant="subHeader">
                {label ?? "Performance Rate"}
                {": "}
                {assess.label}
              </Heading>
              <CmsdsTextField
                label={performanceTargetLabel}
                name={`${index}.performanceTarget`}
                onChange={(evt) =>
                  onChangeHandler(evt, "performanceTarget", index)
                }
                value={value.performanceTarget ?? ""}
                disabled={disabled}
              ></CmsdsTextField>
              <CmsdsTextField
                label="Numerator"
                name={`${index}.numerator`}
                onChange={(evt) => onChangeHandler(evt, "numerator", index)}
                value={value.numerator ?? ""}
                disabled={disabled}
              ></CmsdsTextField>
              <CmsdsTextField
                label="Denominator"
                name={`${index}.denominator`}
                value={displayValue.denominator ?? ""}
                hint="Auto-populates"
                disabled
              ></CmsdsTextField>
              <CmsdsTextField
                label="Rate"
                name={`${index}.rate`}
                hint="Auto-calculates"
                value={value.rate ?? ""}
                disabled
              ></CmsdsTextField>
            </Stack>
          );
        })}
        <Divider></Divider>
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
