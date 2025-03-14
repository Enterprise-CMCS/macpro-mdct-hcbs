import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioField } from "components";
import { useFormContext } from "react-hook-form";
import { ElementType, PageElement } from "types";
import { testA11y } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
  getValues: jest.fn(),
  trigger: mockTrigger,
  unregister: jest.fn(),
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

const mockRadioElement = {
  type: RadioField,
  label: "mock label",
  value: [
    {
      label: "Choice 1",
      value: "A",
      checked: false,
    },
    {
      label: "Choice 2",
      value: "B",
      checkedChildren: [
        {
          type: ElementType.Textbox,
          label: "mock-text-box",
        },
      ],
      checked: false,
    },
    {
      label: "Choice 3",
      value: "C",
      checked: false,
    },
  ],
  hideCondition: {
    controllerElementId: "reporting-radio",
    answer: "yes",
  },
};

const RadioFieldComponent = (
  <div data-testid="test-radio-list">
    <RadioField
      element={mockRadioElement as unknown as PageElement}
      index={0}
      formkey="elements.0"
    />
  </div>
);

describe("<RadioField />", () => {
  test("RadioField renders as Radio", () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("elements.0.answer", "A", {
      shouldValidate: true,
    });
  });

  test("RadioField displays children fields after selection", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 2") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("elements.0.answer", "B", {
      shouldValidate: true,
    });
    expect(screen.getByLabelText("mock-text-box")).toBeInTheDocument();
  });

  testA11y(RadioFieldComponent, () => {
    mockGetValues(undefined);
  });
});

describe("Radio field hide condition logic", () => {
  test("Radio field is hidden if its hide conditions' controlling element has a matching answer", async () => {
    mockGetValues({
      elements: [
        {
          answer: "yes",
          type: "reportingRadio",
          label: "Should we hide the other radios on this page?",
          id: "reporting-radio",
        },
      ],
    });
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).not.toBeInTheDocument();
  });

  test("Radio field is NOT hidden if its hide conditions' controlling element has a different answer", async () => {
    mockGetValues({
      elements: [
        {
          answer: "idk",
          type: "reportingRadio",
          label: "Should we hide the other radios on this page?",
          id: "reporting-radio",
        },
      ],
    });
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).toBeVisible();
  });
});
