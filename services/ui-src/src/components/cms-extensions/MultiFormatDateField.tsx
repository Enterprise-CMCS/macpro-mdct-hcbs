import { SingleInputDateField, TextField } from "@cmsgov/design-system";
import { parseMMYYYY } from "utils";

const fullDate = "MMDDYYYY" as const;
const monthYear = "MMYYYY" as const;

type MultiFormatDateFieldProps = React.ComponentProps<
  typeof SingleInputDateField
> & {
  /** Indicates whether this is a standard date input, or only month-specific. */
  dateFormat: typeof fullDate | typeof monthYear;
};

/**
 * A mask function compatible with the CMSDS `useLabelMask()` hook.
 * Provides masking behavior for both the hint and the input value.
 */
const monthYearMask = (rawValue = "", valueOnly = false) => {
  /*
   * The regex captures month and year, treating any non-digit as a delimiter.
   * If the user types `1.2345`, we will auto-pad to `01/2345`: a valid date.
   * Whereas `12345` would become `12/345`: not valid without another character.
   */
  const RE_MONTH_YEAR = /^(\d{1,2})[\D]?(\d{1,4})?/;
  const match = RE_MONTH_YEAR.exec(rawValue ?? "");
  let formattedValue = "";
  if (match) {
    const [month, year] = match.slice(1);
    formattedValue = [month.padStart(2, "0"), year].filter(Boolean).join("/");
  }
  const hint = formattedValue + "MM/YYYY".substring(formattedValue.length);
  return valueOnly ? formattedValue : hint;
};
// Setting this property affects blur behavior for the hint. See https://github.com/CMSgov/design-system/blob/6369e9b588628f21d15f7505b64a8c3fee8b2ce4/packages/design-system/src/components/TextField/useLabelMask.tsx#L211-L214
monthYearMask.__maskType = "DATE_MASK";

/**
 * An input that behaves like the CMSDS SingleInputDateField,
 * except that it can be switched from month/day/year to just month/year.
 *
 * Also note that SingleInputDateField while supports a popover date picker UI,
 * a date-level picker would not make sense in month/year mode. So we skip it.
 */
export const MultiFormatDateField = ({
  dateFormat = fullDate,
  ...remainingProps
}: MultiFormatDateFieldProps) => {
  if (dateFormat === fullDate) {
    return <SingleInputDateField {...remainingProps} />;
  }

  const { fromDate, fromMonth, fromYear, toDate, toMonth, toYear } =
    remainingProps;
  const wouldUsePicker =
    (fromDate != null || fromMonth != null || Number.isInteger(fromYear)) &&
    (toDate != null || toMonth != null || Number.isInteger(toYear));
  if (wouldUsePicker) {
    console.warn(
      `Date format 'MMYYYY' is incompatible with date picker behavior. To use fromDate, fromMonth, fromYear, toDate, toMonth, or toYear, please specify dateFormat='MMDDYYYY'`
    );
  }

  return (
    <div className="ds-c-single-input-date-field__field-wrapper">
      <TextField
        {...remainingProps}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = event.target.value;
          const maskedValue = monthYearMask(rawValue, true);
          remainingProps.onChange?.(
            rawValue,
            maskedValue,
            parseMMYYYY(maskedValue)
          );
        }}
        labelMask={monthYearMask}
        inputMode="numeric"
      />
    </div>
  );
};
