import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { parseHtml } from "utils";
import {
  SingleInputDateField as CmsdsDateField,
  TextField as CmsdsTextField,
} from "@cmsgov/design-system";
import { PageElementProps } from "../report/Elements";
import { DateTemplate } from "../../types/report";
import { validateDate } from "utils/validation/inputValidation";

const formatMonthYearInput = (value: string) => {
  const digitsOnly = value.replaceAll(/\D/g, "").slice(0, 6);
  if (digitsOnly.length <= 2) return digitsOnly;
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
};

const formatWithPlaceholders = (value: string) => {
  if (!value) return "MM/YYYY";

  const [month = "", year = ""] = value.split("/");
  const paddedMonth = month.padEnd(2, "M");
  const paddedYear = year.padEnd(4, "Y");

  return `${paddedMonth}/${paddedYear}`;
};

export const DateField = (props: PageElementProps<DateTemplate>) => {
  const dateTextbox = props.element;
  const dateFormat = dateTextbox.dateFormat ?? "MMDDYYYY";
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
      dateTextbox.required
    );
    props.updateElement({ answer: isValid ? maskedValue : undefined });
    setErrorMessage(errorMessage);
  };

  const onMonthYearChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const maskedValue = formatMonthYearInput(event.target.value);
    setDisplayValue(maskedValue);
    const { isValid, errorMessage } = validateDate(
      maskedValue,
      maskedValue,
      dateTextbox.required,
      undefined,
      "MMYYYY"
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
  const monthYearHint = (
    <>
      {parsedHint}
      <Text as="span" display="block" sx={sx.monthYearHintText}>
        {formatWithPlaceholders(displayValue)}
      </Text>
    </>
  );

  return (
    <Box>
      {dateFormat === "MMYYYY" ? (
        <Box sx={sx.monthYearInput}>
          <CmsdsTextField
            name={dateTextbox.id}
            label={labelText}
            onChange={onMonthYearChangeHandler}
            value={displayValue}
            hint={monthYearHint}
            errorMessage={errorMessage}
            disabled={props.disabled}
            inputMode="numeric"
          />
        </Box>
      ) : (
        <CmsdsDateField
          name={dateTextbox.id}
          label={labelText}
          onChange={onChangeHandler}
          value={displayValue}
          hint={parsedHint}
          errorMessage={errorMessage}
          disabled={props.disabled}
        />
      )}
    </Box>
  );
};

const sx = {
  monthYearHintText: {
    mt: "1",
    fontSize: "16px",
    fontFamily: "Menlo, Consolas, Monaco",
    fontWeight: "500",
    color: "#5a5a5a",
  },
  monthYearInput: {
    "input:not(.ds-c-choice)": {
      maxWidth: "12ch",
    },
  },
};
