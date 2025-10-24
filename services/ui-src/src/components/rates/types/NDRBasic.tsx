import React, { useEffect, useState } from "react";
import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import {
  NdrBasicTemplate,
  RateInputFieldNameBasic,
  RateInputFieldNamesBasic,
  AlertTypes,
  PageElement,
  ElementType,
} from "types";
import {
  parseNumber,
  removeNoise,
  stringifyInput,
  stringifyResult,
} from "../calculations";
import { PageElementProps } from "components/report/Elements";
import { ErrorMessages, autoCalculatesText } from "../../../constants";
import { Alert, Page } from "components";
import { ExportRateTable } from "components/export/ExportedReportTable";

export const NDRBasic = (props: PageElementProps<NdrBasicTemplate>) => {
  const { updateElement, disabled, element } = props;
  const {
    label,
    answer,
    multiplier,
    hintText,
    displayRateAsPercent,
    minPerformanceLevel,
    conditionalChildren,
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
  const initialErrors = { numerator: "", denominator: "" };
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [errors, setErrors] = useState(initialErrors);

  const updatedDisplayValue = (input: HTMLInputElement) => {
    const fieldType = input.name as RateInputFieldNameBasic;
    const stringValue = input.value;

    const newDisplayValue = structuredClone(displayValue);
    newDisplayValue[fieldType] = stringValue;

    return newDisplayValue;
  };

  const computeErrors = (input: HTMLInputElement) => {
    const fieldType = input.name as RateInputFieldNameBasic;
    const stringValue = input.value;
    const parsedValue = parseNumber(stringValue);
    let errorMessage;

    if (!stringValue) {
      errorMessage = ErrorMessages.requiredResponse;
    } else if (parsedValue === undefined) {
      errorMessage = ErrorMessages.mustBeANumber;
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
    const numerator = parseNumber(newDisplayValue.numerator);
    const denominator = parseNumber(newDisplayValue.denominator);
    const canCompute =
      numerator !== undefined && denominator !== undefined && denominator !== 0;
    const rate = canCompute
      ? (multiplierVal * numerator) / denominator
      : undefined;

    return {
      numerator: removeNoise(numerator),
      denominator: removeNoise(denominator),
      rate: removeNoise(rate),
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
    const newErrors = computeErrors(event.target);

    // answer corresponds to the report data. Its values are numbers.
    const newAnswer = computeAnswer(newDisplayValue);

    // Instantly display calculation results
    updateCalculatedValues(newDisplayValue, newAnswer);
    setDisplayValue(newDisplayValue);
    setErrors(newErrors);

    // Instantly save parsed and calculated values to the store and API
    updateElement({ answer: newAnswer });
  };

  const minimumStatus = () => {
    if (!displayValue.rate || !minPerformanceLevel) return null;

    const rateToParse = displayValue.rate.replace("%", "");
    const parsedRate = parseNumber(rateToParse);

    if (parsedRate === undefined) return null;

    return parsedRate >= minPerformanceLevel;
  };

  const meetsMinimum = minimumStatus();

  //if the minimum isn't met, we want to clear any previous saved answers
  useEffect(() => {
    if (!meetsMinimum) {
      const clearElements =
        conditionalChildren?.map((element) => {
          if ("answer" in element) {
            element.answer = undefined;
          }
          return element;
        }) ?? [];
      updateElement({ conditionalChildren: [...clearElements] });
    }
  }, [meetsMinimum]);

  const performanceLevelStatusAlert = () => {
    if (meetsMinimum === null) return null;

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

  const conditonalChildren = () => {
    if (!conditionalChildren || meetsMinimum || meetsMinimum === null) return;
    const setChildren = (checkedChildren: PageElement[]) => {
      updateElement({ conditionalChildren: [...checkedChildren] });
    };
    return (
      <Page
        id="radio-children"
        setElements={setChildren}
        elements={conditionalChildren}
      />
    );
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      {label && <Heading variant="subHeader">{label}</Heading>}
      {minPerformanceLevel && (
        <Heading as="h2" variant="nestedHeading" color="palette.gray_dark">
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
            onBlur={onChangeHandler}
            value={displayValue.numerator}
            errorMessage={errors.numerator}
            disabled={disabled}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            hint={hintText?.denomHint}
            name={RateInputFieldNamesBasic.denominator}
            onChange={onChangeHandler}
            onBlur={onChangeHandler}
            value={displayValue.denominator}
            errorMessage={errors.denominator}
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
          {conditonalChildren()}
        </Stack>
      </Stack>
    </Stack>
  );
};

//The pdf rendering of NDRBasic component
export const NDRBasicExport = (element: NdrBasicTemplate) => {
  const label = element.label ?? "";

  const minimum =
    element.answer?.rate && element.minPerformanceLevel
      ? element.answer?.rate >= element.minPerformanceLevel
      : false;

  //currently only rendering textarea components but can be modified to render more
  const children = element.conditionalChildren
    ? element.conditionalChildren.map((child) => {
        {
          return {
            indicator: "label" in child && child.label ? child.label : "",
            response:
              "answer" in child ? (child.answer as string) : "Not answered",
            helperText: "helperText" in child ? child.helperText : "",
          };
        }
      })
    : [];

  const rows = [
    {
      indicator: "Numerator",
      response: element.answer?.numerator,
      helperText: element.hintText?.numHint,
    },
    {
      indicator: "Denominator",
      response: element.answer?.denominator,
      helperText: element.hintText?.denomHint,
    },
    {
      indicator: "Result",
      response: element.answer?.rate
        ? `${element.answer.rate}%`
        : autoCalculatesText,
      helperText: element.hintText?.rateHint,
    },
    ...children,
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
