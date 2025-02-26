import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseCustomHtml } from "utils";
import { TextAreaBoxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";

export const TextAreaField = (props: PageElementProps) => {
  const textbox = props.element as TextAreaBoxTemplate;
  const defaultValue = textbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key);
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[key]?.message;
  const parsedHint = textbox.helperText && parseCustomHtml(textbox.helperText);
  const labelText = textbox.label;

  return (
    <Box>
      <CmsdsTextField
        id={key}
        name={key}
        label={labelText || ""}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        errorMessage={errorMessage}
        multiline
        rows={3}
        {...props}
      />
    </Box>
  );
};
