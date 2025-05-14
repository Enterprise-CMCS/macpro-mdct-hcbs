import {
  authenticatedUser,
  parseUserFromToken,
  DecodedToken,
} from "../authentication";
import { proxyEvent } from "../../testing/proxyEvent";
import { UserRoles } from "../../types/types";

var mockDecode: jest.Mock;

jest.mock("jwt-decode", () => {
  mockDecode = jest.fn();
  return {
    __esModule: true,
    default: mockDecode,
  };
});

const apiKeyEvent = { ...proxyEvent, headers: { "x-api-key": "test" } };
const mockToken = {
  "custom:cms_roles": "other-role,mdcthcbs-state-user,another-role",
  "custom:cms_state": "CO",
  email_verified: true,
  email: "stateuser@test.com",
  given_name: "Helen Hunt",
  family_name: "Jackson",
} as DecodedToken;

describe("Authentication methods", () => {
  describe("Test authorization with api key and environment variables", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("is not authorized when token is missing or invalid", () => {
      mockDecode.mockImplementation(() => {
        return undefined;
      });
      const authStatus = authenticatedUser(apiKeyEvent);
      expect(authStatus).toBeFalsy();
    });
    test("is authorized when api key is passed and environment variables are set", () => {
      mockDecode.mockReturnValue(mockToken);
      const authStatus = authenticatedUser(apiKeyEvent);
      expect(authStatus).toBeTruthy();
    });
  });

  describe("Test authorization with api key", () => {
    beforeEach(() => {
      mockDecode.mockReturnValue(mockToken);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("is authorized when api key is passed", () => {
      const authStatus = authenticatedUser(apiKeyEvent);
      expect(authStatus).toBeTruthy();
    });
  });

  describe("User token parsing", () => {
    it("should successfully parse a valid token", () => {
      const user = parseUserFromToken(mockToken);

      expect(user).toBeTruthy();
      expect(user.role).toBe(UserRoles.STATE_USER);
      expect(user.email).toBe("stateuser@test.com");
      expect(user.fullName).toBe("Helen Hunt Jackson");
    });

    it("should fail if the roles key is missing", () => {
      const noRoleToken = { ...mockToken };
      delete noRoleToken["custom:cms_roles"];
      expect(() => parseUserFromToken(noRoleToken)).toThrow();
    });

    it("should fail if the role is invalid", () => {
      const badRoleToken = { ...mockToken, "custom:cms_roles": "invalid" };
      expect(() => parseUserFromToken(badRoleToken)).toThrow();
    });

    it("should succeed with no state if user has none", () => {
      const noStateToken = { ...mockToken };
      delete noStateToken["custom:cms_state"];
      const user = parseUserFromToken(noStateToken);
      expect(user.state).toBeUndefined();
    });

    it("should fail if state is invalid", () => {
      const badStateToken = { ...mockToken, "custom:cms_state": "invalid" };
      expect(() => parseUserFromToken(badStateToken)).toThrow();
    });

    it("should omit first name if it is not in the token", () => {
      const noGivenNameToken = { ...mockToken, given_name: undefined };
      const user = parseUserFromToken(noGivenNameToken);
      expect(user.fullName).toBe("Jackson");
    });
  });
});
