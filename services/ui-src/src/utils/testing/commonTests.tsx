import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, render } from "@testing-library/react";
import { ReactElement } from "react";
import axe from "axe-core";

const config: axe.RunOptions = {
  runOnly: [
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ],
};

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

    it("should not have basic accessibility issues", async () => {
      const { container } = render(component);
      const results = await axe.run(container, config);
      expect(results.violations).toEqual([]);
    });
  });
};

export const testA11yAct = (
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

    it("should not have basic accessibility issues", async () => {
      await act(async () => {
        const { container } = render(component);
        const results = await axe.run(container, config);
        expect(results.violations).toEqual([]);
      });
    });
  });
};
