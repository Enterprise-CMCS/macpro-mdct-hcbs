import { render, screen } from "@testing-library/react";
import { ComponentInventory } from "./ComponentInventory";

describe("ComponentInventory", () => {
  it("should render without error", () => {
    render(<ComponentInventory />);
    const header = screen.getByRole("heading", { name: "Component Inventory" });
    expect(header).toBeVisible();
  });
});
