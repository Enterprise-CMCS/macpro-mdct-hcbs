import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { useNavigate } from "react-router-dom";
import { useStore } from "utils";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("utils", () => ({
  useStore: jest.fn(),
}));

const report = {
  type: "QM",
  id: "mock-report-id",
  state: "CO",
  pages: [
    { childPageIds: ["1", "2"] },
    { title: "Section 1", id: "id-1" },
    { title: "Section 2", id: "id-2" },
  ],
};

describe("StatusTableElement", () => {
  const mockNavigate = jest.fn();
  const setCurrentPageId = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();

    const mockPageMap = new Map();
    mockPageMap.set("root", 0);
    mockPageMap.set("1", 1);
    mockPageMap.set("2", 2);

    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: mockPageMap,
      report: report,
      setCurrentPageId,
    });
  });

  test("table with section titles and status icons render", () => {
    render(<StatusTableElement />);

    // Table headers
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Section title and status for Section 1
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByAltText("complete icon")).toBeInTheDocument();
  });

  test("when Edit button is clicked call setCurrentPageId with the correct pageId", async () => {
    render(<StatusTableElement />);

    const editButton = screen.getByRole("button", { name: /Edit/i });
    await userEvent.click(editButton);

    expect(setCurrentPageId).toHaveBeenCalledWith("id-1");
  });

  test("when the Review PDF button is clicked navigate to PDF", async () => {
    render(<StatusTableElement />);

    const reviewPdfButton = screen.getByRole("button", { name: /Review PDF/i });

    const path = `/report/${report.type}/${report.state}/${report.id}/export`;
    expect(reviewPdfButton).toHaveAttribute("to", path);

    await userEvent.click(reviewPdfButton);
  });

  test("if pageMap is not defined return null", () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: null,
    });

    const { container } = render(<StatusTableElement />);
    expect(container.firstChild).toBeNull();
  });
});
