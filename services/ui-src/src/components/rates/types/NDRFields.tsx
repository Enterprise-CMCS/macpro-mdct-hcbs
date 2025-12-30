import React, { useState } from "react";
import { Box, Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  NdrFieldsTemplate,
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
import { ErrorMessages } from "../../../constants";

export const NDRFields = (props: PageElementProps<NdrFieldsTemplate>) => {
  const { disabled, element, updateElement } = props;
  const {
    labelTemplate,
    assessments,
    answer,
    multiplier = 1,
    fields,
  } = element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return assessments.map((assessment, i) => ({
      id: assessment.id,
      denominator: stringifyInput(newAnswer?.[i].denominator),
      rates: fields.map((field, j) => ({
        id: `${assessment.id}.${field.id}`,
        performanceTarget: stringifyInput(
          newAnswer?.[i].rates[j].performanceTarget
        ),
        numerator: stringifyInput(newAnswer?.[i].rates[j].numerator),
        rate: stringifyResult(newAnswer?.[i].rates[j].rate),
      })),
    }));
  };

  const initialValue = stringifyAnswer(answer);
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [errors, setErrors] = useState(makeEmptyStringCopyOf(initialValue));

  const updatedDisplayValue = (input: HTMLInputElement) => {
    /*
     * The name will look like "0.denominator" or "1.rates.0.performanceTarget"
     * or "2.rates.1.numerator". The last part is always an InputFieldName.
     * The first part is always an index into the answer array.
     * If there are 4 parts, the 3rd will be an index into the
     * answer[i].rates array.
     */
    const parts = input.name.split(".");
    const fieldType = parts.at(-1) as RateInputFieldName;
    const assessIndex = Number(parts.at(0));
    const fieldIndex = parts.length > 2 ? Number(parts.at(2)) : undefined;
    const stringValue = input.value;
    const { errorMessage } = validateNumber(stringValue, true);

    // displayValue corresponds to the inputs on screen. Its values are strings.
    const newDisplayValue = structuredClone(displayValue);
    const newErrors = structuredClone(errors);
    if (fieldType === RateInputFieldNames.denominator) {
      newDisplayValue[assessIndex].denominator = stringValue;
      newErrors[assessIndex].denominator = errorMessage;
    } else {
      newDisplayValue[assessIndex].rates[fieldIndex!][fieldType] = stringValue;
      newErrors[assessIndex].rates[fieldIndex!][fieldType] = errorMessage;
    }

    for (const [assessmentIndex, assessmentData] of newDisplayValue.entries()) {
      if (parseNumber(assessmentData.denominator) === 0) {
        for (const [rateIndex, rateData] of assessmentData.rates.entries()) {
          if (parseNumber(rateData.numerator) !== 0) {
            newErrors[assessmentIndex].rates[rateIndex].numerator =
              ErrorMessages.denominatorZero("Numerator", "denominator");
          }
        }
      }
    }

    return { displayValue: newDisplayValue, errors: newErrors };
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    return newDisplayValue.map((displayObj) => {
      const denominator = parseNumber(displayObj.denominator);
      const canDivide = denominator !== undefined && denominator !== 0;

      return {
        id: displayObj.id,
        denominator: removeNoise(denominator),
        rates: displayObj.rates.map((rateObj) => {
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
          const rate = canCompute
            ? (multiplier * numerator) / denominator
            : undefined;

          return {
            id: rateObj.id,
            performanceTarget: removeNoise(performanceTarget),
            numerator: removeNoise(numerator),
            rate: removeNoise(rate),
          };
        }),
      };
    });
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    for (let [displayObj, answerObj] of zip(newDisplayValue, newAnswer)) {
      for (let pair of zip(displayObj.rates, answerObj.rates)) {
        const [displayRate, answerRate] = pair;
        displayRate.rate = stringifyResult(answerRate.rate);
      }
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

    // Instantly save parsed and calculated values to the store and API
    updateElement({ answer: newAnswer });
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
        {assessments.map((assess, assessIndex) => {
          const rateSet = displayValue[assessIndex];
          const errorSet = errors[assessIndex];

          return (
            <Stack key={assess.id} gap="2rem">
              <Heading variant="subHeader">
                {"Performance Rates: "}
                {assess.label}
              </Heading>

              <CmsdsTextField
                label={`Denominator (${assess.label})`}
                name={`${assessIndex}.${RateInputFieldNames.denominator}`}
                onChange={onChangeHandler}
                onBlur={onChangeHandler}
                value={rateSet.denominator}
                errorMessage={errorSet.denominator}
                disabled={disabled}
              ></CmsdsTextField>

              {fields.map((field, fieldIndex) => {
                const rateObject = rateSet.rates[fieldIndex];
                const errorObject = errorSet.rates[fieldIndex];

                return (
                  <Stack key={`${assess.id}.${field.id}`} gap="2rem">
                    <Heading variant="nestedHeading">{field.label}</Heading>
                    <CmsdsTextField
                      label={labelTemplate
                        .replace("{{field}}", field.label.toLowerCase())
                        .replace("{{assessment}}", assess.label)}
                      name={`${assessIndex}.rates.${fieldIndex}.${RateInputFieldNames.performanceTarget}`}
                      onChange={onChangeHandler}
                      onBlur={onChangeHandler}
                      value={rateObject.performanceTarget}
                      errorMessage={errorObject.performanceTarget}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Numerator: ${field.label} (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.${RateInputFieldNames.numerator}`}
                      onChange={onChangeHandler}
                      onBlur={onChangeHandler}
                      value={rateObject.numerator}
                      errorMessage={errorObject.numerator}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Denominator (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.denominator`}
                      value={rateSet.denominator}
                      disabled
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`${field.label} Rate (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.rate`}
                      hint="Auto-calculates"
                      value={rateObject.rate}
                      disabled
                    ></CmsdsTextField>
                  </Stack>
                );
              })}
              <Divider></Divider>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

//The pdf rendering of NDRField component
export const NDRFieldExport = (element: NdrFieldsTemplate) => {
  const buildData = element.assessments?.map((assess) => {
    const data = element.answer?.find((item) =>
      item.rates[0].id.includes(assess.id)
    );
    const rates = element.fields.map((field) => {
      const rate = data?.rates.find((rate) => rate.id.includes(field.id));
      const performanceTargetLabel = element.labelTemplate
        .replace("{{field}}", field.label.toLowerCase())
        .replace("{{assessment}}", assess.label);
      return {
        fieldLabel: field.label,
        rate: [
          {
            indicator: performanceTargetLabel,
            response: rate?.performanceTarget,
          },
          {
            indicator: `Numerator: ${field.label} (${assess.label})`,
            response: rate?.numerator,
          },
          {
            indicator: `Denominator (${assess.label})`,
            response: data?.denominator,
            helperText: "Auto-calculates",
          },
          {
            indicator: `${field.label} Rate (${assess.label})`,
            response: stringifyResult(rate?.rate),
            helperText: "Auto-calculates",
          },
        ],
      };
    });
    return {
      label: assess.label,
      denominator: data?.denominator,
      rates,
    };
  });

  return (
    <>
      {buildData?.map((build, idx) => (
        <Box key={`${build.label}.${idx}`}>
          <Heading as="h4" fontWeight="bold">
            Performance Rates: {build.label}
          </Heading>
          <ExportedReportTable
            rows={[
              {
                indicator: `Denominator (${build.label})`,
                response: build.denominator,
              },
            ]}
          />
          {build.rates?.map((rate) =>
            ExportRateTable([{ label: rate.fieldLabel, rows: rate.rate }])
          )}
        </Box>
      ))}
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
