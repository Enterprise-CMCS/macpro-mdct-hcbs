import { render, screen, waitFor } from "@testing-library/react";
import {
  getNotifications,
  updateNotifications,
} from "utils/api/requestMethods/notifications";
import { NotificationsPage } from "./NotificationsPage";
import { ReportType } from "types";
import userEvent from "@testing-library/user-event";

jest.mock("utils/api/requestMethods/notifications", () => ({
  getNotifications: jest.fn(),
  updateNotifications: jest.fn(),
}));

const mockedGet = getNotifications as jest.MockedFunction<
  typeof getNotifications
>;
const mockedUpdate = updateNotifications as jest.MockedFunction<
  typeof updateNotifications
>;

describe("<NotificationsPage />", () => {
  it("should display checked state for enabled notifications", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { category: "CI", enabled: true },
    ]);

    render(<NotificationsPage />);

    const CIcheckbox = await screen.findByRole("checkbox", { name: /CI/i });
    expect(CIcheckbox).toBeChecked();
  });

  it("should update local state and calls updateNotifications", async () => {
    mockedGet.mockResolvedValueOnce([
      { category: ReportType.WWL, enabled: true },
    ]);

    render(<NotificationsPage />);

    const user = userEvent.setup();

    const WWLcheckbox = await screen.findByRole("checkbox", { name: /WWL/i });
    expect(WWLcheckbox).toBeChecked();

    await user.click(WWLcheckbox);

    expect(WWLcheckbox).not.toBeChecked();

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith({
        category: ReportType.WWL,
        enabled: false,
      });
    });
  });
});
