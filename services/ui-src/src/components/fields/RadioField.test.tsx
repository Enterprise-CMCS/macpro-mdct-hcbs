import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioField } from "components";
import { useFormContext } from "react-hook-form";
import { ElementType, RadioTemplate } from "types";
import { useStore } from "utils";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
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
jest.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as jest.MockedFunction<
  typeof useElementIsHidden
>;
jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockClearMeasure = jest.fn();
const mockChangeDeliveryMethods = jest.fn();
const mockSetAnswers = jest.fn();
mockedUseStore.mockReturnValue({
  currentPageId: "my-id",
  clearMeasure: mockClearMeasure,
  changeDeliveryMethods: mockChangeDeliveryMethods,
  setAnswers: mockSetAnswers,
});

const mockRadioElement: RadioTemplate = {
  id: "mock-radio-id",
  type: ElementType.Radio,
  label: "mock label",
  choices: [
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
          id: "mock-text-box-id",
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
    <RadioField element={mockRadioElement} formkey="elements.0" />
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
    const firstRadio = screen.getByLabelText("Choice 1");
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("elements.0.answer", "A", {
      shouldValidate: true,
    });
  });

  test("RadioField displays children fields after selection", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 2");
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
    mockedUseElementIsHidden.mockReturnValue(true);
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).not.toBeInTheDocument();
  });

  test("Radio field is NOT hidden if its hide conditions' controlling element has a different answer", async () => {
    mockedUseElementIsHidden.mockReturnValue(false);
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).toBeVisible();
  });
});

describe("Radio field click action logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Radio field triggers a report delivery methods change when toggled", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
    };
    const deliveryRadio = (
      <div data-testid="test-radio-list">
        <RadioField element={deliveryElement} formkey="elements.0" />
      </div>
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    expect(radioField).toBeVisible();
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).toHaveBeenCalled();
  });

  test("Confirmation modal is shown when delivery method is changed, and clicking yes changes the radio value", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
      answer: "mock-answer",
    };
    const deliveryRadio = (
      <div data-testid="test-radio-list">
        <RadioField element={deliveryElement} formkey="elements.0" />
      </div>
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(0);
    expect(mockSetAnswers).toHaveBeenCalledTimes(0);

    const modalYes = screen.getByText("Yes");
    expect(modalYes).toBeVisible();
    await userEvent.click(modalYes);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(1);
    expect(mockSetAnswers).toHaveBeenCalledTimes(1);
  });

  test("Confirmation modal is shown when delivery method is changed, and clicking no does not change the radio value", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
      answer: "mock-answer",
    };
    const deliveryRadio = (
      <div data-testid="test-radio-list">
        <RadioField element={deliveryElement} formkey="elements.0" />
      </div>
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(0);
    expect(mockSetAnswers).toHaveBeenCalledTimes(0);

    const modalNo = screen.getByText("No");
    expect(modalNo).toBeVisible();
    await userEvent.click(modalNo);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(0);
    expect(mockSetAnswers).toHaveBeenCalledTimes(0);
  });

  test("Radio field triggers a clear action when not reporting.", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmReportingChange",
      choices: [
        {
          label: "Hey, no thanks",
          value: "no",
          checked: false,
        },
        {
          label: "Sure thing partner",
          value: "yes",
          checked: false,
        },
      ],
    };
    const deliveryRadio = (
      <div data-testid="test-radio-list">
        <RadioField element={deliveryElement} formkey="elements.0" />
      </div>
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Hey, no thanks");
    expect(radioField).toBeVisible();
    await userEvent.click(radioField);
    expect(mockClearMeasure).toHaveBeenCalled();
  });
});
