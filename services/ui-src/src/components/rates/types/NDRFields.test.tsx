import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElementType, NdrFieldsTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { NDRFields } from "./NDRFields";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

const mockElementTemplate: NdrFieldsTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrFields,
  labelTemplate:
    "What is the 2028 state performance target for this assessment for {{field}} ({{assessment}})?",
  assessments: [
    { id: "year-1", label: "18 to 64 Years" },
    { id: "year-2", label: "65 to 74 Years" },
    { id: "year-3", label: "75 to 84 Years" },
    { id: "year-4", label: "85 years or older" },
  ],
  fields: [
    { id: "short-term", label: "Short Term Stay" },
    { id: "med-term", label: "Medium Term Stay" },
    { id: "long-term", label: "Long Term Stay" },
  ],
  multiplier: 1000,
  required: true,
};
const updateSpy = jest.fn();

const NdrFieldsWrapper = ({ template }: { template: NdrFieldsTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <NDRFields element={element} updateElement={onChange} />;
};

describe("<NDRFields />", () => {
  describe("Test NDRFields component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("NDRFields is visible", () => {
      render(<NdrFieldsWrapper template={mockElementTemplate} />);
      const { assessments, fields } = mockElementTemplate;

      assessments?.forEach((assess) => {
        expect(
          screen.getAllByRole("textbox", {
            name: `Denominator (${assess.label})`,
          })
        ).toHaveLength(4);
        fields?.forEach((field) => {
          expect(
            screen.getByRole("textbox", {
              name: `What is the 2028 state performance target for this assessment for ${field.label.toLowerCase()} (${
                assess.label
              })?`,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("textbox", {
              name: `Numerator: ${field.label} (${assess.label})`,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("textbox", {
              name: `${field.label} Rate (${assess.label})`,
            })
          ).toBeInTheDocument();
        });
      });
    });

    test("Rate should calculate", async () => {
      render(<NdrFieldsWrapper template={mockElementTemplate} />);
      const { assessments, fields } = mockElementTemplate;

      if (assessments && assessments.length > 0) {
        const denom = screen.getAllByRole("textbox", {
          name: `Denominator (${assessments[0].label})`,
        })[0];
        await act(async () => await userEvent.type(denom, "1"));
        expect(denom).toHaveValue("1");

        const num = screen.getByRole("textbox", {
          name: `Numerator: ${fields?.[0].label} (${assessments[0].label})`,
        });
        await act(async () => await userEvent.type(num, "1"));
        expect(num).toHaveValue("1");

        const rate = screen.getByRole("textbox", {
          name: `${fields?.[0].label} Rate (${assessments[0].label})`,
        });
        expect(rate).toHaveValue("1000");
      }
    });

    test("Error should show if the denominator is 0", async () => {
      render(<NdrFieldsWrapper template={mockElementTemplate} />);
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
    render(<NdrFieldsWrapper template={mockElementTemplate} />);
    const { assessments, fields } = mockElementTemplate;

    if (assessments && assessments.length > 0) {
      const denom = screen.getAllByRole("textbox", {
        name: `Denominator (${assessments[0].label})`,
      })[0];
      await act(async () => await userEvent.type(denom, "0"));
      expect(denom).toHaveValue("0");

      const num = screen.getByRole("textbox", {
        name: `Numerator: ${fields?.[0].label} (${assessments[0].label})`,
      });
      await act(async () => await userEvent.type(num, "0"));
      expect(num).toHaveValue("0");

      const rate = screen.getByRole("textbox", {
        name: `${fields?.[0].label} Rate (${assessments[0].label})`,
      });
      expect(rate).toHaveValue("0.00");
    }
  });

  testA11y(<NdrFieldsWrapper template={mockElementTemplate} />);
});
