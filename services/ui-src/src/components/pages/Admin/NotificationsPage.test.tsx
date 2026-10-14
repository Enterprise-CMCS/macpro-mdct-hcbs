import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { NotificationsPage } from "./NotificationsPage";
import { StateNames } from "../../../constants";
import { getReportName, ReportType } from "types/report";

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(screen.getByText("Add a new assignment:")).toBeVisible();
    expect(screen.getByText("Filter assignments:")).toBeVisible();
    expect(screen.getByText("Sort assignments:")).toBeVisible();
    expect(screen.getByText("Edit or remove assignments:")).toBeVisible();
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

  it("reports that saving is unavailable when persistence is not supplied", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);
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
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Saving assignments is not available yet."
    );
    expect(screen.getByRole("dialog", { name: "Add Email" })).toBeVisible();
  });
});
