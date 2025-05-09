import { apiLib, updateTimeout } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { BannerData } from "types/banners";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.get<BannerData>(`/banners/${bannerKey}`, options);
}

async function writeBanner(bannerData: BannerData) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...bannerData },
  };

  updateTimeout();
  return await apiLib.post<BannerData>(`/banners/${bannerData.key}`, options);
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.del(`/banners/${bannerKey}`, request);
}

export { getBanner, writeBanner, deleteBanner };
