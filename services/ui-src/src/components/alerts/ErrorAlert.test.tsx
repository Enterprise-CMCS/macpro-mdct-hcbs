import { render, screen } from "@testing-library/react";
import { ErrorAlert } from "components";
import { ErrorVerbiage } from "types";
import { genericErrorContent } from "verbiage/errors";
import { testA11y } from "utils/testing/commonTests";

const error: ErrorVerbiage = {
  title: "We've run into a problem",
  description: genericErrorContent,
};

const errorAlertComponent = <ErrorAlert error={error} />;

describe("<ErrorAlert />", () => {
  beforeEach(() => {
    render(errorAlertComponent);
  });
  test("Get by link", () => {
    expect(
      screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" })
    ).toBeVisible();
  });

  test("Find error in the alert", () => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We've run into a problem"
    );
  });

  testA11y(errorAlertComponent);
});
