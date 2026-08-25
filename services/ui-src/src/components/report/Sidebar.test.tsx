import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useStore } from "utils";
import { Report } from "types";

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: () => mockUseNavigate,
  useParams: vi.fn(),
}));

const setCurrentPageId = vi.fn();
const mockUseNavigate = vi.fn();

const mockPageMap = new Map([
  ["root", 0],
  ["id-1", 1],
  ["id-2", 2],
  ["child-1", 3],
]);

const report = {
  pages: [
    { childPageIds: ["id-1", "id-2"], id: "root" },
    { navTitle: "Section 1", id: "id-1", childPageIds: ["child-1"] },
    { navTitle: "Section 2", id: "id-2" },
    { navTitle: "Child 1", id: "child-1" },
  ],
} as Report;

const testComponent = (
  <Router>
    <Sidebar />
  </Router>
);

describe("Sidebar", () => {
  beforeEach(() => {
    useStore.setState({
      pageMap: mockPageMap,
      report,
      currentPageId: "id-1",
      setCurrentPageId,
    });
    vi.mocked(useParams).mockReturnValue({
      reportType: "exampleReport",
      state: "exampleState",
      reportId: "123",
    });
  });

  it("should not render if missing details from the store", () => {
    useStore.setState({
      pageMap: undefined,
      report: undefined,
      currentPageId: undefined,
      setCurrentPageId,
    });

    const { container } = render(testComponent);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render section headers", () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  it("should navigate on link click", async () => {
    render(testComponent);
    const link = screen.getByText("Section 1");
    await userEvent.click(link);
    const reportPath = "/report/exampleReport/exampleState/123/id-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(reportPath);
  });

  it("should expand on button click", async () => {
    render(testComponent);

    const expandButton = screen.getByAltText("Expand subitems");
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await userEvent.click(expandButton);

    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });
});
