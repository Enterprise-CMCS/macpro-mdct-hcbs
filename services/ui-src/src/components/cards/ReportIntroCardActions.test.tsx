import { render, screen } from "@testing-library/react";
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

const reportActionsComponent = (
  <RouterWrappedComponent>
    <ReportIntroCardActions reportType={ReportType.QMS} />
  </RouterWrappedComponent>
);

describe("<ReportIntroCardActions />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(reportActionsComponent);
    });

    test("QMS ReportTypeCard navigates to next route on link click", async () => {
      const dashboardLink = screen.getByRole("link", {
        name: "Enter QMS Report online",
      });
      userEvent.click(dashboardLink);
      await userEvent.click(dashboardLink);
      const expectedRoute = "/report/QMS/MN";
      expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    });
  });

  testA11y(reportActionsComponent);
});
