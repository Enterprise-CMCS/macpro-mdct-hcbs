import {
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  PageStatus,
  PageTemplate,
  PageType,
} from "types";

/**
 * Recursively step through the report,
 * yielding each page that should be rendered in the PDF export view.
 *
 * Certain pages have special logic for whether or not they should render,
 * or how to find their child pages.
 *
 * This function's flow should match the logic when viewing the actual report.
 * @param allPages Every page of the `report.pages` array
 * @param pageId The ID of the page currently under examination
 */
export function* iterateExportPages(
  allPages: PageTemplate[],
  pageId: string = "root"
): Generator<PageTemplate> {
  const page = allPages.find((p) => p.id === pageId)!;
  console.assert(page, `Page '${pageId}' not found in report.pages!`);

  switch (pageId) {
    case "root":
      yield* iterateChildPages(allPages, page.childPageIds ?? []);
      return;
    case "review-submit":
      // We never render the Review And Submit page in the export view.
      return;
    case "req-measure-result":
    case "optional-measure-result":
      const isRequired = pageId === "req-measure-result";
      const childPageIds = getMeasurePageIds(allPages, isRequired);
      // Greedily iterate children, so that we can tell if there are any.
      const childPages = [...iterateChildPages(allPages, childPageIds)];
      if (childPages.length > 0) {
        const title = isRequired ? "Required Measures" : "Optional Measures";
        yield injectedHeaderPage(title);
        yield* childPages;
      }
      return;
    case "select-measures":
      yield* iterateChildPages(allPages, getTargetPageIds(page));
      return;
  }

  switch (page.type) {
    case PageType.Measure:
      const mPage = page as MeasurePageTemplate;
      if (mPage.required || mPage.status !== PageStatus.NOT_STARTED) {
        yield mPage;
        yield* iterateChildPages(allPages, getMeasureResultPageIds(mPage));
      }
      return;
    case PageType.MeasureResults:
      if ((page as FormPageTemplate).status !== PageStatus.NOT_STARTED) {
        yield page;
      }
      return;
  }

  // This is a standard form page, which may or may not have child pages.
  yield page;

  if ("childPageIds" in page) {
    yield* iterateChildPages(allPages, page.childPageIds ?? []);
  }
}

/** Map an array of page IDs to an iterator over export pages */
function* iterateChildPages(allPages: PageTemplate[], pageIds: string[]) {
  for (let pageId of pageIds) {
    yield* iterateExportPages(allPages, pageId);
  }
}

/** Create an artificial "page" in the export, with no contents but a heading */
function injectedHeaderPage(headerText: string) {
  return {
    navTitle: headerText,
    id: "injected-heading",
    type: PageType.Standard,
    elements: [],
  };
}

/**
 * Search the QMS report for Measure pages.
 * Returns either all required measures or all optional measures
 */
function getMeasurePageIds(allPages: PageTemplate[], isRequired: boolean) {
  return allPages
    .filter((page) => page.type === "measure")
    .filter((page) => (page as MeasurePageTemplate).required === isRequired)
    .map((page) => page.id);
}

/** Get the Measure Results pages for a given QMS Measure page */
function getMeasureResultPageIds(measurePage: MeasurePageTemplate) {
  return measurePage.dependentPages?.map((dp) => dp.template) ?? [];
}

/** Get the Measure Targets pages referenced by the QIP Select Measures page */
function getTargetPageIds(selectMeasuresPage: PageTemplate) {
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
