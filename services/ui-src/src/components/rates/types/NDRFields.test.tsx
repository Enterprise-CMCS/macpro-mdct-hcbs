import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { FacilityLengthOfStayCalc } from "../calculations";
import { useStore } from "utils";
import {
  ElementType,
  PerformanceRateTemplate,
  PerformanceRateType,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { mockStateUserStore } from "utils/testing/setupJest";
import { NDRFields } from "./NDRFields";

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
  rateType: PerformanceRateType.NDR_FIELDS,
} as PerformanceRateTemplate;

const ndrNDRFieldsComponent = (
  <NDRFields
    formkey={"mock-key"}
    calculation={FacilityLengthOfStayCalc}
    year={2026}
    {...mockedPerformanceElement}
  />
);

describe("<NDRFields />", () => {
  describe("Test NDRFields component", () => {
    beforeEach(() => {
      render(ndrNDRFieldsComponent);
    });
    test("NDRFields is visible", () => {
      const { assessments, fields } = mockedPerformanceElement;

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
      const { assessments, fields } = mockedPerformanceElement;

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
      }
    });
  });

  testA11y(
    ndrNDRFieldsComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
