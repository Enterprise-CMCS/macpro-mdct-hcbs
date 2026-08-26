import { useEffect, useState } from "react";
import { MultiFormatDateField } from "components/cms-extensions/MultiFormatDateField";
import { parseHtml } from "utils";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";
import { validateDate } from "utils/validation/inputValidation";

export const DateField = (props: PageElementProps<DateTemplate>) => {
  const dateTextbox = props.element;
  const dateFormat = dateTextbox.dateFormat ?? "MMDDYYYY";
  const [displayValue, setDisplayValue] = useState(dateTextbox.answer ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(dateTextbox.answer ?? "");
  }, [dateTextbox.answer]);

  const onChangeHandler = (
    rawValue: string,
    maskedValue: string,
    _date: Date | undefined
  ) => {
    setDisplayValue(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      dateTextbox.required,
      undefined,
      dateFormat
    );
    props.updateElement({ answer: isValid ? maskedValue : undefined });
    setErrorMessage(errorMessage);
  };

  const parsedHint =
    dateTextbox.helperText && parseHtml(dateTextbox.helperText);
  const labelText = (
    <>
      {dateTextbox.label}
      {!dateTextbox.required && (
        <span className="optionalText"> (optional)</span>
      )}
    </>
  );

  return (
    <MultiFormatDateField
      dateFormat={dateFormat}
      name={dateTextbox.id}
      label={labelText}
      onChange={onChangeHandler}
      value={displayValue}
      hint={parsedHint}
      errorMessage={errorMessage}
      disabled={props.disabled}
    />
  );
};
