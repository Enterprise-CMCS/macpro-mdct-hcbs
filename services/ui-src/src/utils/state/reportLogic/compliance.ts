import { ElementType, PageElement } from "types";

// Returns true when an IMA table has any row selected in a noncompliant column.
export const isNotCompliant = (
  controllerElementId: string,
  elements: Partial<PageElement>[]
) => {
  const table = elements.find(
    (target: any) => target?.id === controllerElementId
  );
  if (!table || table.type !== ElementType.ImaTable) return false;

  const nonCompliantColumnIds = new Set(
    table.columns
      ?.filter((column) => column.nonCompliant)
      .map((column) => column.id)
  );
  const rows = (table.answer ?? table.rows ?? []).filter(
    (row) => !row.isUserCreated
  );
  return rows.some(
    (row) => row.answer && nonCompliantColumnIds.has(row.answer)
  );
};
