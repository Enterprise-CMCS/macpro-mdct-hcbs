import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, ModalFooter, Text } from "@chakra-ui/react";
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
    expect(screen.getByRole("button", { name: /Close/ })).toBeInTheDocument();
  });

  it("renders a custom footer instead of the default actions", async () => {
    render(
      <Modal
        modalDisclosure={{ isOpen: true, onClose: mockCloseHandler }}
        content={content}
        onConfirmHandler={mockConfirmationHandler}
        footer={
          <ModalFooter>
            <Button onClick={mockConfirmationHandler}>Custom action</Button>
          </ModalFooter>
        }
      >
        <Text>{content.body}</Text>
      </Modal>
    );
    await waitFor(() =>
      expect(screen.getByText(content.heading)).toBeVisible()
    );
    expect(screen.getByText(content.body)).toBeVisible();
    expect(
      screen.queryByRole("button", { name: content.actionButtonText })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Custom action" })
    );
    expect(mockConfirmationHandler).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole("button", { name: /Close/ }));
    expect(mockCloseHandler).toHaveBeenCalledOnce();
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
