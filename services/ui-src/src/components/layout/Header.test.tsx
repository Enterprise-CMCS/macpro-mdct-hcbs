import { fireEvent, render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Header, MenuOption } from "components";
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

    test("Renders My Account and is clickable", () => {
      render(
        <MenuOption
          text={"My Account"}
          icon={"icon_arrrow_down.png"}
          altText={"Arrow down"}
        />
      );

      const menuButton = screen.getByRole("button", { name: /my account/i });
      expect(menuButton).toBeInTheDocument();

      fireEvent.click(menuButton);
    });

    test("Logs out user", () => {
      render(
        <MenuOption
          text={"Log Out"}
          icon={"icon_arrow_right_square.png"}
          altText={"Logout"}
        />
      );

      const logoutButton = screen.getByRole("img", { name: /Logout/i });
      expect(logoutButton).toBeInTheDocument();

      fireEvent.click(logoutButton);
    });
  });

  testA11y(headerComponent);
});
