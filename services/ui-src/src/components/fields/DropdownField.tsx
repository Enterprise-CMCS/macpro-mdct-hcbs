import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { PageElementProps } from "components/report/Elements";
import { DropdownTemplate } from "types";
import {
  Dropdown as CmsdsDropdownField,
  DropdownChangeObject,
  DropdownProps,
} from "@cmsgov/design-system";
import { parseCustomHtml } from "utils";

export const DropdownField = (props: PageElementProps) => {
  /**
   * TODO:
   * https://design.cms.gov/components/dropdown/?theme=core
   * WCAG 2.1 Level AA Conformance missing - Roll as custom dropdown
   */
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

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(dropdown.answer ?? dropdown.options[0].value);
  }, [dropdown.answer]);

  const onChangeHandler = async (event: DropdownChangeObject) => {
    const { name, value } = event.target;
    setDisplayValue(value);
    form.setValue(name, value, { shouldValidate: true });
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // CMSDS Dropdown not using event.target.value onBlur, innertext or outertext appear to contain the current value
    form.setValue(key, event.target.innerText);
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;
  const parsedHint =
    dropdown.helperText && parseCustomHtml(dropdown.helperText);
  const labelText = dropdown.label;

  const dropdownProps: DropdownProps = {
    id: key,
    name: key,
    label: labelText || "",
    hint: <>{parsedHint}</>,
    onChange: (change) => {
      onChangeHandler(change);
    },
    onBlur: onBlurHandler,
    options: dropdown.options,
    errorMessage: errorMessage,
    value: displayValue,
    ...props,
  };

  return <>{CmsdsDropdownField(dropdownProps)}</>;
};
