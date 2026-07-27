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

  switch (pageId) {
    case "root":
      for (let childId of page.childPageIds ?? []) {
        yield* iterateExportPages(allPages, childId);
      }
      return;
    case "review-submit":
      // We never render the Review And Submit page in the export view.
      return;
    case "req-measure-result":
    case "optional-measure-result":
      const isRequired = pageId === "req-measure-result";
      const childPages = getMeasurePageIds(allPages, isRequired).flatMap(
        (mpid) => [...iterateExportPages(allPages, mpid)]
      );
      if (childPages.length > 0) {
        yield {
          navTitle: isRequired ? "Required Measures" : "Optional Measures",
          id: "injected-heading",
          type: PageType.Standard,
          elements: [],
        };
        yield* childPages;
      }
      return;
    case "select-measures":
      for (let childId of getTargetPageIds(page as FormPageTemplate)) {
        yield* iterateExportPages(allPages, childId);
      }
      return;
  }

  switch (page.type) {
    case PageType.Measure:
      const mPage = page as MeasurePageTemplate;
      if (mPage.required || mPage.status !== PageStatus.NOT_STARTED) {
        yield mPage;
        for (let childId of getMeasureResultPageIds(mPage)) {
          yield* iterateExportPages(allPages, childId);
        }
      }
      return;
    case PageType.MeasureResults:
      if ((page as FormPageTemplate).status !== PageStatus.NOT_STARTED) {
        yield page;
      }
      return;
  }

  // This is a standard form page, which may or may not have.
  yield page;

  if ("childPageIds" in page) {
    for (let childId of page.childPageIds ?? []) {
      yield* iterateExportPages(allPages, childId);
    }
  }
}

function getMeasurePageIds(allPages: PageTemplate[], isRequired: boolean) {
  return allPages
    .filter((page) => page.type === "measure")
    .filter((page) => (page as MeasurePageTemplate).required === isRequired)
    .map((page) => page.id);
}

function getMeasureResultPageIds(measurePage: MeasurePageTemplate) {
  return measurePage.dependentPages?.map((dp) => dp.template) ?? [];
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
