import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { HelpPage } from "components/pages/HelpPage/HelpPage";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/help";

const helpView = (
  <RouterWrappedComponent>
    <HelpPage />
  </RouterWrappedComponent>
);

describe("Test HelpPage", () => {
  beforeEach(() => {
    render(helpView);
  });

  test("Check that HelpPage renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });
});

describe("Test HelpPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(helpView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
