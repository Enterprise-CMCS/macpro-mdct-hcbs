import { apiLib, updateTimeout } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";

export interface SendEmailPayload {
  toAddress: string;
  subject: string;
  message: string;
}

export async function sendEmail(payload: SendEmailPayload) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...payload },
  };

  updateTimeout();
  return await apiLib.post("/notification/send", options);
}
