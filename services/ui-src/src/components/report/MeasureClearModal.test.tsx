import { render, screen } from "@testing-library/react";
import { mockMeasureTemplate } from "utils/testing/setupJest";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { MeasureClearModal } from "./MeasureClearModal";

const mockClose = jest.fn();
const mockSubmit = jest.fn();

describe("Test MeasureClearModal", () => {
  it("Test MeasureClearModal Render", async () => {
    const modal = MeasureClearModal(
      mockMeasureTemplate.id,
      mockClose,
      mockSubmit
    );
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const cancelBtn = screen.getByText("Cancel");
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalled();

    const submit = screen.getByText("Clear measure data");
    await userEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
