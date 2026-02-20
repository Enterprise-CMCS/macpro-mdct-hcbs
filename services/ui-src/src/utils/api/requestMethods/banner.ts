import { apiLib, updateTimeout } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { BannerShape, BannerFormData } from "types/banners";

export async function getBanners() {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.get<BannerShape[]>("/banners", options);
}

export async function updateBanner(bannerData: BannerFormData) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...bannerData },
  };

  updateTimeout();
  return await apiLib.post<BannerShape>("/banners", options);
}

export async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.del(`/banners/${bannerKey}`, request);
}
