import { apiLib } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { Report, ReportOptions } from "types/report";

export async function createReport(
  reportType: string,
  state: string,
  reportOptions: ReportOptions
) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...reportOptions },
  };

  return await apiLib.post(`/reports/${reportType}/${state}`, options);
}

export async function getReport(reportType: string, state: string, id: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get(`/reports/${reportType}/${state}/${id}`, options);
}

export async function putReport(report: Report) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  return await apiLib.put(
    `/reports/${report.type}/${report.state}/${report.id}`,
    options
  );
}

export async function submitReport(report: Report) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  return await apiLib.post(`/reports/${report.type}/${report.state}`, options);
}

export async function getReportsForState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get(`/reports/${reportType}/${state}`, options);
}
