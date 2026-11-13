import { describe, expect, it } from "vitest";
import { HDCWCIntroductionCard } from "./HDCWCIntroductionCard";
import { render, screen } from "@testing-library/react";
import { testA11yAct } from "utils/testing/commonTests";
import { RouterWrappedComponent } from "utils/testing/mockRouter";

const component = (
  <RouterWrappedComponent>
    <HDCWCIntroductionCard />
  </RouterWrappedComponent>
);

describe("HDCWCIntroductionCard", () => {
  it("should render", () => {
    render(component);
    expect(
      screen.getByText("HCBS Direct Care Worker Compensation Report")
    ).toBeVisible();
    expect(screen.getByText("Enter HDCWC online")).toBeVisible();
  });

  testA11yAct(component);
});
