import {
  ElementType,
  isResultRowButton,
  PageType,
  ResultRowButtonTemplate,
} from "../types";
import { hcbsReportTemplate } from "./hcbs";

describe("HCBS Template", () => {
  it("Should exist", () => {
    expect(hcbsReportTemplate).toBeDefined();
  });

  it("Should have a root page", () => {
    const root = hcbsReportTemplate.pages.find((page) => page.id === "root");
    expect(root).toBeDefined();
  });

  it("Should not contain duplicate page IDs", () => {
    const pageIds = hcbsReportTemplate.pages.map((page) => page.id);
    const uniqueIds = pageIds.filter((x, i, a) => i === a.indexOf(x));
    expect(pageIds).toEqual(uniqueIds);
  });

  it("Should have a child page for every ID referenced by a parent page", () => {
    const allPageIds = hcbsReportTemplate.pages
      .filter((page) => page.type === PageType.Standard)
      .map((page) => page.id);
    const referencedChildren = hcbsReportTemplate.pages.flatMap(
      (page) => page.childPageIds ?? []
    );
    for (let childPageId of referencedChildren) {
      expect(allPageIds).toContain(childPageId);
    }
  });

  it("Should have a modal for every ID referenced by a page", () => {
    const modalPageIds = hcbsReportTemplate.pages
      .filter((page) => page.type === PageType.Modal)
      .map((page) => page.id);
    const referencedModals = hcbsReportTemplate.pages
      .flatMap((page) => page.elements ?? [])
      .filter(isResultRowButton)
      .map((button) => button.modalId);
    for (let modalId of referencedModals) {
      expect(modalPageIds).toContain(modalId);
    }
  });

  it("Should not contain any unused pages", () => {
    const allPageIds = hcbsReportTemplate.pages.map((page) => page.id);
    const children = hcbsReportTemplate.pages.flatMap(
      (page) => page.childPageIds ?? []
    );
    const modals = hcbsReportTemplate.pages
      .flatMap((page) => page.elements ?? [])
      .filter((element) => element.type === ElementType.ResultRowButton)
      .map((button) => (button as ResultRowButtonTemplate).modalId);
    const referencedPageIds = ["root"].concat(children).concat(modals);
    for (let pageId of allPageIds) {
      expect(referencedPageIds).toContain(pageId);
    }
  });
});
