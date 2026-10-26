import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationAssignment } from "types/notification";
import { ReportType } from "types/report";
import { testA11y } from "utils/testing/commonTests";
import { NotificationAssignmentsTable } from "./NotificationAssignmentsTable";

const assignments: NotificationAssignment[] = [
  {
    email: "zebra@example.com",
    states: ["AK", "NC", "OH"],
    reports: [ReportType.QIP, ReportType.IMA],
  },
  {
    email: "alpha@example.com",
    states: ["AL"],
    reports: [ReportType.HA],
  },
];

describe("<NotificationAssignmentsTable />", () => {
  it("renders assignments in email order without mutating the supplied data", async () => {
    const user = userEvent.setup();
    render(<NotificationAssignmentsTable assignments={assignments} />);
    expect(
      screen.getByRole("table", { name: "Notification assignments" })
    ).toBeVisible();
    const emails = () =>
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => within(row).getAllByRole("cell")[0].textContent);
    expect(emails()).toEqual(["alpha@example.com", "zebra@example.com"]);
    expect(screen.getByText("AK, NC, OH")).toBeVisible();
    expect(screen.getByText("QIP, IMA")).toBeVisible();
    expect(screen.getByRole("columnheader", { name: /Email/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    await user.click(
      screen.getByRole("button", { name: "Sort Email descending" })
    );
    expect(emails()).toEqual(["zebra@example.com", "alpha@example.com"]);
    expect(screen.getByRole("columnheader", { name: /Email/ })).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    await user.click(
      screen.getByRole("button", { name: "Sort Email ascending" })
    );
    expect(emails()).toEqual(["alpha@example.com", "zebra@example.com"]);
    expect(assignments[0].email).toBe("zebra@example.com");
  });

  it("shows and allows for All in the states column", () => {
    render(
      <NotificationAssignmentsTable
        assignments={[
          {
            email: "all@example.com",
            states: ["ALL"],
            reports: [ReportType.HA],
          },
        ]}
      />
    );
    expect(screen.getByRole("cell", { name: "All" })).toBeVisible();
  });

  it("passes the selected assignment to Edit and Delete callbacks", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <NotificationAssignmentsTable
        assignments={assignments}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    await user.click(
      screen.getByRole("button", { name: "Edit zebra@example.com" })
    );
    await user.click(
      screen.getByRole("button", { name: "Delete alpha@example.com" })
    );
    expect(onEdit).toHaveBeenCalledWith(assignments[0]);
    expect(onDelete).toHaveBeenCalledWith(assignments[1]);
  });

  it.each([false, true])(
    "disables actions when unavailable or read-only (disabled=%s)",
    (disabled) => {
      render(
        <NotificationAssignmentsTable
          assignments={assignments}
          disabled={disabled}
          onEdit={disabled ? vi.fn() : undefined}
          onDelete={disabled ? vi.fn() : undefined}
        />
      );
      for (const action of screen.getAllByRole("button", {
        name: /^(Edit|Delete)/,
      })) {
        expect(action).toBeDisabled();
      }
    }
  );

  it("shows an empty state", () => {
    render(<NotificationAssignmentsTable assignments={[]} />);
    expect(
      screen.getByText("No notification assignments found.")
    ).toBeVisible();
  });

  testA11y(<NotificationAssignmentsTable assignments={assignments} />);
});
