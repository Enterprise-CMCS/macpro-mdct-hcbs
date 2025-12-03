import {
  canArchiveReport,
  canReadState,
  canReleaseReport,
  canWriteBanner,
  canWriteState,
} from "../authorization";
import { User, UserRoles } from "../../types/types";

const adminUser = {
  role: UserRoles.ADMIN,
} as User;

const approverUser = {
  role: UserRoles.APPROVER,
} as User;

const internalUser = {
  role: UserRoles.INTERNAL,
} as User;

const helpDeskUser = {
  role: UserRoles.HELP_DESK,
} as User;

const stateUser = {
  role: UserRoles.STATE_USER,
  state: "CO",
} as User;

describe("Authorization functions", () => {
  describe("canReadState", () => {
    it("should allow admins", () => {
      expect(canReadState(adminUser, "CO")).toBe(true);
    });

    it("should allow state users to read their own state", () => {
      expect(canReadState(stateUser, "CO")).toBe(true);
    });

    it("should forbid state users to read other states", () => {
      expect(canReadState(stateUser, "TX")).toBe(false);
    });
  });

  describe("canWriteBanners", () => {
    it("should forbid admins", () => {
      expect(canWriteState(adminUser, "CO")).toBe(false);
    });

    it("should allow state users to read their own state", () => {
      expect(canWriteState(stateUser, "CO")).toBe(true);
    });

    it("should forbid state users to read other states", () => {
      expect(canWriteState(stateUser, "TX")).toBe(false);
    });
  });

  describe("canReleaseReport", () => {
    it("should allow admins and approvers, forbid others", () => {
      expect(canReleaseReport(adminUser)).toBe(true);
      expect(canReleaseReport(approverUser)).toBe(true);

      expect(canReleaseReport(stateUser)).toBe(false);
      expect(canReleaseReport(helpDeskUser)).toBe(false);
      expect(canReleaseReport(internalUser)).toBe(false);
    });
  });

  describe("canArchiveReport", () => {
    it("should allow admins and approvers, forbid others", () => {
      expect(canArchiveReport(adminUser)).toBe(true);
      expect(canArchiveReport(approverUser)).toBe(true);

      expect(canArchiveReport(stateUser)).toBe(false);
      expect(canArchiveReport(helpDeskUser)).toBe(false);
      expect(canArchiveReport(internalUser)).toBe(false);
    });
  });
  describe("canWriteBanner", () => {
    it("should ONLY allow admins, forbid others", () => {
      expect(canWriteBanner(adminUser)).toBe(true);

      expect(canWriteBanner(approverUser)).toBe(false);
      expect(canWriteBanner(stateUser)).toBe(false);
      expect(canWriteBanner(helpDeskUser)).toBe(false);
      expect(canWriteBanner(internalUser)).toBe(false);
    });
  });
});
