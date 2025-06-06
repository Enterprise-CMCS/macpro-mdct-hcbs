import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import { StatusAlert } from "./StatusAlert";
import { AlertTypes, ElementType, StatusAlertTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";
import userEvent from "@testing-library/user-event";

jest.mock("utils/state/reportLogic/completeness", () => ({
  inferredReportStatus: jest.fn().mockReturnValue("Complete"),
}));

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return false;
        }
        return { ...mockUseStore, currentPageId: "mock-id" };
      }
    ),
}));

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

const mockStatusAlert: StatusAlertTemplate = {
  id: "mock-alert-id",
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text",
  status: AlertTypes.ERROR,
};

const mockStatusLink: StatusAlertTemplate = {
  id: "mock-alert-id",
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text {ReturnButton}",
  status: AlertTypes.ERROR,
};

const statusAlertComponent = (
  <StatusAlert element={mockStatusAlert} formkey="elements.0"></StatusAlert>
);

describe("<StatusAlert />", () => {
  describe("Test StatusAlert component", () => {
    test("StatusAlert is visible", () => {
      render(statusAlertComponent);
      expect(screen.getByText("mock alert")).toBeVisible();
      expect(screen.getByText("mock text")).toBeVisible();
    });

    test("StatusAlert with link is clickable", async () => {
      render(
        <StatusAlert
          element={mockStatusLink}
          formkey="elements.0"
        ></StatusAlert>
      );

      expect(screen.getByText("mock alert")).toBeVisible();
      const link = screen.getByText("Click here");

      await userEvent.click(link);
    });

    test("Test Review & Submit banner", () => {
      (useStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          return { submittable: true };
        }
        return {
          ...mockUseStore,
          report: { pages: [{ childPageIds: ["test-1"] }] },
          currentPageId: "review-submit",
        };
      });
      render(statusAlertComponent);

      expect(screen.queryByText("mock alert")).not.toBeInTheDocument();
      expect(screen.queryByText("mock text")).not.toBeInTheDocument();
    });
  });

  testA11y(statusAlertComponent);
});
