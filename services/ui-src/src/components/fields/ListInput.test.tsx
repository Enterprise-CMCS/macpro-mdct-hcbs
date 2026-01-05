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

const updateSpy = jest.fn();

const ListInputComponent = (
  <div>
    <ListInput element={mockedListInputElement} updateElement={updateSpy} />
  </div>
);

describe("<ListInput />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(ListInputComponent);
  });
  it("ListInput renders", () => {
    expect(screen.getByText("This is a mock list input")).toBeVisible();
    expect(screen.getByText("mock helper text")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "mock button text" })
    ).toBeVisible();
  });
  it("ListInput allows adding fields", async () => {
    const addBtn = screen.getByRole("button", { name: "mock button text" });
    await userEvent.click(addBtn);

    const textbox = screen.getByRole("textbox", { name: "mock field" });
    expect(textbox).toBeVisible();

    await userEvent.type(textbox, "text");
    expect(updateSpy).toHaveBeenCalledTimes(5);
  });

  it("ListInput allows removing fields", async () => {
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
});
