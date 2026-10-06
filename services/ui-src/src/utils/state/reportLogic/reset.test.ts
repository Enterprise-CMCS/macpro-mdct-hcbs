import { describe, expect, it } from "vitest";
import { ElementType, PerformanceNdrTemplate, RadioTemplate } from "types";
import { performResetPageElement } from "./reset";

describe("performResetPageElement", () => {
  it("clears a rate, nested sampling response, and all choice details", () => {
    const question: RadioTemplate = {
      id: "sampling-question",
      type: ElementType.Radio,
      label: "Sampling methodology",
      required: true,
      answer: "Probability sample",
      choices: ["Entire population", "Probability sample"].map((value) => ({
        label: value,
        value,
        checkedChildren: [
          {
            id: `${value}-details`,
            type: ElementType.TextAreaField,
            label: "Sampling details",
            required: true,
            answer: "Saved details",
          },
        ],
      })),
    };
    const rate: PerformanceNdrTemplate = {
      id: "homemaker-1-rate",
      type: ElementType.PerformanceNdr,
      required: true,
      answer: { numerator: 1, denominator: 2, rate: 50 },
      children: [
        {
          id: "sampling-header",
          type: ElementType.SubHeader,
          text: "State sampling methodology",
        },
        question,
      ],
    };

    performResetPageElement(rate);

    expect(rate.answer).toBeUndefined();
    expect(question.answer).toBeUndefined();
    for (const choice of question.choices) {
      expect(choice.checkedChildren![0]).toEqual(
        expect.objectContaining({ answer: undefined })
      );
    }
    expect(rate.children![0]).toEqual({
      id: "sampling-header",
      type: ElementType.SubHeader,
      text: "State sampling methodology",
    });
  });
});
