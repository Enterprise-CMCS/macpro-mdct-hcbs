import { act, render, screen } from "@testing-library/react";
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

    test("Logo, Help and Menu is visible on Header", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
      expect(screen.getByAltText("HCBS logo")).toBeVisible();
      expect(screen.getByAltText("Help")).toBeVisible();
      expect(screen.getByAltText("Account")).toBeVisible();
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });

    test("When My Account menu is clicked, it expands", async () => {
      const menuButton = screen.getByRole("button", {
        name: "my account",
        expanded: false,
      });
      expect(menuButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(menuButton);
      });
      expect(
        screen.getByRole("button", { name: "my account", expanded: true })
      ).toBeInTheDocument();
    });

    test("Logs out user", () => {
      // TO-DO mock log out and test that user is logged out when button is clicked
      render(
        <MenuOption
          text={"Log Out"}
          icon={"icon_arrow_right_square.png"}
          altText={"Logout"}
        />
      );

      const logoutButton = screen.getByRole("img", { name: "Logout" });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  testA11y(headerComponent);
});
