import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxField } from "components";
import { ElementType, CheckboxTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { CheckboxExport } from "./CheckboxField";

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
};

const CheckboxComponent = (
  <CheckboxField element={mockCheckboxElement} updateElement={updateSpy} />
);

describe("<CheckboxField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("CheckboxField renders as Checkboxes", () => {
    render(CheckboxComponent);
    expect(screen.getByRole("checkbox", { name: "Choice 1" })).toBeVisible();
    expect(screen.getByRole("checkbox", { name: "Choice 2" })).toBeVisible();
    expect(screen.getByRole("checkbox", { name: "Choice 3" })).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    render(CheckboxComponent);
    await userEvent.click(screen.getByRole("checkbox", { name: "Choice 1" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["A"] });
  });

  test("CheckboxField displays children fields after selection", async () => {
    render(CheckboxComponent);
    expect(
      screen.queryByRole("textbox", { name: "Text Label" })
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: "Choice 2" }));
    expect(updateSpy).toHaveBeenCalledWith({ answer: ["B"] });
    expect(screen.getByRole("textbox", { name: "Text Label" })).toBeVisible();
  });

  testA11y(CheckboxComponent);
});

describe("<CheckboxExport/>", () => {
  it("renders selected labels when answer is array", () => {
    const element: CheckboxTemplate = {
      type: ElementType.Checkbox,
      id: "check",
      label: "Label",
      required: false,
      choices: [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
      ],
      answer: ["a", "b"],
    };

    render(<>{CheckboxExport(element)}</>);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("returns empty for no answer", () => {
    const element: CheckboxTemplate = {
      type: ElementType.Checkbox,
      id: "check",
      label: "Label",
      required: false,
      choices: [],
      answer: [],
    };

    render(<>{CheckboxExport(element)}</>);

    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
