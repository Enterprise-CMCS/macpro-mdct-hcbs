import { describe, expect, it } from "vitest";
import { ElementType, PageType } from "../../types/reports";
import { ciReportTemplate } from "./ci/ci";
import { CMIT_LIST } from "./cmit";
import { pcpReportTemplate } from "./pcp/pcp";
import { qipReportTemplate } from "./qip/qip";
import { defaultMeasures, pomMeasures } from "./qms/measureOptions";
import { qmsReportTemplate } from "./qms/qms";
import { tacmReportTemplate } from "./tacm/tacm";
import { wwlReportTemplate } from "./wwl/wwl";
import { imaReportTemplate } from "./ima/ima";

const reportsToTest = [
  { template: qmsReportTemplate, name: "QMS" },
  { template: tacmReportTemplate, name: "TACM" },
  { template: ciReportTemplate, name: "CI" },
  { template: qipReportTemplate, name: "QIP" },
  { template: pcpReportTemplate, name: "PCP" },
  { template: wwlReportTemplate, name: "WWL" },
  { template: imaReportTemplate, name: "IMA" },
];

describe.each(reportsToTest)("Report Template: $name", ({ template }) => {
  it("should exist", () => {
    expect(template).toBeDefined();
  });

  it("should have a root page", () => {
    const root = template.pages.find((page) => page.id === "root");
    expect(root).toBeDefined();
  });

  it("should not contain duplicate page IDs", () => {
    const pageIds = template.pages.map((page) => page.id);
    const uniqueIds = pageIds.filter((x, i, a) => i === a.indexOf(x));
    expect(pageIds).toEqual(uniqueIds);
  });

  it("should have a child page for every ID referenced by a parent page", () => {
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
    it("should all have UIDs which exist in the CMIT list", () => {
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

describe("IMA Investigation Referrals", () => {
  it("should not mark No as non-compliant", () => {
    const page = imaReportTemplate.pages.find(
      ({ id }) => id === "investigation-referrals"
    );
    const question = page?.elements?.find(
      ({ id }) => id === "investigation-referrals-question"
    );

    expect(question).toMatchObject({ type: ElementType.Radio });
    expect(question).not.toHaveProperty("nonCompliantOn");
  });
});
