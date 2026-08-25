import { beforeEach, describe, expect, it, vi } from "vitest";
import { initAuthManager, updateTimeout, getExpiration } from "utils";
import { refreshCredentials } from "./authLifecycle";
import { fetchAuthSession } from "aws-amplify/auth"; // mocked in setupTests.tsx
import { Hub } from "aws-amplify/utils";
import { sub } from "date-fns";

describe("utils/auth", () => {
  describe("AuthManager Initialization", () => {
    it("should require a new login when initializing when past expiration", async () => {
      // Set an initial time, because jest runs too fast to have different timestamps
      const expired = sub(Date.now(), {
        days: 5,
      }).toDateString();
      localStorage.setItem("mdcthcbs_session_exp", expired);

      initAuthManager();
      const clearedTime = localStorage.getItem("mdcthcbs_session_exp");
      expect(clearedTime).toEqual(null);
    });
  });

  describe("AuthManager", () => {
    beforeEach(() => {
      // Auth manager has a debounce that runs for 2s every time it updates
      vi.useFakeTimers();
      initAuthManager();
      vi.runAllTimers();
    });

    it("should update expected session expiration on updateTimeout", () => {
      const currentTime = Date.now();
      updateTimeout();
      vi.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

      const savedTime = localStorage.getItem("mdcthcbs_session_exp");
      expect(new Date(savedTime!).valueOf()).toBeGreaterThanOrEqual(
        new Date(currentTime).valueOf()
      );
    });

    it("should refresh the auth session on refreshCredentials", async () => {
      // Set an initial time, because jest runs too fast to have different timestamps
      const initialExpiration = sub(Date.now(), { seconds: 5 }).toString();
      localStorage.setItem("mdcthcbs_session_exp", initialExpiration);
      await refreshCredentials();
      vi.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

      expect(fetchAuthSession).toHaveBeenCalledWith({ forceRefresh: true });

      // Check that the new timestamp is updated
      const storedExpiration = getExpiration();
      expect(storedExpiration).not.toEqual(initialExpiration);
      expect(new Date(storedExpiration!).valueOf()).toBeGreaterThan(
        new Date(initialExpiration).valueOf()
      );
    });

    it("should give an empty string as expected expiration, when none is set", async () => {
      localStorage.removeItem("mdcthcbs_session_exp");

      const storedExpiration = getExpiration();
      expect(storedExpiration).toEqual("");
    });
  });

  describe("AuthManager Hub Integration", () => {
    let spy = vi.spyOn(localStorage.__proto__, "setItem");
    beforeEach(() => {
      spy.mockClear();
    });

    it("should listen for auth events", () => {
      Hub.listen = vi
        .fn()
        .mockImplementation((_channel: string, callback: any) => {
          callback({ payload: { event: "signIn" } });
        });
      initAuthManager();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("should ignore unrelated auth events", () => {
      const currentTime = Date.now();
      Hub.listen = vi
        .fn()
        .mockImplementation((channel: string, callback: any) => {
          callback({ payload: { event: "nonExistentEvent" } });
        });
      initAuthManager();
      const savedTime = localStorage.getItem("mdcthcbs_session_exp");
      expect(new Date(savedTime!).valueOf()).toBeGreaterThanOrEqual(
        new Date(currentTime).valueOf()
      );
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
