import {
  calculateNextQuarter,
  calculateRemainingSeconds,
  checkDateCompleteness,
  checkDateRangeStatus,
  convertDateEtToUtc,
  convertDateTimeEtToUtc,
  convertDatetimeStringToNumber,
  convertDateUtcToEt,
  formatMonthDayYear,
  getLocalHourMinuteTime,
  twoDigitCalendarDate,
} from "./time";

// 1/1/2022 @ 00:00:00
const testDate = {
  utcMS: 1641013200000,
  utcString: "Sat, 01 Jan 2022 05:00:00 GMT",
  etFormattedString: "01/01/2022",
};

const getLocalHourMinuteTimeRegex = /[0-2]?[0-9]:[0-5][0-9](a|p)m/;

describe("utils/time", () => {
  describe("getLocalHourMinuteTime()", () => {
    test("returns correct hourminute format", () => {
      const localHourMinuteTime = getLocalHourMinuteTime();
      expect(localHourMinuteTime).toMatch(getLocalHourMinuteTimeRegex);
    });
  });

  describe("convertDateTimeEtToUtc()", () => {
    test("Valid ET datetime converts to UTC correctly", () => {
      const result = convertDateTimeEtToUtc(
        { year: 2022, month: 1, day: 1 },
        { hour: 0, minute: 0, second: 0 }
      );
      expect(result).toBe(testDate.utcMS);
      expect(new Date(result).toUTCString()).toBe(testDate.utcString);
    });
  });

  describe("convertDateEtToUtc()", () => {
    test("Valid ET datetime converts to UTC correctly", () => {
      const result = convertDateEtToUtc(testDate.etFormattedString);
      expect(result).toBe(testDate.utcMS);
      expect(new Date(result).toUTCString()).toBe(testDate.utcString);
    });
  });

  describe("convertDateUtcToEt()", () => {
    test("Valid UTC datetime converts to ET correctly", () => {
      const result = convertDateUtcToEt(testDate.utcMS);
      expect(result).toBe(testDate.etFormattedString);
    });
  });

  describe("checkDateRangeStatus()", () => {
    const currentTime = Date.now(); // 'current' time in ms since unix epoch
    const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
    const twoDays = oneDay * 2;

    test("returns false if startDate is in the future", () => {
      const startDate = currentTime + oneDay;
      const endDate = currentTime + twoDays;
      const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
      expect(dateRangeStatus).toBeFalsy();
    });

    test("returns false if endDate is in the past", () => {
      const startDate = currentTime - twoDays;
      const endDate = currentTime - oneDay;
      const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
      expect(dateRangeStatus).toBeFalsy();
    });

    test("returns true if startDate is in the past and endDate is in the future", () => {
      const startDate = currentTime - oneDay;
      const endDate = currentTime + oneDay;
      const dateRangeStatus = checkDateRangeStatus(startDate, endDate);
      expect(dateRangeStatus).toBeTruthy();
    });
  });

  describe("twoDigitCalendarDate()", () => {
    test("should set 1 to 01", () => {
      const startDay = 1;
      expect(twoDigitCalendarDate(startDay)).toBe("01");
    });

    test("should set 12 to 12", () => {
      const startMonth = 12;
      expect(twoDigitCalendarDate(startMonth)).toBe("12");
    });
  });

  describe("formatMonthDayYear()", () => {
    it("Should render dates as MM/dd/yyyy", () => {
      const date = new Date("2024-03-20").valueOf();
      const formatted = formatMonthDayYear(date);
      // Imprecise matcher, because the result depends on the user's time zone
      expect(formatted).toMatch(/03\/\d\d\/2024/);
    });
  });

  describe("checkDateCompleteness()", () => {
    test("that it returns an object of { year, month, day }", () => {
      expect(checkDateCompleteness("10/22/2024")).toEqual({
        year: 2024,
        month: 10,
        day: 22,
      });
    });
    test("incorrect date returns null", () => {
      expect(checkDateCompleteness("10/22/24")).toBeNull();
    });
    test("not a date returns null", () => {
      expect(checkDateCompleteness("banana")).toBeNull();
    });
    test("empty string returns null", () => {
      expect(checkDateCompleteness("")).toBeNull();
    });
  });

  describe("convertDatetimeStringToNumber()", () => {
    it("should return the correct epoch for midnight", () => {
      const result = convertDatetimeStringToNumber("10/22/2024", {
        hour: 0,
        minute: 0,
        second: 0,
      });
      expect(result).toBe(1729569600000);
    });

    it("should return the correct epoch for one second before midnight", () => {
      const result = convertDatetimeStringToNumber("10/22/2024", {
        hour: 23,
        minute: 59,
        second: 59,
      });
      expect(result).toBe(1729655999000);
    });
  });

  describe("calculateTimeLeft()", () => {
    test("returns 0 when no value is given", () => {
      expect(calculateRemainingSeconds()).toBeCloseTo(0);
    });

    test("expiration time greater than zero", () => {
      const expirationTime = "2050-11-18T12:53:11-05:00";
      expect(calculateRemainingSeconds(expirationTime)).toBeGreaterThan(0);
    });
  });

  describe("calculateNextQuarter()", () => {
    test("returns same year and next period", () => {
      const previousQuarter = "2027 Q1";
      expect(calculateNextQuarter(previousQuarter)).toBe("2027 Q2");
    });
    test("returns next year and next period", () => {
      const previousQuarter = "2027 Q4";
      expect(calculateNextQuarter(previousQuarter)).toBe("2028 Q1");
    });
    test("returns empty string when nothing is passed in", () => {
      expect(calculateNextQuarter("")).toBe("");
    });
  });
});
