import { useEffect, useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { DateRangeTemplate } from "types/report";
import { PageElementProps } from "components/report/Elements";
import { ErrorMessages } from "../../constants";
import { validateDate } from "utils/validation/inputValidation";
import { parseMMDDYYYY, parseMMYYYY } from "utils/other/time";
import { MultiFormatDateField } from "components/cms-extensions/MultiFormatDateField";

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
  const parsedStart = parse(answer.start);
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
    start: dateRange.answer.start,
    end: dateRange.answer?.end ?? "",
  });
  const [errors, setErrors] = useState<DateRangeErrors>({
    start: "",
    end: "",
    range: getRangeErrorMessage(dateRange.answer, dateFormat),
  });

  useEffect(() => {
    setDisplayValues({
      start: dateRange.answer.start,
      end: dateRange.answer?.end ?? "",
    });
    setErrors((prev) => ({
      ...prev,
      range: getRangeErrorMessage(dateRange.answer, dateFormat),
    }));
  }, [dateRange.answer.start, dateRange.answer?.end, dateFormat]);

  const handleDateChange = (
    fieldName: "start" | "end",
    rawValue: string,
    maskedValue: string,
    _date: Date | undefined
  ) => {
    setDisplayValues((prev) => ({ ...prev, [fieldName]: rawValue }));

    const isRequired =
      fieldName === "end"
        ? (dateRange.endDateRequired ?? dateRange.required)
        : dateRange.required;

    const invalidText =
      dateFormat === "MMYYYY"
        ? `${dateRange.labels[fieldName]} is invalid. Please enter date in MM/YYYY format`
        : `${dateRange.labels[fieldName]} is invalid. Please enter date in MM/DD/YYYY format`;

    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      isRequired,
      invalidText,
      dateFormat
    );

    const nextAnswer: DateRangeTemplate["answer"] = {
      ...dateRange.answer,
      ...(isValid || rawValue === "" ? { [fieldName]: maskedValue } : {}),
    };
    const rangeError = getRangeErrorMessage(nextAnswer, dateFormat);

    if ((isValid || rawValue === "") && !rangeError) {
      props.updateElement({ answer: nextAnswer });
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
      range: rangeError,
    }));
  };

  const parsedHint = dateRange.helperText && parseHtml(dateRange.helperText);

  const isOptionalEnd = !(dateRange.endDateRequired ?? dateRange.required);
  const endDateLabel = (
    <>
      {dateRange.labels.end}
      {isOptionalEnd && <span className="optionalText"> (optional)</span>}
    </>
  );

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
      <Box marginTop="spacer3">
        <MultiFormatDateField
          dateFormat={dateFormat}
          name={`${dateRange.id}-start`}
          label={dateRange.labels.start}
          onChange={(rawValue, maskedValue, date) =>
            handleDateChange("start", rawValue, maskedValue, date)
          }
          value={displayValues.start}
          hint={parseHtml(dateRange.startHelperText ?? "")}
          errorMessage={errors.start}
          disabled={props.disabled}
        />
      </Box>
      <Box marginTop="8px">
        <MultiFormatDateField
          dateFormat={dateFormat}
          name={`${dateRange.id}-end`}
          label={endDateLabel}
          onChange={(rawValue, maskedValue, date) =>
            handleDateChange("end", rawValue, maskedValue, date)
          }
          value={displayValues.end}
          hint={parseHtml(dateRange.endHelperText ?? "")}
          errorMessage={errors.end || errors.range}
          disabled={props.disabled}
        />
      </Box>
    </Stack>
  );
};
