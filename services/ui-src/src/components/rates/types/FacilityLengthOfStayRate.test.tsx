import { render, screen } from "@testing-library/react";
import { FacilityLengthOfStayRate } from "./FacilityLengthOfStayRate";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { useStore } from "utils";
import { ElementType, FacilityLengthOfStayRateTemplate } from "types";
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
mockedUseStore.mockReturnValue({ report: { year: 2026 } });

const mockedPerformanceElement: FacilityLengthOfStayRateTemplate = {
  id: "mock-element-id",
  type: ElementType.FacilityLengthOfStayRate,
  helperText: "helper text",
};

const fieldsComponent = (
  <FacilityLengthOfStayRate
    formkey={"mock-key"}
    element={mockedPerformanceElement}
  />
);

const fieldLabels = {
  performanceTarget:
    "What is the 2026 state performance target for this assessment?",
  actualTransitions: "Count of Successful Discharges to the Community",
  stayCount: "Facility Admission Count",
  expectedTransitions:
    "Expected Count of Successful Discharges to the Community",
  populationRate: "Multi-Plan Population Rate",
  actualRate:
    "Observed Performance Rate for the Minimizing Length of Facility Stay",
  expectedRate:
    "Expected Performance Rate for the Minimizing Length of Facility Stay",
  riskAdjustedRate:
    "Risk Adjusted Rate for the Minimizing Length of Facility Stay",
};

describe("<Fields />", () => {
  describe("Test Fields component", () => {
    beforeEach(() => {
      render(fieldsComponent);
    });

    test("Fields are visible and enabled/disabled appropriately", () => {
      const autoCalculatedLabels = [
        fieldLabels.actualRate,
        fieldLabels.expectedRate,
        fieldLabels.riskAdjustedRate,
      ];
      for (let label of Object.values(fieldLabels)) {
        const element = screen.getByRole("textbox", { name: label });
        expect(element).toBeInTheDocument();

        if (autoCalculatedLabels.includes(label)) {
          expect(element).toBeDisabled();
        } else {
          expect(element).not.toBeDisabled();
        }
      }
    });

    test("Fields should auto-calculate", async () => {
      const fields = Object.fromEntries(
        Object.entries(fieldLabels).map(([id, label]) => [
          id,
          screen.getByRole("textbox", { name: label }),
        ])
      ) as Record<keyof typeof fieldLabels, HTMLElement>;

      await userEvent.type(fields.actualTransitions, "2");
      await userEvent.type(fields.stayCount, "7");
      await userEvent.type(fields.expectedTransitions, "3");
      await userEvent.type(fields.populationRate, "2");

      expect(fields.actualRate).toHaveValue("0.29");
      expect(fields.expectedRate).toHaveValue("0.43");
      expect(fields.riskAdjustedRate).toHaveValue("1.33");
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
