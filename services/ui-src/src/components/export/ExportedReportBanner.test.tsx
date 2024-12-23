import { render, screen } from "@testing-library/react";
import { ExportedReportBanner } from "./ExportedReportBanner";
import userEvent from "@testing-library/user-event";
import qmsVerbiage from "verbiage/export/qm-export";

describe("ExportedReportBanner", () => {
  beforeEach(() => {
    render(<ExportedReportBanner></ExportedReportBanner>);
    jest.spyOn(window, "print").mockImplementation(() => {});
  });
  it("ExportedReportBanner is visible", () => {
    expect(
      screen.getByText(qmsVerbiage.reportBanner.intro)
    ).toBeInTheDocument();
  });
  it("Test click of print button", async () => {
    const pdfButton = screen.getByText("Download PDF");
    await userEvent.click(pdfButton);
    expect(window.print).toBeCalled();
  });
});
