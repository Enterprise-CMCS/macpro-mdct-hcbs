import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "components";
import { useState } from "react";
import { testA11y } from "utils/testing/commonTests";

const toggleButtonComponent = (
  <ToggleButton
    id={"test-toggle"}
    label={"Test Toggle button"}
    checked={false}
    onCheckedChange={jest.fn()}
  />
);

const ToggleTestComponent = () => {
  const [checked, setChecked] = useState(false);

  return (
    <ChakraProvider>
      <ToggleButton
        id={"test-toggle"}
        label={"Test Toggle button"}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </ChakraProvider>
  );
};

describe("<ToggleButton />", () => {
  it("renders unchecked by default", () => {
    render(toggleButtonComponent);
    expect(screen.getByLabelText(/Test Toggle button/i)).not.toBeChecked();
  });

  it("gets checked when clicked", async () => {
    const user = userEvent.setup();

    render(<ToggleTestComponent />);

    const toggle = screen.getByRole("checkbox", {
      name: /Test Toggle button/i,
    });

    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    expect(toggle).toBeChecked();
  });

  testA11y(toggleButtonComponent);
});
