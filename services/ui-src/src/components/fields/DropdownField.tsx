import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { PageElementProps } from "components/report/Elements";
import { DropdownTemplate } from "types";
import { Dropdown as CmsdsDropdownField } from "@cmsgov/design-system";
import { parseCustomHtml } from "utils";

export const DropdownField = (props: PageElementProps) => {
  const dropdown = props.element as DropdownTemplate;
  const defaultValue = dropdown.answer ?? dropdown.options[0].value;
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
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;
  const parsedHint =
    dropdown.helperText && parseCustomHtml(dropdown.helperText);
  const labelText = dropdown.label;

  return (
    <CmsdsDropdownField
      id={key}
      name={key}
      label={labelText || ""}
      hint={parsedHint}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      options={dropdown.options}
      errorMessage={errorMessage}
      value={displayValue}
      {...props}
    ></CmsdsDropdownField>
  );
};
