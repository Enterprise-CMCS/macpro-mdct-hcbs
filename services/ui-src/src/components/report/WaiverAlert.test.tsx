import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import { WaiverAlert } from "./WaiverAlert";
import { AlertTypes, ElementType, WaiverAlertTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
    reportType: "QMS",
    state: "CO",
    reportId: "mock-id",
  })),
}));

const mockWaiverAlert: WaiverAlertTemplate = {
  id: "mock-status-alert-id",
  type: ElementType.WaiverAlert,
  title: "mock alert",
  text: "mock text",
  status: AlertTypes.WARNING,
};

const WaiverAlertComponent = (
  <WaiverAlert element={mockWaiverAlert}></WaiverAlert>
);

describe("<WaiverAlert />", () => {
  describe("Test WaiverAlert component", () => {
    test("WaiverAlert is visible", () => {
      render(WaiverAlertComponent);
      expect(screen.getByText("mock alert")).toBeVisible();
      expect(screen.getByText("mock text")).toBeVisible();
    });
  });

  testA11y(WaiverAlertComponent);
});
