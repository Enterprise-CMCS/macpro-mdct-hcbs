import { canReadState, canWriteState } from "../authorization";
import { User, UserRoles } from "../../types/types";

const adminUser = {
  role: UserRoles.ADMIN,
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

  describe("canWriteState", () => {
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
});
