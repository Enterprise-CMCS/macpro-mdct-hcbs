import { CiIntroductionCard } from "./CiIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <CiIntroductionCard />
  </RouterWrappedComponent>
);

describe("CiIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("The Critical Incident Reporting", { exact: false })
    ).toBeVisible();
  });

  testA11yAct(component);
});
