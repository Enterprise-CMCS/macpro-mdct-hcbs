import {
  parseNumber,
  roundRate,
  stringifyInput,
  stringifyResult,
} from "./calculations";

describe("Rate calculations", () => {
  describe("roundRate", () => {
    it.each([
      // Reject undefined
      { input: undefined, expected: undefined },
      // Preserve precision left of the decimal
      { input: 1234, expected: 1234 },
      { input: 123.4, expected: 123.4 },
      { input: 12.34, expected: 12.34 },
      // Round at the 2nd decimal place
      { input: 1.234, expected: 1.23 },
      { input: 0.1234, expected: 0.12 },
      // Round 5s towards positive infinity
      { input: -0.015, expected: -0.01 },
      { input: -0.005, expected: 0 },
      { input: 0.005, expected: 0.01 },
      { input: 0.015, expected: 0.02 },
    ])("should return $expected given $input", ({ input, expected }) => {
      expect(roundRate(input)).toBe(expected);
    });
  });

  describe("stringifyInput", () => {
    it.each([
      { input: undefined, expected: "" },
      { input: 1234, expected: "1234" },
      { input: 123.4, expected: "123.4" },
      { input: 12.34, expected: "12.34" },
      { input: 1.234, expected: "1.234" },
      { input: 0.1234, expected: "0.1234" },
      { input: -0.1, expected: "-0.1" },
    ])("should return $expected given $input", ({ input, expected }) => {
      expect(stringifyInput(input)).toBe(expected);
    });
  });

  describe("stringifyResult", () => {
    it.each([
      { input: undefined, expected: "" },
      { input: 0, expected: "0.00" },
      { input: 1234, expected: "1234" },
      { input: 123.4, expected: "123.4" },
      { input: 12.34, expected: "12.34" },
      { input: 1.234, expected: "1.234" },
      { input: 0.1234, expected: "0.1234" },
      { input: -0.1, expected: "-0.1" },
    ])("should return $expected given $input", ({ input, expected }) => {
      expect(stringifyResult(input)).toBe(expected);
    });
  });

  describe("parseNumber", () => {
    it.each([
      { input: "42", expected: 42 },
      { input: "12.", expected: 12 },
      { input: ".012", expected: 0.012 },
      { input: "12.5", expected: 12.5 },
      { input: "-77", expected: -77 },
      { input: "-.3", expected: -0.3 },
      { input: "0", expected: 0 },
      { input: " 123\n", expected: 123 }, // trim any whitespace from copy/paste
      { input: "-0", expected: 0 }, // even though 0 and -0 are different things
      { input: "", expected: undefined },
      { input: "    ", expected: undefined },
      { input: "-", expected: undefined },
      { input: ".", expected: undefined },
      { input: "-.", expected: undefined },
      { input: "1.2.3", expected: undefined },
      { input: "NaN", expected: undefined },
      { input: "1abc", expected: undefined }, // even though parseFloat("1abc") === 1
      { input: "Infinity", expected: undefined }, // even though isNaN(Infinity) === false
      { input: "1.5e2", expected: undefined }, // even though 1.5e2 === 150
      { input: "0xaf", expected: undefined }, // even though 0xaf === 175
      { input: "1_000", expected: undefined }, // even though 1_000 === 1000
    ])("should return $expected given '$input'", ({ input, expected }) => {
      expect(parseNumber(input)).toBe(expected);
    });
  });
});
