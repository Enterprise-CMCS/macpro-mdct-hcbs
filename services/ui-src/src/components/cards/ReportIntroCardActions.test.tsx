import { render, screen, getDefaultNormalizer } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { ReportType } from "types";

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
  })),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockUseStore);

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const reportActionsComponent = (reportType: ReportType) => (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={reportType} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("Renders", () => {
    test("QMS ReportTypeCard navigates to next route on link click", async () => {
      render(reportActionsComponent(ReportType.QMS));
      const dashboardLink = screen.getByRole("link", {
        name: "Enter QMS Report online",
      });
      userEvent.click(dashboardLink);
      await userEvent.click(dashboardLink);
      const expectedRoute = "/report/QMS/MN";
      expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });

    test.each([
      { type: ReportType.QMS, text: "QMS" },
      { type: ReportType.TACM, text: "TACM" },
      { type: ReportType.CICM, text: "CICM" },
      { type: "bad name" as ReportType, text: "" },
    ])("$type report card renders action button", ({ type, text }) => {
      render(reportActionsComponent(type));
      expect(
        screen.getByText(`Enter ${text} Report online`, {
          normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
        })
      ).toBeVisible();
    });
  });

  testA11y(reportActionsComponent(ReportType.QMS));
});
