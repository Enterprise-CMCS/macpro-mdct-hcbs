import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { DateShape } from "types";
import { differenceInSeconds } from "date-fns";

interface TimeShape {
  hour: number;
  minute: number;
  second: number;
}

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

/*
 * Converts passed ET datetime to UTC
 * returns -> UTC datetime in format 'yyyy-MM-ddThh:mm:ss.SSSZ'
 */
export const convertDateTimeEtToUtc = (
  etDate: DateShape,
  etTime: TimeShape
) => {
  const { year, month, day } = etDate;
  const { hour, minute, second } = etTime;

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = fromZonedTime(
    new Date(year, month - 1, day, hour, minute, second),
    "America/New_York"
  );
  return utcDatetime.toISOString();
};

/*
 * Converts passed UTC datetime to ET date
 * returns -> ET date in format mm/dd/yyyy
 */
export const convertDateUtcToEt = (date: number): string => {
  const convertedDate = date;
  const easternDatetime = toZonedTime(
    new Date(convertedDate),
    "America/New_York"
  );

  const month = twoDigitCalendarDate(new Date(easternDatetime).getMonth() + 1);
  const day = twoDigitCalendarDate(new Date(easternDatetime).getDate());
  const year = new Date(easternDatetime).getFullYear();

  // month + 1 because Date object months are zero-indexed
  return `${month}/${day}/${year}`;
};

/*
 * This code ensures the date has a preceeding 0 if the month/day is a single digit.
 * Ex: 7 becomes 07 while 10 stays 10
 */
export const twoDigitCalendarDate = (date: number) => {
  return ("0" + date).slice(-2);
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

export const convertDateStringEtToUtc = (date: string, time: TimeShape) => {
  const completeDate = parseMMDDYYYY(date);
  let convertedTime;
  if (completeDate) {
    let dateShape = {
      year: completeDate.getFullYear(),
      month: completeDate.getMonth() + 1,
      day: completeDate.getDate(),
    };
    convertedTime = convertDateTimeEtToUtc(dateShape, time);
  }
  return convertedTime || undefined;
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
  if (!match) throw new Error(`Invalid banner date: ${isoDateString}`);
  const [year, month, day] = match.slice(1).map(Number);
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
