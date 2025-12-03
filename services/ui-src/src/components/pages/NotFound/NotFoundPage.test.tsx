import { render, screen } from "@testing-library/react";
// components
import { NotFoundPage } from "components";
import { testA11y } from "utils/testing/commonTests";

const notFoundView = <NotFoundPage />;

describe("<NotFoundPage />", () => {
  test("Check that page renders", () => {
    render(notFoundView);
    const heading = screen.getByRole("heading", { name: "Page not found" });
    expect(heading).toBeVisible();
  });

  testA11y(notFoundView);
});
