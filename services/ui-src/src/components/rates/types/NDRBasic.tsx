import React, { useEffect, useState } from "react";
import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import {
  NdrBasicTemplate,
  RateInputFieldNameBasic,
  RateInputFieldNamesBasic,
  AlertTypes,
} from "types";
import {
  parseNumber,
  roundRate,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import { Alert } from "components";

export const NDRBasic = (props: PageElementProps<NdrBasicTemplate>) => {
  const { formkey, disabled, element } = props;
  const {
    label,
    answer,
    multiplier,
    hintText,
    displayRateAsPercent,
    minPerformanceLevel,
  } = element;
  const multiplierVal = multiplier ?? 1; // default multiplier value

  const stringifyAnswer = (newAnswer: typeof answer) => {
    let rate = stringifyResult(newAnswer?.rate);
    if (rate && displayRateAsPercent) {
      rate = rate.concat("%");
    }
    return {
      numerator: stringifyInput(newAnswer?.numerator),
      denominator: stringifyInput(newAnswer?.denominator),
      rate,
    };
  };

  const initialValue = stringifyAnswer(answer);
  const [displayValue, setDisplayValue] = useState(initialValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
  }, []);

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as RateInputFieldNameBasic;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    newDisplayValue[fieldType] = stringValue;

    return newDisplayValue;
  };

  const computeAnswer = (newDisplayValue: typeof displayValue) => {
    const numerator = parseNumber(newDisplayValue.numerator);
    const denominator = parseNumber(newDisplayValue.denominator);
    const canCompute =
      numerator !== undefined && denominator !== undefined && denominator !== 0;
    const rate = canCompute
      ? (multiplierVal * numerator) / denominator
      : undefined;

    return {
      numerator: roundRate(numerator),
      denominator: roundRate(denominator),
      rate: roundRate(rate),
    };
  };

  const updateCalculatedValues = (
    newDisplayValue: typeof displayValue,
    newAnswer: NonNullable<typeof answer>
  ) => {
    newDisplayValue.rate = stringifyAnswer(newAnswer).rate;
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

  const performanceLevelStatusAlert = () => {
    if (!displayValue?.rate || !minPerformanceLevel) return null;

    // Removing the % from the rate
    const rateToParse = displayRateAsPercent
      ? displayValue.rate.slice(0, -1)
      : displayValue.rate;
    const parsedRate = parseNumber(rateToParse);

    if (parsedRate === undefined) return null;

    const meetsMinimum = parsedRate >= minPerformanceLevel;

    return meetsMinimum ? (
      <Alert status={AlertTypes.SUCCESS} title="Success">
        {`The data entered indicates this measure meets the ${minPerformanceLevel}% Minimum Performance Level.`}
      </Alert>
    ) : (
      <Alert status={AlertTypes.WARNING} title="Warning">
        {`The data entered indicates this measure does not meet the ${minPerformanceLevel}% Minimum Performance Level. Explain why in the additional comments field below.`}
      </Alert>
    );
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      {label && <Heading variant="subHeader">{label}</Heading>}
      {minPerformanceLevel && (
        <Heading as="h2" variant="nestedHeading" color="#5a5a5a">
          Minimum Performance Level: {minPerformanceLevel}%
        </Heading>
      )}
      <Stack gap="2rem">
        <Stack gap="2rem">
          <CmsdsTextField
            label="Numerator"
            hint={hintText?.numHint}
            name={RateInputFieldNamesBasic.numerator}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.numerator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            hint={hintText?.denomHint}
            name={RateInputFieldNamesBasic.denominator}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.denominator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Result"
            hint={hintText?.rateHint}
            name="result"
            value={displayValue.rate}
            disabled
          ></CmsdsTextField>
          {performanceLevelStatusAlert()}
        </Stack>
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
