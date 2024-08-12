// USERS

// TODO: Finalize with IDM
export enum UserRoles {
  ADMIN = "mdct-hcbs-bor", // "MDCT HCBS Business Owner Representative"
  APPROVER = "mdct-hcbs-appr", // "MDCT HCBS Approver"
  HELP_DESK = "mdct-hcbs-hd", // "MDCT HCBS Help Desk"
  INTERNAL = "mdct-hcbs-internal-user", // "MDCT HCBS Internal User"
  STATE_USER = "mdct-hcbs-state-user", // "MDCT HCBS State User"
}

export interface HcbsUser {
  email: string;
  given_name: string;
  family_name: string;
  full_name: string;
  state?: string;
  userRole?: string;
  userIsAdmin?: boolean;
  userIsReadOnly?: boolean;
  userIsEndUser?: boolean;
}

export interface UserContextShape {
  user?: HcbsUser;
  getExpiration: Function;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
  showLocalLogins?: boolean;
  updateTimeout: () => void;
}
