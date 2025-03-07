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
  const [hideElement, setHideElement] = useState<boolean>(false);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    const options = { required: textbox.required || false };
    form.register(key, options);
    form.setValue(key, defaultValue);
    form.setValue(`${props.formkey}.type`, textbox.type);
    form.setValue(`${props.formkey}.label`, textbox.label);
    form.setValue(`${props.formkey}.id`, textbox.id);
  }, []);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(textbox.answer ?? "");
  }, [textbox.answer]);

  useEffect(() => {
    const formValues = form.getValues() as any;
    if (formValues && Object.keys(formValues).length === 0) {
      return;
    }
    const reportingRadio = formValues?.elements?.find((element: any) => {
      return element?.id === "measure-reporting-radio";
    });
    if (reportingRadio?.answer === "no") {
      setHideElement(true);
    } else {
      setHideElement(false);
    }
  }, [form.getValues()]);

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
