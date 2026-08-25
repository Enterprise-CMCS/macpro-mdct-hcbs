import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListInput } from "./ListInput";
import { ElementType, ListInputTemplate } from "types";
import userEvent from "@testing-library/user-event";

const mockedListInputElement: ListInputTemplate = {
  type: ElementType.ListInput,
  id: "mock-id",
  label: "This is a mock list input",
  fieldLabel: "mock field",
  helperText: "mock helper text",
  buttonText: "mock button text",
  required: false,
};

const updateSpy = vi.fn();

const ListInputComponent = (
  <div>
    <ListInput element={mockedListInputElement} updateElement={updateSpy} />
  </div>
);

describe("<ListInput />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(ListInputComponent);
    expect(screen.getByText("This is a mock list input")).toBeVisible();
    expect(screen.getByText("mock helper text")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "mock button text" })
    ).toBeVisible();
  });

  it("should allow adding fields", async () => {
    render(ListInputComponent);
    const addBtn = screen.getByRole("button", { name: "mock button text" });
    await userEvent.click(addBtn);

    const textbox = screen.getByRole("textbox", { name: "mock field" });
    expect(textbox).toBeVisible();

    await userEvent.type(textbox, "text");
    expect(updateSpy).toHaveBeenCalledTimes(5);
  });

  it("should allow removing fields", async () => {
    render(ListInputComponent);
    const addBtn = screen.getByRole("button", { name: "mock button text" });
    await userEvent.click(addBtn);
    expect(screen.getByRole("textbox", { name: "mock field" })).toBeVisible();
    expect(updateSpy).toHaveBeenCalledTimes(1);

    const removeBtn = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(removeBtn);
    expect(
      screen.queryByRole("textbox", { name: "mock field" })
    ).not.toBeInTheDocument();
    expect(updateSpy).toHaveBeenCalledTimes(2);
  });

  it("should show an error when user does not fillout the field", async () => {
    render(ListInputComponent);
    const addBtn = screen.getByRole("button", { name: "mock button text" });
    await userEvent.click(addBtn);
    const textbox = screen.getByRole("textbox", { name: "mock field" });
    //trigger the error message through a focus
    await userEvent.click(textbox);
    //remove focus by adding another textbox
    await userEvent.click(addBtn);
    expect(screen.getByText("A response is required")).toBeVisible();
    await userEvent.type(textbox, "text");
    expect(
      screen.queryByText("A response is required")
    ).not.toBeInTheDocument();
  });

  it("should hide remove button when disabled is true", async () => {
    const { rerender } = render(
      <div>
        <ListInput
          element={mockedListInputElement}
          updateElement={updateSpy}
          disabled={false}
        />
      </div>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "mock button text" })
    );
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();

    rerender(
      <div>
        <ListInput
          element={{ ...mockedListInputElement, answer: [""] }}
          updateElement={updateSpy}
          disabled={true}
        />
      </div>
    );

    expect(
      screen.queryByRole("button", { name: "Remove" })
    ).not.toBeInTheDocument();
  });
});
