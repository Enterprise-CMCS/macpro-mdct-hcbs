import { describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "@chakra-ui/react";
import { convertBreakpoints, makeMediaQueryClasses } from "./useBreakpoint";

vi.mock("@chakra-ui/react", () => ({
  useMediaQuery: vi.fn((array: boolean[]): boolean[] => array),
  useTheme: () => ({
    breakpoints: {
      sm: "35em",
      md: "55em",
      lg: "75em",
      xl: "100em",
    },
  }),
}));
const mockedUseMQ = vi.mocked(useMediaQuery);

describe("utils/useBreakpoint", () => {
  describe("convertBreakpoints()", () => {
    it("should convert breakpoints from em to px correctly", () => {
      const pxBreaks = convertBreakpoints();
      expect(pxBreaks).toEqual({
        sm: 560,
        md: 880,
        lg: 1200,
        xl: 1600,
      });
    });
  });

  describe("makeMediaQueryClasses()", () => {
    it("should calculate mobile media query class correctly ", () => {
      // return value if window.innerWidth <=35em|560px
      mockedUseMQ.mockImplementation((): any => [true, false, false, false]);
      const mqClasses = makeMediaQueryClasses();
      expect(mqClasses).toEqual("mobile");
    });

    it("should calculate tablet media query class correctly ", () => {
      // return value if window.innerWidth >35em|560px && <=55em|880px
      mockedUseMQ.mockImplementation((): any => [false, true, false, false]);
      const mqClasses = makeMediaQueryClasses();
      expect(mqClasses).toEqual("tablet");
    });

    it("should calculate desktop media query class correctly ", () => {
      // return value if window.innerWidth >55em|880px
      mockedUseMQ.mockImplementation((): any => [false, false, true, false]);
      const mqClasses = makeMediaQueryClasses();
      expect(mqClasses).toEqual("desktop");
    });

    it("should calculate ultrawide media query class correctly ", () => {
      // return value if window.innerWidth >100em|1600px
      mockedUseMQ.mockImplementation((): any => [false, false, true, true]);
      const mqClasses = makeMediaQueryClasses();
      expect(mqClasses).toEqual("desktop ultrawide");
    });
  });
});
