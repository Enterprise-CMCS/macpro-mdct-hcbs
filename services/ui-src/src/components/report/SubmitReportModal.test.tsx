import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { SubmitReportModal } from "./SubmitReportModal";
import { ReportType } from "types";

const mockClose = vi.fn();
const mockSubmit = vi.fn();

describe("SubmitReportModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", async () => {
    const modal = SubmitReportModal(mockClose, mockSubmit, ReportType.QMS);
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

  it("should label the submit button with the report type", async () => {
    const modal = SubmitReportModal(mockClose, mockSubmit, ReportType.TACM);
    render(
      <Modal isOpen={true} onClose={mockClose}>
        {modal}
      </Modal>
    );

    const submit = screen.getByRole("button", { name: "Submit TACM Report" });
    expect(submit).toBeVisible();
  });
});
