import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { DeleteConfirmModal } from "./QipDeleteMeasureModal";

const onClose = jest.fn();
const onConfirm = jest.fn();

const renderInModal = (body: string, confirmLabel: string) =>
  render(
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {DeleteConfirmModal(body, confirmLabel, onClose, onConfirm)}
      </ModalContent>
    </Modal>
  );

describe("DeleteConfirmModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the body text and confirm label", () => {
    renderInModal(
      "This action cannot be undone. It will remove the measure LTSS-1 from this QI Plan.",
      "Remove measure"
    );

    expect(screen.getByText(/LTSS-1/)).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove measure" })
    ).toBeInTheDocument();
  });

  it("should call onConfirm when the confirm button is clicked", async () => {
    renderInModal("Are you sure?", "Remove measure");

    await userEvent.click(
      screen.getByRole("button", { name: "Remove measure" })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", async () => {
    renderInModal("Are you sure?", "Remove measure");

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
