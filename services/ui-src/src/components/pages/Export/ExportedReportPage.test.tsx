import { screen, render } from "@testing-library/react";
import { useStore } from "utils";
import { ExportedReportPage } from "./ExportedReportPage";
import { PageType, PageStatus } from "types";

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
    { title: "Section 3", id: "req-measure-result" },
    { title: "Section 4", id: "review-submit" },
    {
      title: "Section 5",
      id: "id-5",
      type: PageType.Measure,
      required: false,
      status: PageStatus.NOT_STARTED,
    },
    {
      title: "Section 6",
      id: "id-6",
      type: PageType.MeasureResults,
      status: PageStatus.NOT_STARTED,
    },
    {
      title: "Section 7",
      id: "id-7",
      type: PageType.Measure,
      status: PageStatus.NOT_STARTED,
      required: true,
    },
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

  it("Should not render filtered sections", () => {
    render(<ExportedReportPage></ExportedReportPage>);
    expect(screen.queryByText("Section 4")).not.toBeInTheDocument();
  });

  it("Should not render optional measures which are not started", () => {
    render(<ExportedReportPage></ExportedReportPage>);
    expect(screen.queryByText("Section 5")).not.toBeInTheDocument();
  });

  it("Should not render measure results which are not started", () => {
    render(<ExportedReportPage></ExportedReportPage>);
    expect(screen.queryByText("Section 6")).not.toBeInTheDocument();
  });
  it("Should render Required Measures Heading", () => {
    render(<ExportedReportPage></ExportedReportPage>);
    expect(screen.queryByText("Required Measures")).toBeInTheDocument();
  });
});
