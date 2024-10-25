import { APIGatewayProxyEvent } from "../types/types";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { getCognitoParameters as getCognitoParamsFromSSM } from "../storage/cognito";

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
