import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFoundPage } from "components";
import { testA11y } from "utils/testing/commonTests";

const notFoundView = <NotFoundPage />;

describe("<NotFoundPage />", () => {
  it("should render correctly", () => {
    render(notFoundView);
    const heading = screen.getByRole("heading", { name: "Page not found" });
    expect(heading).toBeVisible();
  });

  testA11y(notFoundView);
});
