import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { initAuthManager, UserContext, useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const mockLogout = vi.fn();
const mockLoginWithIDM = vi.fn();
const mockUpdateTimeout = vi.fn();
const mockGetExpiration = vi.fn();

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

useStore.setState({ user: mockStateUser });

const spy = vi.spyOn(global, "setTimeout");

describe("Timeout Modal", () => {
  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    initAuthManager();
    await render(timeoutComponent);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    spy.mockClear();
  });

  it("should become visible after some time", async () => {
    await act(async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
    });
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Stay logged in" })
      ).toBeVisible();
      expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
    });
  });

  it("should close when the refresh button is clicked", async () => {
    await act(async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const refreshButton = screen.getByRole("button", {
      name: "Stay logged in",
    });
    await act(async () => {
      fireEvent.click(refreshButton);
    });
    await waitFor(() => {
      const logoutButton = screen.queryByRole("button", { name: "Log out" });
      expect(refreshButton).not.toBeVisible();
      if (logoutButton) {
        expect(logoutButton).not.toBeVisible();
      }
    });
  });

  it("should close and log the user out when the logout button is clicked", async () => {
    await act(async () => {
      vi.advanceTimersByTime(PROMPT_AT + 5000);
    });
    const logoutButton = screen.getByRole("button", { name: "Log out" });
    mockLogout.mockReset();
    await act(async () => {
      await fireEvent.click(logoutButton);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("should log the user out after some more time", async () => {
    mockLogout.mockReset();
    await act(async () => {
      vi.advanceTimersByTime(10 * IDLE_WINDOW);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  describe("accessibility", () => {
    initAuthManager();
    testA11y(timeoutComponent);
  });
});
