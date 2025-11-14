import { WWLIntroductionCard } from "./WWLIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <WWLIntroductionCard />
  </RouterWrappedComponent>
);

describe("WWLIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("When is the Waiver Waiting List Report due?", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
