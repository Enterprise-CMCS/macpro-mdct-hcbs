import { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// utils
import { UserContext, UserProvider, useStore } from "utils";
import { mockUseStore, RouterWrappedComponent } from "utils/testing/setupJest";

jest.mock("utils/state/useStore");
const mockSetUser = jest.fn();
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockUseStore,
  setUser: mockSetUser,
});

// COMPONENTS

const TestComponent = () => {
  const { ...context } = useContext(UserContext);
  return (
    <div>
      <button onClick={() => context.logout()}>Logout</button>
      <button onClick={() => context.loginWithIDM()}>Log In with IDM</button>
      User Test
      <p>
        {mockedUseStore().showLocalLogins
          ? "showLocalLogins is true"
          : "showLocalLogins is false"}
      </p>
    </div>
  );
};

const testComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <TestComponent />
    </UserProvider>
  </RouterWrappedComponent>
);

// HELPERS
let originalLocation: any;

const setWindowOrigin = (windowOrigin: string) => {
  if (!originalLocation) {
    originalLocation = window.location;
  }
  delete (window as any).location;
  (window as any).location = {
    assign: jest.fn(),
    pathname: "/",
    href: `${windowOrigin}/`,
    origin: windowOrigin,
  };
};

const breakCheckAuthState = async () => {
  const mockAmplify = require("aws-amplify/auth");
  mockAmplify.currentSession = jest.fn().mockImplementation(() => {
    throw new Error();
  });
};

// TESTS

describe("<UserProvider />", () => {
  beforeAll(() => {
    setWindowOrigin("localhost");
  });

  afterAll(() => {
    if (originalLocation) {
      (window as any).location = originalLocation;
    }
  });

  describe("Test UserProvider", () => {
    beforeEach(async () => {
      await act(async () => {
        render(testComponent);
      });
    });

    test("child component renders", () => {
      expect(screen.getByText("User Test")).toBeVisible();
    });

    test("logout function", async () => {
      await act(async () => {
        const logoutButton = screen.getByRole("button", { name: "Logout" });
        await userEvent.click(logoutButton);
      });
      expect(window.location.pathname).toEqual("/");
    });

    test("login with IDM function", async () => {
      await act(async () => {
        const loginButton = screen.getByRole("button", {
          name: "Log In with IDM",
        });
        await userEvent.click(loginButton);
      });
      expect(screen.getByText("User Test")).toBeVisible();
    });
  });

  describe("Test UserProvider with production path", () => {
    test("production authenticates with idm when current authenticated user throws an error", async () => {
      setWindowOrigin("mdctlabs.cms.gov");
      await breakCheckAuthState();
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("mdctlabs.cms.gov");
      expect(screen.getByText("User Test")).toBeVisible();
    });
  });

  describe("Test UserProvider with non-production path", () => {
    test("Non-production error state correctly sets showLocalLogins", async () => {
      setWindowOrigin("wherever");
      await breakCheckAuthState();
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("wherever");
      expect(screen.getByText("showLocalLogins is true")).toBeVisible();
    });
  });

  describe("Test UserProvider error handling", () => {
    test("Logs error to console if logout throws error", async () => {
      jest.spyOn(console, "log").mockImplementation(jest.fn());
      const spy = jest.spyOn(console, "log");

      const mockAmplify = require("aws-amplify/auth");
      mockAmplify.signOut = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await act(async () => {
        render(testComponent);
      });

      await act(async () => {
        const logoutButton = screen.getByRole("button", { name: "Logout" });
        await userEvent.click(logoutButton);
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  test("check auth function", async () => {
    const mockAmplify = require("aws-amplify/auth");
    mockAmplify.fetchAuthSession = jest.fn().mockResolvedValue({
      tokens: {
        idToken: {
          payload: {
            email: "email@address.com",
            given_name: "first",
            family_name: "last",
            "custom:cms_roles": "roles",
            "custom:cms_state": "ZZ",
          },
        },
      },
    });
    await act(async () => {
      render(testComponent);
    });
    expect(mockSetUser).toHaveBeenCalledWith({
      email: "email@address.com",
      given_name: "first",
      family_name: "last",
      full_name: "first last",
      userRole: undefined,
      state: "ZZ",
      userIsAdmin: false,
      userIsReadOnly: false,
      userIsEndUser: false,
    });
  });
});
