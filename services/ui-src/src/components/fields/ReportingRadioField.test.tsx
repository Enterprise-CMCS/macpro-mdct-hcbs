import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportingRadioField } from "components";
import { useFormContext } from "react-hook-form";
import { ElementType, ReportingRadioTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
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

const mockRadioElement: ReportingRadioTemplate = {
  id: "mock-radio-element",
  type: ElementType.ReportingRadio,
  label: "mock label",
  choices: [
    {
      label: "Yes",
      value: "yes",
      checked: false,
    },
    {
      label: "No",
      value: "no",
      checkedChildren: [
        {
          id: "mock-text-box-id",
          type: ElementType.Textbox,
          label: "mock-text-box",
        },
      ],
      checked: false,
    },
  ],
};

const ReportingRadioFieldComponent = (
  <div data-testid="test-radio-list">
    <ReportingRadioField
      element={mockRadioElement}
      index={0}
      formkey="elements.0"
    />
  </div>
);

describe("<RadioField />", () => {
  test("RadioField renders as Radio", () => {
    mockGetValues(undefined);
    render(ReportingRadioFieldComponent);
    expect(screen.getByText("Yes")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    mockGetValues(undefined);
    render(ReportingRadioFieldComponent);
    const firstRadio = screen.getByLabelText("Yes") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("elements.0.answer", "yes", {
      shouldValidate: true,
    });
  });

  test("RadioField displays children fields after selection", async () => {
    mockGetValues(undefined);
    render(ReportingRadioFieldComponent);
    const firstRadio = screen.getByLabelText("No") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("elements.0.answer", "no", {
      shouldValidate: true,
    });
    expect(screen.getByLabelText("mock-text-box")).toBeInTheDocument();
  });

  testA11y(ReportingRadioFieldComponent, () => {
    mockGetValues(undefined);
  });
});
