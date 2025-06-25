import React, { useState, useEffect } from "react";
import { get, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseHtml } from "utils";
import {
  TextboxTemplate,
  NumberFieldTemplate,
  ElementType,
} from "../../types/report";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { requiredResponse } from "../../constants";
import { parseNumber, stringifyInput } from "../rates/calculations";

export const TextField = (
  props: PageElementProps<TextboxTemplate | NumberFieldTemplate>
) => {
  const textbox = props.element;

  const stringifyAnswer = (newAnswer: typeof textbox.answer) => {
    if (typeof newAnswer === "number") return stringifyInput(newAnswer);
    return newAnswer ?? "";
  };

  const defaultValue = stringifyAnswer(textbox?.answer);
  const [displayValue, setDisplayValue] = useState<string>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  const hideElement = useElementIsHidden(textbox.hideCondition, key);

  useEffect(() => {
    const options = { required: textbox.required ? requiredResponse : false };
    form.register(key, options);
  }, []);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(stringifyAnswer(textbox.answer));
  }, [textbox.answer]);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setDisplayValue(value);

    const updatedValue =
      textbox.type === ElementType.NumberField ? parseNumber(value) : value;
    form.setValue(name, updatedValue, {
      shouldValidate: true,
    });
    form.setValue(`${props.formkey}.type`, textbox.type);
    form.setValue(`${props.formkey}.label`, textbox.label);
    form.setValue(`${props.formkey}.id`, textbox.id);
  };

  const onBlurHandler = () => {
    // When the user is done typing, overwrite the answer with the parsed value.
    setDisplayValue(stringifyAnswer(form.getValues(key)));
  };

  // prepare error message, hint, and classes
  const formErrors = form?.formState?.errors;
  const errorMessage: string | undefined = get(formErrors, key)?.message;
  const parsedHint = textbox.helperText && parseHtml(textbox.helperText);
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
