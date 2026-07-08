import React, { useState } from "react";
import { Box, Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Assessment, MultiCategoryNdrTemplate, NdrCategory } from "types";
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

const FieldNames = {
  numerator: "numerator",
  denominator: "denominator",
} as const;
type FieldName = (typeof FieldNames)[keyof typeof FieldNames];

const categoryHints = (assess: Assessment, category: NdrCategory) =>
  assess.categoryHints?.find((hints) => hints.categoryId === category.id);

const hint = (
  assess: Assessment,
  category: NdrCategory,
  key: "hintNumerator" | "hintDenominator" | "hintRate"
) => {
  const assessmentCategoryHint = categoryHints(assess, category)?.[key];
  switch (key) {
    case "hintNumerator":
      return assessmentCategoryHint ?? assess.hints?.hintNumerator;
    case "hintDenominator":
      return assessmentCategoryHint ?? assess.hints?.hintDenominator;
    case "hintRate":
      return (
        assessmentCategoryHint ??
        category.hintRate ??
        assess.hints?.hintRate ??
        "Auto-calculates"
      );
  }
};

export const MultiCategoryNdr = (
  props: PageElementProps<MultiCategoryNdrTemplate>
) => {
  const { disabled, element, updateElement } = props;
  const { assessments, answer, multiplier = 1, categories } = element;

  const stringifyAnswer = (newAnswer: typeof answer) => {
    return assessments.map((assessment, i) => ({
      id: assessment.id,
      denominator: stringifyInput(newAnswer?.[i].denominator),
      rates: categories.map((category, j) => ({
        id: `${assessment.id}.${category.id}`,
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
     * The name will look like "0.denominator" or
     * or "2.rates.1.numerator". The last part is always an InputFieldName.
     * The first part is always an index into the answer array.
     * If there are 4 parts, the 3rd will be an index into the
     * answer[i].rates array.
     */
    const parts = input.name.split(".");
    const fieldType = parts.at(-1) as FieldName;
    const assessIndex = Number(parts.at(0));
    const fieldIndex = parts.length > 2 ? Number(parts.at(2)) : undefined;
    const stringValue = input.value;
    const { errorMessage } = validateNumber(stringValue, true);

    // displayValue corresponds to the inputs on screen. Its values are strings.
    const newDisplayValue = structuredClone(displayValue);
    const newErrors = structuredClone(errors);
    if (fieldType === FieldNames.denominator) {
      newDisplayValue[assessIndex].denominator = stringValue;
      newErrors[assessIndex].denominator = errorMessage;
    } else {
      newDisplayValue[assessIndex].rates[fieldIndex!][fieldType] = stringValue;
      newErrors[assessIndex].rates[fieldIndex!][fieldType] = errorMessage;
    }

    for (const [assessmentIndex, assessmentData] of newDisplayValue.entries()) {
      const parsedDenominator = parseNumber(assessmentData.denominator);
      for (const [rateIndex, rateData] of assessmentData.rates.entries()) {
        if (parsedDenominator === 0 && parseNumber(rateData.numerator) !== 0) {
          newErrors[assessmentIndex].rates[rateIndex].numerator =
            ErrorMessages.denominatorZero();
        } else if (
          parsedDenominator !== 0 &&
          newErrors[assessmentIndex].rates[rateIndex].numerator ===
            ErrorMessages.denominatorZero()
        ) {
          newErrors[assessmentIndex].rates[rateIndex].numerator = "";
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
          const numerator = parseNumber(rateObj.numerator);

          if (denominator === 0 && numerator === 0) {
            return {
              id: rateObj.id,
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
                name={`${assessIndex}.${FieldNames.denominator}`}
                hint={assess.hints?.hintDenominator}
                onChange={onChangeHandler}
                onBlur={onChangeHandler}
                value={rateSet.denominator}
                errorMessage={errorSet.denominator}
                disabled={disabled}
              ></CmsdsTextField>

              {categories.map((category, catIndex) => {
                const rateObject = rateSet.rates[catIndex];
                const errorObject = errorSet.rates[catIndex];

                return (
                  <Stack key={`${assess.id}.${category.id}`} gap="2rem">
                    <Heading variant="nestedHeading">{category.label}</Heading>
                    <CmsdsTextField
                      label={`Numerator: ${category.label} (${assess.label})`}
                      name={`${assessIndex}.rates.${catIndex}.${FieldNames.numerator}`}
                      hint={hint(assess, category, "hintNumerator")}
                      onChange={onChangeHandler}
                      onBlur={onChangeHandler}
                      value={rateObject.numerator}
                      errorMessage={errorObject.numerator}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Denominator (${assess.label})`}
                      name={`${assessIndex}.rates.${catIndex}.denominator`}
                      hint={hint(assess, category, "hintDenominator")}
                      value={rateSet.denominator}
                      disabled
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`${category.label} Rate (${assess.label})`}
                      name={`${assessIndex}.rates.${catIndex}.rate`}
                      hint={hint(assess, category, "hintRate")}
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

//The pdf rendering of MultiCategoryNdr component
export const MultiCategoryNdrExport = (element: MultiCategoryNdrTemplate) => {
  const buildData = element.assessments?.map((assess) => {
    const data = element.answer?.find((item) =>
      item.rates[0].id.includes(assess.id)
    );
    const rates = element.categories.map((category) => {
      const rate = data?.rates.find((rate) => rate.id.includes(category.id));
      return {
        fieldLabel: category.label,
        rate: [
          {
            indicator: `Numerator: ${category.label} (${assess.label})`,
            response: rate?.numerator,
            helperText: hint(assess, category, "hintNumerator"),
          },
          {
            indicator: `Denominator (${assess.label})`,
            response: data?.denominator,
            helperText: hint(assess, category, "hintDenominator"),
          },
          {
            indicator: `${category.label} Rate (${assess.label})`,
            response: stringifyResult(rate?.rate),
            helperText: hint(assess, category, "hintRate"),
          },
        ],
      };
    });
    return {
      label: assess.label,
      denominator: data?.denominator,
      hintDenominator: assess.hints?.hintDenominator,
      rates,
    };
  });

  return (
    <>
      {buildData?.map((build, idx) => (
        <Box key={`${build.label}.${idx}`}>
          <Heading as="h4" variant="nestedHeading">
            Performance Rates: {build.label}
          </Heading>
          <ExportedReportTable
            rows={[
              {
                indicator: `Denominator (${build.label})`,
                response: build.denominator,
                helperText: build.hintDenominator,
              },
            ]}
            caption={`Performance Rates: ${build.label}`}
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
