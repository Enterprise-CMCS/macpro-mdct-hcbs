import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = vi.fn();
const mockConfirmationHandler = vi.fn();

const content = {
  heading: "Dialog Heading",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan diam vitae metus lacinia, eget tempor purus placerat.",
  actionButtonText: "Dialog Action",
  closeButtonText: "Cancel",
};

const modalComponent = (
  <Modal
    onConfirmHandler={mockConfirmationHandler}
    modalDisclosure={{
      isOpen: true,
      onClose: mockCloseHandler,
    }}
    content={content}
  >
    <Text>{content.body}</Text>
  </Modal>
);

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render its contents", () => {
    render(modalComponent);
    expect(screen.getByText(content.heading)).toBeTruthy();
    expect(screen.getByText(content.body)).toBeTruthy();
  });

  it("should call its confirm handler when button is clicked", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText(/Dialog Action/i));
    expect(mockConfirmationHandler).toHaveBeenCalledTimes(1);
  });

  it("should close when Cancel is clockedModals close button can be clicked", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText(/Cancel/i));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    expect(mockConfirmationHandler).not.toHaveBeenCalled();
  });

  it("should disable submit when prompted", () => {
    const disabledModal = (
      <Modal
        onConfirmHandler={mockConfirmationHandler}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
        content={content}
        disableConfirm={true}
      >
        <Text>{content.body}</Text>
      </Modal>
    );
    render(disabledModal);

    const button = screen.getByRole("button", { name: "Dialog Action" });
    expect(button).toBeDisabled();
  });

  testA11y(modalComponent);
});
