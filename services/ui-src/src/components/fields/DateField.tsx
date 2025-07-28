import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";
import { validateDate } from "utils/validation/inputValidation";

export const DateField = (props: PageElementProps<DateTemplate>) => {
  const dateTextbox = props.element;
  const updateElement = props.updateElement;
  const [displayValue, setDisplayValue] = useState(dateTextbox.answer ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(dateTextbox.answer ?? "");
  }, [dateTextbox.answer]);

  const onChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayValue(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!dateTextbox.required
    );
    updateElement({ answer: isValid ? maskedValue : undefined });
    setErrorMessage(errorMessage);
  };

  const parsedHint =
    dateTextbox.helperText && parseHtml(dateTextbox.helperText);
  const labelText = dateTextbox.label;

  return (
    <Box>
      <CmsdsDateField
        name={dateTextbox.id}
        label={labelText}
        onChange={onChangeHandler}
        value={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        disabled={props.disabled}
      />
    </Box>
  );
};
