import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFlags } from "launchdarkly-react-client-sdk";
import { sendTestEmail } from "utils/api/requestMethods/notifications";
import { NotificationsPage } from "./NotificationsPage";

vi.mock("utils/api/requestMethods/notifications", () => ({
  sendTestEmail: vi.fn(),
}));

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
}));

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: true,
    } as ReturnType<typeof useFlags>);
    vi.mocked(sendTestEmail).mockResolvedValue(undefined);
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

  it("shows the test email controls only when the feature is enabled", () => {
    vi.mocked(useFlags).mockReturnValue({
      notificationsSystem: false,
    } as ReturnType<typeof useFlags>);

    render(<NotificationsPage />);

    expect(
      screen.queryByPlaceholderText("Enter recipient email")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Send Test Email" })
    ).not.toBeInTheDocument();
  });

  it("enables sending after an email address is entered and sends the test email", async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    const sendButton = screen.getByRole("button", { name: "Send Test Email" });
    expect(sendButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText("Enter recipient email"),
      "tester@example.com"
    );
    expect(sendButton).toBeEnabled();

    await user.click(sendButton);

    await waitFor(() => {
      expect(sendTestEmail).toHaveBeenCalledWith({
        toAddress: "tester@example.com",
        subject: "HCBS Notification Test",
        message: "This is a test notification from the HCBS system.",
      });
    });
    expect(sendButton).toBeEnabled();
  });

  it("shows a loading state while the test email is being sent", async () => {
    const user = userEvent.setup();
    let resolveEmailRequest!: () => void;
    vi.mocked(sendTestEmail).mockReturnValue(
      new Promise<void>((resolve) => {
        resolveEmailRequest = resolve;
      })
    );
    render(<NotificationsPage />);

    await user.type(
      screen.getByPlaceholderText("Enter recipient email"),
      "tester@example.com"
    );
    const sendButton = screen.getByRole("button", { name: "Send Test Email" });
    await user.click(sendButton);

    expect(sendButton).toBeDisabled();

    resolveEmailRequest();
    await waitFor(() => {
      expect(sendButton).toBeEnabled();
    });
  });
});
