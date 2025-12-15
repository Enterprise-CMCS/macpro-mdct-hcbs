import { render, screen } from "@testing-library/react";
import { ExportedReportBanner } from "./ExportedReportBanner";
import userEvent from "@testing-library/user-event";

describe("ExportedReportBanner", () => {
  beforeEach(() => {
    render(<ExportedReportBanner reportName=""></ExportedReportBanner>);
    jest.spyOn(window, "print").mockImplementation(() => {});
  });
  it("ExportedReportBanner is visible", () => {
    expect(
      screen.getByText("Click below to export", { exact: false })
    ).toBeInTheDocument();
  });
  it("Test click of print button", async () => {
    const pdfButton = screen.getByText("Download PDF");
    await userEvent.click(pdfButton);
    expect(window.print).toHaveBeenCalled();
  });
});
