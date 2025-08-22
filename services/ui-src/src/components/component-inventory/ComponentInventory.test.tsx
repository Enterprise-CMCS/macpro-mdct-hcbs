import { render, screen } from "@testing-library/react";
import { ComponentInventory } from "./ComponentInventory";

const mockUseParams = jest.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mockPageId",
});
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
}));

describe("ComponentInventory", () => {
  it("should render without error", () => {
    render(<ComponentInventory />);
    const header = screen.getByRole("heading", { name: "Component Inventory" });
    expect(header).toBeVisible();
  });
});
