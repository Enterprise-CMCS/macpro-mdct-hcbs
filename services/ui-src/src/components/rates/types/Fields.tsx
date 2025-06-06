import React, { useEffect, useState } from "react";
import { LengthOfStayField, LengthOfStayRateTemplate } from "types";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import {
  parseNumber,
  roundRate,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const Fields = (props: PageElementProps<LengthOfStayRateTemplate>) => {
  const { formkey, disabled } = props;
  const { labels, answer } = props.element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return {
      performanceTarget: stringifyInput(newAnswer?.performanceTarget),
      actualCount: stringifyInput(newAnswer?.actualCount),
      denominator: stringifyInput(newAnswer?.denominator),
      expectedCount: stringifyInput(newAnswer?.expectedCount),
      populationRate: stringifyInput(newAnswer?.populationRate),
      actualRate: stringifyResult(newAnswer?.actualRate),
      expectedRate: stringifyResult(newAnswer?.expectedRate),
      adjustedRate: stringifyResult(newAnswer?.adjustedRate),
    };
  };

  const initialValue = stringifyAnswer(answer);
  const [displayValue, setDisplayValue] = useState(initialValue);

  // Get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
  }, []);

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as LengthOfStayField;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    newDisplayValue[fieldType] = stringValue;

    return newDisplayValue;
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const performanceTarget = parseNumber(newDisplayValue.performanceTarget);
    const actualCount = parseNumber(newDisplayValue.actualCount);
    const denominator = parseNumber(newDisplayValue.denominator);
    const expectedCount = parseNumber(newDisplayValue.expectedCount);
    const populationRate = parseNumber(newDisplayValue.populationRate);
    let actualRate: number | undefined = undefined;
    let expectedRate: number | undefined = undefined;
    let adjustedRate: number | undefined = undefined;

    const canDivide = denominator !== undefined && denominator !== 0;

    if (canDivide && actualCount !== undefined) {
      actualRate = actualCount / denominator;
    }

    if (canDivide && expectedCount !== undefined) {
      expectedRate = expectedCount / denominator;
    }

    if (
      actualCount !== undefined &&
      expectedCount !== undefined &&
      populationRate !== undefined
    ) {
      /*
       * Note that this is algebraically equivalent to the prescribed formula:
       *     (actualRate / expectedRate) * populationRate
       * since the factor of `1/denominator` in both actualRate and expectedRate
       * cancels out. So we can compute it before the user gives a denominator.
       * Additionally, we may get a more precise answer from this more direct
       * computation - although roundRate() discards most/all of that precision.
       */
      adjustedRate = (populationRate * actualCount) / expectedCount;
    }

    return {
      performanceTarget: roundRate(performanceTarget),
      actualCount: roundRate(actualCount),
      denominator: roundRate(denominator),
      expectedCount: roundRate(expectedCount),
      populationRate: roundRate(populationRate),
      actualRate: roundRate(actualRate),
      expectedRate: roundRate(expectedRate),
      adjustedRate: roundRate(adjustedRate),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    newDisplayValue.actualRate = stringifyResult(newAnswer.actualRate);
    newDisplayValue.expectedRate = stringifyResult(newAnswer.expectedRate);
    newDisplayValue.adjustedRate = stringifyResult(newAnswer.adjustedRate);
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
        <CmsdsTextField
          label={labels.performanceTarget}
          name="performanceTarget"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.performanceTarget}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualCount}
          name="actualCount"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.actualCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.denominator}
          name="denominator"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.denominator}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedCount}
          name="expectedCount"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.expectedCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.populationRate}
          name="populationRate"
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={displayValue.populationRate}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualRate}
          name="actualRate"
          value={displayValue.actualRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRate}
          name="expectedRate"
          value={displayValue.expectedRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.adjustedRate}
          name="adjustedRate"
          value={displayValue.adjustedRate}
          disabled={true}
        ></CmsdsTextField>
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
