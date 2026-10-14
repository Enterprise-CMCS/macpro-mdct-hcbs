import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElementType, MultiCategoryNdrTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { MultiCategoryNdr } from "./MultiCategoryNdr";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

const mockElementTemplate: MultiCategoryNdrTemplate = {
  id: "mock-perf-id",
  type: ElementType.MultiCategoryNdr,
  assessments: [
    { id: "year-1", label: "18 to 64 Years" },
    { id: "year-2", label: "65 to 74 Years" },
    { id: "year-3", label: "75 to 84 Years" },
    { id: "year-4", label: "85 years or older" },
  ],
  categories: [
    { id: "short-term", label: "Short Term Stay" },
    { id: "med-term", label: "Medium Term Stay" },
    { id: "long-term", label: "Long Term Stay" },
  ],
  multiplier: 1000,
  required: true,
};
const updateSpy = vi.fn();

const MultiCategoryNdrWrapper = ({
  template,
}: {
  template: MultiCategoryNdrTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <MultiCategoryNdr element={element} updateElement={onChange} />;
};

describe("<MultiCategoryNdr />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
    const { assessments, categories } = mockElementTemplate;

    for (const assess of assessments) {
      expect(
        screen.getAllByRole("textbox", {
          name: `Denominator (${assess.label})`,
        })
      ).toHaveLength(4);
      for (const category of categories) {
        expect(
          screen.getByRole("textbox", {
            name: `Numerator: ${category.label} (${assess.label})`,
          })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("textbox", {
            name: `${category.label} Rate (${assess.label})`,
          })
        ).toBeInTheDocument();
      }
    }
  });

  it("should auto-calculate rates", async () => {
    render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
    const { assessments, categories } = mockElementTemplate;

    const denom = screen.getAllByRole("textbox", {
      name: `Denominator (${assessments[0].label})`,
    })[0];
    await act(async () => await userEvent.type(denom, "1"));
    expect(denom).toHaveValue("1");

    const num = screen.getByRole("textbox", {
      name: `Numerator: ${categories?.[0].label} (${assessments[0].label})`,
    });
    await act(async () => await userEvent.type(num, "1"));
    expect(num).toHaveValue("1");

    const rate = screen.getByRole("textbox", {
      name: `${categories?.[0].label} Rate (${assessments[0].label})`,
    });
    expect(rate).toHaveValue("1000");
  });

  it("should render hints for assessments", () => {
    const template: MultiCategoryNdrTemplate = {
      ...mockElementTemplate,
      assessments: [
        {
          id: "year-1",
          label: "18 to 64 Years",
          hints: {
            hintNumerator: "Numerator hint",
            hintDenominator: "Denominator hint",
            hintRate: "Rate hint",
          },
        },
      ],
    };
    render(<MultiCategoryNdrWrapper template={template} />);

    const categoryCount = template.categories.length;
    expect(screen.getByText("Denominator hint")).toBeVisible();
    expect(screen.getAllByText("Numerator hint")).toHaveLength(categoryCount);
    expect(screen.getAllByText("Rate hint")).toHaveLength(categoryCount);
  });

  it("should prioritize hints from categories over assessment hints", () => {
    const template: MultiCategoryNdrTemplate = {
      ...mockElementTemplate,
      assessments: [
        {
          id: "year-1",
          label: "18 to 64 Years",
          hints: { hintRate: "Assessment rate hint" },
        },
      ],
      categories: [
        {
          id: "short-term",
          label: "Short Term Stay",
          hintRate: "Category rate hint",
        },
      ],
    };
    render(<MultiCategoryNdrWrapper template={template} />);

    expect(screen.getByText("Category rate hint")).toBeVisible();
    expect(screen.queryByText("Assessment rate hint")).not.toBeInTheDocument();
  });

  it("should prioritize categoryHints over assessment hints", () => {
    const template: MultiCategoryNdrTemplate = {
      ...mockElementTemplate,
      assessments: [
        {
          id: "year-1",
          label: "18 to 64 Years",
          hints: {
            hintNumerator: "Assessment numerator",
            hintDenominator: "Assessment denominator",
            hintRate: "Assessment rate",
          },
          categoryHints: [
            {
              categoryId: "short-term",
              hintNumerator: "Short numerator",
              hintDenominator: "Short denominator",
              hintRate: "Short rate",
            },
          ],
        },
      ],
      categories: [{ id: "short-term", label: "Short Term Stay" }],
    };
    render(<MultiCategoryNdrWrapper template={template} />);

    expect(screen.getByText("Short numerator")).toBeVisible();
    expect(screen.getByText("Short denominator")).toBeVisible();
    expect(screen.getByText("Short rate")).toBeVisible();
    // Assessment-level numerator/rate fall back shows if the category does not
    // override them, so they should not appear.
    expect(screen.queryByText("Assessment numerator")).not.toBeInTheDocument();
    expect(screen.queryByText("Assessment rate")).not.toBeInTheDocument();
    expect(screen.getByText("Assessment denominator")).toBeVisible();
  });

  it("should show an error if the denominator is 0", async () => {
    render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
    const { assessments } = mockElementTemplate;

    const denom = screen.getAllByRole("textbox", {
      name: `Denominator (${assessments[0].label})`,
    })[0];
    await act(async () => await userEvent.type(denom, "0"));
    expect(denom).toHaveValue("0");

    const errors = screen.queryAllByText(ErrorMessages.denominatorZero());
    expect(errors[0]).toBeVisible();
    expect(errors.length).toBe(3);

    await act(async () => await userEvent.type(denom, "4"));
    expect(
      screen.queryByText(ErrorMessages.denominatorZero())
    ).not.toBeInTheDocument();
  });

  it("should set Rate to 0 if both numerator and denominator are 0", async () => {
    render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
    const { assessments, categories } = mockElementTemplate;

    const denom = screen.getAllByRole("textbox", {
      name: `Denominator (${assessments[0].label})`,
    })[0];
    await act(async () => await userEvent.type(denom, "0"));
    expect(denom).toHaveValue("0");

    const num = screen.getByRole("textbox", {
      name: `Numerator: ${categories?.[0].label} (${assessments[0].label})`,
    });
    await act(async () => await userEvent.type(num, "0"));
    expect(num).toHaveValue("0");

    const rate = screen.getByRole("textbox", {
      name: `${categories?.[0].label} Rate (${assessments[0].label})`,
    });
    expect(rate).toHaveValue("0.00");
  });

  testA11y(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
});
