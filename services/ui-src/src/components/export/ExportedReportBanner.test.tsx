import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExportedReportBanner } from "./ExportedReportBanner";
import userEvent from "@testing-library/user-event";

vi.spyOn(window, "print").mockImplementation(() => {});

describe("ExportedReportBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call window.print to download a PDF", async () => {
    render(<ExportedReportBanner reportName="" />);
    expect(screen.getByText(/Click below to export/)).toBeInTheDocument();

    await userEvent.click(screen.getByText("Download PDF"));
    expect(window.print).toHaveBeenCalled();
  });
});
