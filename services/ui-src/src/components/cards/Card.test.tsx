import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { Card } from "components";

const cardComponent = (
  <Card>
    <p>Mock child component</p>
  </Card>
);

describe("<Card/>", () => {
  it("should render its children", () => {
    render(cardComponent);
    expect(screen.getByText("Mock child component")).toBeVisible();
  });

  testA11y(cardComponent);
});
