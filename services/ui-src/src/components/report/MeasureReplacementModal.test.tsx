import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockMeasureTemplate } from "utils/testing/setupTests";
import { MeasureReplacementModal } from "./MeasureReplacementModal";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

const mockClose = vi.fn();
const mockSubmit = vi.fn();

describe("MeasureReplacementModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render and behave correctly", async () => {
    const modal = MeasureReplacementModal(
      mockMeasureTemplate,
      mockClose,
      mockSubmit
    );
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const radioYes = screen.getByLabelText("Yes");
    await userEvent.click(radioYes);
    expect(radioYes).toBeChecked();

    const radioNo = screen.getByLabelText("Yes");
    await userEvent.click(radioNo);
    expect(radioNo).toBeChecked();

    const cancelBtn = screen.getByText("Cancel");
    await userEvent.click(cancelBtn);
    expect(mockClose).toHaveBeenCalled();

    const submit = screen.getByText("Substitute Measure");
    await userEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
