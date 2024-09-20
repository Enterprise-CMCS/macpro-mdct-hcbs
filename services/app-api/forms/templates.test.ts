import { isResultRowButton, PageType } from "../types/reports";
import { qmReportTemplate } from "./qm";

describe("QM Template", () => {
  it("Should exist", () => {
    expect(qmReportTemplate).toBeDefined();
  });

  it("Should have a root page", () => {
    const root = qmReportTemplate.pages.find((page) => page.id === "root");
    expect(root).toBeDefined();
  });

  it("Should not contain duplicate page IDs", () => {
    const pageIds = qmReportTemplate.pages.map((page) => page.id);
    const uniqueIds = pageIds.filter((x, i, a) => i === a.indexOf(x));
    expect(pageIds).toEqual(uniqueIds);
  });

  it("Should have a child page for every ID referenced by a parent page", () => {
    const allPageIds = qmReportTemplate.pages
      .filter((page) => page.type === PageType.Standard)
      .map((page) => page.id);
    const referencedChildren = qmReportTemplate.pages.flatMap(
      (page) => page.childPageIds ?? []
    );
    for (let childPageId of referencedChildren) {
      expect(allPageIds).toContain(childPageId);
    }
  });

  it("Should have a modal for every ID referenced by a page", () => {
    const modalPageIds = qmReportTemplate.pages
      .filter((page) => page.type === PageType.Modal)
      .map((page) => page.id);
    const referencedModals = qmReportTemplate.pages
      .flatMap((page) => page.elements ?? [])
      .filter(isResultRowButton)
      .map((button) => button.modalId);
    for (let modalId of referencedModals) {
      expect(modalPageIds).toContain(modalId);
    }
  });
});
