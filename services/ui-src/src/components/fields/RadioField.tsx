import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ChoiceTemplate, RadioTemplate } from "types";
import { parseCustomHtml } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";

export const RadioField = (props: PageElementProps) => {
  const radio = props.element as RadioTemplate;

  const defaultValue = radio.value ?? [];
  const [displayValue, setDisplayValue] =
    useState<ChoiceTemplate[]>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key);
  }, []);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newValues = displayValue.map((choice) => {
      choice.checked = choice.value === value;
      return choice;
    });
    setDisplayValue(newValues);
    form.setValue(name, value, { shouldValidate: true });
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[key]?.message;
  const parsedHint = radio.helperText && parseCustomHtml(radio.helperText);
  const labelText = radio.label;

  return (
    <Box>
      <CmsdsChoiceList
        name={key}
        type={"radio"}
        label={labelText || ""}
        choices={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        onComponentBlur={onBlurHandler}
        {...props}
      />
    </Box>
  );
};

const sx = {
  ".ds-c-choice:disabled::before": {
    boxShadow: "inset 0 0 4em 1em #A6A6A6",
  },
  ".ds-c-choice:disabled": {
    borderColor: "palette.gray_light",
  },
};
