import {
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  PageStatus,
  PageTemplate,
  PageType,
} from "types";

export function* iterateExportPages(
  allPages: PageTemplate[],
  pageId: string
): Generator<PageTemplate> {
  const page = allPages.find((p) => p.id === pageId)!;

  if (page.id === "root") {
    for (let childId of page.childPageIds ?? []) {
      yield* iterateExportPages(allPages, childId);
    }
  } else if (page.id === "review-submit") {
    // We never render the Review And Submit page in the export view.
    return;
  } else if (page.id === "req-measure-result") {
    const childPages = getMeasurePageIds(allPages, true).flatMap((cpid) => [
      ...iterateExportPages(allPages, cpid),
    ]);
    if (childPages.length > 0) {
      yield {
        navTitle: "Required Measures",
        id: "required-measures-heading",
        type: PageType.Standard,
        elements: [],
      };
      yield* childPages;
    }
  } else if (page.id === "optional-measure-result") {
    const childPages = getMeasurePageIds(allPages, false).flatMap((cpid) => [
      ...iterateExportPages(allPages, cpid),
    ]);
    if (childPages.length > 0) {
      yield {
        navTitle: "Optional Measures",
        id: "optional-measures-heading",
        type: PageType.Standard,
        elements: [],
      };
      yield* childPages;
    }
  } else if (page.id === "select-measures") {
    for (let childId of getTargetPageIds(page as FormPageTemplate)) {
      yield* iterateExportPages(allPages, childId);
    }
  } else if (page.type === PageType.Measure) {
    const mPage = page as MeasurePageTemplate;
    if (mPage.required || mPage.status !== PageStatus.NOT_STARTED) {
      yield mPage;
      for (let childId of mPage.dependentPages?.map((dp) => dp.key) ?? []) {
        yield* iterateExportPages(allPages, childId);
      }
    }
  } else if (page.type === PageType.MeasureResults) {
    if ((page as FormPageTemplate).status !== PageStatus.NOT_STARTED) {
      yield page;
    }
  } else {
    // This is a standard form page. No hide conditions, no children.
    yield page;
  }
}

function getMeasurePageIds(allPages: PageTemplate[], isRequired: boolean) {
  return allPages
    .filter((page) => page.type === "measure")
    .filter((page) => (page as MeasurePageTemplate).required === isRequired)
    .map((page) => page.id);
}

function getTargetPageIds(selectMeasuresPage: FormPageTemplate) {
  const childIds = selectMeasuresPage.elements
    ?.filter((el) => el.type === ElementType.QipMeasureTable)
    .find((el) => el.id === "select-measures-table")
    ?.answer?.map((row) => row.pageId);
  if (childIds === undefined) {
    console.error(`Can't export measure target pages - can't find page IDs!`);
    return [];
  }
  if (childIds.length === 0) {
    console.warn(`Can't export measure target pages - no measures selected.`);
    return [];
  }
  return childIds;
}
