import { describe, expect, it } from "vitest";
import {
  CheckboxTemplate,
  ComplianceRules,
  ElementType,
  ImaTableTemplate,
  PageType,
  RadioTemplate,
} from "../../types/reports";
import { ciReportTemplate } from "./ci/ci";
import { CMIT_LIST } from "./cmit";
import { pcpReportTemplate } from "./pcp/pcp";
import { qipReportTemplate } from "./qip/qip";
import { defaultMeasures, pomMeasures } from "./qms/measureOptions";
import { qmsReportTemplate } from "./qms/qms";
import { haReportTemplate } from "./ha/ha";
import { wwlReportTemplate } from "./wwl/wwl";
import { imaReportTemplate } from "./ima/ima";
import { INVESTIGATION_REFERRAL_TYPES } from "./ima/referralTypes";

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

describe("IMA Investigation Referrals", () => {
  const page = imaReportTemplate.pages.find(
    ({ id }) => id === "investigation-referrals"
  )!;
  const mainQuestion = page.elements!.find(
    ({ id }) => id === "investigation-referrals-question"
  ) as RadioTemplate;

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

  it("configures the referral table's rows, answer columns, and compliance rule", () => {
    const table = mainQuestion.choices.find(({ value }) => value === "yes")!
      .checkedChildren![0] as ImaTableTemplate;

    expect(table).toMatchObject({
      id: "investigation-referrals-table",
      type: ElementType.ImaTable,
      complianceRule: ComplianceRules.AnyPartialOrAllNotReferred,
    });
    expect(table.rows).toEqual(INVESTIGATION_REFERRAL_TYPES);
    expect(
      table.columns.filter(({ type }) => type === "answer").map(({ id }) => id)
    ).toEqual([
      "not-referred",
      "no-info-shared",
      "status-only",
      "resolution-only",
      "both",
    ]);
    expect(mainQuestion.required).toBe(true);
    expect(
      mainQuestion.choices.find(({ value }) => value === "no")!.checkedChildren
    ).toBeUndefined();
  });

  it("nests the required follow-up after the table and entity checkboxes under Yes", () => {
    const followUp = mainQuestion.choices.find(({ value }) => value === "yes")!
      .checkedChildren![1] as RadioTemplate;

    expect(followUp).toMatchObject({
      id: "investigation-referrals-follow-up",
      type: ElementType.Radio,
      required: true,
    });
    expect(followUp.choices.map(({ value }) => value)).toEqual(["yes", "no"]);
    expect(
      followUp.choices.find(({ value }) => value === "no")!.checkedChildren
    ).toBeUndefined();

    const entities = followUp.choices.find(({ value }) => value === "yes")!
      .checkedChildren![0] as CheckboxTemplate;

    expect(entities).toMatchObject({
      id: "investigation-referrals-entities",
      type: ElementType.Checkbox,
      required: true,
    });
    expect(entities.choices.map(({ value }) => value)).toEqual([
      "provider-licensing-credentialing",
      "provider-screening-enrollment-suspension-termination",
      "abuse-registry-agency",
      "adult-protective-services",
      "child-protective-services",
      "medicaid-fraud-control-unit",
      "neighboring-states",
      "state-medicaid-agency",
      "operating-agency",
      "other-entity",
    ]);
  });

  it("uses the parent radio to control the non-compliance elements", () => {
    for (const id of [
      "divider",
      "noncompliance-justification",
      "timeline-justification",
    ]) {
      expect(page.elements!.find((element) => element.id === id)).toMatchObject(
        {
          showWhenNonCompliant: [mainQuestion.id],
        }
      );
    }
    expect(
      page.elements!.find(({ id }) => id === "compliance-alert")
    ).toMatchObject({
      controllerElementId: [mainQuestion.id],
    });
    for (const id of [
      "noncompliance-justification",
      "timeline-justification",
    ]) {
      expect(page.elements!.find((element) => element.id === id)).toMatchObject(
        {
          type: ElementType.TextAreaField,
          required: true,
        }
      );
    }
  });
});
