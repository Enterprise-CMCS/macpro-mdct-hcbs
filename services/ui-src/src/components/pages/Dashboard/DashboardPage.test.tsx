import { render, screen } from "@testing-library/react";
// components
import { DashboardPage } from "components";
// utils
import { mockStateUser } from "utils/testing/mockUsers";
import { RouterWrappedComponent } from "utils/testing/setupJest";

import { useBreakpoint, useStore, makeMediaQueryClasses } from "utils";
import { useUser } from "utils/auth/useUser";
import dashboardVerbiage from "verbiage/pages/dashboard";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-dashboard",
  })),
}));

const dashboardWithNoReports = (
  <RouterWrappedComponent>
    <DashboardPage />
  </RouterWrappedComponent>
);

describe("<DashboardPage />", () => {
  describe("Test Report Dashboard with no reports", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseUser.mockReturnValue(mockStateUser);
      mockedUseStore.mockReturnValue({
        reportsByState: undefined,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    test("Dashboard renders table with empty text", () => {
      mockedUseStore.mockReturnValue(mockStateUser);
      render(dashboardWithNoReports);
      expect(screen.getByText(dashboardVerbiage.body.empty)).toBeVisible();
    });
  });
});
