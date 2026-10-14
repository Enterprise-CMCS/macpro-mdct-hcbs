import { describe, expect, it } from "vitest";
import { IMAIntroductionCard } from "./IMAIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <IMAIntroductionCard />
  </RouterWrappedComponent>
);

describe("IMAIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("When are the Incident Management Assessments Due?")
    ).toBeVisible();
  });

  testA11yAct(component);
});
