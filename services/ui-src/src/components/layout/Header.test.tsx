import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Header } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockLogout = jest.fn();

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={mockLogout} />
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
      // find img elements
      expect(screen.getByRole("img", { name: "LABS logo" })).toBeVisible();
      expect(screen.getByRole("img", { name: "Help" })).toBeVisible();
      expect(screen.getByRole("img", { name: "Account" })).toBeVisible();
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });

    test("When My Account menu is clicked, it expands", async () => {
      // Find button
      const menuButton = screen.getByRole("button", {
        name: "my account",
        expanded: false,
      });
      expect(menuButton).toBeInTheDocument();
      // Click and expand
      await userEvent.click(menuButton);

      expect(
        screen.getByRole("button", { name: "my account", expanded: true })
      ).toBeInTheDocument();
    });

    test("Logs out user", async () => {
      // Find button
      const menuButton = screen.getByRole("button", { name: "my account" });
      await userEvent.click(menuButton);

      // Click and expand
      const logoutButton = screen.getByAltText("Logout");
      expect(logoutButton).toBeInTheDocument();
      await userEvent.click(logoutButton);

      // Mock logout
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  testA11y(headerComponent);
});
