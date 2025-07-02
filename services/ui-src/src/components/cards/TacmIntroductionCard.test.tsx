import { TacmIntroductionCard } from "./TacmIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <TacmIntroductionCard />
  </RouterWrappedComponent>
);

describe("TacmIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("The Timely Access Compliance Measures support", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
