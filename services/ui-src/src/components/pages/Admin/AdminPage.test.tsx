import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminPage, AdminBannerContext } from "components";
import { useStore } from "utils";
import {
  mockBannerStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { mockBannerData } from "utils/testing/mockBanner";
import { bannerErrors } from "verbiage/errors";
import { testA11yAct } from "utils/testing/commonTests";
import { AdminBannerShape } from "types";

const mockBannerMethods = {
  fetchAdminBanner: jest.fn(async () => {}),
  writeAdminBanner: jest.fn(async () => {}),
  deleteAdminBanner: jest.fn(async () => {}),
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const adminView = (context: AdminBannerShape) => (
  <RouterWrappedComponent>
    <AdminBannerContext.Provider value={context}>
      <AdminPage />
    </AdminBannerContext.Provider>
  </RouterWrappedComponent>
);

describe("<AdminPage />", () => {
  describe("Test AdminPage banner manipulation functionality", () => {
    test("Deletes current banner on delete button click", async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue(mockBannerStore);
        await render(adminView(mockBannerMethods));
      });
      const deleteButton = screen.getByText("Delete Current Banner");
      await userEvent.click(deleteButton);
      await waitFor(() =>
        expect(mockBannerMethods.deleteAdminBanner).toHaveBeenCalled()
      );
    });
  });

  describe("Test AdminPage without banner", () => {
    beforeEach(async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          bannerData: undefined,
        });
        await render(adminView(mockBannerMethods));
      });
    });

    test("Check that AdminPage renders", () => {
      const heading = screen.getByRole("heading", { name: "Banner Admin" });
      expect(heading).toBeVisible();
    });

    test("Check that current banner info does not render", () => {
      const currentBannerStatus = screen.queryByText("Status:");
      expect(currentBannerStatus).not.toBeInTheDocument();
    });

    test("Check that 'no current banner' text shows", async () => {
      expect(screen.getByText("There is no current banner")).toBeVisible();
    });
  });

  describe("Test AdminPage with banner", () => {
    beforeEach(async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue(mockBannerStore);
        await render(adminView(mockBannerMethods));
      });
    });

    test("Check that AdminPage renders", () => {
      const heading = screen.getByRole("heading", { name: "Banner Admin" });
      expect(heading).toBeVisible();
    });

    test("Check that current banner info renders", () => {
      const currentBannerStatus = screen.queryByText("Status:");
      expect(currentBannerStatus).toBeVisible();

      const deleteButton = screen.getByText("Delete Current Banner");
      expect(deleteButton).toBeVisible();
    });

    test("Check that 'no current banner' text does not show", () => {
      expect(
        screen.queryByText("There is no current banner")
      ).not.toBeInTheDocument();
    });
  });

  describe("Test AdminPage with active/inactive banner", () => {
    const currentTime = Date.now(); // 'current' time in ms since unix epoch
    const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
    const context = mockBannerMethods;
    mockedUseStore.mockReturnValue(mockBannerStore);

    test("Active banner shows 'active' status", async () => {
      // TODO: actually toggle active status
      const activeBannerData = {
        ...mockBannerData,
        startDate: currentTime - oneDay,
        endDate: currentTime + oneDay,
      };
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          bannerData: activeBannerData,
          bannerActive: true,
        });
        await render(adminView(context));
      });
      const currentBannerStatus = screen.getByText("Status:");
      expect(currentBannerStatus.textContent).toEqual("Status: Active");
    });

    test("Inactive banner shows 'inactive' status", async () => {
      const inactiveBannerData = {
        ...mockBannerData,
        startDate: currentTime + oneDay,
        endDate: currentTime + oneDay + oneDay,
      };
      await act(async () => {
        mockedUseStore.mockReturnValue({
          ...mockBannerStore,
          bannerData: inactiveBannerData,
        });
        await render(adminView(context));
      });
      const currentBannerStatus = screen.getByText("Status:");
      expect(currentBannerStatus.textContent).toEqual("Status: Inactive");
    });
  });

  describe("Test AdminPage displays banner error when state has set an error", () => {
    test("Displays error if deleteBanner throws error", async () => {
      mockedUseStore.mockReturnValue({
        ...mockBannerStore,
        bannerErrorMessage: bannerErrors.DELETE_BANNER_FAILED,
      });

      await act(async () => {
        await render(adminView(mockBannerMethods));
      });

      expect(
        screen.getByText("Current banner could not be deleted")
      ).toBeVisible();
    });
  });

  testA11yAct(adminView(mockBannerMethods));
});
