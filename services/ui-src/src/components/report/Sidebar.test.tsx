import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useStore } from "../../utils/state/useStore";

jest.mock("../../utils/state/useStore", () => ({
  useStore: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const setCurrentPageId = jest.fn();
const mockNavigate = jest.fn();

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
    useStore.mockReturnValue({
      pageMap: mockPageMap,
      report,
      currentPageId: "id-1",
      setCurrentPageId,
    });
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({
      reportType: "exampleReport",
      state: "exampleState",
      reportId: "123",
    });
  });
  test("should not render if missing details from the store", () => {
    useStore.mockReturnValueOnce({
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
    const button = screen.getByText("Section 1");
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenLastCalledWith(
      "/report/exampleReport/exampleState/123/id-1"
    );
  });

  test("should expand on Click", async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const expandButton = screen.getByAltText("Expand subitems");
    expect(screen.queryByText("Child 1")).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(expandButton);
    });

    expect(screen.getByText("Child 1")).toBeInTheDocument();
  });
});
