import { APIGatewayProxyEvent, isUserRole, User } from "../types/types";
import jwt_decode from "jwt-decode";
import { isStateAbbreviation } from "./constants";

export interface DecodedToken {
  "custom:cms_roles"?: string;
  "custom:cms_state"?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Extract user information from the event's auth headers.
 *
 * Returns `undefined` if the headers are invalid.
 */
export const authenticatedUser = (
  event: APIGatewayProxyEvent
): User | undefined => {
  const apiKey = event.headers?.["x-api-key"];
  if (apiKey) {
    const token = jwt_decode(apiKey) as DecodedToken;
    return token ? parseUserFromToken(token) : undefined;
  }
  return undefined;
};

export const parseUserFromToken = (token: DecodedToken) => {
  return {
    role: parseRoleFromToken(token),
    state: parseStateFromToken(token),
    /*
     * We expect email to always be present & valid for all users,
     * even though email_verified is not always true for our test users.
     */
    email: token.email as string,
    fullName: parseFullNameFromToken(token),
  };
};

const parseRoleFromToken = (token: DecodedToken) => {
  if (!("custom:cms_roles" in token)) {
    throw new Error(`Token is missing key "custom:cms_roles"`);
  }
  const rolesString = token["custom:cms_roles"] as string;
  const role = rolesString.split(",").find(isUserRole);
  if (!role) {
    throw new Error(`No HCBS role defined: ${rolesString}`);
  }
  return role;
};

const parseStateFromToken = (token: DecodedToken) => {
  if (!("custom:cms_state" in token)) {
    return undefined;
  }
  const state = token["custom:cms_state"] as string;
  if (!isStateAbbreviation(state)) {
    throw new Error(`Invalid state abbreviation: ${state}`);
  }
  return state;
};

const parseFullNameFromToken = (token: DecodedToken) => {
  return [token["given_name"], token["family_name"]]
    .filter((name) => !!name)
    .join(" ");
};
