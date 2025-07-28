import React, { useState } from "react";
import { LengthOfStayField, LengthOfStayRateTemplate } from "types";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  parseNumber,
  removeNoise,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import {
  makeEmptyStringCopyOf,
  validateNumber,
} from "utils/validation/inputValidation";

export const Fields = (props: PageElementProps<LengthOfStayRateTemplate>) => {
  const { disabled, updateElement } = props;
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
  const [errors, setErrors] = useState(makeEmptyStringCopyOf(initialValue));

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as LengthOfStayField;
    const stringValue = input.value;
    const { errorMessage } = validateNumber(stringValue, true);

    const newDisplayValue = structuredClone(displayValue);
    const newErrors = structuredClone(errors);
    newDisplayValue[fieldType] = stringValue;
    newErrors[fieldType] = errorMessage;

    return { displayValue: newDisplayValue, errors: newErrors };
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
      performanceTarget: removeNoise(performanceTarget),
      actualCount: removeNoise(actualCount),
      denominator: removeNoise(denominator),
      expectedCount: removeNoise(expectedCount),
      populationRate: removeNoise(populationRate),
      actualRate: removeNoise(actualRate),
      expectedRate: removeNoise(expectedRate),
      adjustedRate: removeNoise(adjustedRate),
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
    const { displayValue: newDisplayValue, errors: newErrors } =
      updatedDisplayValue(event.target);

    // answer corresponds to the report data. Its values are numbers.
    const newAnswer = computeAnswer(newDisplayValue);

    // Instantly display calculation results
    updateCalculatedValues(newDisplayValue, newAnswer);
    setDisplayValue(newDisplayValue);
    setErrors(newErrors);

    // Instantly save parsed and calculated values to the store and API
    updateElement({ answer: newAnswer });
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
        <CmsdsTextField
          label={labels.performanceTarget}
          name="performanceTarget"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.performanceTarget}
          errorMessage={errors.performanceTarget}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualCount}
          name="actualCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.actualCount}
          errorMessage={errors.actualCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.denominator}
          name="denominator"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.denominator}
          errorMessage={errors.denominator}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedCount}
          name="expectedCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.expectedCount}
          errorMessage={errors.expectedCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.populationRate}
          name="populationRate"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.populationRate}
          errorMessage={errors.populationRate}
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
