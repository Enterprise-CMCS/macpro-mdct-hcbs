import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  NdrFieldsTemplate,
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

export const NDRFields = (props: PageElementProps<NdrFieldsTemplate>) => {
  const { disabled, formkey, element } = props;
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

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, initialValue);
  }, []);

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

    // displayValue corresponds to the inputs on screen. Its values are strings.
    const newDisplayValue = structuredClone(displayValue);
    if (fieldType === RateInputFieldNames.denominator) {
      newDisplayValue[assessIndex].denominator = stringValue;
    } else {
      newDisplayValue[assessIndex].rates[fieldIndex!][fieldType] = stringValue;
    }

    return newDisplayValue;
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    return newDisplayValue.map((displayObj) => {
      const denominator = parseNumber(displayObj.denominator);
      const canDivide = denominator !== undefined && denominator !== 0;

      return {
        id: displayObj.id,
        denominator: roundRate(denominator),
        rates: displayObj.rates.map((rateObj) => {
          const performanceTarget = parseNumber(rateObj.performanceTarget);
          const numerator = parseNumber(rateObj.numerator);
          const canCompute = canDivide && numerator !== undefined;
          const rate = canCompute
            ? (multiplier * numerator) / denominator
            : undefined;

          return {
            id: rateObj.id,
            performanceTarget: roundRate(performanceTarget),
            numerator: roundRate(numerator),
            rate: roundRate(rate),
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
        {assessments.map((assess, assessIndex) => {
          const rateSet = displayValue[assessIndex];

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
                onBlur={onBlurHandler}
                value={rateSet.denominator}
                disabled={disabled}
              ></CmsdsTextField>

              {fields.map((field, fieldIndex) => {
                const rateObject = rateSet.rates[fieldIndex];

                return (
                  <Stack key={`${assess.id}.${field.id}`} gap="2rem">
                    <Heading variant="nestedHeading">{field.label}</Heading>
                    <CmsdsTextField
                      label={labelTemplate
                        .replace("{{field}}", field.label.toLowerCase())
                        .replace("{{assessment}}", assess.label)}
                      name={`${assessIndex}.rates.${fieldIndex}.${RateInputFieldNames.performanceTarget}`}
                      onChange={onChangeHandler}
                      onBlur={onBlurHandler}
                      value={rateObject.performanceTarget}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Numerator: ${field.label} (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.${RateInputFieldNames.numerator}`}
                      onChange={onChangeHandler}
                      onBlur={onBlurHandler}
                      value={rateObject.numerator}
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

const sx = {
  performance: {
    input: {
      width: "240px",
    },
  },
};
