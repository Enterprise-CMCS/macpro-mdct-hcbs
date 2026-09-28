import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardTable } from "components";
import { ReportStatus, Report, LiteReport } from "types";
import { useStore } from "utils";
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { VerticalTable } from "./DashboardTable";

const mockArchive = vi.fn();
const mockRelease = vi.fn();
vi.mock("utils/api/requestMethods/report", () => ({
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
] as Report[];

const mockOpenAddEditReportModal = vi.fn();
const mockUnlockModalOnOpenHandler = vi.fn();

const standardDashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={reports}
      openAddEditReportModal={mockOpenAddEditReportModal}
      unlockModalOnOpenHandler={mockUnlockModalOnOpenHandler}
      onReportUpdate={vi.fn()}
    />
  </RouterWrappedComponent>
);

const mockTableProps = {
  tableContent: {
    caption: "Quality Measure Reports",
    headRow: [
      "Submission name",
      "Reporting year",
      "Last edited",
      "Edited by",
      "Status",
      "#",
    ],
  },
  reports: reports,
  showEditNameColumn: true,
  showReportSubmissionsColumn: false,
  showAdminControls: false,
  openAddEditReportModal: mockOpenAddEditReportModal,
  navigate: vi.fn(),
  userIsEndUser: true,
  toggleArchived: vi.fn(),
  toggleRelease: vi.fn(),
  archiving: undefined,
  unlocking: undefined,
};

const mockAdminTableProps = {
  ...mockTableProps,
  showEditNameColumn: false,
  showReportSubmissionsColumn: true,
  showAdminControls: true,
  userIsEndUser: false,
};

const propsWithAdminControls = {
  ...mockAdminTableProps,
};

const renderVerticalTableWithAdminControls = (overrideProps = {}) => {
  return render(
    <RouterWrappedComponent>
      <VerticalTable {...{ ...propsWithAdminControls, ...overrideProps }} />
    </RouterWrappedComponent>
  );
};

describe("Dashboard table", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState({ user: mockAdminUser });
  });

  it("should render edit button and call openAddEditReportModal on click", async () => {
    useStore.setState({ user: mockStateUser });

    render(standardDashboardTableComponent);

    const editButton = screen.getByLabelText("Edit report 1 name");
    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
    expect(mockOpenAddEditReportModal).toHaveBeenCalled();
  });

  it("should call toggleArchived when Archive button is clicked in DashboardTable", async () => {
    const mockToggleArchived = vi.fn();
    renderVerticalTableWithAdminControls({
      toggleArchived: mockToggleArchived,
    });

    const archiveButton = screen.getAllByText("Archive")[0];
    await userEvent.click(archiveButton);

    expect(mockToggleArchived).toHaveBeenCalled();
  });

  it("should call toggleRelease when Unlock button is clicked in DashboardTable", async () => {
    const mockToggleRelease = vi.fn();
    const submittedReports = [
      {
        ...reports[0],
        status: ReportStatus.SUBMITTED,
        archived: false,
      },
    ];
    renderVerticalTableWithAdminControls({
      reports: submittedReports,
      toggleRelease: mockToggleRelease,
    });

    const unlockButton = screen.getByText("Unlock");
    await userEvent.click(unlockButton);

    expect(mockToggleRelease).toHaveBeenCalled();
  });

  it("should show Unarchive text for archived reports", () => {
    renderVerticalTableWithAdminControls();
    expect(screen.getByText("Unarchive")).toBeInTheDocument();
  });

  it("should disabled Unlock button for archived reports", () => {
    renderVerticalTableWithAdminControls();
    const unlockButtons = screen.getAllByText("Unlock");
    const archivedReportUnlockButton = unlockButtons.at(-1)!;
    expect(archivedReportUnlockButton.closest("button")).toBeDisabled();
  });

  it("should handle undefined archived property and set to true", async () => {
    const reportWithUndefinedArchived = [
      {
        ...reports[0],
        archived: undefined,
      },
    ];

    render(
      <RouterWrappedComponent>
        <DashboardTable
          reports={reportWithUndefinedArchived as unknown as LiteReport[]}
          openAddEditReportModal={vi.fn()}
          unlockModalOnOpenHandler={vi.fn()}
          onReportUpdate={vi.fn()}
        />
      </RouterWrappedComponent>
    );

    const archiveButton = screen.getByText("Archive");
    await userEvent.click(archiveButton);

    expect(mockArchive).toHaveBeenCalled();
  });

  it("should call onReportUpdate after toggling archive status", async () => {
    const mockOnReportUpdate = vi.fn();

    render(
      <RouterWrappedComponent>
        <DashboardTable
          reports={reports}
          openAddEditReportModal={vi.fn()}
          unlockModalOnOpenHandler={vi.fn()}
          onReportUpdate={mockOnReportUpdate}
        />
      </RouterWrappedComponent>
    );

    const archiveButton = screen.getAllByText("Archive")[0];
    await userEvent.click(archiveButton);

    expect(mockOnReportUpdate).toHaveBeenCalled();
  });

  it("should call onReportUpdate after releasing report", async () => {
    const mockOnReportUpdate = vi.fn();
    const mockUnlockHandler = vi.fn();
    const submittedReport = [
      {
        ...reports[0],
        status: ReportStatus.SUBMITTED,
        archived: false,
      },
    ];

    render(
      <RouterWrappedComponent>
        <DashboardTable
          reports={submittedReport as LiteReport[]}
          openAddEditReportModal={vi.fn()}
          unlockModalOnOpenHandler={mockUnlockHandler}
          onReportUpdate={mockOnReportUpdate}
        />
      </RouterWrappedComponent>
    );

    const unlockButton = screen.getByText("Unlock");
    await userEvent.click(unlockButton);

    expect(mockRelease).toHaveBeenCalled();
    expect(mockUnlockHandler).toHaveBeenCalled();
    expect(mockOnReportUpdate).toHaveBeenCalled();
  });
});
