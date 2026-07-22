import { useEffect, useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import {
  SingleInputDateField as CmsdsDateField,
  TextField as CmsdsTextField,
} from "@cmsgov/design-system";
import { parseHtml } from "utils";
import { DateRangeTemplate } from "types/report";
import { PageElementProps } from "components/report/Elements";
import { ErrorMessages } from "../../constants";
import { validateDate } from "utils/validation/inputValidation";
import { parseMMDDYYYY, parseMMYYYY } from "utils/other/time";
import { formatMonthYearInput, formatWithPlaceholders } from "./monthYearInput";

const invalidMessage = (label: string, dateFormat: "MMDDYYYY" | "MMYYYY") =>
  dateFormat === "MMYYYY"
    ? `${label} is invalid. Please enter date in MM/YYYY format`
    : `${label} is invalid. Please enter date in MM/DD/YYYY format`;

type DateRangeErrors = {
  start: string;
  end: string;
  range: string;
};

type DateValues = {
  start: string;
  end: string;
};

const getRangeErrorMessage = (
  answer: DateRangeTemplate["answer"],
  dateFormat: "MMDDYYYY" | "MMYYYY"
) => {
  const parse = dateFormat === "MMYYYY" ? parseMMYYYY : parseMMDDYYYY;
  const parsedStart = parse(answer?.start ?? "");
  const parsedEnd = parse(answer?.end ?? "");

  if (parsedStart && parsedEnd && parsedEnd < parsedStart) {
    return dateFormat === "MMYYYY"
      ? ErrorMessages.endDateBeforeStartDate
      : ErrorMessages.measurementEndDateBeforeStartDate;
  }

  return "";
};

export const DateRange = (props: PageElementProps<DateRangeTemplate>) => {
  const dateRange = props.element;
  const dateFormat = dateRange.dateFormat ?? "MMDDYYYY";

  const [displayValues, setDisplayValues] = useState<DateValues>({
    start: dateRange.answer?.start ?? "",
    end: dateRange.answer?.end ?? "",
  });
  const [errors, setErrors] = useState<DateRangeErrors>({
    start: "",
    end: "",
    range: getRangeErrorMessage(dateRange.answer, dateFormat),
  });

  useEffect(() => {
    setDisplayValues({
      start: dateRange.answer?.start ?? "",
      end: dateRange.answer?.end ?? "",
    });
    setErrors((prev) => ({
      ...prev,
      range: getRangeErrorMessage(dateRange.answer, dateFormat),
    }));
  }, [dateRange.answer?.start, dateRange.answer?.end, dateFormat]);

  const handleDateChange = (
    fieldName: "start" | "end",
    rawValue: string,
    maskedValue: string
  ) => {
    setDisplayValues((prev) => ({ ...prev, [fieldName]: rawValue }));

    const isRequired =
      fieldName === "end"
        ? (dateRange.endDateRequired ?? dateRange.required)
        : dateRange.required;

    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      isRequired,
      invalidMessage(dateRange.labels[fieldName], dateFormat),
      dateFormat
    );

    const nextAnswer = {
      ...dateRange.answer,
      [fieldName]: isValid ? maskedValue : undefined,
    };
    const rangeError = getRangeErrorMessage(nextAnswer, dateFormat);

    if (!rangeError) {
      props.updateElement({ answer: nextAnswer });
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
      range: rangeError,
    }));
  };

  const onMonthYearChange =
    (fieldName: "start" | "end") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const masked = formatMonthYearInput(event.target.value);
      handleDateChange(fieldName, masked, masked);
    };

  const parsedHint = dateRange.helperText && parseHtml(dateRange.helperText);

  const renderField = (fieldName: "start" | "end") => {
    const name = `${dateRange.id}-${fieldName}`;
    const label = dateRange.labels[fieldName];
    const value = displayValues[fieldName];
    const errorMessage =
      fieldName === "end" ? errors.end || errors.range : errors.start;

    if (dateFormat === "MMYYYY") {
      return (
        <Box sx={sx.monthYearInput}>
          <CmsdsTextField
            name={name}
            label={label}
            onChange={onMonthYearChange(fieldName)}
            value={value}
            hint={
              <Text as="span" display="block" sx={sx.monthYearHintText}>
                {formatWithPlaceholders(value)}
              </Text>
            }
            errorMessage={errorMessage}
            disabled={props.disabled}
            inputMode="numeric"
          />
        </Box>
      );
    }

    return (
      <CmsdsDateField
        name={name}
        label={label}
        onChange={(rawValue, maskedValue) =>
          handleDateChange(fieldName, rawValue, maskedValue)
        }
        value={value}
        errorMessage={errorMessage}
        disabled={props.disabled}
      />
    );
  };

  return (
    <Stack spacing={0} width="100%">
      <Text fontSize="heading_lg" fontWeight="heading_md">
        {dateRange.labels.top}
      </Text>
      {parsedHint && (
        <Text fontSize="body_md" color="palette.gray_dark">
          {parsedHint}
        </Text>
      )}
      <Box marginTop="spacer3">{renderField("start")}</Box>
      <Box marginTop="8px">{renderField("end")}</Box>
    </Stack>
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
