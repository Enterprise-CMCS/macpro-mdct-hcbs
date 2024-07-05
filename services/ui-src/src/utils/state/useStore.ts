import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  HcbsUserState,
  HcbsUser,
} from "types";

// USER STORE
const userStore = (set: Function) => ({
  // initial state
  user: undefined,
  // show local logins
  showLocalLogins: undefined,
  // actions
  setUser: (newUser?: HcbsUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
  // toggle show local logins (dev only)
  setShowLocalLogins: () =>
    set(() => ({ showLocalLogins: true }), false, { type: "showLocalLogins" }),
});


export const useStore = create(
  // devtools is being used for debugging state
  persist(
    devtools<HcbsUserState>(
      (set) => ({
        ...userStore(set),
      })
    ),
    {
      name: "hcbs-store",
      partialize: (state) => ({}),
    }
  )
);
