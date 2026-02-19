import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxField } from "components";
import { ElementType, CheckboxTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";

const updateSpy = jest.fn();

const mockCheckboxElement: CheckboxTemplate = {
  id: "mock-checkbox-id",
  type: ElementType.Checkbox,
  label: "mock label",
  required: true,
  answer: [],
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
};

const CheckboxComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxField element={mockCheckboxElement} updateElement={updateSpy} />
  </div>
);

describe("<CheckboxField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("CheckboxField renders as Checkboxes", () => {
    render(CheckboxComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    render(CheckboxComponent);
    const firstCheckbox = screen.getByLabelText("Choice 1");
    await userEvent.click(firstCheckbox);
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["A"] });
  });

  test("CheckboxField displays children fields after selection", async () => {
    render(CheckboxComponent);
    const secondCheckbox = screen.getByLabelText("Choice 2");
    await userEvent.click(secondCheckbox);
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["B"] });
    expect(screen.getByLabelText("mock-text-box")).toBeInTheDocument();
  });

  testA11y(CheckboxComponent);
});
