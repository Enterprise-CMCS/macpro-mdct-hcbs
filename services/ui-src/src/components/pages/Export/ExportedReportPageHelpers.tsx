import {
  FormPageTemplate,
  MeasurePageTemplate,
  PageType,
  PageStatus,
  PageTemplate,
} from "types";

export const shouldRender = (section: PageTemplate) => {
  if (section.id === "review-submit" || section.id === "root") {
    return false;
  }

  if (
    section.type === PageType.Measure &&
    (section as MeasurePageTemplate).required === false &&
    (section as MeasurePageTemplate).status === PageStatus.NOT_STARTED
  ) {
    return false;
  }

  if (
    section.type === PageType.MeasureResults &&
    (section as FormPageTemplate).status === PageStatus.NOT_STARTED
  ) {
    return false;
  }

  return true;
};

export const createMeasuresSection = (
  isRequired: boolean,
  reportPages: PageTemplate[]
) => {
  let filteredMeasures = reportPages.filter(
    (section) =>
      section.type === "measure" &&
      (section as MeasurePageTemplate).required === isRequired
  ) as MeasurePageTemplate[];

  const measuresSection: PageTemplate[] = [];
  if (filteredMeasures.length > 0) {
    // Add heading to beginning of section
    measuresSection.push({
      title: isRequired ? "Required Measures" : "Optional Measures",
      id: isRequired
        ? "required-measures-heading"
        : "optional-measures-heading",
      type: PageType.Standard,
      elements: [],
    });

    // For every measure, add to section + add its dependent pages
    for (let section of filteredMeasures) {
      measuresSection.push(section);
      const measureIdx = reportPages.findIndex(
        (measure) => measure.id === section.id
      );
      reportPages.splice(Number(measureIdx), 1);

      const depPages = section.dependentPages;
      for (let page of depPages ?? []) {
        const measureResultIdx = reportPages.findIndex(
          (section) => section.id === page.template
        );
        if (measureResultIdx != -1) {
          measuresSection.push(reportPages[measureResultIdx]);
          reportPages.splice(measureResultIdx, 1);
        }
      }
    }
  }
  return measuresSection;
};
