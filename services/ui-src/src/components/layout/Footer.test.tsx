import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Footer } from "components";
import { testA11y } from "utils/testing/commonTests";

const footerComponent = (
  <RouterWrappedComponent>
    <Footer />
  </RouterWrappedComponent>
);

describe("<Footer />", () => {
  describe("Test Footer", () => {
    beforeEach(() => {
      render(footerComponent);
    });

    test("Footer is visible", () => {
      expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "footer");
    });

    test("Images on footer are visible", () => {
      expect(
        screen.getByRole("img", {
          name: "Department of Health and Human Services, USA",
        })
      ).toBeVisible();
      expect(screen.getByRole("img", { name: "LABS logo" })).toBeVisible();
      expect(
        screen.getByRole("img", {
          name: "Medicaid.gov: Keeping America Healthy",
        })
      ).toBeVisible();
    });

    test("Links are visible", async () => {
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
  });
  testA11y(footerComponent);
});
