import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

export async function createReport(
  reportType: string,
  state: string,
  reportOptions: any // TODO: correct
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...reportOptions },
  };

  updateTimeout();
  const response = await API.post(
    "hcbs",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}

export async function getReport(reportType: string, state: string, id: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get(
    "hcbs",
    `/reports/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

export async function getReportsForState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get(
    "hcbs",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}
