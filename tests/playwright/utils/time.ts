/** Format the given date as `MM/dd/yyyy`. Example: "12/30/2024" */
const formatDateUS = (date: Date | number) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)!.value;
  const yyyy = getPart("year");
  const MM = getPart("month");
  const dd = getPart("day");
  return `${MM}/${dd}/${yyyy}`;
};

/** The length of one day, in milliseconds (ignoring DST and leap seconds) */
const ONE_DAY = 24 * 60 * 60 * 1000;

/** Yesterday's date, in local time, as MM/dd/yyyy. Example: "12/29/2024" */
export const yesterday = () => formatDateUS(new Date().valueOf() - ONE_DAY);

/** Today's date, in local time, as MM/dd/yyyy. Example: "12/30/2024" */
export const today = () => formatDateUS(new Date());

/** Yesterday's date, in local time, as MM/dd/yyyy. Example: "12/31/2024" */
export const tomorrow = () => formatDateUS(new Date().valueOf() + ONE_DAY);
