import { apiLib } from "utils";
import { getRequestHeaders } from "./getRequestHeaders";
import { LiteReport, Report, ReportOptions } from "types/report";

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

  return await apiLib.post<Report>(`/reports/${reportType}/${state}`, options);
}

export async function getReport(reportType: string, state: string, id: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get<Report>(
    `/reports/${reportType}/${state}/${id}`,
    options
  )!;
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

export async function updateReport(report: Partial<Report>) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  return await apiLib.put(
    `/reports/update/${report.type}/${report.state}/${report.id}`,
    options
  );
}

export async function postSubmitReport(report: Report) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  return await apiLib.post<Report>(
    `/reports/submit/${report.type}/${report.state}/${report.id}`,
    options
  );
}

export async function updateArchivedStatus(
  report: LiteReport,
  archiveStatus: boolean
) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { archived: archiveStatus },
  };

  return await apiLib.put(
    `/reports/${report.type}/${report.state}/${report.id}/archive`,
    options
  );
}

export async function getReportsForState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get<LiteReport[]>(
    `/reports/${reportType}/${state}`,
    options
  );
}

export async function releaseReport(report: LiteReport) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  return await apiLib.put(
    `/reports/release/${report.type}/${report.state}/${report.id}`,
    options
  );
}
