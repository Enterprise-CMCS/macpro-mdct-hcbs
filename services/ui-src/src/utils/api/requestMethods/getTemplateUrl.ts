import { apiLib } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get(`/templates/${templateName}`, options);
}
