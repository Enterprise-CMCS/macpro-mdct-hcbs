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
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateTimeEtToUtc = (
  etDate: DateShape,
  etTime: TimeShape
): number => {
  const { year, month, day } = etDate;
  const { hour, minute, second } = etTime;

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = fromZonedTime(
    new Date(year, month - 1, day, hour, minute, second),
    "America/New_York"
  );
  return utcDatetime.getTime();
};

/*
 * Converts passed ET date to UTC
 * returns -> UTC datetime in format 'ms since Unix epoch'
 */
export const convertDateEtToUtc = (date: string): number => {
  const [month, day, year] = date.split("/");

  // month - 1 because Date object months are zero-indexed
  const utcDatetime = fromZonedTime(
    new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    "America/New_York"
  );
  return utcDatetime.getTime();
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

export const convertDatetimeStringToNumber = (
  date: string,
  time: TimeShape
): number | undefined => {
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

export const checkDateRangeStatus = (
  startDate: number,
  endDate: number
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= startDate && currentTime <= endDate;
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

export const calculateNextQuarter = (previousQuarter: string) => {
  if (previousQuarter) {
    const formattedQuarter = previousQuarter.split(" ");
    const year = parseInt(formattedQuarter[0]);
    const period = parseInt(
      formattedQuarter[1][formattedQuarter[1].length - 1]
    );
    const nextPeriod = (period % 4) + 1;
    const nextYear = period === 4 ? year + 1 : year;
    return `${nextYear} Q${nextPeriod}`;
  }
  return "";
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
