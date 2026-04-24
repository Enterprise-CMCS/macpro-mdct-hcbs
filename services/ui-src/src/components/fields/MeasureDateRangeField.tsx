import { useEffect, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { parseHtml } from "utils";
import { SingleInputDateField as CmsdsDateField } from "@cmsgov/design-system";
import { MeasureDateRangeTemplate } from "../../types/report";
import { validateDate } from "utils/validation/inputValidation";
import { ErrorMessages } from "../../constants";
import { parseMMDDYYYY } from "utils/other/time";

interface MeasureDateRangeFieldProps {
  element: MeasureDateRangeTemplate;
  updateElement: (updatedElement: Partial<MeasureDateRangeTemplate>) => void;
  disabled?: boolean;
}

export const MeasureDateRangeField = (props: MeasureDateRangeFieldProps) => {
  const element = props.element;
  const updateElement = props.updateElement;
  const [startDisplayValue, setStartDisplayValue] = useState(
    element.startDateAnswer ?? ""
  );
  const [endDisplayValue, setEndDisplayValue] = useState(
    element.endDateAnswer ?? ""
  );
  const [startErrorMessage, setStartErrorMessage] = useState("");
  const [endErrorMessage, setEndErrorMessage] = useState("");

  // Listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setStartDisplayValue(element.startDateAnswer ?? "");
    setEndDisplayValue(element.endDateAnswer ?? "");
  }, [element.startDateAnswer, element.endDateAnswer]);

  const validateEndDate = (
    startRawValue: string,
    startMaskedValue: string,
    endRawValue: string,
    endMaskedValue: string
  ) => {
    const parsedStartDate = parseMMDDYYYY(startMaskedValue);
    const parsedEndDate = parseMMDDYYYY(endMaskedValue);

    if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
      return ErrorMessages.endDateBeforeStartDate;
    }
    return "";
  };

  const onStartDateChange = (rawValue: string, maskedValue: string) => {
    setStartDisplayValue(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!element.required
    );
    updateElement({ startDateAnswer: isValid ? maskedValue : undefined });
    setStartErrorMessage(errorMessage);

    // Check end date range if end date exists
    if (element.endDateAnswer) {
      const rangeError = validateEndDate(
        rawValue,
        maskedValue,
        endDisplayValue,
        element.endDateAnswer
      );
      setEndErrorMessage(rangeError);
    }
  };

  const onEndDateChange = (rawValue: string, maskedValue: string) => {
    setEndDisplayValue(rawValue);
    const { isValid, errorMessage } = validateDate(
      rawValue,
      maskedValue,
      !!element.required
    );
    updateElement({ endDateAnswer: isValid ? maskedValue : undefined });

    // Validate end vs start
    if (isValid) {
      const rangeError = validateEndDate(
        element.startDateAnswer ?? "",
        element.startDateAnswer ?? "",
        rawValue,
        maskedValue
      );
      setEndErrorMessage(rangeError);
    } else {
      setEndErrorMessage(errorMessage);
    }
  };

  const parsedHint = element.helperText && parseHtml(element.helperText);

  return (
    <VStack align="stretch" spacing="spacer3">
      <Box>
        <Box as="legend" className="ds-c-label" mb="2">
          {element.label}
        </Box>
        {parsedHint && <p className="ds-c-hint">{parsedHint}</p>}
      </Box>

      <HStack spacing="spacer3" align="flex-start">
        <Box flex="1">
          <CmsdsDateField
            name={`${element.id}-start`}
            label={element.startDateLabel}
            onChange={onStartDateChange}
            value={startDisplayValue}
            errorMessage={startErrorMessage}
            disabled={props.disabled}
          />
        </Box>

        <Box flex="1">
          <CmsdsDateField
            name={`${element.id}-end`}
            label={element.endDateLabel}
            onChange={onEndDateChange}
            value={endDisplayValue}
            errorMessage={endErrorMessage}
            disabled={props.disabled}
          />
        </Box>
      </HStack>
    </VStack>
  );
};
