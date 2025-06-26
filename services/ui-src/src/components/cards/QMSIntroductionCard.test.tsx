import { QmsIntroductionCard } from "./QmsIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11y } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <QmsIntroductionCard />
  </RouterWrappedComponent>
);

describe("QmsIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("The HCBS QMS report is now available.", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11y(component);
});
