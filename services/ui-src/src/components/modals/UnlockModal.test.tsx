import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { UnlockModal } from "components";

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

  test("Modals action button can be clicked", () => {
    fireEvent.click(screen.getByText("Return to dashboard"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Modals close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test Modal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
