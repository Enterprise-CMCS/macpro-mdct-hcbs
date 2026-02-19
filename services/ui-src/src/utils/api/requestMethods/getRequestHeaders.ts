import { fetchAuthSession } from "aws-amplify/auth";

export const getRequestHeaders = async () => {
  try {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    const headers = {
      "x-api-key": idToken?.toString(),
    };
    return headers;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
