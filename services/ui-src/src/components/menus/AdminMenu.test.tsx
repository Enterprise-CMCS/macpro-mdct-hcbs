import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { AdminMenu } from "components";
import { testA11y } from "utils/testing/commonTests";

const menuComponent = (
  <RouterWrappedComponent>
    <AdminMenu />
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  it("should contain a working link to the banner editor", async () => {
    render(menuComponent);
    await userEvent.click(screen.getByRole("button", { name: "admin menu" }));

    const bannerButton = screen.getByText("Banner Editor");
    await userEvent.click(bannerButton);

    expect(window.location.pathname).toEqual("/admin");
  });

  testA11y(menuComponent);
});
