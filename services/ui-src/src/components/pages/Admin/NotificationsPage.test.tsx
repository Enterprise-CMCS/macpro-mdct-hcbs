import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import {
  getNotifications,
  updateNotifications,
} from "utils/api/requestMethods/notifications";
import { NotificationsPage } from "./NotificationsPage";
import { ReportType } from "types";
import userEvent from "@testing-library/user-event";

vi.mock("utils/api/requestMethods/notifications", () => ({
  getNotifications: vi.fn(),
  updateNotifications: vi.fn(),
}));

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ notificationsSystem: true }),
}));

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display checked state for enabled notifications", async () => {
    vi.mocked(getNotifications).mockResolvedValue([
      { category: ReportType.CI, enabled: true },
    ]);

    render(<NotificationsPage />);

    const CIcheckbox = await screen.findByRole("checkbox", { name: /CI/i });
    expect(CIcheckbox).toBeChecked();
  });

  it("should update local state and call updateNotifications", async () => {
    vi.mocked(getNotifications).mockResolvedValueOnce([
      { category: ReportType.WWL, enabled: true },
    ]);

    render(<NotificationsPage />);

    const user = userEvent.setup();

    const WWLcheckbox = await screen.findByRole("checkbox", { name: /WWL/i });
    expect(WWLcheckbox).toBeChecked();

    await user.click(WWLcheckbox);

    expect(WWLcheckbox).not.toBeChecked();

    await waitFor(() => {
      expect(updateNotifications).toHaveBeenCalledWith({
        category: ReportType.WWL,
        enabled: false,
      });
    });
  });
});
