import { render, screen } from "@testing-library/react";
import { HelpPage } from "components/pages/HelpPage/HelpPage";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import verbiage from "verbiage/pages/help";
import { testA11y } from "utils/testing/commonTests";

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
  testA11y(helpView);
});
