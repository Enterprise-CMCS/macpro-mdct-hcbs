import { render } from "@testing-library/react";
import { Error } from "components";
import { testA11y } from "utils/testing/commonTests";

const errorView = <Error />;

describe("<Error />", () => {
  test("Check that Error message renders", () => {
    const { getByRole } = render(errorView);
    expect(getByRole("heading", { level: 2 })).toHaveTextContent(
      "Sorry! An error has occurred."
    );
  });

  testA11y(errorView);
});
