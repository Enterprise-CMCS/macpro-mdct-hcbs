/* eslint-disable no-console */
import { get, put, post, del } from "aws-amplify/api";
import { AnyObject } from "types";
import { updateTimeout } from "utils";

const apiName = "hcbs";

type ResponsePayload = Awaited<ReturnType<typeof get>["response"]>["body"];

/**
 * Wrap the AWS API so we can handle any before or after behaviors.
 * Below we just key off of these API calls as our source of user activity to make sure
 * credentials don't expire.
 *
 * TODO: These `undefined as T` casts are really gross! Do... something.
 */
const apiRequest = async <T = unknown>(
  request: typeof del | typeof get | typeof post | typeof put,
  path: string,
  options: AnyObject
) => {
  try {
    updateTimeout();
    const response = await request({ apiName, path, options }).response;
    if (!("body" in response)) {
      return undefined as T;
    }

    const body = response.body as ResponsePayload;
    // body.json() dies on an empty response, spectacularly
    const text = await body.text();
    if (text && text.length > 0) {
      return JSON.parse(text) as T;
    }

    return undefined as T;
  } catch (e: any) {
    // Return our own error for handling in the app
    const info = `Request Failed - ${path} - ${e.response?.body}`;
    console.log(e);
    console.log(info);
    throw new Error(info);
  }
};

export const apiLib = {
  del: async (path: string, options: AnyObject) =>
    apiRequest(del, path, options),
  get: async <T>(path: string, options: AnyObject) =>
    apiRequest<T>(get, path, options),
  post: async <T>(path: string, options: AnyObject) =>
    apiRequest<T>(post, path, options),
  put: async <T>(path: string, options: AnyObject) =>
    apiRequest<T>(put, path, options),
};
