import { act, render, screen } from "@testing-library/react";
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
  fields: [
    {
      id: "actualDischarges",
      label: "Count of Successful Discharges to the Community",
    },
    { id: "admissionCount", label: "Facility Admission Count" },
    {
      id: "expectedDischarges",
      label: "Expected Count of Successful Discharges to the Community",
    },
    { id: "populationRate", label: "Multi-Plan Population Rate" },
    {
      id: "actualRate",
      label:
        "Observed Performance Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "expectedRate",
      label:
        "Expected Performance Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "riskAdjustedRate",
      label: "Risk Adjusted Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
  ],
};

const fieldsComponent = (
  <FacilityLengthOfStayRate
    formkey={"mock-key"}
    element={mockedPerformanceElement}
  />
);

describe("<Fields />", () => {
  describe("Test Fields component", () => {
    beforeEach(() => {
      render(fieldsComponent);
    });
    test("Fields is visible", () => {
      expect(
        screen.getByRole("textbox", {
          name: "What is the 2026 state performance target for this assessment?",
        })
      ).toBeInTheDocument();

      mockedPerformanceElement.fields?.forEach((field) => {
        expect(
          screen.getByRole("textbox", {
            name: field.label,
          })
        ).toBeInTheDocument();

        if (field.autoCalc)
          expect(
            screen.getByRole("textbox", { name: field.label })
          ).toBeDisabled();
      });
    });
    test("Fields should auto-calculate", async () => {
      const countOfSuccessDis = screen.getByRole("textbox", {
        name: "Count of Successful Discharges to the Community",
      });
      await act(async () => await userEvent.type(countOfSuccessDis, "1"));

      const facAdminCount = screen.getByRole("textbox", {
        name: "Facility Admission Count",
      });
      await act(async () => await userEvent.type(facAdminCount, "2"));

      const expectedCountOfSuccessDis = screen.getByRole("textbox", {
        name: "Expected Count of Successful Discharges to the Community",
      });
      await act(
        async () => await userEvent.type(expectedCountOfSuccessDis, "1")
      );

      const multiPlan = screen.getByRole("textbox", {
        name: "Multi-Plan Population Rate",
      });
      await act(async () => await userEvent.type(multiPlan, "2"));

      //rates
      const oprMinStay = screen.getByRole("textbox", {
        name: "Observed Performance Rate for the Minimizing Length of Facility Stay",
      });
      expect(oprMinStay).toHaveValue("0.5");

      const eprMinStay = screen.getByRole("textbox", {
        name: "Expected Performance Rate for the Minimizing Length of Facility Stay",
      });
      expect(eprMinStay).toHaveValue("0.5");

      const rarMinStay = screen.getByRole("textbox", {
        name: "Risk Adjusted Rate for the Minimizing Length of Facility Stay",
      });
      expect(rarMinStay).toHaveValue("2");
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
