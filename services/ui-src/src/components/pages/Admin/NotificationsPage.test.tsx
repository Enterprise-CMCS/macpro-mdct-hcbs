import { render, screen } from "@testing-library/react";
import { getNotifications } from "utils/api/requestMethods/notifications";
import { NotificationsPage } from "./NotificationsPage";

jest.mock("utils/api/requestMethods/notifications", () => ({
  getNotifications: jest.fn(),
}));

describe("<NotificationsPage />", () => {
  it("should display checked state for enabled notifications", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { category: "CI", enabled: true },
    ]);

    render(<NotificationsPage />);

    const CIcheckbox = await screen.findByRole("checkbox", { name: /CI/i });
    expect(CIcheckbox).toBeChecked();
  });
});
