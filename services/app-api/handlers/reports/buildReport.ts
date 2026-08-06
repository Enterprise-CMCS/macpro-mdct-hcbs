import KSUID from "ksuid";
import {
  getReportTemplate,
  getCmitInfo,
  getWaiverInfo,
} from "../../forms/yearlyFormSelection";
import {
  Report,
  ReportStatus,
  ReportOptions,
  ReportType,
  isHeaderTemplate,
  MeasureOptions,
  MeasurePageTemplate,
  CMIT,
  PageStatus,
  isReportWithMeasuresTemplate,
  ElementType,
} from "../../types/reports";
import { User } from "../../types/types";
import { validateReportPayload } from "../../utils/reportValidation";
import { logger } from "../../libs/debug-lib";
import { StateAbbr } from "../../utils/constants";
import assert from "node:assert";

export const buildReport = async (
  reportType: ReportType,
  state: StateAbbr,
  reportOptions: ReportOptions,
  user: User
) => {
  const year = reportOptions.year;
  const template = structuredClone(getReportTemplate(reportType, year));
  const cmitList = getCmitInfo(year);
  const waiverList = getWaiverInfo(year, state);

  const report: Report = {
    ...template,
    state: state,
    id: KSUID.randomSync().string,
    created: Date.now(),
    lastEdited: Date.now(),
    lastEditedBy: user.fullName,
    lastEditedByEmail: user.email,
    type: reportType,
    status: ReportStatus.NOT_STARTED,
    name: reportOptions.name,
    year: reportOptions.year,
    options: reportOptions.options,
    archived: false,
    submissionCount: 0,
  };

  if (report.type === ReportType.QMS) {
    // QMS has measure templates that must be populated on creation,
    // as well as some questions that vary based on the report.options

    removeIrrelevantSurveyQuestions(report);

    // Collect all measures, based on selected rules.
    assert.ok(isReportWithMeasuresTemplate(template));
    let measures = template.measureLookup.defaultMeasures;
    if (report.options.pom) {
      measures.push(...template.measureLookup.pomMeasures);
    }

    for (let measure of measures) {
      const cmitInfo = cmitList.find((cmit) => cmit.uid === measure.uid)!;
      const parentPage = initializeMeasurePage(
        measure,
        template.measureTemplates[measure.measureTemplate],
        cmitInfo,
        true
      );

      const childPages = measure.dependentPages.map((pageInfo) =>
        initializeMeasurePage(
          measure,
          template.measureTemplates[pageInfo.template],
          cmitInfo,
          false
        )
      );
      report.pages.push(parentPage, ...childPages);
    }
    delete (report as any).measureTemplates;
    delete (report as any).measureLookup;
  }

  //certain checkbox forms that utilize waivers need to have their checkboxes generate during form generation
  if (
    [
      ReportType.CI,
      ReportType.PCP,
      ReportType.TACM,
      ReportType.QMS,
      ReportType.QIP,
      ReportType.WWL,
    ].includes(report.type)
  ) {
    const waiverQuestions = report.pages
      .flatMap((page) => page.elements ?? [])
      .filter((el) => el.id == "waivers-list-checkboxes")
      .filter((el) => el.type === ElementType.Checkbox);

    for (const question of waiverQuestions) {
      question.choices = waiverList.map((waiver) => ({
        label: `${waiver.waiverType}: ${waiver.controlNumber} ${waiver.programTitle}`,
        value: waiver.id,
      }));
    }
  }

  /**
   * Report should always be valid in this function, but we're going
   * to send it through the report validator for a sanity check
   */
  let validatedReport: Report | undefined;
  try {
    validatedReport = await validateReportPayload(report);
  } catch (error) {
    logger.error(error);
    throw new Error("Invalid request");
  }

  return validatedReport;
};

/**
 * Clone the given template, and fill it in with the necessary data.
 */
const initializeMeasurePage = (
  measure: MeasureOptions,
  template: MeasurePageTemplate,
  cmitInfo: CMIT,
  isMeasurePage: boolean
) => {
  const page = structuredClone(template);
  page.cmit = measure.cmit;
  page.required = measure.required;
  page.status = PageStatus.NOT_STARTED;

  if (isMeasurePage) {
    page.dependentPages = measure.dependentPages;
    page.cmitId = measure.uid;
    page.cmitInfo = cmitInfo;
  }

  for (let i = 0; i < page.elements.length; i += 1) {
    let element = page.elements[i];
    if (isHeaderTemplate(element)) {
      /*
       * Many pages share the same `measureHeader` object, from elements.ts
       * The extra clone ensures we only alter this page's header.
       */
      const clone = structuredClone(element);
      clone.text = clone.text.replace("{measureName}", cmitInfo.name);
      page.elements[i] = clone;
    }
  }
  return page;
};

const removeIrrelevantSurveyQuestions = (report: Report) => {
  const unusedSurveyIds = (["cahps", "nciidd", "nciad", "pom"] as const)
    .filter((s) => !report.options[s])
    .map((name) => `${name}-period`);
  const page = report.pages.find((page) => page.id === "general-info");
  if (!page || !page.elements) {
    throw new Error(`QMS General Info page doesn't exist, or is empty!`);
  }
  page.elements = page.elements.filter((e) => !unusedSurveyIds.includes(e.id));
};
