import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkipNav } from "components";
import { testA11yAct } from "utils/testing/commonTests";

const skipNavComponent = (
  <>
    <SkipNav />
    <main id="main-content" tabIndex={-1}>
      Main content
    </main>
  </>
);

describe("<SkipNav />", () => {
  test("renders skip link with accessible text and becomes focusable", async () => {
    render(skipNavComponent);

    const skipNavLink = screen.getByRole("link", {
      name: "Skip to main content",
    });

    await userEvent.tab();

    expect(skipNavLink).toHaveAttribute("href", "#main-content");
    expect(skipNavLink).toHaveFocus();
    expect(skipNavLink).toBeVisible();
  });

  testA11yAct(skipNavComponent);
});
