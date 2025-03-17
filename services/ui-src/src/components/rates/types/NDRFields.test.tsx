import { act, render, screen } from "@testing-library/react";
import { Fields } from "./Fields";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { FacilityLengthOfStayCalc } from "../calculations";
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
  fields: [
    {
      id: "count-of-success-dis",
      label: "Count of Successful Discharges to the Community",
    },
    { id: "fac-admin-count", label: "Facility Admission Count" },
    {
      id: "expected-count-of-success-dis",
      label: "Expected Count of Successful Discharges to the Community",
    },
    { id: "multi-plan", label: "Multi-Plan Population Rate" },
    {
      id: "opr-min-stay",
      label:
        "Observed Performance Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "epr-min-stay",
      label:
        "Expected Performance Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "rar-min-stay",
      label: "Risk Adjusted Rate for the Minimizing Length of Facility Stay",
      autoCalc: true,
    },
  ],
  multiplier: 1,
} as PerformanceRateTemplate;

const fieldsComponent = (
  <Fields
    formkey={"mock-key"}
    calculation={FacilityLengthOfStayCalc}
    year={2026}
    {...mockedPerformanceElement}
  />
);

describe("<Fields />", () => {
  describe("Test Fields component", () => {
    beforeEach(() => {
      render(fieldsComponent);
    });
    test("Fields is visible", () => {
      expect(
        screen.getByLabelText(
          "What is the 2026 state performance target for this assessment?"
        )
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
    test("Rate should calculate", async () => {
      
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
