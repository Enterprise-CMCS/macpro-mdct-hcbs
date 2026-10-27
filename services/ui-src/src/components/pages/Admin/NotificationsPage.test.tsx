import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { NotificationsPage } from "./NotificationsPage";
import { StateNames } from "../../../constants";
import { getReportName, ReportType } from "types/report";
import { NotificationAssignment } from "types/notification";
import {
  createNotificationAssignment,
  deleteNotificationAssignment,
  getNotificationAssignments,
  updateNotificationAssignment,
} from "utils/api/requestMethods/notificationAssignments";

vi.mock("utils/api/requestMethods/notificationAssignments", () => ({
  createNotificationAssignment: vi.fn(),
  deleteNotificationAssignment: vi.fn(),
  updateNotificationAssignment: vi.fn(),
  getNotificationAssignments: vi.fn(),
}));

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getNotificationAssignments).mockResolvedValue([]);
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: true,
      isHaReportActive: true,
    } as ReturnType<typeof useFlags>);
  });

  it("renders the notification assignment guidance", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    expect(
      screen.getByRole("heading", { name: "Notifications Settings" })
    ).toBeVisible();
    expect(
      screen.getByText("The notification assignments page should be used", {
        exact: false,
      })
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Notification Assignments" })
    );
    await waitFor(() =>
      expect(
        screen.getByText("How to manage notification assignments:")
      ).toBeVisible()
    );
  });

  it("hides Add email when the feature is disabled", () => {
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: false,
    } as ReturnType<typeof useFlags>);

    render(<NotificationsPage />);

    expect(
      screen.queryByRole("button", { name: "Add email" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "- Select an option - States" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "- Select an option - Report Types",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear Filters" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(getNotificationAssignments).not.toHaveBeenCalled();
  });

  it("lists states from constants in the state filter", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);
    await user.click(
      screen.getByRole("button", { name: "- Select an option - States" })
    );
    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options.map((option) => option.textContent)).toEqual([
      "- Select an option -",
      ...Object.values(StateNames),
    ]);
  });

  it("lists only enabled reports in the report filter", async () => {
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: true,
      isQmsReportActive: true,
      isQipReportActive: true,
      isHaReportActive: true,
    });
    const user = userEvent.setup();
    render(<NotificationsPage />);
    await user.click(
      screen.getByRole("button", { name: "- Select an option - Report Types" })
    );
    for (const type of [ReportType.QMS, ReportType.QIP, ReportType.HA]) {
      expect(
        screen.getByRole("option", {
          name: `${type}: ${getReportName(type)}`,
        })
      ).toBeInTheDocument();
    }
    for (const type of [
      ReportType.CI,
      ReportType.PCP,
      ReportType.IMA,
      ReportType.WWL,
    ]) {
      expect(
        screen.queryByRole("option", {
          name: `${type}: ${getReportName(type)}`,
        })
      ).not.toBeInTheDocument();
    }
  });

  it("selects filters and clears both selections", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage disabled />);
    await user.click(
      screen.getByRole("button", { name: "- Select an option - States" })
    );
    await user.click(screen.getByRole("option", { name: "Alabama" }));
    await user.click(
      screen.getByRole("button", { name: "- Select an option - Report Types" })
    );
    await user.click(
      screen.getByRole("option", { name: "HA: HCBS Access Report" })
    );
    expect(
      screen.getByRole("button", { name: "Remove Alabama filter" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Remove HA filter" })
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.queryByLabelText("Selected filters")).not.toBeInTheDocument();
    for (const label of ["States", "Report Types"]) {
      expect(
        screen.getByRole("button", { name: `- Select an option - ${label}` })
      ).toHaveTextContent("- Select an option -");
    }
  });

  it("adds multiple unique filter chips and removes them independently", async () => {
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: true,
      isHaReportActive: true,
      isQipReportActive: true,
    });
    const user = userEvent.setup();
    render(<NotificationsPage />);
    for (const state of ["Alaska", "North Carolina", "Alaska"]) {
      await user.click(
        screen.getByRole("button", { name: "- Select an option - States" })
      );
      await user.click(screen.getByRole("option", { name: state }));
      expect(
        screen.getByRole("button", { name: "- Select an option - States" })
      ).toHaveTextContent("- Select an option -");
    }
    for (const report of [
      "HA: HCBS Access Report",
      "QIP: QMS Quality Improvement Plans",
    ]) {
      await user.click(
        screen.getByRole("button", {
          name: "- Select an option - Report Types",
        })
      );
      await user.click(screen.getByRole("option", { name: report }));
      expect(
        screen.getByRole("button", {
          name: "- Select an option - Report Types",
        })
      ).toHaveTextContent("- Select an option -");
    }
    expect(
      screen.getByRole("button", { name: "Remove Alaska filter" })
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "Remove Alaska filter" })
    );
    await user.click(screen.getByRole("button", { name: "Remove QIP filter" }));
    expect(
      screen.queryByRole("button", { name: "Remove Alaska filter" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Remove QIP filter" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove North Carolina filter" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Remove HA filter" })
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.queryByLabelText("Selected filters")).not.toBeInTheDocument();
  });

  it("matches multi-state assignments when combining state and report filters", async () => {
    const user = userEvent.setup();
    const assignments: NotificationAssignment[] = [
      { email: "ha@example.com", states: ["AL"], reports: [ReportType.HA] },
      {
        email: "multi@example.com",
        states: ["AL", "OH"],
        reports: [ReportType.HA, ReportType.QIP],
      },
      { email: "ohio@example.com", states: ["OH"], reports: [ReportType.HA] },
    ];
    vi.mocked(getNotificationAssignments).mockResolvedValue(assignments);
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: true,
      isHaReportActive: true,
      isQipReportActive: true,
    });
    render(<NotificationsPage />);
    await screen.findByRole("cell", { name: "multi@example.com" });
    await user.click(
      screen.getByRole("button", { name: "- Select an option - States" })
    );
    await user.click(screen.getByRole("option", { name: "Ohio" }));
    await user.click(
      screen.getByRole("button", { name: "- Select an option - Report Types" })
    );
    await user.click(
      screen.getByRole("option", { name: "QIP: QMS Quality Improvement Plans" })
    );
    expect(screen.getByText("multi@example.com")).toBeVisible();
    expect(screen.queryByText("ha@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText("ohio@example.com")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    expect(screen.queryByLabelText("Selected filters")).not.toBeInTheDocument();
    for (const { email } of assignments) {
      expect(screen.getByText(email)).toBeVisible();
    }
  });

  it("opens the modal and resets the form after canceling", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    await user.click(screen.getByRole("button", { name: "Add email" }));
    expect(screen.getByRole("dialog", { name: "Add Email" })).toBeVisible();
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "po@example.com"
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "Add email" }));
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("");
  });

  it("disables Add email for a read-only page", () => {
    render(<NotificationsPage disabled />);
    expect(screen.getByRole("button", { name: "Add email" })).toBeDisabled();
  });

  it("filters assignments by any selected state and report, and clears the filters", async () => {
    const user = userEvent.setup();
    const assignments: NotificationAssignment[] = [
      {
        email: "alabama@example.com",
        states: ["AL"],
        reports: [ReportType.HA],
      },
      { email: "alaska@example.com", states: ["AK"], reports: [ReportType.HA] },
      { email: "qip@example.com", states: ["AL"], reports: [ReportType.QIP] },
      { email: "ohio@example.com", states: ["OH"], reports: [ReportType.HA] },
    ];
    vi.mocked(getNotificationAssignments).mockResolvedValue(assignments);
    render(<NotificationsPage />);
    await screen.findByRole("cell", { name: "alabama@example.com" });
    for (const state of ["Alabama", "Alaska"]) {
      await user.click(
        screen.getByRole("button", { name: "- Select an option - States" })
      );
      await user.click(screen.getByRole("option", { name: state }));
    }
    expect(screen.queryByText("ohio@example.com")).not.toBeInTheDocument();
    expect(screen.getByText("qip@example.com")).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "- Select an option - Report Types" })
    );
    await user.click(
      screen.getByRole("option", { name: "HA: HCBS Access Report" })
    );
    expect(screen.getByText("alabama@example.com")).toBeVisible();
    expect(screen.getByText("alaska@example.com")).toBeVisible();
    expect(screen.queryByText("qip@example.com")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Remove Alabama filter" })
    );
    expect(screen.queryByText("alabama@example.com")).not.toBeInTheDocument();
    expect(screen.getByText("alaska@example.com")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear Filters" }));
    for (const { email } of assignments) {
      expect(screen.getByText(email)).toBeVisible();
    }
  });

  it("loads assignments with Edit and Delete available", async () => {
    const assignment: NotificationAssignment = {
      email: "po@example.com",
      states: ["AK", "NC", "OH"],
      reports: [ReportType.QIP, ReportType.IMA],
    };
    vi.mocked(getNotificationAssignments).mockResolvedValue([assignment]);
    render(<NotificationsPage />);
    expect(
      await screen.findByRole("button", { name: "Edit po@example.com" })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Delete po@example.com" })
    ).toBeEnabled();
  });

  it("deletes an assignment and removes it from the table", async () => {
    const user = userEvent.setup();
    const assignments: NotificationAssignment[] = [
      { email: "alpha@example.com", states: ["AL"], reports: [ReportType.HA] },
      { email: "beta@example.com", states: ["AK"], reports: [ReportType.HA] },
    ];
    vi.mocked(getNotificationAssignments).mockResolvedValue(assignments);
    vi.mocked(deleteNotificationAssignment).mockResolvedValue(undefined);
    render(<NotificationsPage />);
    await user.click(
      await screen.findByRole("button", { name: "Delete alpha@example.com" })
    );
    expect(deleteNotificationAssignment).toHaveBeenCalledWith(
      "alpha@example.com"
    );
    await waitFor(() =>
      expect(screen.queryByText("alpha@example.com")).not.toBeInTheDocument()
    );
    expect(screen.getByText("beta@example.com")).toBeVisible();
  });

  it("shows a spinner on the Delete button while deleting", async () => {
    const user = userEvent.setup();
    let finishDelete: () => void = () => {};
    vi.mocked(getNotificationAssignments).mockResolvedValue([
      { email: "po@example.com", states: ["AL"], reports: [ReportType.HA] },
    ]);
    vi.mocked(deleteNotificationAssignment).mockReturnValue(
      new Promise((resolve) => {
        finishDelete = () => resolve(undefined);
      })
    );
    render(<NotificationsPage />);
    await user.click(
      await screen.findByRole("button", { name: "Delete po@example.com" })
    );
    const deleteButton = screen.getByRole("button", {
      name: "Delete po@example.com",
    });
    expect(deleteButton).toBeDisabled();
    expect(within(deleteButton).getByText("Loading...")).toBeInTheDocument();
    finishDelete();
    await waitFor(() =>
      expect(screen.queryByText("po@example.com")).not.toBeInTheDocument()
    );
  });

  it("keeps the row and displays an error when delete fails", async () => {
    const user = userEvent.setup();
    const assignment: NotificationAssignment = {
      email: "po@example.com",
      states: ["AL"],
      reports: [ReportType.HA],
    };
    vi.mocked(getNotificationAssignments).mockResolvedValue([assignment]);
    vi.mocked(deleteNotificationAssignment).mockRejectedValueOnce(
      new Error("This assignment no longer exists.")
    );
    render(<NotificationsPage />);
    await user.click(
      await screen.findByRole("button", { name: "Delete po@example.com" })
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This assignment no longer exists."
    );
    expect(screen.getByRole("cell", { name: assignment.email })).toBeVisible();
    vi.mocked(deleteNotificationAssignment).mockResolvedValue(undefined);
    await user.click(
      screen.getByRole("button", { name: "Delete po@example.com" })
    );
    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
    expect(screen.queryByText(assignment.email)).not.toBeInTheDocument();
  });

  const fillAssignment = async () => {
    const user = userEvent.setup();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Add email" })).toBeEnabled()
    );
    await user.click(screen.getByRole("button", { name: "Add email" }));
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "po@example.com"
    );
    await user.click(
      screen.getByRole("button", { name: "States, 0 selected" })
    );
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Alabama" })
    );
    await user.keyboard("{Escape}");
    await user.click(
      screen.getByRole("button", { name: "Report Types, 0 selected" })
    );
    await user.click(
      await screen.findByRole("menuitemcheckbox", {
        name: "HA: HCBS Access Report",
      })
    );
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Save" }));
  };

  it("saves an assignment to the API, updates the table, and loads it after remounting", async () => {
    const assignment: NotificationAssignment = {
      email: "po@example.com",
      states: ["AL"],
      reports: [ReportType.HA],
    };
    vi.mocked(createNotificationAssignment).mockResolvedValue(assignment);
    const { unmount } = render(<NotificationsPage />);
    await fillAssignment();
    expect(createNotificationAssignment).toHaveBeenCalledWith(assignment);
    expect(
      await screen.findByRole("cell", { name: assignment.email })
    ).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    unmount();
    vi.mocked(getNotificationAssignments).mockResolvedValue([assignment]);
    render(<NotificationsPage />);
    expect(
      await screen.findByRole("cell", { name: assignment.email })
    ).toBeVisible();
    expect(getNotificationAssignments).toHaveBeenCalledTimes(2);
  }, 15000);

  it("keeps the modal open and displays duplicate and save errors without adding a row", async () => {
    vi.mocked(createNotificationAssignment).mockRejectedValueOnce(
      new Error(
        "An assignment already exists for this email. Use Edit to update it."
      )
    );
    render(<NotificationsPage />);
    await fillAssignment();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Use Edit to update it."
    );
    expect(screen.getByRole("dialog", { name: "Add Email" })).toBeVisible();
    expect(
      screen.queryByRole("cell", { name: "po@example.com" })
    ).not.toBeInTheDocument();
    vi.mocked(createNotificationAssignment).mockRejectedValueOnce(
      new Error("Unable to save.")
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to save."
    );
  }, 15000);

  it("shows loading and load failures with a retry instead of an empty table", async () => {
    vi.mocked(getNotificationAssignments).mockRejectedValueOnce(
      new Error("Unable to load.")
    );
    render(<NotificationsPage />);
    expect(
      screen.getByText("Loading notification assignments")
    ).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load."
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByRole("table")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("opens Edit with existing data, saves updates, and resets when adding", async () => {
    const user = userEvent.setup();
    const assignment: NotificationAssignment = {
      email: "po@example.com",
      states: ["AL"],
      reports: [ReportType.HA],
    };
    const updated: NotificationAssignment = {
      ...assignment,
      states: ["AL", "AK"],
    };
    vi.mocked(getNotificationAssignments).mockResolvedValue([assignment]);
    vi.mocked(updateNotificationAssignment).mockRejectedValueOnce(
      new Error("Update failed.")
    );
    render(<NotificationsPage />);
    await user.click(
      await screen.findByRole("button", { name: "Edit po@example.com" })
    );
    expect(
      screen.getByRole("dialog", { name: "Edit Assignments" })
    ).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: "States, 1 selected" })
    );
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Alaska" })
    );
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Update failed."
    );
    expect(screen.getByRole("dialog")).toBeVisible();
    vi.mocked(updateNotificationAssignment).mockResolvedValue(updated);
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(updateNotificationAssignment).toHaveBeenLastCalledWith(updated);
    expect(screen.getByRole("cell", { name: "AL, AK" })).toBeVisible();
    expect(createNotificationAssignment).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Add email" }));
    expect(screen.getByRole("dialog", { name: "Add Email" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("");
  });
});
