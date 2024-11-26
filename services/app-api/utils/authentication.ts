import { APIGatewayProxyEvent, isUserRole, User } from "../types/types";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { getCognitoParameters as getCognitoParamsFromSSM } from "../storage/cognito";
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { isStateAbbreviation } from "./constants";

const loadCognitoValues = async () => {
  if (
    process.env.COGNITO_USER_POOL_ID &&
    process.env.COGNITO_USER_POOL_CLIENT_ID
  ) {
    return {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
    };
  } else {
    const { userPoolId, userPoolClientId } = await getCognitoParamsFromSSM();
    process.env.COGNITO_USER_POOL_ID = userPoolId;
    process.env.COGNITO_USER_POOL_CLIENT_ID = userPoolClientId;
    return { userPoolId, userPoolClientId };
  }
};

/**
 * Extract user information from the event's auth headers.
 *
 * Returns `undefined` if the headers are invalid.
 */
export const authenticatedUser = async (
  event: APIGatewayProxyEvent
): Promise<User | undefined> => {
  const apiKey = event.headers?.["x-api-key"];
  const token = await verifyAndParseToken(apiKey);
  if (!token) {
    return undefined;
  }

  return parseUserFromToken(token);
};

/** Verify the signature on the JWT */
const verifyAndParseToken = async (apiKey: string | undefined) => {
  const cognitoValues = await loadCognitoValues();
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoValues.userPoolId,
    tokenUse: "id",
    clientId: cognitoValues.userPoolClientId,
  });

  try {
    return await verifier.verify(apiKey!);
  } catch {
    return undefined;
  }
};

export const parseUserFromToken = (token: CognitoIdTokenPayload) => {
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

const parseRoleFromToken = (token: CognitoIdTokenPayload) => {
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

const parseStateFromToken = (token: CognitoIdTokenPayload) => {
  if (!("custom:cms_state" in token)) {
    return undefined;
  }
  const state = token["custom:cms_state"] as string;
  if (!isStateAbbreviation(state)) {
    throw new Error(`Invalid state abbreviation: ${state}`);
  }
  return state;
};

const parseFullNameFromToken = (token: CognitoIdTokenPayload) => {
  return [token["given_name"], token["family_name"]]
    .filter((name) => !!name)
    .join(" ");
};
