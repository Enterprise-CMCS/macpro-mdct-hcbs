import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextAreaField } from "components";
import { testA11y } from "utils/testing/commonTests";
import { ElementType, TextAreaBoxTemplate } from "types/report";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { useState } from "react";
import { ErrorMessages } from "../../constants";

vi.mock("utils/state/hooks/useElementIsHidden");
vi.mocked(useElementIsHidden).mockReturnValue(false);

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
const updateSpy = vi.fn();

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
    vi.clearAllMocks();
  });

  it("should render a textbox", () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textAreaField = screen.getByRole("textbox");
    expect(textAreaField).toBeVisible();
  });

  it("should send updates to the Form", async () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textAreaField = screen.getByRole("textbox");

    await userEvent.type(textAreaField, "hello");

    expect(updateSpy).toHaveBeenCalledWith({ answer: "hello" });
  });

  it("should send undefined when input is cleared", async () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textAreaField = screen.getByRole("textbox");

    await userEvent.type(textAreaField, "hello");
    await userEvent.clear(textAreaField);

    expect(updateSpy).toHaveBeenCalledWith({ answer: undefined });
    expect(screen.getByText(ErrorMessages.requiredResponse)).toBeVisible();
  });

  it("should be hidden if its hide conditions' controlling element has a matching answer", async () => {
    vi.mocked(useElementIsHidden).mockReturnValueOnce(true);
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    const textField = screen.queryByLabelText("test label");
    expect(textField).not.toBeInTheDocument();
  });

  it("should not show word count when no wordLimit is set", () => {
    render(<TextAreaWrapper template={mockedTextAreaElement} />);
    expect(screen.queryByText(/Suggested length/)).not.toBeInTheDocument();
  });

  it("should show optional indicator when field is not required", () => {
    render(
      <TextAreaWrapper
        template={{ ...mockedTextAreaElement, required: false }}
      />
    );

    expect(screen.getByText("(optional)")).toBeVisible();
  });

  it("should show word count of 0 when field is empty", () => {
    render(
      <TextAreaWrapper
        template={{ ...mockedTextAreaElement, wordLimit: 300 }}
      />
    );
    expect(screen.getByText("Suggested length 0/300 words")).toBeVisible();
  });

  it("should update word count as user types", async () => {
    render(
      <TextAreaWrapper
        template={{ ...mockedTextAreaElement, wordLimit: 300 }}
      />
    );
    await userEvent.type(screen.getByRole("textbox"), "hello world");
    expect(screen.getByText("Suggested length 2/300 words")).toBeVisible();
  });

  it("should show a warning when word limit exceeded", async () => {
    render(
      <TextAreaWrapper template={{ ...mockedTextAreaElement, wordLimit: 3 }} />
    );
    await userEvent.type(screen.getByRole("textbox"), "hello world hi there");
    expect(screen.getByText(ErrorMessages.wordCountExceeded(3))).toBeVisible();
    expect(screen.getByText("Suggested length 4/3 words")).toBeVisible();
  });

  testA11y(<TextAreaWrapper template={mockedTextAreaElement} />);
});
