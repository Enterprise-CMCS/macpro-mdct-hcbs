import { render, screen, waitFor } from "@testing-library/react";
import {
  getNotifications,
  updateNotifications,
} from "utils/api/requestMethods/notifications";
import { sendEmail } from "utils/api/requestMethods/sendEmail";
import { NotificationsPage } from "./NotificationsPage";
import { ReportType } from "types";
import userEvent from "@testing-library/user-event";

jest.mock("utils/api/requestMethods/notifications", () => ({
  getNotifications: jest.fn(),
  updateNotifications: jest.fn(),
}));

jest.mock("utils/api/requestMethods/sendEmail", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: jest.fn().mockReturnValue({ notificationsSystem: true }),
}));

const mockedGet = jest.mocked(getNotifications);
const mockedUpdate = jest.mocked(updateNotifications);
const mockedSendEmail = jest.mocked(sendEmail);

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    mockedGet.mockResolvedValue([]);
    mockedSendEmail.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should display checked state for enabled notifications", async () => {
    mockedGet.mockResolvedValue([{ category: ReportType.CI, enabled: true }]);

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

  it("should call sendEmail with the correct payload when Send Email is clicked", async () => {
    render(<NotificationsPage />);

    const button = await screen.findByRole("button", { name: /send email/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(mockedSendEmail).toHaveBeenCalledWith({
        toAddress: "test@test.com",
        subject: "HCBS Notification",
        message: "This is a notification from the HCBS system.",
      });
    });
  });

  it("should show loading state while sending email", async () => {
    let resolveSend!: () => void;
    mockedSendEmail.mockReturnValue(
      new Promise<undefined>((resolve) => {
        resolveSend = () => resolve(undefined);
      })
    );

    render(<NotificationsPage />);

    const button = await screen.findByRole("button", { name: /send email/i });
    await userEvent.click(button);

    expect(await screen.findByText("Sending...")).toBeInTheDocument();

    resolveSend();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /send email/i })
      ).toBeInTheDocument();
    });
  });
});
