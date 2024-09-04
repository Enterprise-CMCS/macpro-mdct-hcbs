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
      ).toHaveAttribute("alt", "Department of Health and Human Services, USA");
      expect(screen.getByRole("img", { name: "HCBS logo" })).toHaveAttribute(
        "alt",
        "HCBS logo"
      );
      expect(
        screen.getByRole("img", {
          name: "Medicaid.gov: Keeping America Healthy",
        })
      ).toHaveAttribute("alt", "Medicaid.gov: Keeping America Healthy");
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
