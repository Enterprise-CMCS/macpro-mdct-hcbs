import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ComponentInventory } from "./ComponentInventory";

const mockUseParams = vi.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mockPageId",
});
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
}));

describe("ComponentInventory", () => {
  it("should render without error", () => {
    render(
      <MemoryRouter>
        <ComponentInventory />
      </MemoryRouter>
    );
    const header = screen.getByRole("heading", { name: "Component Inventory" });
    expect(header).toBeVisible();
  });
});
