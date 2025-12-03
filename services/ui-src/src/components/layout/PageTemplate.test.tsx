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
    test("Check that PageTemplate (standard) renders", () => {
      const { getByText } = render(standardPageComponent);
      expect(getByText("Standard Test Text")).toBeVisible();
    });

    testA11y(standardPageComponent);
  });

  describe("report", () => {
    test("Check that PageTemplate (report) renders", () => {
      const { getByText } = render(reportPageComponent);
      expect(getByText("Report Test Text")).toBeVisible();
    });

    testA11y(reportPageComponent);
  });
});
