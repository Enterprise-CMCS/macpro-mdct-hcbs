import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDR } from "./NDR";
import { useFormContext } from "react-hook-form";
import { NDRCalc } from "../calculations";
import { useStore } from "utils";
import { ElementType, PerformanceRateTemplate } from "types";
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

const mockedPerformanceElement = {
  type: ElementType.PerformanceRate,
  label: "test label",
  helperText: "helper text",
  assessments: [{ id: "test-1", label: "assessment 1" }],
  multiplier: 1,
} as PerformanceRateTemplate;

const ndrComponent = (
  <NDR
    formkey={"mock-key"}
    calculation={NDRCalc}
    year={2026}
    {...mockedPerformanceElement}
  />
);

describe("<NDR />", () => {
  describe("Test NDR component", () => {
    beforeEach(() => {
      render(ndrComponent);
    });
    test("NDR is visible", () => {
      expect(
        screen.getByRole("textbox", {
          name: "What is the 2026 state performance target for this assessment?",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeDisabled();
    });
    test("Rate should calculate", async () => {
      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2"));
      expect(denominator).toHaveValue("2");

      const rate = screen.getByRole("textbox", { name: "Rate" });
      expect(rate).toHaveValue("50");
    });
  });

  testA11y(
    ndrComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
