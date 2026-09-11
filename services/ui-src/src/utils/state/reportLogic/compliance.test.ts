import { describe, expect, it } from "vitest";
import { ElementType, PageElement } from "types";
import { isNotCompliant } from "./compliance";

const createTable = (overrides: Partial<PageElement> = {}) =>
  ({
    id: "ima-table",
    type: ElementType.ImaTable,
    columns: [
      { id: "yes", label: "Yes", type: "answer" },
      { id: "no", label: "No", type: "answer", nonCompliant: true },
    ],
    rows: [{ id: "incident", description: "Incident", answer: "yes" }],
    ...overrides,
  }) as unknown as PageElement;

describe("isNotCompliant", () => {
  it("returns false when the controller table is missing", () => {
    expect(isNotCompliant("missing-table", [])).toBe(false);
  });

  it("returns false when the controller is not an IMA table", () => {
    expect(
      isNotCompliant("text-field", [
        { id: "text-field", type: ElementType.Textbox },
      ])
    ).toBe(false);
  });

  it("returns false when the table has no column metadata", () => {
    expect(
      isNotCompliant("ima-table", [createTable({ columns: undefined })])
    ).toBe(false);
  });

  it("returns true when a row selects a non-compliant column", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [{ id: "incident", description: "Incident", answer: "no" }],
        }),
      ])
    ).toBe(true);
  });

  it("returns false when no row selects a non-compliant column", () => {
    expect(isNotCompliant("ima-table", [createTable()])).toBe(false);
  });

  it("ignores rows without an answer", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          rows: [{ id: "incident", description: "Incident" }],
        }),
      ])
    ).toBe(false);
  });

  it("uses the saved answer rows when they are available", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          answer: [{ id: "incident", description: "Incident", answer: "no" }],
          rows: [{ id: "incident", description: "Incident", answer: "yes" }],
        }),
      ])
    ).toBe(true);
  });

  it("falls back to template rows when no saved answer exists", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({
          answer: undefined,
          rows: [{ id: "incident", description: "Incident", answer: "no" }],
        }),
      ])
    ).toBe(true);
  });

  it("returns false when the table has neither answers nor rows", () => {
    expect(
      isNotCompliant("ima-table", [
        createTable({ answer: undefined, rows: undefined }),
      ])
    ).toBe(false);
  });
});
