import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import config from "config";
import { initAuthManager, updateTimeout, getExpiration, useStore } from "utils";
import { PRODUCTION_HOST_DOMAIN } from "../../constants";
import { HcbsUser, UserContextShape, UserRoles } from "types/users";

type ExpectedTokenShape = {
  email: string;
  given_name: string;
  family_name: string;
  "custom:cms_roles": string;
  "custom:cms_state": string | undefined;
};

export const UserContext = createContext<UserContextShape>({
  logout: async () => {},
  loginWithIDM: async () => {},
  updateTimeout: () => {},
  getExpiration: () => "",
});

const authenticateWithIDM = async () => {
  await signInWithRedirect({ provider: { custom: "Okta" } });
};

export const UserProvider = ({ children }: Props) => {
  const location = useLocation();
  const isProduction = window.location.origin.includes(PRODUCTION_HOST_DOMAIN);

  // state management
  const { user, showLocalLogins, setUser, setShowLocalLogins } = useStore();

  // initialize the authentication manager that oversees timeouts
  initAuthManager();

  const logout = async () => {
    try {
      setUser(undefined);
      await signOut();
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuthState = useCallback(async () => {
    // Allow Post Logout flow alongside user login flow
    if (location?.pathname.toLowerCase() === "/postlogout") {
      window.location.href = config.POST_SIGNOUT_REDIRECT;
      return;
    }

    try {
      const tokens = (await fetchAuthSession()).tokens;
      if (!tokens?.idToken) {
        throw new Error("Missing tokens auth session.");
      }
      const payload = tokens.idToken.payload;
      const {
        email,
        given_name,
        family_name,
        "custom:cms_roles": cms_role,
        "custom:cms_state": state,
      } = payload as ExpectedTokenShape;

      // "custom:cms_roles" is an string of concat roles so we need to check for the one applicable to HCBS
      const userRole = cms_role.split(",").find((r) => r.includes("mdcthcbs"));
      const full_name = [given_name, " ", family_name].join("");
      const userCheck = {
        userIsAdmin:
          userRole === UserRoles.ADMIN || userRole === UserRoles.APPROVER,
        userIsReadOnly:
          userRole === UserRoles.HELP_DESK || userRole === UserRoles.INTERNAL,
        userIsEndUser: userRole === UserRoles.STATE_USER,
      };
      const currentUser: HcbsUser = {
        email,
        given_name,
        family_name,
        full_name,
        userRole,
        state,
        ...userCheck,
      };
      setUser(currentUser);
    } catch {
      if (isProduction) {
        await authenticateWithIDM();
      } else {
        setShowLocalLogins(true);
      }
    }
  }, [isProduction, location]);

  // re-render on auth state change, checking router location
  useEffect(() => {
    checkAuthState();
  }, [location, checkAuthState]);

  const values: UserContextShape = useMemo(
    () => ({
      user,
      logout,
      showLocalLogins,
      loginWithIDM: authenticateWithIDM,
      updateTimeout,
      getExpiration,
    }),
    [user, logout, showLocalLogins]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

interface Props {
  children?: ReactNode;
}
