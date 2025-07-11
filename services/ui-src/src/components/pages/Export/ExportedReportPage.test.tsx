import { screen, render } from "@testing-library/react";
import { useStore } from "utils";
import { ExportedReportPage } from "./ExportedReportPage";

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useStore: jest.fn(),
}));

const report = {
  type: "QMS",
  id: "mock-report-id",
  state: "CO",
  name: "mock-title",
  pages: [
    { childPageIds: ["1", "2"] },
    { title: "Section 1", id: "id-1" },
    { title: "Section 2", id: "id-2" },
  ],
  lastEdited: 1751987780396,
  lastEditedBy: "last edited",
  status: "In progress",
  options: {
    cahps: true,
    nciidd: false,
    nciad: true,
    pom: false,
  },
};

describe("ExportedReportPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockReturnValue({
      report: report,
    });
  });
  it("ExportReportPage is visible", () => {
    render(<ExportedReportPage></ExportedReportPage>);
    expect(
      screen.getByText("Colorado Quality Measure Set Report for: mock-title")
    ).toBeInTheDocument();
  });
});
