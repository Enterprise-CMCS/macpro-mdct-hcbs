import { ElementType, PageElement } from "types";

// Returns true when an IMA table has a non-compliant answer configuration.
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
  const isMissingRequiredCompliantAnswer =
    table.requiredCompliantAnswerId &&
    !rows.some((row) => row.answer === table.requiredCompliantAnswerId);

  return (
    Boolean(isMissingRequiredCompliantAnswer) ||
    rows.some((row) => row.answer && nonCompliantColumnIds.has(row.answer))
  );
};
