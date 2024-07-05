import { HcbsUser } from "types";

// initial user state
export interface HcbsUserState {
  // INITIAL STATE
  user?: HcbsUser;
  showLocalLogins: boolean | undefined;
  // ACTIONS
  setUser: (newUser?: HcbsUser) => void;
  setShowLocalLogins: (showLocalLogins: boolean) => void;
}
