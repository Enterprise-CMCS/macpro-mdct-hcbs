import { render, screen } from "@testing-library/react";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { SubmitReportModal } from "./SubmitReportModal";

const mockClose = jest.fn();
const mockSubmit = jest.fn();

describe("Test SubmitReportModal", () => {
  it("Test SubmitReportModal for XYZ Render", async () => {
    const modal = SubmitReportModal(mockClose, mockSubmit, "XYZ");
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalled();

    const submit = screen.getByRole("button", { name: "Submit XYZ Report" });
    await userEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("Test SubmitReportModal cancel and submit interactions", async () => {
    const modal = SubmitReportModal(mockClose, mockSubmit, "XYZ");
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalled();

    const submit = screen.getByRole("button", { name: "Submit XYZ Report" });
    await userEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
