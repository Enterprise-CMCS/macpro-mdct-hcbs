import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { useNavigate } from "react-router-dom";
import { useStore } from "utils";

jest.mock("assets/icons/status/icon_status_check.svg", () => "iconStatusCheck");
jest.mock("assets/icons/status/icon_status_alert.svg", () => "iconStatusError");
jest.mock("assets/icons/edit/icon_edit_primary.svg", () => "editIconPrimary");
jest.mock(
  "assets/icons/search/icon_search_primary.svg",
  () => "lookupIconPrimary"
);

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("utils", () => ({
  useStore: jest.fn(),
}));

describe("StatusTableElement", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("should render the table with section title and status icon", () => {
    const mockPageMap = new Map();
    mockPageMap.set("root", { childPageIds: ["1", "2"] });
    mockPageMap.set("1", { title: "Section 1" });
    mockPageMap.set("2", { title: "Section 2" });

    (useStore as jest.Mock).mockReturnValue({
      pageMap: mockPageMap,
    });

    render(<StatusTableElement />);

    // Table headers
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Section title rendered
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByAltText("icon description")).toBeInTheDocument();

    // icon
    const editButtons = screen.getByRole("button", { name: /Edit/i });
    expect(editButtons).toBeInTheDocument();
  });

  it("should navigate to PDF when Review PDF button is clicked", async () => {
    const mockPageMap = new Map();
    mockPageMap.set("root", { childPageIds: ["1"] });
    mockPageMap.set("1", { title: "Section 1" });

    (useStore as jest.Mock).mockReturnValue({
      pageMap: mockPageMap,
    });

    render(<StatusTableElement />);

    const reviewPdfButton = screen.getByRole("button", { name: /Review PDF/i });
    await userEvent.click(reviewPdfButton);

    expect(mockNavigate).toHaveBeenCalledWith("PDF");
  });

  it("should return null if pageMap is not defined", () => {
    (useStore as jest.Mock).mockReturnValue({
      pageMap: null,
    });

    const { container } = render(<StatusTableElement />);
    expect(container.firstChild).toBeNull();
  });
});
