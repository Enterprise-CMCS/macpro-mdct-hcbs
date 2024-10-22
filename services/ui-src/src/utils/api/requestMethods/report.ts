import { apiLib } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";

async function createReport(
  reportType: string,
  state: string,
  reportOptions: any // TODO: correct
) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...reportOptions },
  };

  return await apiLib.post(`/reports/${reportType}/${state}`, options);
}

async function getReport(reportType: string, state: string, id: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get(`/reports/${reportType}/${state}/${id}`, options);
}

export { createReport, getReport };
