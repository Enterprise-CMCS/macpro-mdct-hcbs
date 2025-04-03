import { render, screen } from "@testing-library/react";
import { DashboardTable } from "components";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const reports = [
  {
    id: "abc",
    name: "report 1",
    submissionCount: 0,
    archived: false,
  },
  {
    id: "xyz",
    name: "report 2",
    submissionCount: 0,
    archived: false,
  },
  {
    id: "123",
    name: "report 3",
    submissionCount: 1,
    archived: true,
  },
] as unknown as any;

const dashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable reports={reports} openAddEditReportModal={jest.fn} />
  </RouterWrappedComponent>
);

const adminDashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={reports}
      openAddEditReportModal={jest.fn}
      isAdmin={true}
    />
  </RouterWrappedComponent>
);

describe("Dashboard table with state user", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should render report name and edit button in table", async () => {
    render(dashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.getAllByAltText("Edit Report Name").length).toBe(3);
  });
});

describe("Dashboard table with admin user", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should not render the proper controls when admin", async () => {
    render(adminDashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Edit Report Name")).not.toBeInTheDocument();
    expect(screen.getAllByText("Archive").length).toBe(2);
    expect(screen.getAllByText("View").length).toBe(3);
    expect(screen.getAllByText("Unlock").length).toBe(3);
  });
});
