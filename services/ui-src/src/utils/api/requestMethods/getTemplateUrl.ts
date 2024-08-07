import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  const response = await API.get("hcbs", `/templates/${templateName}`, request);
  return response;
}
