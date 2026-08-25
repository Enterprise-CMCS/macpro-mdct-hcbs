import { describe, expect, it, vi } from "vitest";
import { render, screen, getDefaultNormalizer } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";
import { HcbsUser, ReportType } from "types";
import { useNavigate } from "react-router-dom";
import { useStore } from "utils";

vi.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => ({
    isDesktop: true,
  })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

useStore.setState({ user: { state: "MN" } as HcbsUser });

const reportActionsComponent = (reportType: ReportType) => (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={reportType} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("Renders", () => {
    it("should navigate to dashboard on link click", async () => {
      render(reportActionsComponent(ReportType.QMS));
      const dashboardLink = screen.getByRole("link", {
        name: "Enter QMS Report online",
      });
      userEvent.click(dashboardLink);
      await userEvent.click(dashboardLink);
      const expectedRoute = "/report/QMS/MN";
      expect(useNavigate()).toHaveBeenCalledWith(expectedRoute);
    });

    it.each([
      { type: ReportType.QMS, text: "QMS Report" },
      { type: ReportType.TACM, text: "TACM Report" },
      { type: ReportType.CI, text: "CI Report" },
      { type: ReportType.PCP, text: "PCP Report" },
      { type: ReportType.QIP, text: "QMS QIP" },
      { type: ReportType.WWL, text: "WWL Report" },
      { type: "an invalid report type" as ReportType, text: "" },
    ])("should render the correct button text for $type", ({ type, text }) => {
      render(reportActionsComponent(type));
      expect(
        screen.getByText(`Enter ${text} online`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      ).toBeVisible();
    });
  });

  testA11y(reportActionsComponent(ReportType.QMS));
});
