import {
  ElementType,
  ImaTableTemplate,
  PageElement,
  RadioTemplate,
} from "types";

const isRadioElement = (
  element: Partial<PageElement>
): element is Partial<RadioTemplate> => element.type === ElementType.Radio;

const isImaTableElement = (
  element: Partial<PageElement>
): element is Partial<ImaTableTemplate> =>
  element.type === ElementType.ImaTable;

// Returns true when an IMA table has any row selected in a noncompliant column.
export const isNotCompliant = (
  controllerElementId: string,
  elements: Partial<PageElement>[]
) => {
  const controllingElement = elements.find(
    (target) => target?.id === controllerElementId
  );
  if (!controllingElement) return false;

  if (isRadioElement(controllingElement)) {
    const selectedValue = controllingElement.answer;
    return (
      typeof selectedValue === "string" &&
      selectedValue === controllingElement.nonCompliantOn
    );
  }

  if (!isImaTableElement(controllingElement)) return false;

  const nonCompliantColumnIds = new Set(
    controllingElement.columns
      ?.filter((column) => column.nonCompliant)
      .map((column) => column.id)
  );
  const rows = (
    controllingElement.answer ??
    controllingElement.rows ??
    []
  ).filter((row) => !row.isUserCreated);
  return rows.some((row) => {
    if (!row.answer) return false;

    const rowSpecificNonCompliantAnswers = row.nonCompliantAnswers ?? [];
    return (
      rowSpecificNonCompliantAnswers.includes(row.answer) ||
      nonCompliantColumnIds.has(row.answer)
    );
  });
};
