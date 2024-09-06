import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { Card } from "components";

const cardComponent = (
  <Card>
    <p>Mock child component</p>
  </Card>
);

describe("Test Card", () => {
  beforeEach(() => {
    render(cardComponent);
  });

  test("Card is visible", () => {
    expect(screen.getByText("Mock child component")).toBeVisible();
  });

  testA11y(cardComponent);
});
