import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useFormContext } from "react-hook-form";
import { ElementType, NdrTemplate } from "types";
import { parseNumber, roundTo } from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const NDR = (props: PageElementProps<NdrTemplate>) => {
  const { formkey, disabled, element } = props;
  const { label, performanceTargetLabel, answer } = element;

  const initialValue = {
    performanceTarget: undefined,
    numerator: undefined,
    denominator: undefined,
    rate: undefined,
  };
  const defaultValue = answer ?? initialValue;
  const [displayValue, setDisplayValue] = useState(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldType: "performanceTarget" | "denominator" | "numerator"
  ) => {
    const newValue = parseNumber(event.target.value);
    if (newValue === undefined) return;

    const answer = structuredClone(displayValue);

    switch (fieldType) {
      case "performanceTarget":
        answer.performanceTarget = newValue;
        break;
      case "denominator":
        {
          answer.denominator = newValue;
          const numerator = answer.numerator;
          if (numerator !== undefined && newValue !== 0) {
            answer.rate = roundTo(numerator / newValue, 1);
          }
        }
        break;
      case "numerator":
        {
          const denominator = answer.denominator;
          answer.numerator = newValue;

          if (denominator !== undefined && denominator !== 0) {
            answer.rate = roundTo(newValue / denominator, 1);
          }
        }
        break;
    }

    setDisplayValue(answer);
    form.setValue(`${key}`, answer, { shouldValidate: true });
    form.setValue(`${key}.type`, ElementType.NdrEnhanced);
  };

  return (
    <Stack gap="2rem">
      <Stack gap="2rem">
        <Heading variant="subHeader">Performance Rate: {label}</Heading>
        <CmsdsTextField
          label={performanceTargetLabel}
          name="performanceTarget"
          onChange={(evt) => onChangeHandler(evt, "performanceTarget")}
          value={displayValue.performanceTarget ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Numerator"
          name="numerator"
          onChange={(evt) => onChangeHandler(evt, "numerator")}
          value={displayValue.numerator ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Denominator"
          name="denominator"
          onChange={(evt) => onChangeHandler(evt, "denominator")}
          value={displayValue.denominator ?? ""}
          disabled={disabled}
        ></CmsdsTextField>
        <CmsdsTextField
          label="Rate"
          name="rate"
          hint="Auto-calculates"
          value={displayValue.rate ?? ""}
          disabled
        ></CmsdsTextField>
        <Divider></Divider>
      </Stack>
    </Stack>
  );
};
