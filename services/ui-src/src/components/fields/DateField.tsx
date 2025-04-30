import React, { useEffect, useState } from "react";
import { get, useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/react";
import { checkDateCompleteness, parseCustomHtml } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";

export const DateField = (props: PageElementProps) => {
  const dateTextbox = props.element as DateTemplate;
  const defaultValue = dateTextbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register form field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key);
  }, []);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(dateTextbox.answer ?? "");
  }, [dateTextbox.answer]);

  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const isValidDate = checkDateCompleteness(maskedValue);
    if (isValidDate || maskedValue === "") {
      form.setValue(key, maskedValue, { shouldValidate: true });
    }
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;

  const parsedHint =
    dateTextbox.helperText && parseCustomHtml(dateTextbox.helperText);
  const labelText = dateTextbox.label;

  return (
    <Box>
      <CmsdsDateField
        id={key}
        name={key}
        label={labelText || ""}
        onChange={onChangeHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        /*
         * Typescript hack. CmsdsDateField won't recognize
         * passthrough props until @cmsgov/design-system^9.0.0
         * TODO: Unhack, to just `disabled={props.disabled}`
         */
        {...{ disabled: props.disabled }}
      />
    </Box>
  );
};
