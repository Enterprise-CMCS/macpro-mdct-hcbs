import { render, screen } from "@testing-library/react";
import { HelpPage } from "components/pages/HelpPage/HelpPage";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import verbiage from "verbiage/pages/help";
import { testA11y } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";

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
    expect(screen.getByText(verbiage.intro.header)).toHaveTextContent(
      "How can we help you?"
    );
  });

  test("Check for email links", () => {
    const email1 = screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" });
    expect(email1).toHaveAttribute("href", "mailto:mdct_help@cms.hhs.gov");
    const email2 = screen.getByRole("link", { name: "MFPDemo@cms.hhs.gov" });
    expect(email2).toHaveAttribute("href", "mailto:MFPDemo@cms.hhs.gov");
  });

  test("Question 1: When Expand button clicked it expands", async () => {
    const button = screen.getByRole("button", {
      name: "How do I log into my IDM account?",
      expanded: false,
    });
    await userEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: "How do I log into my IDM account?",
        expanded: true,
      })
    ).toBeInTheDocument();
  });

  test("Question 2: When Expand button clicked it expands", async () => {
    const button = screen.getByRole("button", {
      name: "Question #2",
      expanded: false,
    });
    await userEvent.click(button);

    expect(
      screen.getByRole("button", { name: "Question #2", expanded: true })
    ).toBeInTheDocument();
  });
});

describe("Test HelpPage accessibility", () => {
  testA11y(helpView);
});
