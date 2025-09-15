import { PCPIntroductionCard } from "./PCPIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <PCPIntroductionCard />
  </RouterWrappedComponent>
);

describe("PCPIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("When is the Person-Centered Planning Report Due?", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
