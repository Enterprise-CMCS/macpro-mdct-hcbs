import { PageType } from "../../types/reports";
import { ciReportTemplate } from "./ci/ci";
import { CMIT_LIST } from "./cmit";
import { pcpReportTemplate } from "./pcp/pcp";
import { qipReportTemplate } from "./qip/qip";
import { defaultMeasures, pomMeasures } from "./qms/measureOptions";
import { qmsReportTemplate } from "./qms/qms";
import { tacmReportTemplate } from "./tacm/tacm";
import { wwlReportTemplate } from "./wwl/wwl";

const reportsToTest = [
  { template: qmsReportTemplate, name: "QMS" },
  { template: tacmReportTemplate, name: "TACM" },
  { template: ciReportTemplate, name: "CI" },
  { template: qipReportTemplate, name: "QIP" },
  { template: pcpReportTemplate, name: "PCP" },
  { template: wwlReportTemplate, name: "WWL" },
];
describe.each(reportsToTest)("Report Templates", ({ template, name }) => {
  it(`${name} should exist`, () => {
    expect(template).toBeDefined();
  });

  it(`${name} should have a root page`, () => {
    const root = template.pages.find((page) => page.id === "root");
    expect(root).toBeDefined();
  });

  it(`${name} should not contain duplicate page IDs`, () => {
    const pageIds = template.pages.map((page) => page.id);
    const uniqueIds = pageIds.filter((x, i, a) => i === a.indexOf(x));
    expect(pageIds).toEqual(uniqueIds);
  });

  it(`${name} should have a child page for every ID referenced by a parent page`, () => {
    const allPageIds = template.pages
      .filter(
        (page) =>
          page.type &&
          [PageType.Standard, PageType.ReviewSubmit].includes(page.type)
      )
      .map((page) => page.id);
    const referencedChildren = template.pages.flatMap(
      (page) => page.childPageIds ?? []
    );
    for (let childPageId of referencedChildren) {
      expect(allPageIds).toContain(childPageId);
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
