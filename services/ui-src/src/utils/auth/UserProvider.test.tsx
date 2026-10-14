import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { UserContext, UserProvider, useStore } from "utils";
import { RouterWrappedComponent } from "utils/testing/setupTests";

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
}));

const TestComponent = () => {
  const { ...context } = useContext(UserContext);
  return (
    <div>
      <button onClick={() => context.logout()}>Logout</button>
      <button onClick={() => context.loginWithIDM()}>Log In with IDM</button>
      User Test
      <p>
        {useStore.getState().showLocalLogins
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

const originalLocationDescriptor = Object.getOwnPropertyDescriptor(
  global,
  "location"
)!;

const setWindowOrigin = (windowOrigin: string) => {
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      assign: vi.fn(),
      origin: windowOrigin,
      pathname: "/",
    },
    writable: true,
  });
};

describe("<UserProvider />", () => {
  beforeAll(() => {
    setWindowOrigin("localhost");
  });

  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
  });

  it("should render child components", () => {
    render(testComponent);
    expect(screen.getByText("User Test")).toBeVisible();
  });

  it("should redirect to site root on logout", async () => {
    render(testComponent);
    await act(async () => {
      const logoutButton = screen.getByRole("button", { name: "Logout" });
      await userEvent.click(logoutButton);
    });
    expect(window.location.pathname).toEqual("/");
  });

  it("should successfully login with IDM", async () => {
    render(testComponent);
    await act(async () => {
      const loginButton = screen.getByRole("button", {
        name: "Log In with IDM",
      });
      await userEvent.click(loginButton);
    });
    expect(screen.getByText("User Test")).toBeVisible();
  });

  it("should set the user field of the store on initial load", async () => {
    vi.mocked(fetchAuthSession).mockResolvedValueOnce({
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
        accessToken: {} as any,
      },
    });
    await act(async () => {
      render(testComponent);
    });
    expect(useStore.getState().user).toEqual({
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

  describe("with production path", () => {
    it("should authenticate with idm when current authenticated user throws an error", async () => {
      setWindowOrigin("mdcthcbs.cms.gov");
      vi.mocked(fetchAuthSession).mockImplementationOnce(() => {
        throw new Error("mock session error");
      });
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("mdcthcbs.cms.gov");
      expect(screen.getByText("User Test")).toBeVisible();
    });
  });

  describe("with non-production path", () => {
    it("should correctly set showLocalLogins in non-production error state", async () => {
      setWindowOrigin("wherever");
      vi.mocked(fetchAuthSession).mockImplementationOnce(() => {
        throw new Error("mock session error");
      });
      await act(async () => {
        render(testComponent);
      });
      expect(window.location.origin).toContain("wherever");
      expect(screen.getByText("showLocalLogins is true")).toBeVisible();
    });
  });

  describe("error handling", () => {
    it("should log an error to console if logout throws", async () => {
      vi.spyOn(console, "log").mockImplementation(vi.fn());
      const spy = vi.spyOn(console, "log");

      vi.mocked(signOut).mockImplementation(() => {
        throw new Error("Some error occured");
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
});
