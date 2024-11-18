// BANNER

export interface BannerData {
  title: string;
  description: string;
  link?: string;
  key?: string;
  startDate?: number;
  endDate?: number;
  isActive?: boolean;
}

export interface AdminBannerMethods {
  fetchAdminBanner: Function;
  writeAdminBanner: Function;
  deleteAdminBanner: Function;
}

export interface AdminBannerShape extends AdminBannerMethods {}
