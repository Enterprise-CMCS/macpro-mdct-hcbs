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
  test("Get by link", () => {
    render(errorAlertComponent);
    expect(
      screen.getByRole("link", { name: "mdct_help@cms.hhs.gov" })
    ).toBeVisible();
  });
  test("Find error alert", () => {
    render(errorAlertComponent);
    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "We've run into a problem"
    );
  });
  test("does not render the Alert when error is null", () => {
    render(<ErrorAlert error={undefined} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  testA11y(errorAlertComponent);
});
