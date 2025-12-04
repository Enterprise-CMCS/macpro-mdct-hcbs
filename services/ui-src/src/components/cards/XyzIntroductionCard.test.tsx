import { XyzIntroductionCard } from "./XyzIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <XyzIntroductionCard />
  </RouterWrappedComponent>
);

describe("XyzIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("When is the XYZ Report Due?", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
