import { act, render, screen } from "@testing-library/react";
import { Fields } from "./Fields";
import userEvent from "@testing-library/user-event";
import {
  ElementType,
  LengthOfStayField,
  LengthOfStayRateTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";

const mockedPerformanceElement: LengthOfStayRateTemplate = {
  id: "mock-perf-id",
  type: ElementType.LengthOfStayRate,
  required: true,
  labels: {
    performanceTarget: `What is the 2028 state performance target?`,
    actualCount: "Count of Successful Discharges to the Community",
    denominator: "Facility Admission Count",
    expectedCount: "Expected Count of Successful Discharges to the Community",
    populationRate: "Multi-Plan Population Rate",
    actualRate:
      "Observed Performance Rate for Minimizing Length of Facility Stay",
    expectedRate:
      "Expected Performance Rate for Minimizing Length of Facility Stay",
    adjustedRate: "Risk Adjusted Rate for Minimizing Length of Facility Stay",
  },
};
const updateSpy = jest.fn();

const LengthOfStayWrapper = ({
  template,
}: {
  template: LengthOfStayRateTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <Fields element={element} updateElement={onChange} />;
};

describe("<Fields />", () => {
  describe("Test Fields component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const labels = mockedPerformanceElement.labels;
    const getInput = (fieldId: LengthOfStayField) => {
      return screen.getByRole("textbox", { name: labels[fieldId] });
    };

    const getInputWithOptionalField = (fieldId: LengthOfStayField) => {
      return screen.getByText((content) => content.startsWith(labels[fieldId]));
    };
    test("Fields are visible, and disabled appropriately", async () => {
      render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

      expect(
        getInputWithOptionalField("populationRate" as LengthOfStayField)
      ).toBeInTheDocument();

      const otherFieldIds = Object.keys(labels).filter(
        (fieldId) => fieldId !== "populationRate"
      );
      for (const fieldId of otherFieldIds) {
        expect(getInput(fieldId as LengthOfStayField)).toBeInTheDocument();
      }

      for (const editableFieldId of [
        "performanceTarget",
        "actualCount",
        "denominator",
        "expectedCount",
        "adjustedRate",
      ] as const) {
        expect(getInput(editableFieldId)).not.toBeDisabled();
      }

      expect(
        getInputWithOptionalField("populationRate" as LengthOfStayField)
      ).not.toBeDisabled();

      for (const autoCalcFieldId of ["actualRate", "expectedRate"] as const) {
        expect(getInput(autoCalcFieldId)).toBeDisabled();
      }
    });

    test("Fields should auto-calculate", async () => {
      const enterValue = async (fieldId: LengthOfStayField, value: string) => {
        await act(() => userEvent.type(getInput(fieldId), value));
      };

      render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

      await enterValue("actualCount", "1");
      await enterValue("denominator", "2");
      await enterValue("expectedCount", "1");
      await enterValue("adjustedRate", "2");

      expect(getInput("actualRate")).toHaveValue("0.5");
      expect(getInput("expectedRate")).toHaveValue("0.5");
    });
  });

  testA11y(<LengthOfStayWrapper template={mockedPerformanceElement} />);
});
