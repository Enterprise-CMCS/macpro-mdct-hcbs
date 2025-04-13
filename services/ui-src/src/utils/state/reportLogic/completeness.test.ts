import { ElementType, PageStatus } from "types";
import { elementSatisfiesRequired, pageIsCompletable } from "./completeness";

describe("pageIsCompletable", () => {
  test("handles empty conditions", () => {
    const missingPageReport = {
      pages: [],
    } as any;
    expect(pageIsCompletable(missingPageReport, "my-id")).toBeFalsy();

    const noElementsOnPage = {
      pages: [{ id: "my-id" }],
    } as any;
    expect(pageIsCompletable(noElementsOnPage, "my-id")).toBeTruthy();
  });

  test("false when incomplete element", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "bad-question",
              type: ElementType.Radio,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as any;
    expect(pageIsCompletable(report, "my-id")).toBeFalsy();
  });

  test("false when dependent page is incomplete", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "delivery-method-radio",
              type: ElementType.Radio,
              answer: "FFS",
              required: true,
              value: [{ value: "FFS" }],
            },
          ],
          children: [
            {
              key: "FFS",
              template: "FFS-1",
            },
          ],
        },
        {
          id: "FFS-1",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "a-text",
              type: ElementType.TextAreaField,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as any;
    expect(pageIsCompletable(report, "my-id")).toBeFalsy();
  });

  test("succeeds when complete element", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "good-question",
              type: ElementType.Textbox,
              answer: "WOW",
              required: true,
            },
          ],
        },
      ],
    } as any;
    expect(pageIsCompletable(report, "my-id")).toBeTruthy();
  });
});

describe("elementSatisfiesRequired", () => {
  test("returns true when hidden or not required", () => {
    const hiddenElement = {
      id: "other-element",
      answer: "foo",
      type: ElementType.Textbox,
      required: true,
    } as any;
    const notRequired = {
      id: "not-element",
      answer: "foo",
      type: ElementType.Textbox,
    } as any;
    const elements = [
      { id: "other-element", answer: "foo", type: ElementType.Textbox },
      hiddenElement,
      notRequired,
    ] as any;
    expect(elementSatisfiesRequired(hiddenElement, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(notRequired, elements)).toBeTruthy();
  });
});
