import { createContext, ReactNode, useMemo, useEffect } from "react";
import { BannerData, AdminBannerShape } from "types/banners";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import {
  checkDateRangeStatus,
  deleteBanner,
  getBanner,
  useStore,
  writeBanner,
} from "utils";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  fetchAdminBanner: async () => {},
  writeAdminBanner: async (_data: BannerData) => {},
  deleteAdminBanner: async () => {},
});

export const AdminBannerProvider = ({ children }: Props) => {
  // state management
  const {
    bannerData,
    setBannerData,
    bannerActive,
    setBannerActive,
    bannerLoading,
    setBannerLoading,
    bannerErrorMessage,
    setBannerErrorMessage,
    bannerDeleting,
    setBannerDeleting,
  } = useStore();

  const fetchAdminBanner = async () => {
    setBannerLoading(true);
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      setBannerData(currentBanner);
      setBannerErrorMessage(undefined);
    } catch (e: unknown) {
      // 404 expected when no current banner exists
      if (!!e && typeof e === "object" && e.toString().includes("404")) {
        setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setBannerLoading(false);
  };

  const deleteAdminBanner = async () => {
    setBannerDeleting(true);
    try {
      await deleteBanner(ADMIN_BANNER_ID);
      await fetchAdminBanner();
    } catch {
      setBannerErrorMessage(bannerErrors.DELETE_BANNER_FAILED);
    }
    setBannerDeleting(false);
  };

  const writeAdminBanner = async (newBannerData: BannerData) => {
    try {
      await writeBanner(newBannerData);
    } catch {
      setBannerErrorMessage(bannerErrors.CREATE_BANNER_FAILED);
    }
    await fetchAdminBanner();
  };

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData && bannerData.startDate && bannerData.endDate) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  useEffect(() => {
    fetchAdminBanner();
  }, []);

  const providerValue = useMemo(
    () => ({
      // Banner Data
      bannerData,
      setBannerData,
      // Banner showing
      bannerActive,
      setBannerActive,
      // Banner Loading
      bannerLoading,
      setBannerLoading,
      // Banner Error State
      bannerErrorMessage,
      setBannerErrorMessage,
      // Banner Deleting State
      bannerDeleting,
      setBannerDeleting,
      // Banner API calls
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [
      bannerData,
      bannerActive,
      bannerLoading,
      bannerErrorMessage,
      bannerDeleting,
    ]
  );

  return (
    <AdminBannerContext.Provider value={providerValue}>
      {children}
    </AdminBannerContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
