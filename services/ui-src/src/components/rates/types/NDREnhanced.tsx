import React, { useState } from "react";
import { Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  NdrEnhancedTemplate,
  RateInputFieldName,
  RateInputFieldNames,
} from "types";
import {
  parseNumber,
  removeNoise,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import { zip } from "utils/other/arrays";
import {
  makeEmptyStringCopyOf,
  validateNumber,
} from "utils/validation/inputValidation";
import {
  ExportedReportTable,
  ExportRateTable,
} from "components/export/ExportedReportTable";
import { autoPopulatedText, ErrorMessages } from "../../../constants";

export const NDREnhanced = (props: PageElementProps<NdrEnhancedTemplate>) => {
  const { disabled, element, updateElement } = props;
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
  const [errors, setErrors] = useState(makeEmptyStringCopyOf(initialValue));

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
    const { errorMessage } = validateNumber(stringValue, true);

    const newDisplayValue = structuredClone(displayValue);
    const newErrorObject = structuredClone(errors);
    if (fieldType === RateInputFieldNames.denominator) {
      newDisplayValue.denominator = stringValue;
      newErrorObject.denominator = errorMessage;
    } else {
      newDisplayValue.rates[assessIndex!][fieldType] = stringValue;
      newErrorObject.rates[assessIndex!][fieldType] = errorMessage;
    }

    const parsedDenominator = parseNumber(newDisplayValue.denominator);
    for (const [index, rate] of newDisplayValue.rates.entries()) {
      if (parsedDenominator === 0 && parseNumber(rate.numerator) !== 0) {
        newErrorObject.rates[index].numerator = ErrorMessages.denominatorZero();
      }
      if (
        parsedDenominator !== 0 &&
        newErrorObject.rates[index].numerator ===
          ErrorMessages.denominatorZero()
      ) {
        newErrorObject.rates[index].numerator = "";
      }
    }

    return { displayValue: newDisplayValue, errors: newErrorObject };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const denominator = parseNumber(newDisplayValue.denominator);
    const canDivide = denominator !== undefined && denominator !== 0;

    return {
      denominator: removeNoise(denominator),
      rates: newDisplayValue.rates.map((rateObj) => {
        const performanceTarget = parseNumber(rateObj.performanceTarget);
        const numerator = parseNumber(rateObj.numerator);

        if (denominator === 0 && numerator === 0) {
          return {
            id: rateObj.id,
            performanceTarget: removeNoise(performanceTarget),
            numerator: 0,
            rate: 0,
          };
        }

        const canCompute = canDivide && numerator !== undefined;
        const rate = canCompute ? numerator / denominator : undefined;

        return {
          id: rateObj.id,
          performanceTarget: removeNoise(performanceTarget),
          numerator: removeNoise(numerator),
          rate: removeNoise(rate),
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
    const { displayValue: newDisplayValue, errors: newErrors } =
      updatedDisplayValue(event.target);

    // answer corresponds to the report data. Its values are numbers.
    const newAnswer = computeAnswer(newDisplayValue);

    // Instantly display calculation results
    updateCalculatedValues(newDisplayValue, newAnswer);
    setDisplayValue(newDisplayValue);
    setErrors(newErrors);

    // Instantly save parsed and calculated values to the form, store, and API
    updateElement({ answer: newAnswer });
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">
        {label ? `${label}s` : "Performance Rates"}
      </Heading>
      <Text>{helperText}</Text>
      <Stack gap="2rem">
        <CmsdsTextField
          label={`${label ? `${label}s` : "Performance Rates"} Denominator`}
          name={RateInputFieldNames.denominator}
          onChange={onChangeHandler}
          onBlur={onChangeHandler}
          value={displayValue.denominator}
          errorMessage={errors.denominator}
          disabled={disabled}
        ></CmsdsTextField>
        {assessments.map((assess, index) => {
          const value = displayValue.rates[index];
          const valueErrors = errors.rates[index];

          return (
            <Stack key={assess.id} gap="2rem">
              <Heading variant="subHeader">
                {label ?? "Performance Rate"}
                {": "}
                {assess.label}
              </Heading>
              {performanceTargetLabel && (
                <CmsdsTextField
                  label={performanceTargetLabel}
                  name={`${index}.${RateInputFieldNames.performanceTarget}`}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                  value={value.performanceTarget}
                  errorMessage={valueErrors.performanceTarget}
                  disabled={disabled}
                ></CmsdsTextField>
              )}
              <CmsdsTextField
                label="Numerator"
                name={`${index}.${RateInputFieldNames.numerator}`}
                onChange={onChangeHandler}
                onBlur={onChangeHandler}
                value={value.numerator}
                errorMessage={valueErrors.numerator}
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

//The pdf rendering of NDREnchanced component
export const NDREnhancedExport = (element: NdrEnhancedTemplate) => {
  const label = element.label ?? "Performance Rates";

  const buildData = element.assessments?.map(
    (assess: { id: string; label: string }) => {
      const performanceRate = element.answer?.rates?.find(
        (rate: { id: string }) => rate.id === assess.id
      );
      const row = [
        ...(element.performanceTargetLabel
          ? [
              {
                indicator: element.performanceTargetLabel,
                response: performanceRate?.performanceTarget,
              },
            ]
          : []),
        {
          indicator: "Numerator",
          response: performanceRate?.numerator,
        },
        {
          indicator: "Denominator",
          response: element?.answer?.denominator ?? autoPopulatedText,
          helperText: "Auto-populates",
        },
        {
          indicator: "Rate",
          response: performanceRate?.rate
            ? stringifyResult(performanceRate?.rate)
            : autoPopulatedText,
          helperText: "Auto-calculates",
        },
      ];
      return { label: `${label} : ${assess.label}`, rows: row };
    }
  );

  return (
    <>
      <Heading as="h4" fontWeight="bold">{`${label}`}</Heading>
      <ExportedReportTable
        rows={[
          {
            indicator: "Performance Rates Denominator",
            response: element?.answer?.denominator,
          },
        ]}
      />
      {ExportRateTable(buildData)}
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
