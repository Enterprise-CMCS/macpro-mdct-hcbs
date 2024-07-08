// USERS

// TODO: Finalize with IDM
export enum UserRoles {
  ADMIN = "mdcthcbs-bor", // "MDCT HCBS Business Owner Representative"
  APPROVER = "mdcthcbs-approver", // "MDCT HCBS Approver"
  HELP_DESK = "mdcthcbs-help-desk", // "MDCT HCBS Help Desk"
  INTERNAL = "mdcthcbs-cms-internal-user", // "MDCT HCBS Internal User"
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
  loginWithIDM: () => void;
  showLocalLogins?: boolean;
  updateTimeout: () => void;
}
