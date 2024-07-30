import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Header, MenuOption } from "components";
import { testA11y } from "utils/testing/commonTests";

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("<Header />", () => {
  describe("Test Visibility of Header", () => {
    beforeEach(() => {
      render(headerComponent);
    });

    test("Navigation, Logo, Help and Menu is visible on Header", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
      expect(screen.getByAltText("HCBS logo")).toBeVisible();
      expect(screen.getByAltText("Help")).toBeVisible();
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });

    test("Renders My Account menu and is clickable", () => {
      render(
        <MenuOption
          text={"My Account"}
          icon={"icon_arrrow_down.png"}
          altText={"Arrow down"}
        />
      );

      const menuButton = screen.getByRole("button", { name: /my account/i });
      expect(menuButton).toBeInTheDocument();

      userEvent.click(menuButton);
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

      userEvent.click(logoutButton);
    });
  });

  testA11y(headerComponent);
});
