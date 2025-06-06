import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  NdrEnhancedTemplate,
  RateInputFieldName,
  RateInputFieldNames,
} from "types";
import {
  parseNumber,
  roundRate,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import { zip } from "utils/other/arrays";

export const NDREnhanced = (props: PageElementProps<NdrEnhancedTemplate>) => {
  const { formkey, disabled, element } = props;
  const { assessments, answer, helperText, performanceTargetLabel, label } =
    element;

  const stringifyAnswer = (
    newAnswer: typeof answer | Record<string, undefined>
  ) => {
    return {
      denominator: stringifyInput(newAnswer?.denominator),
      rates: assessments.map((assessment, i) => ({
        id: assessment.id,
        performanceTarget: stringifyInput(
          newAnswer?.rates?.[i].performanceTarget
        ),
        numerator: stringifyInput(newAnswer?.rates?.[i].numerator),
        rate: stringifyResult(newAnswer?.rates?.[i].rate),
      })),
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
    /*
     * The name will look like "denominator" or "0.performanceTarget"
     * or "1.numerator". The last part is always a RateInputFieldName.
     * If there are two parts, the first will be an index into answer.rates.
     */
    const parts = input.name.split(".");
    const fieldType = parts.at(-1) as RateInputFieldName;
    const assessIndex = parts.length > 1 ? Number(parts.at(0)) : undefined;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    if (fieldType === RateInputFieldNames.denominator) {
      newDisplayValue.denominator = stringValue;
    } else {
      newDisplayValue.rates[assessIndex!][fieldType] = stringValue;
    }

    return newDisplayValue;
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const denominator = parseNumber(newDisplayValue.denominator);
    const canDivide = denominator !== undefined && denominator !== 0;

    return {
      denominator: roundRate(denominator),
      rates: newDisplayValue.rates.map((rateObj) => {
        const performanceTarget = parseNumber(rateObj.performanceTarget);
        const numerator = parseNumber(rateObj.numerator);
        const canCompute = canDivide && numerator !== undefined;
        const rate = canCompute ? numerator / denominator : undefined;

        return {
          id: rateObj.id,
          performanceTarget: roundRate(performanceTarget),
          numerator: roundRate(numerator),
          rate: roundRate(rate),
        };
      }),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    for (let pair of zip(newDisplayValue.rates, newAnswer.rates)) {
      const [displayRate, answerRate] = pair;
      displayRate.rate = stringifyResult(answerRate.rate);
    }
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
      <Heading variant="subHeader">{label ?? "Performance Rates"}</Heading>
      <Text>{helperText}</Text>
      <Stack gap="2rem">
        <CmsdsTextField
          label={`${label ?? "Performance Rates"} Denominator`}
          name={RateInputFieldNames.denominator}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.denominator}
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
                name={`${index}.${RateInputFieldNames.performanceTarget}`}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                value={value.performanceTarget}
                disabled={disabled}
              ></CmsdsTextField>
              <CmsdsTextField
                label="Numerator"
                name={`${index}.${RateInputFieldNames.numerator}`}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                value={value.numerator}
                disabled={disabled}
              ></CmsdsTextField>
              <CmsdsTextField
                label="Denominator"
                name={`${index}.denominator`}
                value={displayValue.denominator}
                hint="Auto-populates"
                disabled
              ></CmsdsTextField>
              <CmsdsTextField
                label="Rate"
                name={`${index}.rate`}
                hint="Auto-calculates"
                value={value.rate}
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
