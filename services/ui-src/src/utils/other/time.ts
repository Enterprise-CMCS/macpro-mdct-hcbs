import { differenceInSeconds } from "date-fns";

/*
 * Returns local time in HH:mm format with the "am/pm" indicator
 * ex: 12:02pm
 */
export const getLocalHourMinuteTime = () => {
  const currentUtcTime = Date.now();
  const localTime = new Date(currentUtcTime).toLocaleTimeString();
  const localTimeHourMinute = localTime.substring(
    0,
    localTime.lastIndexOf(":")
  );
  const twelveHourIndicator = localTime.includes("AM") ? "am" : "pm";
  return localTimeHourMinute.concat(twelveHourIndicator);
};

/**
 * Format the given date to MM/dd/yyyy. For example: "03/20/2024"
 */
export const formatMonthDayYear = (date: number) => {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  } as const;
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)!.value;
  return [getPart("month"), getPart("day"), getPart("year")].join("/");
};

/*
 * Calculates time remaining for things like timeout
 */
export const calculateRemainingSeconds = (expiresAt?: any) => {
  if (!expiresAt) return 0;
  const parsedDate = new Date(expiresAt);
  if (isNaN(parsedDate.getTime())) return 0;
  return differenceInSeconds(parsedDate, new Date());
};

/**
 * Parse a date string in the format "MM/DD/YYYY"
 * @returns a Date, or `undefined` if the input is invalid
 * @example
 * parseMMDDYYYY("") === undefined
 * parseMMDDYYYY("not a date") === undefined
 * parseMMDDYYYY("99/99/9999") === undefined
 * parseMMDDYYYY("12/31/2025") // December 31st, 2025
 */
export const parseMMDDYYYY = (dateString: string): Date | undefined => {
  if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return undefined;
  }
  const parts = dateString.split("/");
  // Month is 0 indexed in JavaScript Date constructor
  const month = parseInt(parts[0]) - 1;
  const day = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  const dateObj = new Date(year, month, day);

  // Check if the date is valid
  if (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month &&
    dateObj.getDate() === day
  ) {
    return dateObj;
  }
  return undefined;
};

/**
 * Parse the given date as if it were in the user's local time zone.
 * @param {string} isoDateString A date formatted as yyyy-MM-dd
 */
export const parseAsLocalDate = (isoDateString: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateString);
  console.assert(match, `Invalid banner date: ${isoDateString}`);
  const [year, month, day] = match!.slice(1).map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Compare _only the date_ portion of two date objects.
 *
 * Time of day is ignored, and we use the current local timezone.
 * @returns
 * - A negative number if `dateA` is earlier
 * - `0` if the two dates are on the same day
 * - A positive number if `dateA` is later
 */
export const compareDates = (dateA: Date, dateB: Date) => {
  return (
    dateA.getFullYear() - dateB.getFullYear() ||
    dateA.getMonth() - dateB.getMonth() ||
    dateA.getDate() - dateB.getDate()
  );
};
