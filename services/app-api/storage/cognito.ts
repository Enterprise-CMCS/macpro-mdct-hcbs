import { getParameter } from "./ssm/ssm-lib";

export const getCognitoParameters = async () => {
  const stage = process.env.STAGE!;
  const nameOf = (identifier: string) => `/${stage}/ui-auth/${identifier}`;
  const [userPoolId, userPoolClientId] = await Promise.all([
    getParameter(nameOf("cognito_user_pool_id")),
    getParameter(nameOf("cognito_user_pool_client_id")),
  ]);
  if (!userPoolId || !userPoolClientId) {
    throw new Error("cannot load cognito values from SSM");
  }
  return { userPoolId, userPoolClientId };
};
