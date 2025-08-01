import React, { useState, useEffect } from "react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { TextAreaBoxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { ErrorMessages } from "../../constants";

export const TextAreaField = (props: PageElementProps<TextAreaBoxTemplate>) => {
  const textbox = props.element;
  const updateElement = props.updateElement;
  const defaultValue = textbox.answer ?? "";
  const [displayValue, setDisplayValue] = useState(defaultValue);
  const [errorMessage, setErrorMessage] = useState("");

  const hideElement = useElementIsHidden(textbox.hideCondition);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(textbox.answer ?? "");
  }, [textbox.answer]);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setDisplayValue(value);
    if (!value && textbox.required) {
      setErrorMessage(ErrorMessages.requiredResponse);
    } else {
      setErrorMessage("");
    }
    const answer = value === "" ? undefined : value;
    updateElement({ answer });
  };

  const parsedHint = textbox.helperText && parseHtml(textbox.helperText);

  const labelText = (
    <>
      {textbox.label}
      {!textbox.required && <span className="optionalText"> (optional)</span>}
    </>
  );

  if (hideElement) {
    return null;
  }

  return (
    <Box>
      <CmsdsTextField
        name={textbox.id}
        label={labelText}
        hint={parsedHint}
        onChange={onChangeHandler}
        onBlur={onChangeHandler}
        value={displayValue}
        errorMessage={errorMessage}
        multiline
        rows={3}
        disabled={props.disabled}
      />
    </Box>
  );
};
