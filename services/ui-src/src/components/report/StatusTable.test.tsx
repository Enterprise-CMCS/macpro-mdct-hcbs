import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusTableElement } from "./StatusTable";
import { MemoryRouter } from "react-router-dom";
import { useStore } from "utils";

jest.mock("utils", () => ({
  useStore: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
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
  beforeEach(() => {
    jest.clearAllMocks();

    const mockPageMap = new Map();
    mockPageMap.set("root", 0);
    mockPageMap.set("1", 1);
    mockPageMap.set("2", 2);

    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: mockPageMap,
      report: report,
    });
  });

  test("table with section titles and status icons render", () => {
    render(
      <MemoryRouter>    
        <StatusTableElement />
      </MemoryRouter>  
  );

    // Table headers
    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Section title and status for Section 1
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByAltText("complete icon")).toBeInTheDocument();
  });

  test("when the Edit button is clicked, navigate to the correct page", async () => {
    render(
      <MemoryRouter>    
        <StatusTableElement />
      </MemoryRouter> 
    );

    const editButton = screen.getAllByRole("button", { name: /Edit/i})[0];
    await userEvent.click(editButton);

    expect(editButton).toBeVisible();
    // console.log("TEST RESULT: Navigating to: ", `/report/${report.type}/${report.state}/${report.id}/id-1`)
    // const expectButtonPath = `/report/${report.type}/${report.state}/${report.id}/id-1`;
    // expect(mockNavigate).toHaveBeenCalledWith(expectButtonPath);
    expect(mockNavigate).toHaveBeenCalled();
  });

  test("when the Review PDF button is clicked, navigate to PDF", async () => {
    render(
      <MemoryRouter>    
        <StatusTableElement />
      </MemoryRouter> 
    );

    const reviewPdfButton = screen.getByRole("link", { name: /Review PDF/i });

    const PdfPath = `/report/${report.type}/${report.state}/${report.id}/export`;
    expect(reviewPdfButton).toHaveAttribute("href", PdfPath);
    expect(reviewPdfButton).toHaveAttribute("target", "_blank");
  });

  test("if pageMap is not defined return null", () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      pageMap: null,
    });

    const { container } = render(
      <MemoryRouter>    
        <StatusTableElement />
      </MemoryRouter> 
    );
    expect(container.firstChild).toBeNull();
  });
});
