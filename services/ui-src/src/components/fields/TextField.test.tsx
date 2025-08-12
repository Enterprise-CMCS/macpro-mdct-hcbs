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

jest.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as jest.MockedFunction<
  typeof useElementIsHidden
>;

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

const updateSpy = jest.fn();

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
    jest.clearAllMocks();
  });

  test("TextField is visible", () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");
    expect(textField).toBeVisible();
  });

  test("TextField should send updates to the Form", async () => {
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "hello");

    expect(updateSpy).toHaveBeenCalledWith({ answer: "hello" });
  });

  test("TextField should parse numeric values depending on its type", async () => {
    render(<TextFieldWrapper template={mockedNumberField} />);
    const textField = screen.getByRole("textbox");

    await userEvent.type(textField, "24");

    expect(updateSpy).toHaveBeenCalledWith({ answer: 24 });
  });

  test("NumberField should render its initial value", () => {
    render(
      <TextFieldWrapper template={{ ...mockedNumberField, answer: 123 }} />
    );

    const textField = screen.getByRole("textbox");
    expect(textField).toHaveValue("123");
  });

  test("NumberField should respond to measure clear", () => {
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

  test("Text field is hidden if its hide conditions' controlling element has a matching answer", async () => {
    mockedUseElementIsHidden.mockReturnValueOnce(true);
    render(<TextFieldWrapper template={mockedTextboxElement} />);
    const textField = screen.queryByLabelText("test label");
    expect(textField).not.toBeInTheDocument();
  });

  testA11y(<TextFieldWrapper template={mockedTextboxElement} />);
});
