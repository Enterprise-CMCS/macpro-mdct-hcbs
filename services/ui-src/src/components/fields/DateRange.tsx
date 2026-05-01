import { useEffect, useState } from "react";
import { Box, Stack, Text } from "@chakra-ui/react";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { parseHtml } from "utils";
import { DateRangeTemplate } from "types/report";
import { PageElementProps } from "components/report/Elements";
import { ErrorMessages } from "../../constants";
import { validateDate } from "utils/validation/inputValidation";
import { parseMMDDYYYY } from "utils/other/time";

const invalidMessage = (label: string) =>
  `${label} is invalid. Please enter date in MM/DD/YYYY format`;

export const DateRange = (props: PageElementProps<DateRangeTemplate>) => {
  const dateRange = props.element;
  const updateElement = props.updateElement;

  const [displayStart, setDisplayStart] = useState(
    dateRange.answer?.start ?? ""
  );
  const [displayEnd, setDisplayEnd] = useState(dateRange.answer?.end ?? "");
  const [startErrorMessage, setStartErrorMessage] = useState("");
  const [endErrorMessage, setEndErrorMessage] = useState("");

  useEffect(() => {
    setDisplayStart(dateRange.answer?.start ?? "");
    setDisplayEnd(dateRange.answer?.end ?? "");
  }, [dateRange.answer?.start, dateRange.answer?.end]);

  const onStartChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayStart(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!dateRange.required,
      invalidMessage(dateRange.labels.start)
    );

    updateElement({
      answer: {
        ...dateRange.answer,
        start: isValid ? maskedValue : undefined,
      },
    });

    setStartErrorMessage(errorMessage);
  };

  const onEndChangeHandler = (rawValue: string, maskedValue: string) => {
    setDisplayEnd(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!dateRange.required,
      invalidMessage(dateRange.labels.end)
    );

    updateElement({
      answer: {
        ...dateRange.answer,
        end: isValid ? maskedValue : undefined,
      },
    });

    setEndErrorMessage(errorMessage);
  };

  const rangeErrorMessage = (() => {
    const parsedStart = parseMMDDYYYY(dateRange.answer?.start ?? "");
    const parsedEnd = parseMMDDYYYY(dateRange.answer?.end ?? "");

    if (parsedStart && parsedEnd && parsedEnd < parsedStart) {
      return ErrorMessages.endDateBeforeStartDate;
    }

    return "";
  })();

  const parsedHint = dateRange.helperText && parseHtml(dateRange.helperText);

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
          onChange={onStartChangeHandler}
          value={displayStart}
          errorMessage={startErrorMessage}
          disabled={props.disabled}
        />
      </Box>
      <Box marginTop="8px">
        <CmsdsDateField
          name={`${dateRange.id}-end`}
          label={dateRange.labels.end}
          onChange={onEndChangeHandler}
          value={displayEnd}
          errorMessage={endErrorMessage || rangeErrorMessage}
          disabled={props.disabled}
        />
      </Box>
    </Stack>
  );
};
