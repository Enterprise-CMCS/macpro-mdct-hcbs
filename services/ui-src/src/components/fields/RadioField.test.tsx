import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioField } from "components";
import { ElementType, RadioTemplate } from "types";
import { useStore } from "utils";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/state/hooks/useElementIsHidden");

const mockClearMeasure = vi.fn();
const mockChangeDeliveryMethods = vi.fn();
const mockSetAnswers = vi.fn();
useStore.setState({
  currentPageId: "my-id",
  clearMeasure: mockClearMeasure,
  changeDeliveryMethods: mockChangeDeliveryMethods,
  setAnswers: mockSetAnswers,
});

const mockRadioElement: RadioTemplate = {
  id: "mock-radio-id",
  type: ElementType.Radio,
  label: "Mock Label",
  required: true,
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
          label: "Text Label",
          required: true,
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
const updateSpy = vi.fn();

const RadioFieldComponent = (
  <RadioField element={mockRadioElement} updateElement={updateSpy} />
);

describe("<RadioField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render as Radio", () => {
    render(RadioFieldComponent);
    expect(
      screen.getByRole("radiogroup", { name: "Mock Label" })
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Choice 1" })).toBeVisible();
    expect(screen.getByRole("radio", { name: "Choice 2" })).toBeVisible();
    expect(screen.getByRole("radio", { name: "Choice 3" })).toBeVisible();
  });

  it("should allow checking radio choices", async () => {
    render(RadioFieldComponent);
    await userEvent.click(screen.getByRole("radio", { name: "Choice 1" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: "A" });
  });

  it("should display children fields after selection", async () => {
    render(RadioFieldComponent);
    expect(
      screen.queryByRole("textbox", { name: "Text Label" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Choice 2" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: "B" });
    expect(screen.getByRole("textbox", { name: "Text Label" })).toBeVisible();
  });

  it("should be hidden if its hide conditions' controlling element has a matching answer", async () => {
    vi.mocked(useElementIsHidden).mockReturnValue(true);
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).not.toBeInTheDocument();
  });

  it("should NOT be hidden if its hide conditions' controlling element has a different answer", async () => {
    vi.mocked(useElementIsHidden).mockReturnValue(false);
    render(RadioFieldComponent);
    const radioField = screen.queryByText("Choice 1");
    expect(radioField).toBeVisible();
  });

  it("should trigger a report delivery methods change when toggled", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
    };
    const deliveryRadio = (
      <RadioField element={deliveryElement} updateElement={updateSpy} />
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    expect(radioField).toBeVisible();
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).toHaveBeenCalled();
  });

  it("should show a confirmation modal when delivery method is changed, and clicking yes changes the radio value", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
      answer: "mock-answer",
    };
    const deliveryRadio = (
      <RadioField element={deliveryElement} updateElement={updateSpy} />
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).not.toHaveBeenCalled();
    expect(updateSpy).not.toHaveBeenCalled();

    const modal = screen.getByRole("dialog");
    const modalYes = within(modal).getByRole("button", { name: "Yes" });
    expect(modalYes).toBeVisible();
    await userEvent.click(modalYes);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({ answer: "A" });
  });

  it("should show a confirmation modal when delivery method is changed, and clicking no does not change the radio value", async () => {
    const deliveryElement = {
      ...mockRadioElement,
      clickAction: "qmDeliveryMethodChange",
      answer: "mock-answer",
    };
    const deliveryRadio = (
      <RadioField element={deliveryElement} updateElement={updateSpy} />
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Choice 1");
    await userEvent.click(radioField);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(0);
    expect(mockSetAnswers).toHaveBeenCalledTimes(0);

    const modal = screen.getByRole("dialog");
    const modalNo = within(modal).getByRole("button", { name: "No" });
    expect(modalNo).toBeVisible();
    await userEvent.click(modalNo);
    expect(mockChangeDeliveryMethods).toHaveBeenCalledTimes(0);
    expect(mockSetAnswers).toHaveBeenCalledTimes(0);
  });

  it("should trigger a clear action when not reporting.", async () => {
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
      <RadioField element={deliveryElement} updateElement={updateSpy} />
    );
    render(deliveryRadio);
    const radioField = screen.getByText("Hey, no thanks");
    expect(radioField).toBeVisible();
    await userEvent.click(radioField);
    expect(mockClearMeasure).toHaveBeenCalled();
  });

  testA11y(RadioFieldComponent);
});
