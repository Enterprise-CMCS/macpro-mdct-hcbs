import React, { useState, useEffect } from "react";
import { FieldError, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseCustomHtml } from "utils";
import { TextboxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";

export const TextField = (props: PageElementProps) => {
  const textbox = props.element as TextboxTemplate;
  const defaultValue = textbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    const options = { required: textbox.required || false };
    form.register(key, options);
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
  const elementErrors = formErrorState?.[props.formkey] as {
    answer: FieldError;
  };
  const errorMessage = elementErrors?.answer?.message;
  const parsedHint = textbox.helperText && parseCustomHtml(textbox.helperText);
  const labelText = textbox.label;

  return (
    <Box>
      <CmsdsTextField
        id={key}
        name={key}
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
