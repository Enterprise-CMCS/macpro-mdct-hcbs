import React, { useState } from "react";
import { ReadmissionRateField, ReadmissionRateTemplate } from "types";
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
import { ErrorMessages } from "../../../constants";

export const ReadmissionRate = (
  props: PageElementProps<ReadmissionRateTemplate>
) => {
  const { disabled, updateElement } = props;
  const { labels, answer } = props.element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return {
      stayCount: stringifyInput(newAnswer?.stayCount),
      obsReadmissionCount: stringifyInput(newAnswer?.obsReadmissionCount),
      obsReadmissionRate: stringifyResult(newAnswer?.obsReadmissionRate),
      expReadmissionCount: stringifyInput(newAnswer?.expReadmissionCount),
      expReadmissionRate: stringifyResult(newAnswer?.expReadmissionRate),
      obsExpRatio: stringifyResult(newAnswer?.obsExpRatio),
      beneficiaryCount: stringifyInput(newAnswer?.beneficiaryCount),
      outlierCount: stringifyInput(newAnswer?.outlierCount),
      outlierRate: stringifyResult(newAnswer?.outlierRate),
    };
  };

  const initialValue = stringifyAnswer(answer);
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [errors, setErrors] = useState(makeEmptyStringCopyOf(initialValue));

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as ReadmissionRateField;
    const stringValue = input.value;
    const { errorMessage } = validateNumber(stringValue, input.required);

    const newDisplayValue = structuredClone(displayValue);
    const newErrors = structuredClone(errors);
    newDisplayValue[fieldType] = stringValue;
    newErrors[fieldType] = errorMessage;

    // Helper function to validate denominator-zero cases
    const validateDenominatorZero = (
      denominatorField: ReadmissionRateField,
      numeratorField: ReadmissionRateField
    ) => {
      const denominatorValue = parseNumber(newDisplayValue[denominatorField]);

      if (denominatorValue === 0) {
        // Set errors for non-zero numerators
        if (parseNumber(newDisplayValue[numeratorField]) !== 0) {
          newErrors[numeratorField] = ErrorMessages.denominatorZero(
            labels[numeratorField],
            labels[denominatorField]
          );
        }
      } else if (denominatorValue !== 0) {
        // Clear denominator-zero errors
        const expectedError = ErrorMessages.denominatorZero(
          labels[numeratorField],
          labels[denominatorField]
        );
        if (newErrors[numeratorField] === expectedError) {
          newErrors[numeratorField] = "";
        }
      }
    };

    // Validate all denominator-zero cases
    validateDenominatorZero("stayCount", "obsReadmissionCount");
    validateDenominatorZero("stayCount", "expReadmissionCount");
    validateDenominatorZero("expReadmissionCount", "obsReadmissionCount");
    validateDenominatorZero("beneficiaryCount", "outlierCount");

    return { displayValue: newDisplayValue, errors: newErrors };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const stayCount = parseNumber(newDisplayValue.stayCount);
    const obsReadmissionCount = parseNumber(
      newDisplayValue.obsReadmissionCount
    );
    const expReadmissionCount = parseNumber(
      newDisplayValue.expReadmissionCount
    );
    const beneficiaryCount = parseNumber(newDisplayValue.beneficiaryCount);
    const outlierCount = parseNumber(newDisplayValue.outlierCount);

    // Helper to calculate rate or return 0 for 0/0
    const calculateRate = (
      numerator: number | undefined,
      denominator: number | undefined,
      multiplier: number = 1
    ): number | undefined => {
      if (numerator === undefined || denominator === undefined)
        return undefined;
      if (denominator === 0) return numerator === 0 ? 0 : undefined;
      const rate = numerator / denominator;
      return rate * multiplier;
    };

    return {
      stayCount: removeNoise(stayCount),
      obsReadmissionCount: removeNoise(obsReadmissionCount),
      obsReadmissionRate: removeNoise(
        calculateRate(obsReadmissionCount, stayCount, 100)
      ),
      expReadmissionCount: removeNoise(expReadmissionCount),
      expReadmissionRate: removeNoise(
        calculateRate(expReadmissionCount, stayCount, 100)
      ),
      obsExpRatio: removeNoise(
        calculateRate(obsReadmissionCount, expReadmissionCount)
      ),
      beneficiaryCount: removeNoise(beneficiaryCount),
      outlierCount: removeNoise(outlierCount),
      outlierRate: removeNoise(
        calculateRate(outlierCount, beneficiaryCount, 1000)
      ),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    newDisplayValue.obsReadmissionRate = stringifyResult(
      newAnswer.obsReadmissionRate
    );
    newDisplayValue.expReadmissionRate = stringifyResult(
      newAnswer.expReadmissionRate
    );
    newDisplayValue.obsExpRatio = stringifyResult(newAnswer.obsExpRatio);
    newDisplayValue.outlierRate = stringifyResult(newAnswer.outlierRate);
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
          label={labels.stayCount}
          name="stayCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.stayCount}
          errorMessage={errors.stayCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.obsReadmissionCount}
          name="obsReadmissionCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.obsReadmissionCount}
          errorMessage={errors.obsReadmissionCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.obsReadmissionRate}
          name="obsReadmissionRate"
          value={displayValue.obsReadmissionRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          name="expReadmissionCount"
          label={labels.expReadmissionCount}
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.expReadmissionCount}
          errorMessage={errors.expReadmissionCount}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expReadmissionRate}
          name="expReadmissionRate"
          value={displayValue.expReadmissionRate}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.obsExpRatio}
          name="obsExpRatio"
          value={displayValue.obsExpRatio}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.beneficiaryCount}
          name="beneficiaryCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.beneficiaryCount}
          disabled={disabled}
          errorMessage={errors.beneficiaryCount}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.outlierCount}
          name="outlierCount"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.outlierCount}
          disabled={disabled}
          errorMessage={errors.outlierCount}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.outlierRate}
          name="outlierRate"
          value={displayValue.outlierRate}
          disabled={true}
        ></CmsdsTextField>
        <Divider></Divider>
      </Stack>
    </Stack>
  );
};

//The pdf rendering of Readmission Rate component
export const ReadmissionRateExport = (element: ReadmissionRateTemplate) => {
  const label = "Performance Rates";
  const rows = [
    {
      indicator: element.labels?.stayCount,
      response: element.answer?.stayCount,
    },
    {
      indicator: element.labels?.obsReadmissionCount,
      response: element.answer?.obsReadmissionCount,
    },
    {
      indicator: element.labels?.obsReadmissionRate,
      response: stringifyResult(element.answer?.obsReadmissionRate),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.expReadmissionCount,
      response: element.answer?.expReadmissionCount,
    },
    {
      indicator: element.labels?.expReadmissionRate,
      response: stringifyResult(element.answer?.expReadmissionRate),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.obsExpRatio,
      response: stringifyResult(element.answer?.obsExpRatio),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.beneficiaryCount,
      response: element.answer?.beneficiaryCount,
    },
    {
      indicator: element.labels?.outlierCount,
      response: element.answer?.outlierCount,
    },
    {
      indicator: element.labels?.outlierRate,
      response: stringifyResult(element.answer?.outlierRate),
      helperText: "Auto-calculates",
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
