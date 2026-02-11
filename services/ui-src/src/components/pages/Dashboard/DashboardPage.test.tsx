import { render, screen, waitFor } from "@testing-library/react";
import { DashboardPage } from "components";
import {
  RouterWrappedComponent,
  mockUseAdminStore,
  mockUseReadOnlyUserStore,
  mockUseStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { getReportsForState } from "utils/api/requestMethods/report";
import { Report } from "types";
import { useParams } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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
    reportType: "QMS",
    state: "CO",
  })),
}));

jest.mock("utils/api/requestMethods/report", () => ({
  getReportsForState: jest.fn().mockResolvedValue([
    {
      id: "QMSCO123",
      type: "QMS",
      state: "CO",
      lastEdited: new Date("2024-10-24T08:31:54").valueOf(),
      lastEditedBy: "Mock User",
      status: "Not started",
      name: "Mock Report Name",
      year: 2026,
    } as Report,
    {
      id: "QMSCO123",
      type: "QMS",
      state: "CO",
      lastEdited: new Date("2024-10-24T08:31:54").valueOf(),
      lastEditedBy: "Mock User",
      status: "Not started",
      name: "Mock Report 2027",
      year: 2027,
    } as Report,
  ]),
}));

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

const dashboardComponent = (
  <RouterWrappedComponent>
    <DashboardPage />
  </RouterWrappedComponent>
);

describe("DashboardPage with state user", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render an empty state when there are no reports", async () => {
    (getReportsForState as jest.Mock).mockResolvedValueOnce([]);

    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", {
        name: "Colorado Quality Measure Set Report",
      })
    ).toBeVisible();
    expect(
      screen.getByText("once you start a report you can access it here", {
        exact: false,
      })
    ).toBeVisible();
  });

  it("should not call reloadReports if no reportType passed in", async () => {
    (useParams as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    render(dashboardComponent);
    expect(getReportsForState).toHaveBeenCalledTimes(0);
  });

  it("should render report data", async () => {
    const { container } = render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const table = container.querySelector("table")!;
    const columns = [...table.querySelectorAll("tr th")].map(
      (th) => th.textContent!
    );
    const rows = [...table.querySelectorAll("tbody tr")].map((tr) => [
      ...tr.querySelectorAll("td"),
    ]);

    expect(columns.length).toBeGreaterThanOrEqual(4);
    expect(rows.length).toBe(2);

    const cellContent = (columnName: string) => {
      const columnIndex = columns.indexOf(columnName);
      if (columnIndex === -1) throw new Error(`Could not find '${columnName}'`);
      const cell = rows[0][columnIndex];
      return cell.textContent;
    };
    expect(cellContent("Submission name")).toBe("Mock Report Name");
    expect(cellContent("Last edited")).toBe("10/24/2024");
    expect(cellContent("Edited by")).toBe("Mock User");
  });

  it("should be able to filter reports", async () => {
    const { container } = render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    await userEvent.selectOptions(
      screen.queryAllByLabelText("Filter by Year")[0],
      "2026"
    );
    await userEvent.click(screen.getByText("Filter"));

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
      if (columnIndex === -1) throw new Error(`Could not find '${columnName}'`);
      const cell = rows[0][columnIndex];
      return cell.textContent;
    };
    expect(cellContent("Submission name")).toBe("Mock Report Name");
    expect(cellContent("Last edited")).toBe("10/24/2024");
    expect(cellContent("Edited by")).toBe("Mock User");
    expect(screen.queryByText("Mock Report 2027")).not.toBeInTheDocument();
  });

  it("should be able to open the modal to start new report", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Start Quality Measure Set Report"));

    expect(
      screen.getByText("Add new Quality Measure Set Report")
    ).toBeInTheDocument();
  });
});

describe("DashboardPage with Read only user", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseReadOnlyUserStore);
  });
  it("should not render the Start Report button when user is read only", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const startReportButton = screen.queryByRole("button", {
      name: "Start Quality Measure Set Report",
    });
    expect(startReportButton).not.toBeInTheDocument();
  });
});

describe("DashboardPage with Admin user", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockUseAdminStore);
  });
  it("should not render the Start Report button when user is read only", async () => {
    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
      expect(screen.getByText("Mock Report Name")).toBeInTheDocument();
    });

    const startReportButton = screen.queryByRole("button", {
      name: "Start Quality Measure Set Report",
    });
    expect(startReportButton).not.toBeInTheDocument();
  });

  it("should render an empty state when there are no reports", async () => {
    (getReportsForState as jest.Mock).mockResolvedValueOnce([]);

    render(dashboardComponent);
    await waitFor(() => {
      expect(getReportsForState).toHaveBeenCalled();
    });

    expect(
      screen.getByRole("heading", {
        name: "Colorado Quality Measure Set Report",
      })
    ).toBeVisible();
    expect(
      screen.getByText(
        "Once a state or territory begins a QMS Report, you will be able to view it here.",
        {
          exact: false,
        }
      )
    ).toBeVisible();
  });
});
