import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/react";
import { checkDateCompleteness, parseCustomHtml } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";

export const DateField = (props: PageElementProps) => {
  const dateTextbox = props.element as DateTemplate;
  const defaultValue = "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register form field
  const form = useFormContext();
  const inputName = "answers.1.2"; // TODO: id based

  useEffect(() => {
    form.register(inputName);
  }, []);

  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const isValidDate = checkDateCompleteness(maskedValue);
    if (isValidDate || maskedValue === "") {
      form.setValue(inputName, maskedValue, { shouldValidate: true });
    }
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(inputName, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[inputName]?.message;
  const parsedHint =
    dateTextbox.helperText && parseCustomHtml(dateTextbox.helperText);
  const labelText = dateTextbox.label;

  return (
    <Box>
      <CmsdsDateField
        id={inputName}
        name={inputName}
        label={labelText || ""}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
      />
    </Box>
  );
};
