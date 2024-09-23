import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import jwt_decode from "jwt-decode";
import { APIGatewayProxyEvent, UserRoles } from "../types/types";
import { logger } from "../libs/debug-lib";
import { CognitoJwtVerifier } from "aws-jwt-verify";

interface DecodedToken {
  "custom:cms_roles": UserRoles;
  "custom:cms_state": string | undefined;
}

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
    const ssmClient = new SSMClient({ logger });
    const stage = process.env.STAGE!;
    const getParam = async (identifier: string) => {
      const command = new GetParameterCommand({
        Name: `/${stage}/ui-auth/${identifier}`,
      });
      const result = await ssmClient.send(command);
      return result.Parameter?.Value;
    };
    const userPoolId = await getParam("cognito_user_pool_id");
    const userPoolClientId = await getParam("cognito_user_pool_client_id");
    if (userPoolId && userPoolClientId) {
      process.env["COGNITO_USER_POOL_ID"] = userPoolId;
      process.env["COGNITO_USER_POOL_CLIENT_ID"] = userPoolClientId;
      return { userPoolId, userPoolClientId };
    } else {
      throw new Error("cannot load cognito values");
    }
  }
};

export const isAuthenticated = async (event: APIGatewayProxyEvent) => {
  const cognitoValues = await loadCognitoValues();

  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoValues.userPoolId,
    tokenUse: "id",
    clientId: cognitoValues.userPoolClientId,
  });

  try {
    await verifier.verify(event.headers?.["x-api-key"]!);
    return true;
  } catch {
    return false;
  }
};

export const hasPermissions = (
  event: APIGatewayProxyEvent,
  allowedRoles: UserRoles[],
  state?: string
) => {
  let isAllowed = false;
  // decode the idToken
  if (event?.headers?.["x-api-key"]) {
    const decoded = jwt_decode(event.headers["x-api-key"]) as DecodedToken;
    const idmUserRoles = decoded["custom:cms_roles"];
    const idmUserState = decoded["custom:cms_state"];
    const hcbsUserRole = idmUserRoles
      ?.split(",")
      .find((role) => role.includes("mdcthcbs")) as UserRoles;

    isAllowed =
      allowedRoles.includes(hcbsUserRole) &&
      (!state || idmUserState?.includes(state))!;
  }

  return isAllowed;
};

export const isAuthorizedToFetchState = (
  event: APIGatewayProxyEvent,
  state: string
) => {
  // If this is a state user for the matching state, authorize them.
  if (hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return true;
  }

  const nonStateUserRoles = Object.values(UserRoles).filter(
    (role) => role !== UserRoles.STATE_USER
  );

  // If they are any other user type, they don't need to belong to this state.
  return hasPermissions(event, nonStateUserRoles);
};
