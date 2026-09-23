import { describe, expect, it } from "vitest";
import { HaIntroductionCard } from "./HaIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <HaIntroductionCard />
  </RouterWrappedComponent>
);

describe("HaIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("The HCBS Access (HA) report supports", {
        exact: false,
      })
    ).toBeVisible();
  });

  testA11yAct(component);
});
