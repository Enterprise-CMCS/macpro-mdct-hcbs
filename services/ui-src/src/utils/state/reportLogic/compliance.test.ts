import { describe, expect, it } from "vitest";
import { ComplianceRules, ElementType, PageElement } from "types";
import { isNotCompliant } from "./compliance";

const createTable = (overrides: Partial<PageElement> = {}) =>
  ({
    id: "ima-table",
    type: ElementType.ImaTable,
    columns: [
      { id: "yes", label: "Yes", type: "answer" },
      { id: "no", label: "No", type: "answer" },
    ],
    rows: [{ id: "incident", description: "Incident", answer: "yes" }],
    complianceRule: ComplianceRules.AnyNo,
    ...overrides,
  }) as unknown as PageElement;

describe("isNotCompliant", () => {
  it("should return false when the controller table is missing", () => {
    expect(isNotCompliant("missing-table", [])).toBe(false);
  });

  it("should return false when the controller is not an IMA table", () => {
    expect(
      isNotCompliant("text-field", [
        { id: "text-field", type: ElementType.Textbox } as PageElement,
      ])
    ).toBe(false);
  });

  it("should detect a nested radio answer through its parent choice", () => {
    expect(
      isNotCompliant("parent-radio", [
        {
          id: "parent-radio",
          type: ElementType.Radio,
          label: "Parent",
          required: true,
          answer: "yes",
          choices: [
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  id: "nested-radio",
                  type: ElementType.Radio,
                  label: "Nested",
                  required: true,
                  answer: "no",
                  nonCompliantOn: "no",
                  choices: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ],
                },
              ],
            },
          ],
        },
      ])
    ).toBe(true);
  });

  it("should check nested answers even when the parent has nonCompliantOn", () => {
    expect(
      isNotCompliant("parent-radio", [
        {
          id: "parent-radio",
          type: ElementType.Radio,
          label: "Parent",
          required: true,
          answer: "yes",
          nonCompliantOn: "no",
          choices: [
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  id: "nested-radio",
                  type: ElementType.Radio,
                  label: "Nested",
                  required: true,
                  answer: "no",
                  nonCompliantOn: "no",
                  choices: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ],
                },
              ],
            },
            { label: "No", value: "no" },
          ],
        },
      ])
    ).toBe(true);
  });

  it("should return true when radio answer selects a non-compliant choice", () => {
    expect(
      isNotCompliant("separate-investigations-question-1", [
        {
          id: "separate-investigations-question-1",
          type: ElementType.Radio,
          answer: "no",
          nonCompliantOn: "no",
          choices: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        } as any,
      ])
    ).toBe(true);
  });

  it("should return true when a row selects a non-compliant column", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [{ id: "incident", description: "Incident", answer: "no" }],
        }),
      ])
    ).toBe(true);
  });

  it("returns true when a row selects a row-specific non-compliant answer", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AnyRelevantRowMatchesValue,
          rows: [
            {
              id: "claims-data",
              description: "Claims data (e.g., MMIS)",
              answer: "permissible-but-unused",
              nonCompliantAnswers: ["permissible-but-unused"],
            },
          ],
        }),
      ])
    ).toBe(true);
  });

  it("returns false when a row-specific non-compliant answer is selected on a row without row-specific rules", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AnyRelevantRowMatchesValue,
          rows: [
            {
              id: "hospitalization-data",
              description: "Hospitalization data",
              answer: "permissible-but-unused",
            },
          ],
        }),
      ])
    ).toBe(false);
  });

  it("ignores a user-created row selecting a row-specific non-compliant answer", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AnyRelevantRowMatchesValue,
          rows: [
            {
              id: "other-source",
              description: "Other source",
              answer: "permissible-but-unused",
              nonCompliantAnswers: ["permissible-but-unused"],
              isUserCreated: true,
            },
          ],
        }),
      ])
    ).toBeUndefined();
  });

  it("should ignore a user-created row selecting a non-compliant column", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [
            {
              id: "other",
              description: "Other incident",
              answer: "no",
              isUserCreated: true,
            },
          ],
        }),
      ])
    ).toBeUndefined();
  });

  it("should only evaluate standard rows in a mixed table", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [
            {
              id: "other",
              description: "Other incident",
              answer: "no",
              isUserCreated: true,
            },
            { id: "incident", description: "Incident", answer: "yes" },
          ],
        }),
      ])
    ).toBe(false);
  });

  it("should return false when no row selects a non-compliant column", () => {
    expect(isNotCompliant("ima-table", [createTable()])).toBe(false);
  });

  it("should ignore rows without an answer", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [{ id: "incident", description: "Incident" }],
        }),
      ])
    ).toBeUndefined();
  });

  it("should use the saved answer rows when they are available", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          answer: [{ id: "incident", description: "Incident", answer: "no" }],
          rows: [{ id: "incident", description: "Incident", answer: "yes" }],
        }),
      ])
    ).toBe(true);
  });

  it("should fall back to template rows when no saved answer exists", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          answer: undefined,
          rows: [{ id: "incident", description: "Incident", answer: "no" }],
        }),
      ])
    ).toBe(true);
  });

  it.each(Object.values(ComplianceRules))(
    "should return undefined when the table has neither answers nor rows (%s)",
    (complianceRule) => {
      expect(
        isNotCompliant("ima-table", [
          createTable({ complianceRule, answer: undefined, rows: undefined }),
        ])
      ).toBeUndefined();
    }
  );

  it("should return true when any row is answered something other than yes under AnyNonYes", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AnyNonYes,
          rows: [
            { id: "incident-1", description: "Incident 1", answer: "yes" },
            { id: "incident-2", description: "Incident 2", answer: "unsure" },
          ],
        }),
      ])
    ).toBe(true);
  });

  it("should return false when every row is answered yes under AnyNonYes", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AnyNonYes,
          rows: [
            { id: "incident-1", description: "Incident 1", answer: "yes" },
            { id: "incident-2", description: "Incident 2", answer: "yes" },
          ],
        }),
      ])
    ).toBe(false);
  });

  it("should return true when every row is answered no under AllNo", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AllNo,
          rows: [
            { id: "incident-1", description: "Incident 1", answer: "no" },
            { id: "incident-2", description: "Incident 2", answer: "no" },
          ],
        }),
      ])
    ).toBe(true);
  });

  it("should return false when only some rows are answered no under AllNo", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AllNo,
          rows: [
            { id: "incident-1", description: "Incident 1", answer: "no" },
            { id: "incident-2", description: "Incident 2", answer: "yes" },
          ],
        }),
      ])
    ).toBe(false);
  });

  it("should ignore user-created rows when checking AllNo, even when mixed with standard rows", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AllNo,
          rows: [
            { id: "incident-1", description: "Incident 1", answer: "no" },
            { id: "incident-2", description: "Incident 2", answer: "no" },
            {
              id: "other",
              description: "Other incident",
              answer: "yes",
              isUserCreated: true,
            },
          ],
        }),
      ])
    ).toBe(true);
  });

  it("should return true when every row is answered not-referred under AllNotReferred", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AllNotReferred,
          rows: [
            {
              id: "incident-1",
              description: "Incident 1",
              answer: "not-referred",
            },
            {
              id: "incident-2",
              description: "Incident 2",
              answer: "not-referred",
            },
          ],
        }),
      ])
    ).toBe(true);
  });

  it("should return false when only some rows are answered not-referred under AllNotReferred", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          complianceRule: ComplianceRules.AllNotReferred,
          rows: [
            {
              id: "incident-1",
              description: "Incident 1",
              answer: "not-referred",
            },
            {
              id: "incident-2",
              description: "Incident 2",
              answer: "referred",
            },
          ],
        }),
      ])
    ).toBe(false);
  });
});
