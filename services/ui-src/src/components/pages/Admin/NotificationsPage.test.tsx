import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationsPage } from "components";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: jest.fn().mockReturnValue({
    notificationsSystem: true,
  }),
}));

describe("<NotificationsPage />", () => {
  describe("Test NotificationsPage toggle functionality", () => {
    test("clicking one toggle does not check all toggles", async () => {
      render(<NotificationsPage />);
      const user = userEvent.setup();
      const QMSToggle = screen.getByLabelText(/QMS/i);
      const TACMToggle = screen.getByLabelText(/TACM/i);
      const CIToggle = screen.getByLabelText(/CI/i);
      const PCPToggle = screen.getByLabelText(/PCP/i);
      const WWLToggle = screen.getByLabelText(/WWL/i);

      await user.click(QMSToggle);

      expect(QMSToggle).toBeChecked();
      expect(TACMToggle).not.toBeChecked();
      expect(CIToggle).not.toBeChecked();
      expect(PCPToggle).not.toBeChecked();
      expect(WWLToggle).not.toBeChecked();
    });
  });

  testA11yAct(<NotificationsPage />);
});
