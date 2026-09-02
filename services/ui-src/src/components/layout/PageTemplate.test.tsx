import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PageTemplate } from "components";
import { testA11y } from "utils/testing/commonTests";

const standardPageComponent = (
  <PageTemplate type="standard">
    <p>Standard Test Text</p>
  </PageTemplate>
);

const reportPageComponent = (
  <PageTemplate type="report">
    <p>Report Test Text</p>
  </PageTemplate>
);

describe("<PageTemplate />", () => {
  describe("standard", () => {
    it("should render standard page contents", () => {
      const { getByText } = render(standardPageComponent);
      expect(getByText("Standard Test Text")).toBeVisible();
    });

    testA11y(standardPageComponent);
  });

  describe("report", () => {
    it("should render report page contents", () => {
      const { getByText } = render(reportPageComponent);
      expect(getByText("Report Test Text")).toBeVisible();
    });

    testA11y(reportPageComponent);
  });
});
