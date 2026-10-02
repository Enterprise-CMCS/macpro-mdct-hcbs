import { describe, expect, it } from "vitest";
import { ElementType, PageType } from "../../types/reports";
import { ciReportTemplate } from "./ci/ci";
import { CMIT_LIST } from "./cmit";
import { pcpReportTemplate } from "./pcp/pcp";
import { qipReportTemplate } from "./qip/qip";
import { defaultMeasures, pomMeasures } from "./qms/measureOptions";
import { qmsReportTemplate } from "./qms/qms";
import { haReportTemplate } from "./ha/ha";
import { wwlReportTemplate } from "./wwl/wwl";
import { imaReportTemplate } from "./ima/ima";

const reportsToTest = [
  { template: qmsReportTemplate, name: "QMS" },
  { template: haReportTemplate, name: "HA" },
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

describe("HA sampling methodology", () => {
  it.each(["hapch-1", "hapch-2"])(
    "has a distinct sampling question within each %s rate, not at page level",
    (pageId) => {
      const page = haReportTemplate.pages.find((item) => item.id === pageId);
      const elements = page?.elements ?? [];
      const rates = elements.filter(
        (element) => element.type === ElementType.PerformanceNdr
      );
      expect(rates).toHaveLength(4);
      expect(
        elements.some((element) =>
          element.id.includes("state-sampling-methodology")
        )
      ).toBe(false);

      const ids: string[] = [];
      for (const rate of rates) {
        expect(rate.children?.map((child) => child.type)).toEqual([
          ElementType.SubHeader,
          ElementType.Radio,
        ]);
        for (const child of rate.children ?? []) {
          expect(child.id.startsWith(`${rate.id}-`)).toBe(true);
          ids.push(child.id);
          if (child.type === ElementType.Radio) {
            expect(child.required).toBe(true);
            expect(
              child.choices.some((choice) => choice.checkedChildren?.length)
            ).toBe(true);
            for (const choice of child.choices) {
              for (const field of choice.checkedChildren ?? []) {
                expect(field.id.startsWith(`${rate.id}-`)).toBe(true);
                ids.push(field.id);
              }
            }
          }
        }
      }
      expect(new Set(ids).size).toBe(ids.length);
    }
  );
});
