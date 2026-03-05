import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { SubnavBar } from "./SubnavBar";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockReport = {
  id: "1",
  name: "Sample Report",
  type: "mockType",
  state: "mockState",
};

const renderSubnavBar = () =>
  render(
    <RouterWrappedComponent>
      <SubnavBar />
    </RouterWrappedComponent>
  );

describe("Test SubnavBar component", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      lastSavedTime: "2 minutes ago",
    });
  });

  test("SubnavBar is visible with report name and Leave Form button", () => {
    renderSubnavBar();
    expect(screen.getByText(/Sample Report/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Leave form" })).toBeVisible();
  });

  test("Displays last saved time and check icon", () => {
    renderSubnavBar();
    expect(screen.getByText(/Last saved 2 minutes ago/)).toBeInTheDocument();
    expect(screen.getByAltText(/gray checkmark icon/)).toBeInTheDocument();
  });

  test("Does not display last saved time or check icon if lastSavedTime is falsy", () => {
    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      lastSavedTime: "",
    });
    renderSubnavBar();
    expect(screen.queryByText(/Last saved/)).not.toBeInTheDocument();
    expect(
      screen.queryByAltText(/gray checkmark icon/)
    ).not.toBeInTheDocument();
  });
});
