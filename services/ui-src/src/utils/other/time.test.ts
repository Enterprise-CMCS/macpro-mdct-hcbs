import {
  calculateRemainingSeconds,
  formatMonthDayYear,
  getLocalHourMinuteTime,
  parseMMDDYYYY,
} from "./time";

const getLocalHourMinuteTimeRegex = /[0-2]?[0-9]:[0-5][0-9](a|p)m/;

describe("utils/time", () => {
  describe("getLocalHourMinuteTime()", () => {
    it("returns correct hourminute format", () => {
      const localHourMinuteTime = getLocalHourMinuteTime();
      expect(localHourMinuteTime).toMatch(getLocalHourMinuteTimeRegex);
    });
  });

  describe("formatMonthDayYear()", () => {
    it("should render dates as MM/dd/yyyy", () => {
      const date = new Date("2024-03-20").valueOf();
      const formatted = formatMonthDayYear(date);
      // Imprecise matcher, because the result depends on the user's time zone
      expect(formatted).toMatch(/03\/\d\d\/2024/);
    });
  });

  describe("calculateTimeLeft()", () => {
    it("returns 0 when no value is given", () => {
      expect(calculateRemainingSeconds()).toBeCloseTo(0);
    });

    it("checks that expiration time is greater than zero", () => {
      const expirationTime = "2050-11-18T12:53:11-05:00";
      expect(calculateRemainingSeconds(expirationTime)).toBeGreaterThan(0);
    });
  });
});

describe("test parseMMDDYYYY helper function", () => {
  it("should correctly parse a valid MMDDYYYY date string", () => {
    const date = parseMMDDYYYY("12/25/2023");
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2023);
    expect(date?.getMonth()).toBe(11); // December (0-indexed)
    expect(date?.getDate()).toBe(25);
    expect(date?.getHours()).toBe(0); // Should be normalized to midnight
    expect(date?.getMinutes()).toBe(0);
    expect(date?.getSeconds()).toBe(0);
    expect(date?.getMilliseconds()).toBe(0);
  });

  it("should correctly parse a valid MMDDYYYY date string with single digit month/day", () => {
    const date = parseMMDDYYYY("01/05/2024");
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2024);
    expect(date?.getMonth()).toBe(0); // January (0-indexed)
    expect(date?.getDate()).toBe(5);
  });

  it("should correctly parse a leap year date", () => {
    const date = parseMMDDYYYY("02/29/2028"); // 2028 is a leap year
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2028);
    expect(date?.getMonth()).toBe(1); // February (0-indexed)
    expect(date?.getDate()).toBe(29);
  });

  it("should return null for 02/29 in a non-leap year", () => {
    const date = parseMMDDYYYY("02/29/2027");
    expect(date).toBeFalsy();
  });

  it("should return null for an invalid month", () => {
    const date = parseMMDDYYYY("13/01/2023");
    expect(date).toBeFalsy();
  });

  it("should return null for an invalid day", () => {
    const date = parseMMDDYYYY("01/32/2023");
    expect(date).toBeFalsy();
  });

  it("should return null for an invalid day for a specific month", () => {
    const date = parseMMDDYYYY("04/31/2023"); // April has 30 days
    expect(date).toBeFalsy();
  });

  it("should return null for an incorrect format (missing slashes)", () => {
    const date = parseMMDDYYYY("12-25-2023");
    expect(date).toBeFalsy();
  });

  it("should return null for an incorrect format (wrong number of digits)", () => {
    const date = parseMMDDYYYY("1/2/2023");
    expect(date).toBeFalsy();
  });

  it("should return null for an incorrect format", () => {
    const date = parseMMDDYYYY("12/25/2023abc");
    expect(date).toBeFalsy();
  });

  it("should correctly parse a valid future date", () => {
    const futureDate = parseMMDDYYYY("07/15/2050");
    expect(futureDate).toBeInstanceOf(Date);
    expect(futureDate?.getFullYear()).toBe(2050);
    expect(futureDate?.getMonth()).toBe(6);
    expect(futureDate?.getDate()).toBe(15);
  });

  it("should return null for day or month being zero", () => {
    expect(parseMMDDYYYY("00/10/2023")).toBeFalsy();
    expect(parseMMDDYYYY("10/00/2023")).toBeFalsy();
  });
});
