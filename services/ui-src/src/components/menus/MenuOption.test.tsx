import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
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
  it("should render its options with specified attributes", () => {
    render(menuOptionComponent);

    expect(
      screen.getByRole("img", { name: "option 1 alt text" })
    ).toBeVisible();
    expect(screen.getByText("Option1 text")).toBeVisible();
    expect(screen.getByAltText("option 1 alt text")).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: "option 2 alt text" })
    ).toBeVisible();
    expect(screen.getByText("Option2 text")).toBeVisible();
    expect(screen.getByAltText("option 2 alt text")).toBeInTheDocument();
  });

  testA11y(menuOptionComponent);
});
