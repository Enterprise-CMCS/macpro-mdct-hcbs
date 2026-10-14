import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Error } from "components";
import { testA11y } from "utils/testing/commonTests";

const errorView = <Error />;

describe("<Error />", () => {
  it("should render an error message", () => {
    render(errorView);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Sorry! An error has occurred."
    );
  });

  testA11y(errorView);
});
