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
      denominatorCol1: stringifyInput(newAnswer?.denominatorCol1),
      numeratorCol2: stringifyInput(newAnswer?.numeratorCol2),
      expectedRateCol3: stringifyResult(newAnswer?.expectedRateCol3),
      numeratorDenominatorCol4: stringifyInput(
        newAnswer?.numeratorDenominatorCol4
      ),
      expectedRateCol5: stringifyResult(newAnswer?.expectedRateCol5),
      expectedRateCol6: stringifyResult(newAnswer?.expectedRateCol6),
      denominatorCol7: stringifyInput(newAnswer?.denominatorCol7),
      numeratorCol8: stringifyInput(newAnswer?.numeratorCol8),
      expectedRateCol9: stringifyResult(newAnswer?.expectedRateCol9),
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
      numeratorFields: ReadmissionRateField[]
    ) => {
      const denominatorValue = parseNumber(newDisplayValue[denominatorField]);

      if (denominatorValue === 0) {
        // Set errors for non-zero numerators
        numeratorFields.forEach((numField) => {
          if (parseNumber(newDisplayValue[numField]) !== 0) {
            newErrors[numField] = ErrorMessages.denominatorZero(
              labels[numField],
              labels[denominatorField]
            );
          }
        });
      } else if (denominatorValue !== 0) {
        // Clear denominator-zero errors
        numeratorFields.forEach((numField) => {
          const expectedError = ErrorMessages.denominatorZero(
            labels[numField],
            labels[denominatorField]
          );
          if (newErrors[numField] === expectedError) {
            newErrors[numField] = "";
          }
        });
      }
    };

    // Validate all denominator-zero cases
    validateDenominatorZero("denominatorCol1", [
      "numeratorCol2",
      "numeratorDenominatorCol4",
    ]);
    validateDenominatorZero("numeratorDenominatorCol4", ["numeratorCol2"]);
    validateDenominatorZero("denominatorCol7", ["numeratorCol8"]);

    return { displayValue: newDisplayValue, errors: newErrors };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const denominatorCol1 = parseNumber(newDisplayValue.denominatorCol1);
    const numeratorCol2 = parseNumber(newDisplayValue.numeratorCol2);
    const numeratorDenominatorCol4 = parseNumber(
      newDisplayValue.numeratorDenominatorCol4
    );
    const denominatorCol7 = parseNumber(newDisplayValue.denominatorCol7);
    const numeratorCol8 = parseNumber(newDisplayValue.numeratorCol8);

    // Helper to calculate rate or return 0 for 0/0
    const calculateRate = (
      numerator: number | undefined,
      denominator: number | undefined
    ): number | undefined => {
      if (numerator === undefined || denominator === undefined)
        return undefined;
      if (denominator === 0) return numerator === 0 ? 0 : undefined;
      return numerator / denominator;
    };

    return {
      denominatorCol1: removeNoise(denominatorCol1),
      numeratorCol2: removeNoise(numeratorCol2),
      expectedRateCol3: removeNoise(
        calculateRate(numeratorCol2, denominatorCol1)
      ),
      numeratorDenominatorCol4: removeNoise(numeratorDenominatorCol4),
      expectedRateCol5: removeNoise(
        calculateRate(numeratorDenominatorCol4, denominatorCol1)
      ),
      expectedRateCol6: removeNoise(
        calculateRate(numeratorCol2, numeratorDenominatorCol4)
      ),
      denominatorCol7: removeNoise(denominatorCol7),
      numeratorCol8: removeNoise(numeratorCol8),
      expectedRateCol9: removeNoise(
        calculateRate(numeratorCol8, denominatorCol7)
      ),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    newDisplayValue.expectedRateCol3 = stringifyResult(
      newAnswer.expectedRateCol3
    );
    newDisplayValue.expectedRateCol5 = stringifyResult(
      newAnswer.expectedRateCol5
    );
    newDisplayValue.expectedRateCol6 = stringifyResult(
      newAnswer.expectedRateCol6
    );
    newDisplayValue.expectedRateCol9 = stringifyResult(
      newAnswer.expectedRateCol9
    );
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
          label={labels.denominatorCol1}
          name="denominatorCol1"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.denominatorCol1}
          errorMessage={errors.denominatorCol1}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.numeratorCol2}
          name="numeratorCol2"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.numeratorCol2}
          errorMessage={errors.numeratorCol2}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRateCol3}
          name="expectedRateCol3"
          value={displayValue.expectedRateCol3}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          name="numeratorDenominatorCol4"
          label={labels.numeratorDenominatorCol4}
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.numeratorDenominatorCol4}
          errorMessage={errors.numeratorDenominatorCol4}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRateCol5}
          name="expectedRateCol5"
          value={displayValue.expectedRateCol5}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRateCol6}
          name="expectedRateCol6"
          value={displayValue.expectedRateCol6}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.denominatorCol7}
          name="denominatorCol7"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.denominatorCol7}
          disabled={disabled}
          errorMessage={errors.denominatorCol7}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.numeratorCol8}
          name="numeratorCol8"
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.numeratorCol8}
          disabled={disabled}
          errorMessage={errors.numeratorCol8}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRateCol9}
          name="expectedRateCol9"
          value={displayValue.expectedRateCol9}
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
      indicator: element.labels?.denominatorCol1,
      response: element.answer?.denominatorCol1,
    },
    {
      indicator: element.labels?.numeratorCol2,
      response: element.answer?.numeratorCol2,
    },
    {
      indicator: element.labels?.expectedRateCol3,
      response: stringifyResult(element.answer?.expectedRateCol3),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.numeratorDenominatorCol4,
      response: element.answer?.numeratorDenominatorCol4,
    },
    {
      indicator: element.labels?.expectedRateCol5,
      response: stringifyResult(element.answer?.expectedRateCol5),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.expectedRateCol6,
      response: stringifyResult(element.answer?.expectedRateCol6),
      helperText: "Auto-calculates",
    },
    {
      indicator: element.labels?.denominatorCol7,
      response: element.answer?.denominatorCol7,
    },
    {
      indicator: element.labels?.numeratorCol8,
      response: element.answer?.numeratorCol8,
    },
    {
      indicator: element.labels?.expectedRateCol9,
      response: stringifyResult(element.answer?.expectedRateCol9),
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
