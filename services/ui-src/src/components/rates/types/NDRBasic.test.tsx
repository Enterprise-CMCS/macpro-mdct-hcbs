import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDRBasic } from "./NDRBasic";
import { useFormContext } from "react-hook-form";
import { useStore } from "utils";
import { ElementType, NdrBasicTemplate } from "types";
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

const mockedElement: NdrBasicTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrBasic,
  label: "test label",
  multiplier: 100,
};

const ndrBasicComponent = (
  <NDRBasic formkey={"mock-key"} disabled={false} element={mockedElement} />
);

describe("<NDRBasic />", () => {
  describe("Test NDRBasic component", () => {
    beforeEach(() => {
      render(ndrBasicComponent);
    });
    test("NDRBasic is visible", () => {
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Result" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Result" })).toBeDisabled();
    });

    test("Rate should calculate", async () => {
      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2"));
      expect(denominator).toHaveValue("2");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("50");
    });

    test("Rate should not display a decimal point if it is not needed", async () => {
      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "27"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "3"));

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("900");
    });

    test("Rate should display trailing decimal places if the value is rounded to 0", async () => {
      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "4"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2000"));

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("0.2");
    });
  });

  testA11y(
    ndrBasicComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
