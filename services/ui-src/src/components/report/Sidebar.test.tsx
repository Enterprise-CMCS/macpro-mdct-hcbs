import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const mockPageMap = new Map();
mockPageMap.set("root", 0);
mockPageMap.set("id-1", 1);
mockPageMap.set("id-2", 2);
mockPageMap.set("child-1", 3);

const report = {
  type: "QM",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { childPageIds: ["id-1", "id-2"], id: "root" },
    { title: "Section 1", id: "id-1", childPageIds: ["child-1"] },
    { title: "Section 2", id: "id-2" },
    { title: "Child 1", id: "child-1" },
  ],
};

const mockReportStore = jest.fn().mockImplementation(() => ({
  pageMap: mockPageMap,
  report: report,
  currentPageId: "id-1",
}));

jest.mock("../../utils/state/useStore", () => ({
  useStore: () => mockReportStore(),
}));

describe("Sidebar", () => {
  test("should not render if missing details from the store", () => {
    mockReportStore.mockReturnValueOnce({
      pageMap: undefined,
      report: undefined,
      currentPageId: undefined,
    });
    const { container } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("should not render if missing root in page map", () => {
    mockReportStore.mockReturnValueOnce({
      pageMap: new Map(),
      report: report,
      currentPageId: "id-1",
    });
    const { container } = render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("should render section headers", () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    expect(screen.getByText("Section 1")).toBeTruthy();
    expect(screen.getByText("Section 2")).toBeTruthy();
  });

  test("should attempt to navigate on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const button = screen.getByRole("link", { name: /Section 2/i });
    const reportPath = `/report/${report.type}/${report.state}/${report.id}/id-2`;
    expect(button).toHaveAttribute("href", reportPath);
  });

  test("should expand on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const expandButton = screen.getByAltText("Expand subitems");
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
    expect(screen.getByText("Section 1")).toBeTruthy();
    await act(async () => {
      await userEvent.click(expandButton);
    });
    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });
});
