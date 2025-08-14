import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
//components
import { Text } from "@chakra-ui/react";
import { Modal } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = jest.fn();
const mockConfirmationHandler = jest.fn();

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

describe("Test Modal", () => {
  beforeEach(() => {});

  test("Modal shows the contents", () => {
    render(modalComponent);
    expect(screen.getByText(content.heading)).toBeTruthy();
    expect(screen.getByText(content.body)).toBeTruthy();
  });

  test("Modals action button can be clicked", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText(/Dialog Action/i));
    expect(mockConfirmationHandler).toHaveBeenCalledTimes(1);
  });

  test("Modals close button can be clicked", async () => {
    render(modalComponent);
    await userEvent.click(screen.getByText(/Cancel/i));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
  test("Modals disable submit when prompted", () => {
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
