import { render, screen } from "@testing-library/react";
import { HelpPage } from "components/pages/HelpPage/HelpPage";
import { RouterWrappedComponent } from "utils/testing/setupJest";
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
    expect(screen.getByRole("heading")).toHaveTextContent(
      "How can we help you?"
    );
  });

  test("Check for email links", () => {
    const email1 = screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" });
    expect(email1).toHaveAttribute("href", "mailto:mdct_help@cms.hhs.gov");
    const email2 = screen.getByRole("link", {
      name: "LABSQuality@cms.hhs.gov",
    });
    expect(email2).toHaveAttribute("href", "mailto:LABSQuality@cms.hhs.gov");
  });
});

describe("Test HelpPage accessibility", () => {
  testA11y(helpView);
});
