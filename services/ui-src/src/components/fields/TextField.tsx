import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseCustomHtml } from "utils";
import { TextboxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { requiredResponse } from "../../constants";

export const TextField = (props: PageElementProps) => {
  const textbox = props.element as TextboxTemplate;
  const defaultValue = textbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);
  const hideElement = useElementIsHidden(textbox.hideCondition);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    const options = { required: textbox.required ? requiredResponse : false };
    form.register(key, options);
    form.setValue(key, defaultValue);
  }, []);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(textbox.answer ?? "");
  }, [textbox.answer]);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
    form.setValue(`${props.formkey}.type`, textbox.type);
    form.setValue(`${props.formkey}.label`, textbox.label);
    form.setValue(`${props.formkey}.id`, textbox.id);
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;
  const parsedHint = textbox.helperText && parseCustomHtml(textbox.helperText);
  const labelText = textbox.label;

  if (hideElement) {
    return null;
  }

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
