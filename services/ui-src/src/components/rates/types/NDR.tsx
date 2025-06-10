import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { NdrTemplate, RateInputFieldName, RateInputFieldNames } from "types";
import {
  parseNumber,
  roundRate,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const NDR = (props: PageElementProps<NdrTemplate>) => {
  const { formkey, disabled, element } = props;
  const { label, performanceTargetLabel, answer, multiplier } = element;
  const multiplierVal = multiplier ?? 1; // default multiplier value

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return {
      performanceTarget: stringifyInput(newAnswer?.performanceTarget),
      numerator: stringifyInput(newAnswer?.numerator),
      denominator: stringifyInput(newAnswer?.denominator),
      rate: stringifyResult(newAnswer?.rate),
    };
  };

  const initialValue = stringifyAnswer(answer);
  const [displayValue, setDisplayValue] = useState(initialValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
  }, []);

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as RateInputFieldName;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    newDisplayValue[fieldType] = stringValue;

    return newDisplayValue;
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const performanceTarget = parseNumber(newDisplayValue.performanceTarget);
    const numerator = parseNumber(newDisplayValue.numerator);
    const denominator = parseNumber(newDisplayValue.denominator);
    const canCompute =
      numerator !== undefined && denominator !== undefined && denominator !== 0;
    const rate = canCompute
      ? (numerator / denominator) * multiplierVal
      : undefined;

    return {
      performanceTarget: roundRate(performanceTarget),
      numerator: roundRate(numerator),
      denominator: roundRate(denominator),
      rate: roundRate(rate),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    newDisplayValue.rate = stringifyResult(newAnswer.rate);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // displayValue corresponds to the inputs on screen. Its values are strings.
    const newDisplayValue = updatedDisplayValue(event.target);

    // answer corresponds to the report data. Its values are numbers.
    const newAnswer = computeAnswer(newDisplayValue);

    // Instantly display calculation results
    updateCalculatedValues(newDisplayValue, newAnswer);
    setDisplayValue(newDisplayValue);

    // Instantly save parsed and calculated values to the form, store, and API
    form.setValue(`${key}`, newAnswer, { shouldValidate: true });
  };

  const onBlurHandler = () => {
    // When the user is done typing, overwrite the answer with the parsed value.
    setDisplayValue(stringifyAnswer(form.getValues(key)));
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
        <Stack gap="2rem">
          <Heading variant="subHeader">Performance Rate: {label}</Heading>
          {performanceTargetLabel && (
            <CmsdsTextField
              label={performanceTargetLabel}
              name={RateInputFieldNames.performanceTarget}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={displayValue.performanceTarget}
              disabled={disabled}
            ></CmsdsTextField>
          )}
          <CmsdsTextField
            label="Numerator"
            name={RateInputFieldNames.numerator}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.numerator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            name={RateInputFieldNames.denominator}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.denominator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Rate"
            name="rate"
            hint="Auto-calculates"
            value={displayValue.rate}
            disabled
          ></CmsdsTextField>
          <Divider></Divider>
        </Stack>
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
