// USERS

export enum UserRoles {
  ADMIN = "mdctlabs-bor", // "MDCT LABS Business Owner Representative"
  APPROVER = "mdctlabs-appr", // "MDCT LABS Approver"
  HELP_DESK = "mdctlabs-hd", // "MDCT LABS Help Desk"
  INTERNAL = "mdctlabs-internal-user", // "MDCT LABS Internal User"
  STATE_USER = "mdctlabs-state-user", // "MDCT LABS State User"
}

export interface User {
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
  user?: User;
  getExpiration: () => string;
  logout: () => Promise<void>;
  loginWithIDM: () => Promise<void>;
  showLocalLogins?: boolean;
  updateTimeout: () => void;
}
