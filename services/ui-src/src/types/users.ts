// USERS

// TODO: Finalize with IDM
export enum UserRoles {
  ADMIN = "mdcthcbs-bor", // "MDCT HCBS Business Owner Representative"
  APPROVER = "mdcthcbs-appr", // "MDCT HCBS Approver"
  HELP_DESK = "mdcthcbs-hd", // "MDCT HCBS Help Desk"
  INTERNAL = "mdcthcbs-internal-user", // "MDCT HCBS Internal User"
  STATE_USER = "mdcthcbs-state-user", // "MDCT HCBS State User"
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
  loginWithIDM: () => Promise<void>;
  showLocalLogins?: boolean;
  updateTimeout: () => void;
}
