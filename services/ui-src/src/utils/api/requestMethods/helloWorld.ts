import { API } from "aws-amplify";
import { updateTimeout } from "utils/auth/authLifecycle";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getHelloWorld() {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get("hcbs", `/helloWorld`, request);
  return response;
}
