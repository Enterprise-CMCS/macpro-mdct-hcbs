import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioField } from "components";
import { ElementType, RadioTemplate, Report, ReportType } from "types";
import { useStore } from "utils";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/state/hooks/useElementIsHidden");

vi.mock("@chakra-ui/react", async (importOriginal) => ({
  ...(await importOriginal()),
  Box: ({ children, sx }: { children: React.ReactNode; sx?: unknown }) => (
    <div data-testid="radio-field-wrapper" data-sx={JSON.stringify(sx)}>
      {children}
    </div>
  ),
}));

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
    useStore.setState({ report: undefined });
  });

  it.each([
    [ReportType.IMA, true],
    [ReportType.QMS, false],
    [undefined, false],
  ])(
    "applies the IMA label width only for an %s report",
    (reportType, shouldApplyImaWidth) => {
      useStore.setState({
        report: reportType ? ({ type: reportType } as Report) : undefined,
      });

      render(RadioFieldComponent);

      const wrapper = screen.getAllByTestId("radio-field-wrapper")[0];
      expect(wrapper.dataset.sx).toBe(
        shouldApplyImaWidth
          ? JSON.stringify({
              ".ds-c-fieldset > .ds-c-label": { maxWidth: "685px" },
            })
          : undefined
      );
    }
  );

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
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ answer: "A" })
    );
  });

  it("should display children fields after selection", async () => {
    render(RadioFieldComponent);
    expect(
      screen.queryByRole("textbox", { name: "Text Label" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Choice 2" }));
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ answer: "B" })
    );
    expect(screen.getByRole("textbox", { name: "Text Label" })).toBeVisible();
  });

  it("should clear child answers when the selected radio choice changes", async () => {
    const radioWithChildData: RadioTemplate = {
      ...mockRadioElement,
      answer: "B",
      choices: mockRadioElement.choices.map((choice) =>
        choice.value === "B"
          ? {
              ...choice,
              checkedChildren: [
                {
                  id: "child-date-id",
                  type: ElementType.Date,
                  label: "Date",
                  required: true,
                  answer: "10242024",
                },
              ],
            }
          : choice
      ),
    };

    render(
      <RadioField element={radioWithChildData} updateElement={updateSpy} />
    );

    await userEvent.click(screen.getByRole("radio", { name: "Choice 1" }));

    expect(updateSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        answer: "A",
        choices: expect.arrayContaining([
          expect.objectContaining({
            value: "B",
            checkedChildren: [
              expect.objectContaining({
                answer: undefined,
              }),
            ],
          }),
        ]),
      })
    );
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
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ answer: "A" })
    );
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

  it("should show Not compliant when selected choice is non-compliant", async () => {
    const nonCompliantElement: RadioTemplate = {
      ...mockRadioElement,
      id: "mock-non-compliant-radio-id",
      answer: "no",
      nonCompliantOn: "no",
      choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    };

    render(
      <RadioField element={nonCompliantElement} updateElement={updateSpy} />
    );

    expect(screen.getByText("Not compliant.")).toBeVisible();
  });

  testA11y(RadioFieldComponent);
});
