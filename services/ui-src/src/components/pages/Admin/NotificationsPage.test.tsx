import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { NotificationsPage } from "./NotificationsPage";

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
      screen.getByText(/notification assignments page should be used/i)
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "Notification Assignments" })
    );
    await waitFor(() =>
      expect(
        screen.getByText("How to manage notification assignments:")
      ).toBeVisible()
    );
    expect(screen.getByText(/Add a new assignment:/)).toBeVisible();
    expect(screen.getByText(/Filter assignments:/)).toBeVisible();
    expect(screen.getByText(/Sort assignments:/)).toBeVisible();
    expect(screen.getByText(/Edit or remove assignments:/)).toBeVisible();
  });

  it("hides Add email when the feature is disabled", () => {
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: false,
    } as ReturnType<typeof useFlags>);

    render(<NotificationsPage />);

    expect(
      screen.queryByRole("button", { name: "Add email" })
    ).not.toBeInTheDocument();
  });

  it("opens the modal and resets the form after canceling", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    await user.click(screen.getByRole("button", { name: "Add email" }));
    expect(screen.getByRole("dialog", { name: "Add Email" })).toBeVisible();
    await user.type(
      screen.getByRole("textbox", { name: /Email/ }),
      "po@example.com"
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "Add email" }));
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveValue("");
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
      screen.getByRole("textbox", { name: /Email/ }),
      "po@example.com"
    );
    await user.click(screen.getByRole("button", { name: /^States/ }));
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Alabama" })
    );
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /^Report Types/ }));
    await user.click(
      await screen.findByRole("menuitemcheckbox", {
        name: /HA: HCBS Access Report/,
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
