import { render, screen } from "@testing-library/react";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { SubmitReportModal } from "./SubmitReportModal";

const mockClose = jest.fn();
const mockSubmit = jest.fn();

describe("Test SubmitReportModal", () => {
  it("Test SubmitReportModal Render", async () => {
    const modal = SubmitReportModal(mockClose, mockSubmit);
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalled();

    const submit = screen.getByRole("button", { name: "Submit QMS Report" });
    await userEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
