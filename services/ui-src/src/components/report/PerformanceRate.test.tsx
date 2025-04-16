import { render, screen } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import { PerformanceRateElement } from "components";
import { mockStateUserStore, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  PerformanceRateTemplate,
  PerformanceRateType,
} from "types/report";

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
  <PerformanceRateElement
    element={mockedPerformanceRateElement}
    index={0}
    formkey="elements.0"
  />
);

describe("<PerformanceRateElement />", () => {
  describe("Test PerformanceRateElement component", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockUseStore);
      mockGetValues("");
      render(performanceRateComponent);
    });
    test("PerformanceRateElement is visible", () => {
      expect(
        screen.getByRole("textbox", {
          name: "What is the 2028 state performance target for this assessment?",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeInTheDocument();
    });

    afterEach(() => {
      jest.clearAllMocks();
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
