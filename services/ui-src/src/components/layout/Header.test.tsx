import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Header } from "components";
import { testA11y } from "utils/testing/commonTests";

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("<Header />", () => {
  describe("Test Header", () => {
    beforeEach(() => {
      render(headerComponent);
    });

    test("Header is visible", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
    });

    test("Logo is visible", () => {
      expect(screen.getByAltText("HCBS logo")).toBeVisible();
    });

    test("Help button is visible", () => {
      expect(screen.getByAltText("Help")).toBeVisible();
    });

    test("Menu button is visible", () => {
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });
  });

  testA11y(headerComponent);
});
