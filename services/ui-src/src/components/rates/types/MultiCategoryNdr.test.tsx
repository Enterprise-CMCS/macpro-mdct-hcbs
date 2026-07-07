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
    { id: "short-term", label: "Short Term Stay", hintRate: "Rate hint text" },
    { id: "med-term", label: "Medium Term Stay" },
    { id: "long-term", label: "Long Term Stay" },
  ],
  multiplier: 1000,
  hint: "Denominator hint text",
  hintNumerator: "Numerator hint text",
  required: true,
};
const updateSpy = jest.fn();

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
  describe("Test MultiCategoryNdr component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("MultiCategoryNdr is visible", () => {
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

    test("MultiCategoryNdr hints are visible", () => {
      render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);

      expect(
        screen.getAllByText("Denominator hint text").length
      ).toBeGreaterThan(0);
      expect(screen.getAllByText("Numerator hint text").length).toBeGreaterThan(
        0
      );
      expect(screen.getAllByText("Rate hint text").length).toBeGreaterThan(0);
    });

    test("Rate should calculate", async () => {
      render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
      const { assessments, categories } = mockElementTemplate;

      if (assessments && assessments.length > 0) {
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
      }
    });

    test("Error should show if the denominator is 0", async () => {
      render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
      const { assessments } = mockElementTemplate;

      if (assessments && assessments.length > 0) {
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
      }
    });
  });

  test("Rate should be 0 if both numerator and denominator are 0", async () => {
    render(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
    const { assessments, categories } = mockElementTemplate;

    if (assessments && assessments.length > 0) {
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
    }
  });

  testA11y(<MultiCategoryNdrWrapper template={mockElementTemplate} />);
});
