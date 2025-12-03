import {
  isEmail,
  isUrl,
  makeEmptyStringCopyOf,
  validateDate,
  validateNumber,
} from "./inputValidation";

describe("Input validation utilities", () => {
  describe("makeEmptyStringCopyOf()", () => {
    it("should deeply clone objects, preserving non-string properties", () => {
      const original = {
        groups: [
          {
            items: [
              {
                id: 42,
                interesting: false,
                properties: null,
              },
            ],
          },
        ],
      };

      const clone = makeEmptyStringCopyOf(original);

      // Structural equality, but not reference equality
      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);

      // Changing one does not affect the other
      clone.groups.push({ items: [] });
      expect(clone.groups.length).toBe(2);
      expect(original.groups.length).toBe(1);

      // Regardless of how deep the change is
      clone.groups[0].items[0].id = 77;
      expect(original.groups[0].items[0].id).toBe(42);
    });

    it("should erase strings at any level within the object", () => {
      const object = {
        denominator: "44",
        rates: [
          {
            numerator: "33",
            rate: "0.75",
          },
        ],
      };

      const copy = makeEmptyStringCopyOf(object);
      expect(copy).toEqual({
        denominator: "",
        rates: [
          {
            numerator: "",
            rate: "",
          },
        ],
      });
    });
  });

  describe("validateDate()", () => {
    it("should reject empty values for required fields", () => {
      const result = validateDate("", "", true);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("A response is required");
    });

    it("should allow empty values for optional fields", () => {
      const result = validateDate("", "", false);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("");
    });

    it("should reject incomplete dates for required fields", () => {
      const result = validateDate("1234", "12/34", true);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(
        "Response must be a date in MMDDYYYY format"
      );
    });

    it("should reject incomplete dates for optional fields", () => {
      const result = validateDate("1234", "12/34", false);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(
        "If provided, response must be a date in MMDDYYYY format"
      );
    });

    it("should reject invalid dates for required fields", () => {
      const result = validateDate("99999999", "99/99/9999", true);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(
        "Response must be a date in MMDDYYYY format"
      );
    });

    it("should reject invalid dates for optional fields", () => {
      const result = validateDate("99999999", "99/99/9999", false);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe(
        "If provided, response must be a date in MMDDYYYY format"
      );
    });

    it("should allow valid dates", () => {
      const result = validateDate("07292025", "07/29/2025", true);
      expect(result.parsedValue).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe("");
    });
  });

  describe("validateNumber()", () => {
    it("should reject empty values for required fields", () => {
      const result = validateNumber("", true);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("A response is required");
    });

    it("should allow empty values for optional fields", () => {
      const result = validateNumber("", false);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("");
    });

    it("should reject invalid numbers for required fields", () => {
      const result = validateNumber("texas", true);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("Response must be a number");
    });

    it("should reject invalid numbers for optional fields", () => {
      const result = validateNumber("texas", false);
      expect(result.parsedValue).toBeUndefined();
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe("Response must be a number");
    });

    it("should allow valid numbers", () => {
      const result = validateNumber("12.34", false);
      expect(result.parsedValue).toBe(12.34);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe("");
    });
  });

  describe("isUrl()", () => {
    it("should reject undefined", () => {
      expect(isUrl(undefined)).toBe(false);
    });

    it("should reject the empty string", () => {
      expect(isUrl("")).toBe(false);
    });

    it.each([
      { input: "hello" },
      { input: "www.cms.gov" },
      { input: "javascript:void(0)" },
      { input: "ftp://www.example.com" },
    ])("should reject the string '$input'", ({ input }) => {
      expect(isUrl(input)).toBe(false);
    });

    it.each([
      { input: "https://www.cms.gov" },
      { input: "http://www.cms.gov" },
    ])("should accept the string '$input'", ({ input }) => {
      expect(isUrl(input)).toBe(true);
    });
  });

  describe("isEmail()", () => {
    it("should reject undefined", () => {
      expect(isEmail(undefined)).toBe(false);
    });

    it("should reject the empty string", () => {
      expect(isEmail("")).toBe(false);
    });

    it.each([
      { input: "hello" },
      { input: "www.cms.gov" },
      { input: "javascript:void(0)" },
      { input: "https://www.cms.gov" },
      { input: "@" },
    ])("should reject the string '$input'", ({ input }) => {
      expect(isEmail(input)).toBe(false);
    });

    it.each([
      { input: "hello@world.com" },
      { input: "name+folder@gmail.com" },
      { input: "totally-plausible/email.3@test.coforma.io" },
    ])("should accept the string '$input'", ({ input }) => {
      expect(isEmail(input)).toBe(true);
    });
  });
});
