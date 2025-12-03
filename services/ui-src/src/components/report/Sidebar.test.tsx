import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupJest";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useStore } from "utils";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(),
}));

const setCurrentPageId = jest.fn();
const mockUseNavigate = jest.fn();

const mockPageMap = new Map();
mockPageMap.set("root", 0);
mockPageMap.set("id-1", 1);
mockPageMap.set("id-2", 2);
mockPageMap.set("child-1", 3);

const report = {
  pages: [
    { childPageIds: ["id-1", "id-2"], id: "root" },
    { title: "Section 1", id: "id-1", childPageIds: ["child-1"] },
    { title: "Section 2", id: "id-2" },
    { title: "Child 1", id: "child-1" },
  ],
};

describe("Sidebar", () => {
  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: mockPageMap,
      report,
      currentPageId: "id-1",
      setCurrentPageId,
    });
    (useParams as jest.Mock).mockReturnValue({
      reportType: "exampleReport",
      state: "exampleState",
      reportId: "123",
    });
  });
  test("should not render if missing details from the store", () => {
    (useStore as unknown as jest.Mock).mockReturnValueOnce({
      pageMap: undefined,
      report: undefined,
      currentPageId: undefined,
      setCurrentPageId,
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
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
  });

  test("should attempt to navigate on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    const link = screen.getByText("Section 1");
    await userEvent.click(link);
    const reportPath = "/report/exampleReport/exampleState/123/id-1";
    expect(mockUseNavigate).toHaveBeenCalledWith(reportPath);
  });

  test("should expand on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const expandButton = screen.getByAltText("Expand subitems");
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await userEvent.click(expandButton);

    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });
});
