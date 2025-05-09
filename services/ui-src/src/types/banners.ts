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
  fetchAdminBanner: () => Promise<void>;
  writeAdminBanner: (data: BannerData) => Promise<void>;
  deleteAdminBanner: () => Promise<void>;
}

export interface AdminBannerShape extends AdminBannerMethods {}
