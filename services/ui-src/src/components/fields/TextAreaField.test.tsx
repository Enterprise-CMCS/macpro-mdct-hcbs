import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextAreaField } from "components";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, TextAreaBoxTemplate } from "types/report";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { useState } from "react";

jest.mock("utils/state/hooks/useElementIsHidden");
const mockedUseElementIsHidden = useElementIsHidden as jest.MockedFunction<
  typeof useElementIsHidden
>;
mockedUseElementIsHidden.mockReturnValue(false);

const mockedTextAreaElement: TextAreaBoxTemplate = {
  id: "mock-textarea-id",
  type: ElementType.TextAreaField,
  label: "test label",
  helperText: "helper text",
  hideCondition: {
    controllerElementId: "reporting-radio",
    answer: "yes",
  },
  required: true,
};
const updateSpy = jest.fn();

const TextAreaWrapper = ({ template }: { template: TextAreaBoxTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <TextAreaField element={element} updateElement={onChange} />;
};

describe("<TextAreaField />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TextAreaField is visible", () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textAreaField = screen.getByRole("textbox");
    expect(textAreaField).toBeVisible();
  });

  test("TextAreaField should send updates to the Form", async () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textAreaField = screen.getByRole("textbox");

    await userEvent.type(textAreaField, "hello");

    expect(updateSpy).toHaveBeenCalledWith({ answer: "hello" });
  });

  test("Text area field is hidden if its hide conditions' controlling element has a matching answer", async () => {
    mockedUseElementIsHidden.mockReturnValueOnce(true);
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textField = screen.queryByLabelText("test label");
    expect(textField).not.toBeInTheDocument();
  });

  testA11y(<TextAreaWrapper template={mockedTextAreaElement} />);
});
