import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardTable } from "components";
import { ReportStatus } from "types";
import { useStore } from "utils";
import {
  mockUseAdminStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

jest.mock("utils/state/useStore", () => ({
  useStore: jest.fn().mockReturnValue({}),
}));
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockArchive = jest.fn();
const mockRelease = jest.fn();
jest.mock("utils/api/requestMethods/report", () => ({
  updateArchivedStatus: () => mockArchive(),
  releaseReport: () => mockRelease(),
}));

const reports = [
  {
    id: "abc",
    name: "report 1",
    submissionCount: 0,
    archived: false,
    status: ReportStatus.IN_PROGRESS,
  },
  {
    id: "xyz",
    name: "report 2",
    submissionCount: 0,
    archived: false,
    status: ReportStatus.SUBMITTED,
  },
  {
    id: "123",
    name: "report 3",
    submissionCount: 1,
    archived: true,
    status: ReportStatus.IN_PROGRESS,
  },
] as unknown as any;

const dashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={reports}
      openAddEditReportModal={jest.fn}
      unlockModalOnOpenHandler={jest.fn}
    />
  </RouterWrappedComponent>
);

const adminDashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={reports}
      openAddEditReportModal={jest.fn}
      unlockModalOnOpenHandler={jest.fn}
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
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockUseAdminStore);
  });

  it("should not render the proper controls when admin", async () => {
    render(adminDashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Edit Report Name")).not.toBeInTheDocument();
    expect(screen.getAllByText("Archive").length).toBe(2);
    expect(screen.getAllByText("View").length).toBe(3);
    expect(screen.getAllByText("Unlock").length).toBe(3);
  });

  it("should unlock a report on click", async () => {
    render(adminDashboardTableComponent);
    await act(async () => {
      const releaseBtn = screen.getAllByRole("button", { name: "Unlock" })[1];
      await userEvent.click(releaseBtn);
    });
    expect(mockRelease).toHaveBeenCalled();
  });

  it("should archive a report on click", async () => {
    render(adminDashboardTableComponent);
    await act(async () => {
      const button = screen.getAllByRole("button", { name: "Archive" })[0];
      await userEvent.click(button);
    });
    expect(mockArchive).toHaveBeenCalled();
  });

  it("should render In Revision text for a returned report", async () => {
    render(adminDashboardTableComponent);
    // Setup data includes In Progress with Submission Count >= 1
    expect(screen.getByText("In Revision")).toBeInTheDocument();
  });
});
