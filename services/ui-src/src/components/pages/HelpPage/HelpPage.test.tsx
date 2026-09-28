import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpPage } from "components/pages/HelpPage/HelpPage";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const helpView = (
  <RouterWrappedComponent>
    <HelpPage />
  </RouterWrappedComponent>
);

describe("HelpPage", () => {
  it("should render correctly", () => {
    render(helpView);

    expect(screen.getByRole("heading")).toHaveTextContent(
      "How can we help you?"
    );

    const email1 = screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" });
    expect(email1).toHaveAttribute("href", "mailto:mdct_help@cms.hhs.gov");
    const email2 = screen.getByRole("link", {
      name: "HCBSQuality@cms.hhs.gov",
    });
    expect(email2).toHaveAttribute("href", "mailto:HCBSQuality@cms.hhs.gov");
  });

  testA11y(helpView);
});
