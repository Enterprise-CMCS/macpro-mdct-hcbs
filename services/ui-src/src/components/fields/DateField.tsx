import { useEffect, useState } from "react";
import { parseHtml } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate, PageElement } from "../../types/report";
import { ErrorMessages } from "../../constants";
import { validateDate } from "utils/validation/inputValidation";
import { parseMMDDYYYY } from "utils/other/time";

type DateFieldProps = PageElementProps<DateTemplate> & {
  allElements?: PageElement[];
};

const measurementPeriodStartDateId = "measurement-period-start-date";
const measurementPeriodEndDateId = "measurement-period-end-date";

export const DateField = (props: DateFieldProps) => {
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
      !!dateTextbox.required,
      dateTextbox.invalidDateMessage
    );
    updateElement({ answer: isValid ? maskedValue : undefined });
    setErrorMessage(errorMessage);
  };

  const parsedHint =
    dateTextbox.helperText && parseHtml(dateTextbox.helperText);
  const labelText = dateTextbox.label;

  const rangeErrorMessage = (() => {
    if (dateTextbox.id !== measurementPeriodEndDateId || !props.allElements) {
      return "";
    }

    const startElement = props.allElements.find(
      (element): element is DateTemplate =>
        element.type === "date" && element.id === measurementPeriodStartDateId
    );

    const parsedStart = parseMMDDYYYY(startElement?.answer ?? "");
    const parsedEnd = parseMMDDYYYY(dateTextbox.answer ?? "");

    if (parsedStart && parsedEnd && parsedEnd < parsedStart) {
      return ErrorMessages.endDateBeforeStartDate;
    }

    return "";
  })();

  return (
    <CmsdsDateField
      name={dateTextbox.id}
      label={labelText}
      onChange={onChangeHandler}
      value={displayValue}
      hint={parsedHint}
      errorMessage={errorMessage || rangeErrorMessage}
      disabled={props.disabled}
    />
  );
};
