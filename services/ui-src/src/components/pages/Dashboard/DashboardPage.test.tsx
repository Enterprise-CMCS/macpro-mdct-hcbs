import { render, screen, waitFor } from "@testing-library/react";
import { DashboardPage } from "components";
import { RouterWrappedComponent, mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { getReportsForState } from "utils/api/requestMethods/report";
import { Report } from "types";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/other/useBreakpoint", () => ({
  isMobile: jest.fn().mockReturnValue(false),
  makeMediaQueryClasses: jest.fn().mockReturnValue("desktop"),
}));

jest.mock("utils/state/useStore", () => ({
  useStore: jest.fn().mockReturnValue({}),
}));
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(() => ({
    reportType: "QM",
    state: "CO",
  })),
}));

jest.mock("utils/api/requestMethods/report", () => ({
  getReportsForState: jest.fn().mockResolvedValue([
    {
      id: "QMCO123",
      type: "QM",
      state: "CO",
      lastEdited: new Date("2024-10-24T08:31:54").valueOf(),
      lastEditedBy: "Mock User",
      status: "Not Started",
    } as unknown as Report,
  ]),
}));

const dashboardComponent = (
  <RouterWrappedComponent>
    <DashboardPage />
  </RouterWrappedComponent>
);

describe("<DashboardPage />", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render an empty state when there are no reports", async () => {
    (getReportsForState as jest.Mock).mockResolvedValueOnce([]);

    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", { name: "Colorado Quality Measures Report" })
    ).toBeVisible();
    expect(
      screen.getByText("once you start a report you can access it here", {
        exact: false,
      })
    ).toBeVisible();
  });

  it("should render report data", async () => {
    const { container } = render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    const table = container.querySelector("table")!;
    const columns = [...table.querySelectorAll("tr th")].map(
      (th) => th.textContent!
    );
    const rows = [...table.querySelectorAll("tbody tr")].map((tr) => [
      ...tr.querySelectorAll("td"),
    ]);

    expect(columns.length).toBeGreaterThanOrEqual(4);
    expect(rows.length).toBe(1);

    const cellContent = (columnName: string) => {
      const columnIndex = columns.indexOf(columnName);
      if (columnIndex < 0) throw new Error(`Could not find '${columnName}'`);
      const cell = rows[0][columnIndex];
      return cell.textContent;
    };
    expect(cellContent("Submission name")).toBe("{Name of form}"); // TODO placeholder
    expect(cellContent("Last edited")).toBe("10/24/2024");
    expect(cellContent("Edited by")).toBe("Mock User");
  });
});
