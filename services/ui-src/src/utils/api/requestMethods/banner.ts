import { apiLib } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { AdminBannerData } from "types/banners";
import { updateTimeout } from "utils";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  return await apiLib.get(`/banners/${bannerKey}`, options);
}

async function writeBanner(bannerData: AdminBannerData) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...bannerData },
  };

  updateTimeout();
  return await apiLib.post(`/banners/${bannerData.key}`, options);
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
