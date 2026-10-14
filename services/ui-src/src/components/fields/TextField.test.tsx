import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "components";
import { testA11y } from "utils/testing/commonTests";
import {
  ElementType,
  NumberFieldTemplate,
  TextboxTemplate,
} from "types/report";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { useState } from "react";
import { ErrorMessages } from "../../constants";

vi.mock("utils/state/hooks/useElementIsHidden");
vi.mocked(useElementIsHidden).mockReturnValue(false);

const mockedTextboxElement: TextboxTemplate = {
  id: "mock-textbox-id",
  type: ElementType.Textbox,
  label: "test label",
  helperText: "helper text",
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
  required: true,
};

const mockedNumberField: NumberFieldTemplate = {
  id: "mock-textbox-id",
  type: ElementType.NumberField,
  label: "test label",
  helperText: "helper text",
  required: true,
};

const updateSpy = vi.fn();

const TextFieldWrapper = ({
  template,
}: {
  template: TextboxTemplate | NumberFieldTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement } as typeof element);
  };
  return <TextField element={template as any} updateElement={onChange} />;
};

describe("<TextField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a textbox", () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");
    expect(textField).toBeVisible();
  });

  it("should send updates to the Form", async () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "hello");

    expect(updateSpy).toHaveBeenCalledWith({ answer: "hello" });
  });

  it("should parse numeric values depending on its type", async () => {
    render(<TextFieldWrapper template={mockedNumberField} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "24");

    expect(updateSpy).toHaveBeenCalledWith({ answer: 24 });
  });

  it("should show required validation error when required field is cleared", async () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "hello");
    await userEvent.clear(textField);

    expect(screen.getByText(ErrorMessages.requiredResponse)).toBeVisible();
  });

  it("should validate email format for email labels", async () => {
    render(
      <TextFieldWrapper
        template={{ ...mockedTextboxElement, label: "contact email" }}
      />
    );
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "not-an-email");

    expect(screen.getByText(ErrorMessages.mustBeAnEmail)).toBeVisible();
  });

  it("should show non-numeric validation error", async () => {
    render(<TextFieldWrapper template={mockedNumberField} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "abc");

    expect(screen.getByText(ErrorMessages.mustBeANumber)).toBeVisible();
  });

  it("should render its initial value", () => {
    render(
      <TextFieldWrapper template={{ ...mockedNumberField, answer: 123 }} />
    );

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("123");
  });

  it("should respond to measure clear", () => {
    const props = {
      element: {
        ...mockedNumberField,
        answer: 123 as number | undefined,
      },
      updateElement: () => {},
    };

    const { rerender } = render(<TextField {...props} />);
    props.element.answer = undefined;
    rerender(<TextField {...props} />);

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("");
  });

  it("should be hidden if its hide conditions' controlling element has a matching answer", async () => {
    vi.mocked(useElementIsHidden).mockReturnValueOnce(true);
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.queryByLabelText("test label");
    expect(textField).not.toBeInTheDocument();
  });

  testA11y(<TextFieldWrapper template={mockedTextboxElement} />);
});
