import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardTable } from "components";
import { ReportStatus, Report, LiteReport } from "types";
import { useStore } from "utils";
import {
  mockUseAdminStore,
  mockUseStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { VerticalTable } from "./DashboardTable";

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
] as Report[];

const mockOpenAddEditReportModal = jest.fn();
const mockUnlockModalOnOpenHandler = jest.fn();

const standardDashboardTableComponent = (
  <RouterWrappedComponent>
    <DashboardTable
      reports={reports}
      openAddEditReportModal={mockOpenAddEditReportModal}
      unlockModalOnOpenHandler={mockUnlockModalOnOpenHandler}
      onReportUpdate={jest.fn()}
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
  showAdminControlsColumn: false,
  openAddEditReportModal: mockOpenAddEditReportModal,
  navigate: jest.fn(),
  userIsEndUser: true,
  toggleArchived: jest.fn(),
  toggleRelease: jest.fn(),
  archiving: undefined,
  unlocking: undefined,
};

const mockAdminTableProps = {
  ...mockTableProps,
  showEditNameColumn: false,
  showReportSubmissionsColumn: true,
  showAdminControlsColumn: true,
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

describe("Dashboard table with state user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockUseStore);
  });

  it("should render edit button and call openAddEditReportModal on click", async () => {
    render(standardDashboardTableComponent);
    const editButton = screen.getByLabelText("Edit report 1 report name");
    expect(editButton).toBeInTheDocument();
    await userEvent.click(editButton);
    expect(mockOpenAddEditReportModal).toHaveBeenCalled();
  });

  it("should display report values", () => {
    render(standardDashboardTableComponent);
    expect(screen.getByText("report 1")).toBeInTheDocument();
    expect(screen.getByText("report 2")).toBeInTheDocument();
    expect(screen.getByText(ReportStatus.IN_PROGRESS)).toBeInTheDocument();
  });
});

describe("DashboardTable conditional rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call toggleArchived when Archive button is clicked in DashboardTable", async () => {
    const mockToggleArchived = jest.fn();
    renderVerticalTableWithAdminControls({
      toggleArchived: mockToggleArchived,
    });

    const archiveButton = screen.getAllByText("Archive")[0];
    await userEvent.click(archiveButton);

    expect(mockToggleArchived).toHaveBeenCalled();
  });

  it("should call toggleRelease when Unlock button is clicked in DashboardTable", async () => {
    const mockToggleRelease = jest.fn();
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
    const archivedReportUnlockButton = unlockButtons[unlockButtons.length - 1];
    expect(archivedReportUnlockButton.closest("button")).toBeDisabled();
  });
});

describe("DashboardTable toggleArchived and toggleRelease", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue(mockUseAdminStore);
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
          openAddEditReportModal={jest.fn()}
          unlockModalOnOpenHandler={jest.fn()}
          onReportUpdate={jest.fn()}
        />
      </RouterWrappedComponent>
    );

    const archiveButton = screen.getByText("Archive");
    await userEvent.click(archiveButton);

    expect(mockArchive).toHaveBeenCalled();
  });

  it("should call onReportUpdate after toggling archive status", async () => {
    const mockOnReportUpdate = jest.fn();

    render(
      <RouterWrappedComponent>
        <DashboardTable
          reports={reports}
          openAddEditReportModal={jest.fn()}
          unlockModalOnOpenHandler={jest.fn()}
          onReportUpdate={mockOnReportUpdate}
        />
      </RouterWrappedComponent>
    );

    const archiveButton = screen.getAllByText("Archive")[0];
    await userEvent.click(archiveButton);

    expect(mockOnReportUpdate).toHaveBeenCalled();
  });

  it("should call onReportUpdate after releasing report", async () => {
    const mockOnReportUpdate = jest.fn();
    const mockUnlockHandler = jest.fn();
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
          openAddEditReportModal={jest.fn()}
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
