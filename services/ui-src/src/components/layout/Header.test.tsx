import { act, render, screen } from "@testing-library/react";
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

    test("Logs out user", async () => {
      const menuButton = screen.getByRole("button", {
        name: "my account",
        expanded: false,
      });

      await act(async () => {
        await userEvent.click(menuButton);
      });

      const logoutButton = screen.getByRole("img", { name: "Logout" });
      expect(logoutButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(logoutButton);
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
  testA11y(headerComponent);
});
