import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnlockModal } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = vi.fn();

const modalComponent = (
  <UnlockModal
    modalDisclosure={{
      isOpen: true,
      onClose: mockCloseHandler,
    }}
  />
);

describe("UnlockModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render its contents", () => {
    render(modalComponent);
    expect(screen.getByText("You unlocked this report")).toBeTruthy();
    expect(
      screen.getByText(
        "Email the state or territory contact and let them know it requires edits."
      )
    ).toBeTruthy();
  });

  it("should call its action handler", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText("Return to dashboard"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  it("should call its close handler", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  testA11y(modalComponent);
});
