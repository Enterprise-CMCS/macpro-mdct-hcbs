import { ElementType, PageElement } from "types";

const isElementNotCompliant = (element: Partial<PageElement>): boolean => {
  if (element.type === ElementType.Radio) {
    const selectedValue = element.answer;
    if (typeof selectedValue !== "string") return false;

    const selectedChoice = element.choices?.find(
      (choice) => choice.value === selectedValue
    );
    const selectedChildIsNotCompliant =
      selectedChoice?.checkedChildren?.some(isElementNotCompliant) === true;

    return (
      selectedValue === element.nonCompliantOn || selectedChildIsNotCompliant
    );
  }

  if (element.type !== ElementType.ImaTable) return false;

  const nonCompliantColumnIds = new Set(
    element.columns
      ?.filter((column) => column.nonCompliant)
      .map((column) => column.id)
  );
  const rows = (element.answer ?? element.rows ?? []).filter(
    (row) => !row.isUserCreated
  );
  return rows.some((row) => {
    // Check if answer is in a non-compliant column
    if (row.answer && nonCompliantColumnIds.has(row.answer)) {
      return true;
    }
    // Check if answer is in the row's specific non-compliant answers list
    if (row.answer && row.nonCompliantAnswers?.includes(row.answer)) {
      return true;
    }
    return false;
  });
};

// Returns true when the configured controller element is non-compliant, including any selected child branch that is marked non-compliant
export const isNotCompliant = (
  controllerElementId: string,
  elements: Partial<PageElement>[]
) => {
  const controllingElement = elements.find(
    (element) => element.id === controllerElementId
  );
  if (!controllingElement) return false;
  return isElementNotCompliant(controllingElement);
};
