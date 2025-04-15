import { render, screen } from "@testing-library/react";
import { mockUseStore } from "utils/testing/setupJest";
import { StatusAlert } from "./StatusAlert";
import { ElementType, StatusAlertTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useStore } from "utils";

jest.mock("utils/state/reportLogic/completeness", () => ({
  inferredReportStatus: jest.fn().mockReturnValue("Complete"),
}));

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockReturnValue({ ...mockUseStore, currentPageId: "mock-id" }),
}));

const mockStatusAlert = {
  type: ElementType.StatusAlert,
  title: "mock alert",
  text: "mock text",
  status: "error",
} as StatusAlertTemplate;

const statusAlertComponent = (
  <StatusAlert
    element={mockStatusAlert}
    index={0}
    formkey="elements.0"
  ></StatusAlert>
);

describe("<StatusAlert />", () => {
  describe("Test StatusAlert component", () => {
    test("StatusAlert is visible", () => {
      render(statusAlertComponent);
      expect(screen.getByText("mock alert")).toBeVisible();
      expect(screen.getByText("mock text")).toBeVisible();
    });

    test("Test Review & Submit banner", () => {
      (useStore as unknown as jest.Mock).mockReturnValue({
        ...mockUseStore,
        report: { pages: [{ childPageIds: ["test-1"] }] },
        currentPageId: "review-submit",
      });
      render(statusAlertComponent);

      expect(screen.queryByText("mock alert")).not.toBeInTheDocument();
      expect(screen.queryByText("mock text")).not.toBeInTheDocument();
    });
  });

  testA11y(statusAlertComponent);
});
