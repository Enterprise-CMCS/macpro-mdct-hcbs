import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnlockModal } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();

const modalComponent = (
  <UnlockModal
    modalDisclosure={{
      isOpen: true,
      onClose: mockCloseHandler,
    }}
  />
);

describe("Test Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(modalComponent);
  });

  test("Modal shows the contents", () => {
    expect(screen.getByText("You unlocked this QMS Report")).toBeTruthy();
    expect(
      screen.getByText(
        "Email the state or territory contact and let them know it requires edits."
      )
    ).toBeTruthy();
  });

  test("Modals action button can be clicked", async () => {
    await userEvent.click(screen.getByText("Return to dashboard"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Modals close button can be clicked", async () => {
    await userEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  testA11y(modalComponent);
});
