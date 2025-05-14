import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { TextAreaBoxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";

export const TextAreaField = (props: PageElementProps) => {
  const textbox = props.element as TextAreaBoxTemplate;
  const defaultValue = textbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  const hideElement = useElementIsHidden(textbox.hideCondition, key);
  useEffect(() => {
    form.register(key);
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
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrorState, key)?.message;
  const parsedHint = textbox.helperText && parseHtml(textbox.helperText);

  const labelText = [
    textbox.label,
    !textbox.required && <span className="optionalText"> (optional)</span>,
  ];

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
        value={displayValue}
        errorMessage={errorMessage}
        multiline
        rows={3}
        {...props}
      />
    </Box>
  );
};
