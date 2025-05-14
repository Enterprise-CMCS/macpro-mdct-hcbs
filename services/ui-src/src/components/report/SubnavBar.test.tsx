import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { SubnavBar } from "./SubnavBar";
import { ReportType } from "types";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

describe("Test SubnavBar component", () => {
  test("SubnavBar is visible", () => {
    render(
      <RouterWrappedComponent>
        <SubnavBar reportType="QMS" stateName={"PR"} />
      </RouterWrappedComponent>
    );
    expect(screen.getByText("PR QMS Report")).toBeVisible();
    expect(screen.getByRole("link", { name: "Leave form" })).toBeVisible();
  });

  test.each([
    { type: ReportType.QMS, text: "QMS Report" },
    { type: ReportType.TA, text: "TACM Report" },
    { type: ReportType.CI, text: "CICM Report" },
  ])("$type report type renders a title", ({ type, text }) => {
    render(
      <RouterWrappedComponent>
        <SubnavBar reportType={type} stateName={"PR"} />
      </RouterWrappedComponent>
    );
    expect(screen.getByText("PR " + text)).toBeVisible();
  });
});
