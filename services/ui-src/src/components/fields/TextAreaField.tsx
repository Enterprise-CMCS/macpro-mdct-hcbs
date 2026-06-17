import React, { useState, useEffect } from "react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Image, Text } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { TextAreaBoxTemplate } from "../../types/report";
import { PageElementProps } from "../report/Elements";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { ErrorMessages } from "../../constants";
import warningIconBrown from "assets/icons/alert/icon_warning_brown.svg";

const countWords = (value: string): number => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

export const TextAreaField = (props: PageElementProps<TextAreaBoxTemplate>) => {
  const textbox = props.element;
  const updateElement = props.updateElement;
  const wordLimit = textbox.wordLimit;
  const [displayValue, setDisplayValue] = useState(textbox.answer ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  const hideElement = useElementIsHidden(textbox.hideCondition);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(textbox.answer ?? "");
  }, [textbox.answer]);

  const wordCount = countWords(displayValue);
  const isOverLimit = wordLimit !== undefined && wordCount > wordLimit;
  const fieldClassName = isOverLimit ? "word-limit-warning" : undefined;

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setDisplayValue(value);
    if (!value && textbox.required) {
      setErrorMessage(ErrorMessages.requiredResponse);
    } else {
      setErrorMessage("");
    }
    updateElement({ answer: value === "" ? undefined : value });
  };

  const parsedHint = textbox.helperText && parseHtml(textbox.helperText);
  const hintContent = (
    <>
      {parsedHint}
      {isOverLimit && wordLimit !== undefined && (
        <Box
          as="span"
          display="inline-flex"
          mt="1"
          alignItems="flex-start"
          gap="2"
        >
          <Image
            src={warningIconBrown}
            alt=""
            aria-hidden="true"
            boxSize="16px"
            mt="1"
          />
          <Text
            as="span"
            display="block"
            fontSize="sm"
            color="palette.warn_darkest"
          >
            {ErrorMessages.wordCountExceeded(wordLimit)}
          </Text>
        </Box>
      )}
    </>
  );

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
        className={fieldClassName}
        name={textbox.id}
        label={labelText}
        hint={hintContent}
        onChange={onChangeHandler}
        onBlur={onChangeHandler}
        value={displayValue}
        errorMessage={errorMessage}
        multiline
        rows={3}
        disabled={props.disabled}
      />
      {wordLimit !== undefined && (
        <Text
          fontSize="sm"
          color={isOverLimit ? "palette.warn_darkest" : "gray.600"}
          mt="1"
          aria-live="polite"
        >
          Suggested length {wordCount}/{wordLimit} words
        </Text>
      )}
    </Box>
  );
};
