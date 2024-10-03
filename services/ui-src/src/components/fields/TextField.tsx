import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { labelTextWithOptional, parseCustomHtml } from "utils";
import { TextboxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";

export const TextField = (props: PageElementProps) => {
  const textbox = props.element as TextboxTemplate;
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const inputName = "answers.1.2"; // TODO: id based

  useEffect(() => {
    form.register(inputName);
  }, []);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(inputName, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[inputName]?.message;
  const parsedHint = textbox.helperText && parseCustomHtml(textbox.helperText);
  const labelText = textbox.label
    ? labelTextWithOptional(textbox.label)
    : textbox.label;

  return (
    <Box>
      <CmsdsTextField
        id={inputName}
        name={inputName}
        label={labelText || ""}
        hint={parsedHint}
        onChange={(e) => onChangeHandler(e)}
        onBlur={(e) => onBlurHandler(e)}
        value={displayValue}
        errorMessage={errorMessage}
        {...props}
      />
    </Box>
  );
};
