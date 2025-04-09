import { act, render, screen } from "@testing-library/react";
import { useFormContext } from "react-hook-form";
import { useStore } from "utils";
import {
  ElementType,
  PerformanceRateTemplate,
  PerformanceRateType,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { mockStateUserStore } from "utils/testing/setupJest";
import { NDRHCBS } from "./NDRHCBS";
import userEvent from "@testing-library/user-event";

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
  label: "Performance Rates",
  assessments: [
    { id: "self-direction-offer", label: "Self-Direction Offer" },
    { id: "self-direction-opt-in", label: "Self-Direction Opt-In" },
  ],
  fields: [
    { id: "self-label", label: "self-label" },
    { id: "18-to-64-years", label: "18 to 64 Years" },
    { id: "65-years-or-older", label: "65 years or older" },
  ],
  multiplier: 1000,
  rateType: PerformanceRateType.NDRFIELDS_HCBS,
} as PerformanceRateTemplate;

const ndrHCBSComponent = (
  <NDRHCBS formkey={"mock-key"} year={2026} {...mockedPerformanceElement} />
);

describe("<NDRHCBS />", () => {
  describe("Test NDRHCBS component", () => {
    beforeEach(() => {
      render(ndrHCBSComponent);
    });
    test("NDRHCBS is visible", () => {
      const { assessments, fields } = mockedPerformanceElement;

      assessments?.forEach((assess) => {
        expect(
          screen.getAllByRole("textbox", {
            name: `${assess.label} Denominator`,
          })
        ).toHaveLength(1);
        fields?.forEach((field) => {
          expect(
            screen.getByRole("textbox", {
              name: `What is the 2026 state performance target for ${
                assess.label
              }${field.id !== "self-label" ? ` (${field.label})` : ""}?`,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("textbox", {
              name: `Numerator: ${assess.label}${
                field.id !== "self-label" ? ` (${field.label})` : ""
              }`,
            })
          ).toBeInTheDocument();
          expect(
            screen.getByRole("textbox", {
              name: `${assess.label}${
                field.id !== "self-label" ? ` (${field.label})` : ""
              } Rate`,
            })
          ).toBeInTheDocument();
        });
      });
    });

    test("Rate should calculate", async () => {
      const { assessments } = mockedPerformanceElement;

      if (assessments && assessments.length > 0) {
        const denom = screen.getAllByRole("textbox", {
          name: `${assessments[0].label} Denominator`,
        })[0];
        await act(async () => await userEvent.type(denom, "1"));
        expect(denom).toHaveValue("1");

        const num = screen.getByRole("textbox", {
          name: `Numerator: ${assessments[0].label}`,
        });
        await act(async () => await userEvent.type(num, "1"));
        expect(num).toHaveValue("1");
      }
    });
  });

  testA11y(
    ndrHCBSComponent,
    () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockGetValues(undefined);
    },
    () => {
      jest.clearAllMocks();
    }
  );
});
