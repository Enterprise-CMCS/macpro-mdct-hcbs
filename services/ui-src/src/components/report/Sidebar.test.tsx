import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./Sidebar";

const setCurrentPageId = jest.fn();
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

const mockReportStore = jest.fn().mockImplementation(() => ({
  pageMap: mockPageMap,
  report: report,
  currentPageId: "id-1",
  setCurrentPageId,
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
      setCurrentPageId,
    });
    const { container } = render(<Sidebar />);
    expect(container).toBeEmptyDOMElement();
  });

  test("should not render if missing root in page map", () => {
    mockReportStore.mockReturnValueOnce({
      pageMap: new Map(),
      report: report,
      currentPageId: "id-1",
      setCurrentPageId,
    });
    const { container } = render(<Sidebar />);
    expect(container).toBeEmptyDOMElement();
  });

  test("should render section headers", () => {
    const { getByText } = render(<Sidebar />);
    expect(getByText("Section 1")).toBeTruthy();
    expect(getByText("Section 2")).toBeTruthy();
  });

  test("should attempt to navigate on Click", async () => {
    const { getByText } = render(<Sidebar />);
    const button = getByText("Section 1");
    await userEvent.click(button);
    expect(setCurrentPageId).toHaveBeenCalledWith("id-1");
  });

  test("should expand on Click", async () => {
    const { getByText, queryByText } = render(<Sidebar />);

    expect(getByText("Section 1")).toBeTruthy();
    await act(async () => {
      const button = screen.getByAltText("Expand subitems");
      await userEvent.click(button);
    });
    expect(queryByText("Child 1")).toBeInTheDocument();
  });
});
