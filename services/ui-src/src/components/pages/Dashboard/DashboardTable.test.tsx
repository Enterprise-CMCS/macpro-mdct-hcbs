import { render, screen } from "@testing-library/react";
import { DashboardTable } from "components";
import { RouterWrappedComponent } from "utils/testing/setupJest";

const dashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={[
        {
          name: "report 1",
        } as unknown as any,
      ]}
      openAddEditReportModal={jest.fn}
    />
  </RouterWrappedComponent>
);

const readOnlyDashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={[
        {
          name: "report 1",
        } as unknown as any,
      ]}
      openAddEditReportModal={jest.fn}
      readOnlyUser={true}
    />
  </RouterWrappedComponent>
);

describe("Dashboard table with state user", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should render report name and edit button in table", async () => {
    render(dashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.getByAltText("Edit Report")).toBeInTheDocument();
  });
});

describe("Dashboard table with Read only user", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should not render the edit button when read only", async () => {
    render(readOnlyDashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Edit Report")).not.toBeInTheDocument();
  });
});
