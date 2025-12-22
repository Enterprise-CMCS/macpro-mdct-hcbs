import React, { useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { NdrTemplate, RateInputFieldName, RateInputFieldNames } from "types";
import {
  parseNumber,
  removeNoise,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import { autoCalculatesText, ErrorMessages } from "../../../constants";
import { ExportRateTable } from "components/export/ExportedReportTable";

export const NDR = (props: PageElementProps<NdrTemplate>) => {
  const { disabled, element, updateElement } = props;
  const { label, performanceTargetLabel, answer } = element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return {
      performanceTarget: stringifyInput(newAnswer?.performanceTarget),
      numerator: stringifyInput(newAnswer?.numerator),
      denominator: stringifyInput(newAnswer?.denominator),
      rate: stringifyResult(newAnswer?.rate),
    };
  };

  const initialValue = stringifyAnswer(answer);
  const initialErrors = {
    numerator: "",
    denominator: "",
    performanceTarget: "",
  };
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [errors, setErrors] = useState(initialErrors);

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as RateInputFieldName;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    newDisplayValue[fieldType] = stringValue;

    return newDisplayValue;
  };

  const computeErrors = (
    input: HTMLInputElement,
    newDisplayValue: typeof displayValue
  ) => {
    const fieldType = input.name as RateInputFieldName;
    const stringValue = input.value;
    const parsedValue = parseNumber(stringValue);
    let errorMessage;

    if (!stringValue) {
      errorMessage = ErrorMessages.requiredResponse;
    } else if (parsedValue === undefined) {
      errorMessage = ErrorMessages.mustBeANumber;
    } else if (
      parseNumber(newDisplayValue.denominator) === 0 &&
      parseNumber(newDisplayValue.numerator) !== 0
    ) {
      return {
        ...errors,
        [RateInputFieldNames.numerator]: ErrorMessages.denomenatorZero(
          "Numerator",
          "denominator"
        ),
        [RateInputFieldNames.denominator]: "",
      };
    } else {
      errorMessage = "";
    }

    // Overwrite only the error message for the input that was just touched.
    return {
      ...errors,
      [fieldType]: errorMessage,
    };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const performanceTarget = parseNumber(newDisplayValue.performanceTarget);
    const numerator = parseNumber(newDisplayValue.numerator);
    const denominator = parseNumber(newDisplayValue.denominator);
    if (denominator === 0 && numerator === 0) {
      return {
        numerator: 0,
        denominator: 0,
        rate: 0,
      };
    }
    const canCompute =
      numerator !== undefined && denominator !== undefined && denominator !== 0;
    const rate = canCompute ? numerator / denominator : undefined;

    return {
      performanceTarget: removeNoise(performanceTarget),
      numerator: removeNoise(numerator),
      denominator: removeNoise(denominator),
      rate: removeNoise(rate),
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
    const newErrors = computeErrors(event.target, newDisplayValue);

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
        <Stack gap="2rem">
          <Heading variant="subHeader">Performance Rate: {label}</Heading>
          <CmsdsTextField
            label={performanceTargetLabel}
            name={RateInputFieldNames.performanceTarget}
            onChange={onChangeHandler}
            onBlur={onChangeHandler}
            value={displayValue.performanceTarget}
            errorMessage={errors.performanceTarget}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Numerator"
            name={RateInputFieldNames.numerator}
            onChange={onChangeHandler}
            onBlur={onChangeHandler}
            value={displayValue.numerator}
            errorMessage={errors.numerator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            name={RateInputFieldNames.denominator}
            onChange={onChangeHandler}
            onBlur={onChangeHandler}
            value={displayValue.denominator}
            errorMessage={errors.denominator}
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

//The pdf rendering of NDR component
export const NDRExport = (element: NdrTemplate) => {
  const label = `Performance Rate : ${element.label}`;
  const rows = [
    {
      indicator: element.performanceTargetLabel,
      response: element.answer?.performanceTarget,
    },
    {
      indicator: "Numerator",
      response: element.answer?.numerator,
    },
    {
      indicator: "Denominator",
      response: element.answer?.denominator,
    },
    {
      indicator: "Rate",
      response: element.answer?.rate
        ? stringifyResult(element.answer?.rate)
        : autoCalculatesText,
      helperText: "Auto-calculates",
    },
  ];

  return (
    <>
      <Heading as="h4" fontWeight="bold">
        Performance Rates
      </Heading>
      {ExportRateTable([{ label, rows }])}
    </>
  );
};

const sx = {
  performance: {
    input: {
      width: "240px",
    },
  },
};
