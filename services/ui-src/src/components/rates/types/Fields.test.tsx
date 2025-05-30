import { render, screen } from "@testing-library/react";
import { Fields } from "./Fields";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { useStore } from "utils";
import {
  ElementType,
  LengthOfStayField,
  LengthOfStayRateTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { mockStateUserStore } from "utils/testing/setupJest";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: jest.fn(),
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
  get: jest.fn(),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
  }));
jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockedPerformanceElement: LengthOfStayRateTemplate = {
  id: "mock-perf-id",
  type: ElementType.LengthOfStayRate,
  labels: {
    performanceTarget: `What is the 2028 state performance target for this assessment?`,
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

const fieldsComponent = (
  <Fields
    formkey={"mock-key"}
    disabled={false}
    element={mockedPerformanceElement}
  />
);

describe("<Fields />", () => {
  describe("Test Fields component", () => {
    beforeEach(() => {
      render(fieldsComponent);
    });

    const labels = mockedPerformanceElement.labels;
    const getInput = (fieldId: LengthOfStayField) => {
      return screen.getByRole("textbox", { name: labels[fieldId] });
    };

    test("Fields are visible, and disabled appropriately", () => {
      for (let fieldId of Object.keys(labels)) {
        expect(getInput(fieldId as LengthOfStayField)).toBeInTheDocument();
      }

      for (let editableFieldId of [
        "performanceTarget",
        "actualCount",
        "denominator",
        "expectedCount",
        "populationRate",
      ] as const) {
        expect(getInput(editableFieldId)).not.toBeDisabled();
      }

      for (let autoCalcFieldId of [
        "actualRate",
        "expectedRate",
        "adjustedRate",
      ] as const) {
        expect(getInput(autoCalcFieldId)).toBeDisabled();
      }
    });

    test("Fields should auto-calculate", async () => {
      const enterValue = async (fieldId: LengthOfStayField, value: string) => {
        await userEvent.type(getInput(fieldId), value);
      };

      await enterValue("actualCount", "1");
      await enterValue("denominator", "2");
      await enterValue("expectedCount", "1");
      await enterValue("populationRate", "2");

      expect(getInput("actualRate")).toHaveValue("0.5");
      expect(getInput("expectedRate")).toHaveValue("0.5");
      expect(getInput("adjustedRate")).toHaveValue("2");
    });
  });

  testA11y(
    fieldsComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
