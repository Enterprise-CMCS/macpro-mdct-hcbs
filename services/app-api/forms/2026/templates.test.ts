import { isResultRowButton, PageType } from "../../types/reports";
import { CMIT_LIST } from "./cmit";
import { defaultMeasures, pomMeasures } from "./measureOptions";
import { qmsReportTemplate } from "./qms";

describe("QMS Template", () => {
  it("Should exist", () => {
    expect(qmsReportTemplate).toBeDefined();
  });

  it("Should have a root page", () => {
    const root = qmsReportTemplate.pages.find((page) => page.id === "root");
    expect(root).toBeDefined();
  });

  it("Should not contain duplicate page IDs", () => {
    const pageIds = qmsReportTemplate.pages.map((page) => page.id);
    const uniqueIds = pageIds.filter((x, i, a) => i === a.indexOf(x));
    expect(pageIds).toEqual(uniqueIds);
  });

  it("Should have a child page for every ID referenced by a parent page", () => {
    const allPageIds = qmsReportTemplate.pages
      .filter(
        (page) =>
          page.type &&
          [PageType.Standard, PageType.ReviewSubmit].includes(page.type)
      )
      .map((page) => page.id);
    const referencedChildren = qmsReportTemplate.pages.flatMap(
      (page) => page.childPageIds ?? []
    );
    for (let childPageId of referencedChildren) {
      expect(allPageIds).toContain(childPageId);
    }
  });

  it("Should have a modal for every ID referenced by a page", () => {
    const modalPageIds = qmsReportTemplate.pages
      .filter((page) => page.type === PageType.Modal)
      .map((page) => page.id);
    const referencedModals = qmsReportTemplate.pages
      .flatMap((page) => page.elements ?? [])
      .filter(isResultRowButton)
      .map((button) => button.modalId);
    for (let modalId of referencedModals) {
      expect(modalPageIds).toContain(modalId);
    }
  });

  describe("Measure Templates", () => {
    it("Should all have UIDs which exist in the CMIT list", () => {
      const existingUids = CMIT_LIST.map((cmitInfo) => cmitInfo.uid);
      for (let measure of defaultMeasures) {
        expect(existingUids).toContain(measure.uid);
      }
      for (let measure of pomMeasures) {
        expect(existingUids).toContain(measure.uid);
      }
    });
  });
});
