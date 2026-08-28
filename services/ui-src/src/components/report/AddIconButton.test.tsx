import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddIconButton } from "./AddIconButton";

const addIcon = "test-file-stub";

describe("<AddIconButton />", () => {
  it("should render label and icon", () => {
    render(<AddIconButton label="Add measure" onClick={jest.fn()} />);

    expect(screen.getByRole("button", { name: /add measure/i })).toBeVisible();

    const img = document.querySelector("img");
    expect(img).toHaveAttribute("src", addIcon);
    expect(img).toHaveAttribute("alt", "");
  });

  it("should call onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<AddIconButton label="Add key activity" onClick={onClick} />);

    await userEvent.click(
      screen.getByRole("button", { name: /add key activity/i })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should support disabled state", () => {
    render(
      <AddIconButton
        label="Add eligibility"
        onClick={jest.fn()}
        isDisabled={true}
      />
    );

    expect(
      screen.getByRole("button", { name: /add eligibility/i })
    ).toBeDisabled();
  });
});
