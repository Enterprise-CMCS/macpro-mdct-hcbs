import React, { useEffect, useState } from "react";
import {
  ElementType,
  LengthOfStayField,
  LengthOfStayRateTemplate,
} from "types";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { FacilityLengthOfStayCalc, parseNumber } from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const Fields = (props: PageElementProps<LengthOfStayRateTemplate>) => {
  const { formkey, disabled } = props;
  const { labels, answer } = props.element;

  const defaultAnswer = {
    performanceTarget: undefined,
    actualCount: undefined,
    denominator: undefined,
    expectedCount: undefined,
    populationRate: undefined,
    actualRate: undefined,
    expectedRate: undefined,
    adjustedRate: undefined,
  };
  const [displayValue, setDisplayValue] = useState<
    NonNullable<LengthOfStayRateTemplate["answer"]>
  >(answer ?? defaultAnswer);

  // Get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultAnswer);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const parsedValue = parseNumber(value);

    if (parsedValue === undefined) return;

    const calculatedRate = FacilityLengthOfStayCalc({
      ...displayValue,
      [name as LengthOfStayField]: parsedValue,
    });

    setDisplayValue(calculatedRate);

    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, ElementType.LengthOfStayRate);
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
        <CmsdsTextField
          label={labels.performanceTarget}
          name="performanceTarget"
          onChange={onChangeHandler}
          value={displayValue.performanceTarget ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualCount}
          name="actualCount"
          onChange={onChangeHandler}
          value={displayValue.actualCount ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.denominator}
          name="denominator"
          onChange={onChangeHandler}
          value={displayValue.denominator ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedCount}
          name="expectedCount"
          onChange={onChangeHandler}
          value={displayValue.expectedCount ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.populationRate}
          name="populationRate"
          onChange={onChangeHandler}
          value={displayValue.populationRate ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.actualRate}
          name="actualRate"
          onChange={onChangeHandler}
          value={displayValue.actualRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.expectedRate}
          name="expectedRate"
          onChange={onChangeHandler}
          value={displayValue.expectedRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
        <CmsdsTextField
          label={labels.adjustedRate}
          name="adjustedRate"
          onChange={onChangeHandler}
          value={displayValue.adjustedRate ?? ""}
          disabled={true}
        ></CmsdsTextField>
        <Divider></Divider>
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
