import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { Timeout } from "components";
import { IDLE_WINDOW, PROMPT_AT } from "../../constants";
import {
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { initAuthManager, UserContext, useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const mockLogout = jest.fn();
const mockLoginWithIDM = jest.fn();
const mockUpdateTimeout = jest.fn();
const mockGetExpiration = jest.fn();

const mockUser = {
  ...mockStateUserStore,
};

const mockUserContext = {
  user: undefined,
  logout: mockLogout,
  loginWithIDM: mockLoginWithIDM,
  updateTimeout: mockUpdateTimeout,
  getExpiration: mockGetExpiration,
};

const timeoutComponent = (
  <RouterWrappedComponent>
    <UserContext.Provider value={mockUserContext}>
      <Timeout />
    </UserContext.Provider>
  </RouterWrappedComponent>
);

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const spy = jest.spyOn(global, "setTimeout");

describe("Test Timeout Modal", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    mockedUseStore.mockReturnValue(mockUser);
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    spy.mockClear();
  });

  test("Timeout modal is visible", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "Stay logged in" })
        ).toBeVisible();
        expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
      },
      { timeout: 10000 }
    );
  }, 15000);

  test("Timeout modal refresh button is clickable and closes modal", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const refreshButton = screen.getByRole("button", {
      name: "Stay logged in",
    });
    await act(async () => {
      fireEvent.click(refreshButton);
    });
    await waitFor(() => {
      expect(refreshButton).not.toBeVisible();
      expect(
        screen.queryByRole("button", { name: "Log out" })
      ).not.toBeInTheDocument();
    });
  });

  test("Timeout modal logout button is clickable and triggers logout", async () => {
    await act(async () => {
      jest.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const logoutButton = screen.getByRole("button", { name: "Log out" });
    mockLogout.mockReset();
    await act(async () => {
      await fireEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
  test("Timeout modal executes logout on timeout", async () => {
    mockLogout.mockReset();
    await act(async () => {
      jest.advanceTimersByTime(10 * IDLE_WINDOW);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe("Test Timeout Modal accessibility", () => {
  initAuthManager();
  mockedUseStore.mockReturnValue(mockUser);
  testA11y(timeoutComponent);
});
