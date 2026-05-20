import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "components";
import { useState } from "react";
import { testA11y } from "utils/testing/commonTests";

const checkboxButtonComponent = (
  <Checkbox
    id={"test-checkbox"}
    name={"test-checkbox"}
    label={"Test checkbox"}
    checked={false}
    onCheckedChange={jest.fn()}
  />
);

const CheckboxTestComponent = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      id={"test-checkbox"}
      label={"Test checkbox"}
      name={"test-checkbox"}
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
};

describe("<Checkbox />", () => {
  it("renders unchecked by default", () => {
    render(checkboxButtonComponent);
    expect(screen.getByLabelText(/Test checkbox/i)).not.toBeChecked();
  });

  it("gets checked when clicked", async () => {
    const user = userEvent.setup();

    render(<CheckboxTestComponent />);

    const checkbox = screen.getByRole("checkbox", {
      name: /Test checkbox/i,
    });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  testA11y(checkboxButtonComponent);
});
