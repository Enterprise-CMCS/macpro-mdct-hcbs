import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { PerformanceRateElement } from "components";
import { mockStateUserStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, PerformanceRateTemplate, PerformanceRateType } from "types/report";

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

const mockedPerformanceRateElement = {
  type: ElementType.PerformanceRate,
  label: "test label",
  helperText: "helper text",
  assessments: [{ id: "test-1", label: "assessment 1" }],
  rateType: PerformanceRateType.NDR,
  multiplier: 1,
} as PerformanceRateTemplate;

const performanceRateComponent = (
  <PerformanceRateElement element={mockedPerformanceRateElement} index={0} formkey="elements.0" />
);

describe("<PerformanceRateElement />", () => {
  describe("Test PerformanceRateElement component", () => {
    test("PerformanceRateElement is visible", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(performanceRateComponent);
      const textField = screen.getByRole("textbox");
      expect(textField).toBeVisible();
      jest.clearAllMocks();
    });

    test("TextField should send updates to the Form", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues("");
      render(performanceRateComponent);

      screen.debug();
    });
  });

  testA11y(
    performanceRateComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
