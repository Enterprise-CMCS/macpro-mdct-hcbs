import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { Footer } from "components";
import { testA11y } from "utils/testing/commonTests";

const footerComponent = (
  <RouterWrappedComponent>
    <Footer />
  </RouterWrappedComponent>
);

describe("<Footer />", () => {
  it("should render correctly", () => {
    render(footerComponent);

    expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "footer");

    expect(
      screen.getByRole("img", {
        name: "Department of Health and Human Services, USA",
      })
    ).toBeVisible();
    expect(screen.getByRole("img", { name: "HCBS logo" })).toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "Medicaid.gov: Keeping America Healthy",
      })
    ).toBeVisible();

    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute(
      "href",
      "/help"
    );

    expect(
      screen.getByRole("link", { name: "Accessibility Statement" })
    ).toHaveAttribute(
      "href",
      "https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/CMSNondiscriminationNotice"
    );
  });

  testA11y(footerComponent);
});
