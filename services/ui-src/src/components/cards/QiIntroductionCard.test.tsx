import { QiIntroductionCard } from "./QiIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <QiIntroductionCard />
  </RouterWrappedComponent>
);

describe("QiIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("When are the Quality Improvement Plans Due?")
    ).toBeVisible();
  });

  testA11yAct(component);
});
