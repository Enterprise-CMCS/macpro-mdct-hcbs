import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { MenuOption } from "components";
import { testA11y } from "utils/testing/commonTests";

const menuOptionComponent = (
  <RouterWrappedComponent>
    <MenuOption
      text={"Option1 text"}
      icon={"icon.png"}
      altText={"option 1 alt text"}
    />
    <MenuOption
      text={"Option2 text"}
      icon={"icon2.png"}
      altText={"option 2 alt text"}
    />
  </RouterWrappedComponent>
);

describe("<Menu Options/>", () => {
  beforeEach(() => {
    render(menuOptionComponent);
  });
  test("Option 1 & attributes", () => {
    expect(
      screen.getByRole("img", { name: "option 1 alt text" })
    ).toBeVisible();
    expect(screen.getByText("Option1 text")).toBeVisible();
    expect(screen.getByAltText("option 1 alt text")).toBeInTheDocument();
  });

  test("Option 2 & attributes", () => {
    expect(
      screen.getByRole("img", { name: "option 2 alt text" })
    ).toBeVisible();
    expect(screen.getByText("Option2 text")).toBeVisible();
    expect(screen.getByAltText("option 2 alt text")).toBeInTheDocument();
  });

  testA11y(menuOptionComponent);
});
