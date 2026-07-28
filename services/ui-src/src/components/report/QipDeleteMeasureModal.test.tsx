import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { QipDeleteMeasureModal } from "./QipDeleteMeasureModal";

const onClose = jest.fn();
const onConfirm = jest.fn();

const renderInModal = (measureName: string) =>
  render(
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {QipDeleteMeasureModal(measureName, onClose, onConfirm)}
      </ModalContent>
    </Modal>
  );

describe("QipDeleteMeasureModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the measure name in the body text", () => {
    renderInModal("LTSS-1: Comprehensive Assessment");

    expect(
      screen.getByText(/LTSS-1: Comprehensive Assessment/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/)
    ).toBeInTheDocument();
  });

  it("should call onConfirm when Remove measure is clicked", async () => {
    renderInModal("Test Measure");

    await userEvent.click(
      screen.getByRole("button", { name: "Remove measure" })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", async () => {
    renderInModal("Test Measure");

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
