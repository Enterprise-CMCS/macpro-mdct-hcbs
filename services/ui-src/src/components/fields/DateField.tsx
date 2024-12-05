import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box } from "@chakra-ui/react";
import { checkDateCompleteness, parseCustomHtml, useStore } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";

export const DateField = (props: PageElementProps) => {
  const dateTextbox = props.element as DateTemplate;
  const defaultValue = dateTextbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  const { userIsEndUser } = useStore().user || {};

  // get form context and register form field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key);
  }, []);

  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const isValidDate = checkDateCompleteness(maskedValue);
    if (isValidDate || maskedValue === "") {
      form.setValue(key, maskedValue, { shouldValidate: true });
    }
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[key]?.message;
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
        onBlur={onBlurHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        disabled={!userIsEndUser}
      />
    </Box>
  );
};
