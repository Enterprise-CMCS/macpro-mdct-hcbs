import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
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
    form.setValue(`${props.formkey}.type`, textbox.type);
    form.setValue(`${props.formkey}.label`, textbox.label);
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
    form.setValue(`${props.formkey}.type`, textbox.type);
    form.setValue(`${props.formkey}.label`, textbox.label);
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  console.log("FORM ERRORS", formErrors);
  const errorMessage: string | undefined = get(formErrors, key)?.message;
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
        {...props}
      />
    </Box>
  );
};
