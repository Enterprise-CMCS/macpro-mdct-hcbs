import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { UserContext, UserProvider, useStore } from "utils";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { UserRoles } from "types/users";

const mockAuthPayload = {
  email: "test@email.com",
  given_name: "Test",
  family_name: "IsMe",
  ["custom:cms_roles"]: UserRoles.STATE_USER,
  ["custom:cms_state"]: "AL",
};

jest.mock("aws-amplify", () => ({
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: () => ({
        payload: mockAuthPayload,
      }),
    }),
    configure: () => {},
    signOut: jest.fn().mockImplementation(() => {}),
    federatedSignIn: () => {},
  },
  Hub: {
    listen: jest.fn(),
  },
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

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

const mockReplace = jest.fn();

const originalLocationDescriptor: any = Object.getOwnPropertyDescriptor(
  global,
  "location"
);

const setWindowOrigin = (windowOrigin: string) => {
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      assign: jest.fn(),
      origin: windowOrigin,
      replace: mockReplace,
      pathname: "/",
    },
    writable: true,
  });
};

const breakCheckAuthState = async () => {
  const mockAmplify = require("aws-amplify");
  mockAmplify.Auth.currentSession = jest.fn().mockImplementation(() => {
    throw new Error();
  });
};

// TESTS

describe("<UserProvider />", () => {
  beforeAll(() => {
    setWindowOrigin("localhost");
  });

  afterAll(() => {
    Object.defineProperty(global, "location", originalLocationDescriptor);
  });

  describe("Test UserProvider", () => {
    beforeEach(async () => {
      await act(async () => {
        mockedUseStore.mockReturnValue(mockStateUserStore);
        render(testComponent);
      });
    });

    test("child component renders", () => {
      expect(screen.getByText("User Test")).toBeVisible();
    });

    test("test logout function", async () => {
      await act(async () => {
        const logoutButton = screen.getByRole("button", { name: "Logout" });
        await userEvent.click(logoutButton);
      });
      expect(window.location.pathname).toEqual("/");
    });

    test("test login with IDM function", async () => {
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
    test("test production authenticates with idm when current authenticated user throws an error", async () => {
      setWindowOrigin("mdcthcbs.cms.gov");
      await breakCheckAuthState();
      await act(async () => {
        mockedUseStore.mockReturnValue(mockStateUserStore);
        render(testComponent);
      });
      expect(window.location.origin).toContain("mdcthcbs.cms.gov");
      expect(screen.getByText("User Test")).toBeVisible();
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  describe("Test UserProvider with non-production path", () => {
    test("Non-production error state correctly sets showLocalLogins", async () => {
      setWindowOrigin("wherever");
      await breakCheckAuthState();
      await act(async () => {
        mockedUseStore.mockReturnValue(mockStateUserStore);
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

      const mockAmplify = require("aws-amplify");
      mockAmplify.Auth.signOut = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      await act(async () => {
        mockedUseStore.mockReturnValue(mockStateUserStore);
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
