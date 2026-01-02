// eslint-disable-file jest/no-export
import { act, render } from "@testing-library/react";
import { ReactElement } from "react";
import { axe } from "jest-axe";

export const testA11y = (
  component: ReactElement<any, string>,
  beforeCallback?: any,
  afterCallback?: any
) => {
  describe("Accessibility", () => {
    beforeEach(() => {
      if (beforeCallback) {
        beforeCallback();
      }
    });

    afterEach(() => {
      if (afterCallback) {
        afterCallback();
      }
    });

    test("should not have basic accessibility issues", async () => {
      const { container } = render(component);
      const results = await axe(container, {
        runOnly: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
          "best-practice",
        ],
      });
      expect(results).toHaveNoViolations();
    }, 10000);
  });
};

export const testA11yAct = (
  component: ReactElement<any, string>,
  beforeCallback?: any,
  afterCallback?: any
) => {
  describe("AccessibilityAct", () => {
    beforeEach(() => {
      if (beforeCallback) {
        beforeCallback();
      }
    });

    afterEach(() => {
      if (afterCallback) {
        afterCallback();
      }
    });

    test("should not have basic accessibility issues", async () => {
      await act(async () => {
        const { container } = render(component);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });
};
