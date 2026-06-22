import { useEffect, useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { parseHtml } from "utils";
import { DateRangeTemplate } from "types/report";
import { PageElementProps } from "components/report/SimpleElements";
import { ErrorMessages } from "../../constants";
import { validateDate } from "utils/validation/inputValidation";
import { parseMMDDYYYY } from "utils/other/time";

const invalidMessage = (label: string) =>
  `${label} is invalid. Please enter date in MM/DD/YYYY format`;

type DateRangeErrors = {
  start: string;
  end: string;
  range: string;
};

type DateValues = {
  start: string;
  end: string;
};

const getRangeErrorMessage = (answer?: DateRangeTemplate["answer"]) => {
  const parsedStart = parseMMDDYYYY(answer?.start ?? "");
  const parsedEnd = parseMMDDYYYY(answer?.end ?? "");

  if (parsedStart && parsedEnd && parsedEnd < parsedStart) {
    return ErrorMessages.measurementEndDateBeforeStartDate;
  }

  return "";
};

export const DateRange = (props: PageElementProps<DateRangeTemplate>) => {
  const dateRange = props.element;
  const updateElement = props.updateElement;

  const [displayValues, setDisplayValues] = useState<DateValues>({
    start: dateRange.answer?.start ?? "",
    end: dateRange.answer?.end ?? "",
  });
  const [errors, setErrors] = useState<DateRangeErrors>({
    start: "",
    end: "",
    range: getRangeErrorMessage(dateRange.answer),
  });

  useEffect(() => {
    setDisplayValues({
      start: dateRange.answer?.start ?? "",
      end: dateRange.answer?.end ?? "",
    });
    setErrors((prev) => ({
      ...prev,
      range: getRangeErrorMessage(dateRange.answer),
    }));
  }, [dateRange.answer?.start, dateRange.answer?.end]);

  const handleDateChange = (
    fieldName: "start" | "end",
    rawValue: string,
    maskedValue: string
  ) => {
    setDisplayValues((prev) => ({ ...prev, [fieldName]: rawValue }));

    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!dateRange.required,
      invalidMessage(dateRange.labels[fieldName])
    );

    const nextAnswer = {
      ...dateRange.answer,
      [fieldName]: isValid ? maskedValue : undefined,
    };
    const rangeError = getRangeErrorMessage(nextAnswer);

    if (!rangeError) {
      updateElement({ answer: nextAnswer });
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
      range: rangeError,
    }));
  };

  const parsedHint = dateRange.helperText && parseHtml(dateRange.helperText);
  const endFieldError = errors.end || errors.range;

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
        <CmsdsDateField
          name={`${dateRange.id}-start`}
          label={dateRange.labels.start}
          onChange={(rawValue, maskedValue) =>
            handleDateChange("start", rawValue, maskedValue)
          }
          value={displayValues.start}
          errorMessage={errors.start}
          disabled={props.disabled}
        />
      </Box>
      <Box marginTop="8px">
        <CmsdsDateField
          name={`${dateRange.id}-end`}
          label={dateRange.labels.end}
          onChange={(rawValue, maskedValue) =>
            handleDateChange("end", rawValue, maskedValue)
          }
          value={displayValues.end}
          errorMessage={endFieldError}
          disabled={props.disabled}
        />
      </Box>
    </Stack>
  );
};
