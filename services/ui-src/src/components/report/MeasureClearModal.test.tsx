import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { mockMeasureTemplate } from "utils/testing/setupTests";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { MeasureClearModal } from "./MeasureClearModal";

const mockClose = vi.fn();
const mockSubmit = vi.fn();

describe("MeasureClearModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call its handlers when its buttons are clicked", async () => {
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

    await userEvent.click(screen.getByText("Cancel"));
    expect(mockClose).toHaveBeenCalled();

    await userEvent.click(screen.getByText("Clear measure data"));
    expect(mockSubmit).toHaveBeenCalled();
  });
});
