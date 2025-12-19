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
  WAIVER,
  ElementType,
} from "../../types/reports";
import { User } from "../../types/types";
import { validateReportPayload } from "../../utils/reportValidation";
import { logger } from "../../libs/debug-lib";
import { StateAbbr } from "../../utils/constants";

export const buildReport = async (
  reportType: ReportType,
  state: StateAbbr,
  reportOptions: ReportOptions,
  user: User
) => {
  const year = reportOptions.year;
  const template = getReportTemplate(reportType, year);
  const cmitList = getCmitInfo(year);
  const waiverList = getWaiverInfo(year, state);

  const report: Report = {
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
    pages: structuredClone(template.pages),
  };

  /**
   * QMS uses MeasureConfig to define additional pages to add to the report and the relationships between them.
   * Reports using ReportBase alone skip this step and just proceed with what is included.
   */
  if (isReportWithMeasuresTemplate(template)) {
    // Collect all measures, based on selected rules.
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
  }

  //certain checkbox forms that utilize waivers need to have their checkboxes generate during form generation
  if (report.type === ReportType.CI) {
    report.pages = [...report.pages].map((page) => {
      if (page.elements) {
        const waiver = page.elements.find(
          (element) => element.id == "waivers-not-included"
        );
        if (waiver && waiver.type === ElementType.Checkbox) {
          waiver.choices = waiverList.map((waiver) => {
            return {
              label: `${waiver.waiverType}: ${waiver.controlNumber} ${waiver.programTitle}`,
              value: waiver.id,
              checked: true,
            };
          });
          waiver.answer = waiverList.map((waiver) => waiver.id);
        }
      }
      return page;
    });
  }

  /**
   * Report should always be valid in this function, but we're going
   * to send it through the report validator for a sanity check
   */
  let validatedReport: Report | undefined;
  try {
    validatedReport = await validateReportPayload(report);
  } catch (err) {
    logger.error(err);
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
  page.cmitId = measure.uid;
  page.required = measure.required;
  page.status = PageStatus.NOT_STARTED;

  if (isMeasurePage) {
    page.dependentPages = measure.dependentPages;
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
