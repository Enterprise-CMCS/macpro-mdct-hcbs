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
import { ExportRateTable } from "components/export/ExportedReportTable";

export const Fields = (props: PageElementProps<LengthOfStayRateTemplate>) => {
  const { disabled, updateElement } = props;
  const { labels, answer } = props.element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return {
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
    const { errorMessage } = validateNumber(stringValue, input.required);

    const newDisplayValue = structuredClone(displayValue);
    const newErrors = structuredClone(errors);
    newDisplayValue[fieldType] = stringValue;
    newErrors[fieldType] = errorMessage;

    return { displayValue: newDisplayValue, errors: newErrors };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const actualCount = parseNumber(newDisplayValue.actualCount);
    const denominator = parseNumber(newDisplayValue.denominator);
    const expectedCount = parseNumber(newDisplayValue.expectedCount);
    const populationRate = parseNumber(newDisplayValue.populationRate);
    const adjustedRate = parseNumber(newDisplayValue.adjustedRate);
    let actualRate: number | undefined = undefined;
    let expectedRate: number | undefined = undefined;

    const canDivide = denominator !== undefined && denominator !== 0;

    if (canDivide && actualCount !== undefined) {
      actualRate = actualCount / denominator;
    }

    if (canDivide && expectedCount !== undefined) {
      expectedRate = expectedCount / denominator;
    }

    return {
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
    updateElement({ answer: newAnswer, errors: newErrors });
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
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
          name="populationRate"
          label={
            <>
              {labels.populationRate}
              {<span className="optionalText"> (optional)</span>}
            </>
          }
          disabled={disabled}
          required={false}
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.populationRate}
          hint="If Multi-plan Population Rate is left empty, provide a brief explanation in the Additional Comments field below."
          errorMessage={errors.populationRate}
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
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.adjustedRate}
          disabled={disabled}
          errorMessage={errors.adjustedRate}
        ></CmsdsTextField>
        <Divider></Divider>
      </Stack>
    </Stack>
  );
};

//The pdf rendering of Fields component
export const FieldsExport = (element: LengthOfStayRateTemplate) => {
  const label = "Performance Rates";
  const rows = [
    {
      indicator: element.labels?.actualCount,
      response: element.answer?.actualCount,
    },
    {
      indicator: element.labels?.denominator,
      response: element.answer?.denominator,
    },
    {
      indicator: element.labels?.expectedCount,
      response: element.answer?.expectedCount,
    },
    {
      indicator: element.labels?.populationRate,
      response: element.answer?.populationRate,
    },
    {
      indicator: element.labels?.actualRate,
      response: stringifyResult(element.answer?.actualRate),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.expectedRate,
      response: stringifyResult(element.answer?.expectedRate),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.adjustedRate,
      response: element.answer?.adjustedRate,
    },
  ];
  return <>{ExportRateTable([{ label, rows }])}</>;
};

const sx = {
  performance: {
    input: {
      width: "240px",
    },
  },
};
