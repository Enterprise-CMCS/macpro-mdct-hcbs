import React, { useState, useEffect } from "react";
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
import { ErrorMessages } from "../../constants";
import { parseNumber, stringifyInput } from "../rates/calculations";
import { isEmail } from "utils/validation/inputValidation";

export const TextField = (
  props: PageElementProps<TextboxTemplate | NumberFieldTemplate>
) => {
  const { element: textbox, disabled } = props;
  const stringifyAnswer = (newAnswer: typeof textbox.answer) => {
    if (textbox.type === ElementType.NumberField) {
      return stringifyInput(newAnswer as number);
    }
    return newAnswer ?? "";
  };

  const defaultValue = stringifyAnswer(textbox?.answer);
  const [displayValue, setDisplayValue] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFocus, setHasFocus] = useState(false);

  const hideElement = useElementIsHidden(textbox.hideCondition);

  useEffect(() => {
    /*
     * We need to listen for answer updates, in case the measure is cleared.
     * But we don't want to overwrite input contents while the user is typing.
     * This only comes up if a valid answer becomes invalid mid-typing.
     * For example, typing "123abc" into a number field. The values saved up to
     * the store will be: 1, 12, 123, undefined, undefined, undefined.
     * Each of these will immediately be passed back down through the props.
     * When the 1st `undefined` comes through, if we neglect to check for focus,
     * we will wipe out the data, and the textbox will end up with just "bc".
     */
    if (!hasFocus) {
      setDisplayValue(stringifyAnswer(textbox.answer));
    }
  }, [textbox.answer]);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    setDisplayValue(rawValue);

    if (textbox.type === ElementType.NumberField) {
      const updateElement = (props as PageElementProps<NumberFieldTemplate>)
        .updateElement;
      const parsedValue = parseNumber(rawValue);
      updateElement({ answer: parsedValue });
      const valueIsNonNumeric = rawValue && parsedValue === undefined;
      if (!rawValue && textbox.required) {
        setErrorMessage(ErrorMessages.requiredResponse);
      } else if (valueIsNonNumeric && textbox.required) {
        setErrorMessage(ErrorMessages.mustBeANumber);
      } else if (valueIsNonNumeric && !textbox.required) {
        setErrorMessage(ErrorMessages.mustBeANumberOptional);
      } else {
        setErrorMessage("");
      }
    } else {
      const updateElement = (props as PageElementProps<TextboxTemplate>)
        .updateElement;
      updateElement({ answer: rawValue });
      if (!rawValue && textbox.required) {
        setErrorMessage(ErrorMessages.requiredResponse);
      } else if (textbox.label.includes("email") && !isEmail(rawValue)) {
        setErrorMessage(ErrorMessages.mustBeAnEmail);
      } else {
        setErrorMessage("");
      }
    }
  };

  const onBlurHandler = () => {
    // When the user is done typing, overwrite the answer with the parsed value.
    setHasFocus(false);
    setDisplayValue(stringifyAnswer(textbox.answer));
    if (!textbox.answer && textbox.required) {
      setErrorMessage(ErrorMessages.requiredResponse);
    }
  };

  const parsedHint = textbox.helperText && parseHtml(textbox.helperText);
  const labelText = textbox.label;

  if (hideElement) {
    return null;
  }

  return (
    <Box>
      <CmsdsTextField
        name={textbox.id}
        label={labelText || ""}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        onFocus={() => setHasFocus(true)}
        value={displayValue}
        errorMessage={errorMessage}
        disabled={disabled}
        required={textbox.required}
      />
    </Box>
  );
};
